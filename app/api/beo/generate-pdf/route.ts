import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf-generator';
import type { KitchenBEOData, ServiceBEOData } from '@/components/templates/types';

/**
 * Utility function to convert buffer to base64
 */
function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * POST /api/beo/generate-pdf
 * 
 * Generate a PDF from BEO template data
 * 
 * Request Body:
 * {
 *   "type": "kitchen" | "service",
 *   "data": KitchenBEOData | ServiceBEOData,
 *   "returnFormat": "buffer" | "base64" | "file"
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { type, data, returnFormat = 'buffer' } = body;

    // Validate input
    if (!type || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type and data',
        },
        { status: 400 }
      );
    }

    if (!['kitchen', 'service'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type. Must be "kitchen" or "service"',
        },
        { status: 400 }
      );
    }

    // Validate data has required header
    if (!data.header?.beoNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: data.header.beoNumber',
        },
        { status: 400 }
      );
    }

    // Generate PDF using template-based approach
    console.log(`[PDF API] Generating ${type} BEO PDF for ${data.header.beoNumber}...`);
    const result = await generatePDF({
      type: type as 'kitchen' | 'service',
      data: type === 'kitchen' ? (data as KitchenBEOData) : (data as ServiceBEOData),
    });

    if (!result.success || !result.buffer) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'PDF generation failed',
        },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    // Return based on format
    if (returnFormat === 'base64') {
      return NextResponse.json({
        success: true,
        pdf: bufferToBase64(result.buffer),
        metadata: {
          ...result.metadata,
          processingTime: `${processingTime}ms`,
          type,
        },
      });
    }

    // Return as downloadable file (default)
    const filename = `BEO-${data.header.beoNumber}-${type}-${Date.now()}.pdf`;

    // Convert Buffer to Uint8Array for Next.js Response compatibility
    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': result.buffer.length.toString(),
        'X-Processing-Time': processingTime.toString(),
        'X-File-Size': result.metadata?.fileSize?.toString() || result.buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[PDF API] Error generating PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/beo/generate-pdf
 * 
 * Get API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/beo/generate-pdf',
    version: '2.0.0',
    architecture: 'Template-based HTML Generation',
    method: 'POST',
    description: 'Generate a PDF from BEO template data using template literals (no react-dom/server)',
    requestBody: {
      type: {
        type: 'string',
        enum: ['kitchen', 'service'],
        required: true,
        description: 'Type of BEO template to generate',
      },
      data: {
        type: 'object',
        required: true,
        description: 'BEO data matching KitchenBEOData or ServiceBEOData interface',
      },
      returnFormat: {
        type: 'string',
        enum: ['buffer', 'base64'],
        default: 'buffer',
        description: 'Format to return the PDF (buffer returns as downloadable file)',
      },
    },
    responses: {
      200: {
        description: 'PDF generated successfully',
        contentType: 'application/pdf or application/json',
      },
      400: {
        description: 'Invalid request parameters',
      },
      500: {
        description: 'PDF generation failed',
      },
    },
    improvements: {
      'v2.0.0': [
        'Replaced react-dom/server with template literals',
        'Direct HTML generation without React components',
        'Fixed Next.js 14 Server Components compatibility',
        'Improved performance by eliminating React rendering overhead',
        'Self-contained HTML with inline styles',
      ],
    },
    examples: {
      kitchenBEO: {
        type: 'kitchen',
        data: {
          header: {
            beoNumber: 'BEO-2024-001',
            eventName: 'Wedding Reception',
            eventDate: 'Saturday, March 15, 2024',
            eventTime: '6:00 PM - 11:00 PM',
            clientName: 'John & Jane Doe',
            venue: 'Grand Ballroom',
            guestCount: 150,
          },
          menu: {
            appetizers: [],
            mains: [],
            desserts: [],
          },
          prepSchedule: [],
          equipment: {
            cooking: [],
            prep: [],
            service: [],
          },
          staffAssignments: [],
        },
        returnFormat: 'buffer',
      },
      serviceBEO: {
        type: 'service',
        data: {
          header: {
            beoNumber: 'BEO-2024-002',
            eventName: 'Corporate Gala',
            eventDate: 'Friday, April 20, 2024',
            eventTime: '7:00 PM - 12:00 AM',
            clientName: 'Tech Corp Inc.',
            venue: 'Convention Center',
          },
          timeline: [],
          staffPositions: [],
          guestManagement: {
            total: 200,
          },
          equipmentSetup: {
            tables: [],
            linens: [],
            serviceware: [],
          },
        },
        returnFormat: 'buffer',
      },
    },
  });
}

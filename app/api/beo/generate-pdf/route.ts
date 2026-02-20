import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { generateBEOPDF, bufferToBase64 } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { ServiceBEO } from '@/components/templates/ServiceBEO';
import type { KitchenBEOData } from '@/components/templates/KitchenBEO';
import type { ServiceBEOData } from '@/components/templates/ServiceBEO';

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

    // Create React component based on type
    let component: React.ReactElement;

    if (type === 'kitchen') {
      component = React.createElement(KitchenBEO, {
        data: data as KitchenBEOData,
      });
    } else {
      component = React.createElement(ServiceBEO, {
        data: data as ServiceBEOData,
      });
    }

    // Generate PDF
    console.log(`[PDF API] Generating ${type} BEO PDF...`);
    const result = await generateBEOPDF(component);

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
          processingTime,
          type,
        },
      });
    }

    // Return as downloadable file (default)
    const filename = `BEO-${data.header.beoNumber}-${type}-${Date.now()}.pdf`;

    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': result.buffer.length.toString(),
        'X-Processing-Time': processingTime.toString(),
        'X-PDF-Pages': result.metadata?.pages.toString() || '1',
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
    method: 'POST',
    description: 'Generate a PDF from BEO template data',
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
    },
  });
}

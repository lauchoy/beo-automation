/**
 * PDF Generation API Route
 * 
 * POST /api/pdf/generate
 * 
 * Generates PDF documents from BEO templates.
 * Supports both Kitchen and Service BEO types.
 * 
 * Now uses template-based HTML generation (no React rendering)
 * for full Next.js 14 and Vercel compatibility.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePDF, getBEOPDFConfig } from '@/lib/pdf-generator';
import type { KitchenBEOData, ServiceBEOData } from '@/components/templates/types';

// Request body types
interface PDFGenerateRequest {
  type: 'kitchen' | 'service';
  data: KitchenBEOData | ServiceBEOData;
  filename?: string;
  config?: {
    format?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
  };
}

/**
 * POST /api/pdf/generate
 * Generate PDF from BEO data
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body: PDFGenerateRequest = await request.json();

    // Validate request
    if (!body.type || !body.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type and data',
        },
        { status: 400 }
      );
    }

    // Validate type
    if (!['kitchen', 'service'].includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type. Must be "kitchen" or "service"',
        },
        { status: 400 }
      );
    }

    console.log(`[PDF Generator] Generating ${body.type} BEO PDF for ${body.data.header.beoNumber}`);

    // Get PDF config
    const pdfConfig = getBEOPDFConfig(body.type);
    if (body.config) {
      Object.assign(pdfConfig, body.config);
    }

    // Generate PDF using template-based approach
    const result = await generatePDF({
      type: body.type,
      data: body.data,
      config: pdfConfig,
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

    // Determine filename
    const filename = body.filename || 
      `BEO-${body.data.header.beoNumber}-${body.type}-${Date.now()}.pdf`;

    // Log success
    const totalTime = Date.now() - startTime;
    console.log(`[PDF Generator] Successfully generated ${filename} in ${totalTime}ms`);

    // Return PDF as response
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': result.buffer.length.toString(),
        'X-Generation-Time': totalTime.toString(),
        'X-BEO-Number': body.data.header.beoNumber,
        'X-BEO-Type': body.type,
      },
    });
  } catch (error) {
    console.error('[PDF Generator] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pdf/generate
 * Get PDF generator info and capabilities
 */
export async function GET() {
  return NextResponse.json({
    service: 'BEO PDF Generator',
    version: '2.0.0',
    architecture: 'Template-based (No React rendering)',
    compatibility: 'Next.js 14 + Vercel',
    capabilities: {
      types: ['kitchen', 'service'],
      formats: ['A4', 'Letter', 'Legal'],
      orientations: ['portrait', 'landscape'],
      features: [
        'Template-based HTML generation',
        'Print-optimized styling',
        'Custom headers/footers',
        'Professional typography',
        'Allergen icons',
        'Timeline visualization',
        'Staff assignments',
        'Equipment lists',
        'Full Vercel compatibility',
      ],
    },
    usage: {
      endpoint: '/api/pdf/generate',
      method: 'POST',
      contentType: 'application/json',
      requestBody: {
        type: 'kitchen | service',
        data: 'KitchenBEOData | ServiceBEOData',
        filename: 'optional string',
        config: {
          format: 'optional A4 | Letter | Legal',
          orientation: 'optional portrait | landscape',
        },
      },
    },
  });
}

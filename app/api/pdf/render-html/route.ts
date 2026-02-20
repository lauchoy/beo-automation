/**
 * HTML Rendering API Route for PDF Generation
 * 
 * POST /api/pdf/render-html
 * 
 * This route handles React component rendering using react-dom/server.
 * It's isolated from the main application to avoid Next.js 14 Server Component conflicts.
 * 
 * Background:
 * Next.js 14 doesn't allow react-dom/server imports in files that might be used
 * in Server Components. By isolating this functionality in a dedicated API route,
 * we can safely use renderToStaticMarkup without causing build errors.
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { KitchenBEO, type KitchenBEOData } from '@/components/templates/KitchenBEO';
import { ServiceBEO, type ServiceBEOData } from '@/components/templates/ServiceBEO';

// Request body types
interface RenderHTMLRequest {
  type: 'kitchen' | 'service';
  data: KitchenBEOData | ServiceBEOData;
  styles?: string;
}

// Response type
interface RenderHTMLResponse {
  success: boolean;
  html?: string;
  error?: string;
}

/**
 * Patina Design System CSS - Optimized for PDF
 * Based on banquet-blueprint styling reference
 */
const PATINA_PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@400;500;600&display=swap');

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
  }

  body {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #000;
    background: #fff;
    margin: 0;
    padding: 0;
  }

  /* Typography */
  .font-serif {
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  .font-sans {
    font-family: 'Montserrat', system-ui, sans-serif;
  }

  h1, h2, h3, h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 300;
    letter-spacing: -0.02em;
    margin: 0;
    page-break-after: avoid;
  }

  h1 { font-size: 28pt; line-height: 1.2; }
  h2 { font-size: 22pt; line-height: 1.3; }
  h3 { font-size: 18pt; line-height: 1.3; }

  /* Utility Classes */
  .text-xs { font-size: 10pt; }
  .text-sm { font-size: 11pt; }
  .text-base { font-size: 12pt; }
  .text-lg { font-size: 14pt; }
  .text-xl { font-size: 16pt; }
  .text-2xl { font-size: 18pt; }
  .text-3xl { font-size: 22pt; }
  .text-4xl { font-size: 26pt; }
  .text-5xl { font-size: 32pt; }

  .uppercase { text-transform: uppercase; }
  .tracking-wider { letter-spacing: 0.15em; }
  .tracking-widest { letter-spacing: 0.2em; }

  .font-light { font-weight: 300; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }

  /* Colors */
  .text-foreground { color: #000; }
  .text-background { color: #fff; }
  .text-muted-foreground { color: #333; }
  .bg-foreground { background-color: #000; }
  .bg-background { background-color: #fff; }
  .border-foreground { border-color: #000; }

  /* Spacing */
  .space-y-4 > * + * { margin-top: 1rem; }
  .space-y-6 > * + * { margin-top: 1.5rem; }
  .space-y-8 > * + * { margin-top: 2rem; }
  .space-y-12 > * + * { margin-top: 3rem; }
  .space-y-16 > * + * { margin-top: 4rem; }

  .p-4 { padding: 1rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }

  /* Layout */
  .flex { display: flex; }
  .grid { display: grid; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  .gap-6 { gap: 1.5rem; }
  .gap-8 { gap: 2rem; }

  /* Borders */
  .border { border: 1px solid #000; }
  .border-2 { border: 2px solid #000; }
  .border-b { border-bottom: 1px solid #000; }
  .border-l-2 { border-left: 2px solid #000; }
  .border-l-4 { border-left: 4px solid #000; }

  /* Divider */
  .h-px {
    height: 1px;
    background-color: #000;
  }

  /* Page Breaks */
  .page-break-before {
    page-break-before: always;
  }

  .page-break-after {
    page-break-after: always;
  }

  .page-break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  section {
    page-break-inside: avoid;
  }

  /* Checkboxes */
  input[type="checkbox"],
  .checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #000;
    background: transparent;
    display: inline-block;
    margin: 0;
  }

  input[type="checkbox"]:checked,
  .checkbox.checked {
    background: #000;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    page-break-inside: avoid;
  }

  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    font-weight: 600;
    border-bottom: 2px solid #000;
  }

  /* Icons - Hide or replace with text */
  svg {
    display: none;
  }

  /* Print-specific */
  @media print {
    body {
      font-size: 11pt;
    }

    .print\\:hidden {
      display: none !important;
    }

    a {
      color: #000;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      page-break-inside: avoid;
    }
  }

  /* Backgrounds */
  .bg-red-50 { background-color: #fef2f2 !important; }
  .bg-yellow-50 { background-color: #fefce8 !important; }
  .border-red-600 { border-color: #dc2626 !important; }
  .border-yellow-600 { border-color: #ca8a04 !important; }
  .text-red-900 { color: #7f1d1d !important; }
`;

/**
 * Generate HTML from React component
 */
function generateHTML(
  component: React.ReactElement,
  customStyles?: string
): string {
  const markup = renderToStaticMarkup(component);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BEO Document</title>
      <style>
        ${PATINA_PRINT_STYLES}
        ${customStyles || ''}
      </style>
    </head>
    <body>
      ${markup}
    </body>
    </html>
  `;
}

/**
 * POST /api/pdf/render-html
 * Render React component to HTML string
 */
export async function POST(request: NextRequest): Promise<NextResponse<RenderHTMLResponse>> {
  try {
    // Parse request body
    const body: RenderHTMLRequest = await request.json();

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

    console.log(`[HTML Renderer] Rendering ${body.type} BEO component`);

    // Create React component based on type
    let component: React.ReactElement;
    
    if (body.type === 'kitchen') {
      component = React.createElement(KitchenBEO, {
        data: body.data as KitchenBEOData,
      });
    } else {
      component = React.createElement(ServiceBEO, {
        data: body.data as ServiceBEOData,
      });
    }

    // Generate HTML
    const html = generateHTML(component, body.styles);

    console.log(`[HTML Renderer] Successfully rendered ${body.type} BEO HTML`);

    return NextResponse.json(
      {
        success: true,
        html,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[HTML Renderer] Error:', error);

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
 * GET /api/pdf/render-html
 * Get HTML renderer info
 */
export async function GET() {
  return NextResponse.json({
    service: 'BEO HTML Renderer',
    version: '1.0.0',
    description: 'Renders React components to HTML using react-dom/server',
    note: 'This route is isolated from Server Components to prevent Next.js 14 build errors',
    usage: {
      endpoint: '/api/pdf/render-html',
      method: 'POST',
      contentType: 'application/json',
      requestBody: {
        type: 'kitchen | service',
        data: 'KitchenBEOData | ServiceBEOData',
        styles: 'optional custom CSS string',
      },
      response: {
        success: 'boolean',
        html: 'string (full HTML document)',
        error: 'optional error message',
      },
    },
  });
}

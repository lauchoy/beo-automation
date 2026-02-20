/**
 * PDF Generation Utility for BEO Templates
 * 
 * Converts BEO templates to professional PDF documents using Puppeteer
 * with optimized print styling from banquet-blueprint.
 * 
 * Features:
 * - High-quality PDF generation
 * - Template-based HTML generation (no React rendering)
 * - Custom headers/footers
 * - Configurable page settings
 * - Support for both Kitchen and Service BEOs
 * - Full Next.js 14 and Vercel compatibility
 */

import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';
import type { KitchenBEOData, ServiceBEOData } from '@/components/templates/types';
import { generateKitchenBEOHTML } from './html-templates/kitchen-beo-template';
import { generateServiceBEOHTML } from './html-templates/service-beo-template';

// PDF Generation Configuration
export interface PDFConfig {
  format?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  scale?: number;
  preferCSSPageSize?: boolean;
}

// PDF Generation Options
export interface GeneratePDFOptions {
  type: 'kitchen' | 'service';
  data: KitchenBEOData | ServiceBEOData;
  config?: PDFConfig;
  styles?: string;
  filename?: string;
  outputPath?: string;
}

// PDF Generation Result
export interface PDFGenerationResult {
  success: boolean;
  buffer?: Buffer;
  filePath?: string;
  error?: string;
  metadata: {
    generatedAt: string;
    pageCount?: number;
    fileSize?: number;
    generationTime?: string;
  };
}

/**
 * Default PDF configuration optimized for BEO documents
 */
const DEFAULT_PDF_CONFIG: PDFConfig = {
  format: 'A4',
  orientation: 'portrait',
  margin: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in',
  },
  printBackground: true,
  displayHeaderFooter: false,
  scale: 1,
  preferCSSPageSize: false,
};

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
  .tracking-tight { letter-spacing: -0.02em; }

  .font-light { font-weight: 300; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }

  .leading-tight { line-height: 1.25; }
  .leading-snug { line-height: 1.375; }
  .leading-relaxed { line-height: 1.625; }

  /* Colors */
  .text-foreground { color: #000; }
  .text-background { color: #fff; }
  .text-muted-foreground { color: #333; }
  .bg-foreground { background-color: #000; }
  .bg-background { background-color: #fff; }
  .bg-secondary { background-color: #f5f5f5; }
  .border-foreground { border-color: #000; }

  /* Spacing */
  .space-y-1 > * + * { margin-top: 0.25rem; }
  .space-y-2 > * + * { margin-top: 0.5rem; }
  .space-y-3 > * + * { margin-top: 0.75rem; }
  .space-y-4 > * + * { margin-top: 1rem; }
  .space-y-6 > * + * { margin-top: 1.5rem; }
  .space-y-8 > * + * { margin-top: 2rem; }
  .space-y-12 > * + * { margin-top: 3rem; }
  .space-y-16 > * + * { margin-top: 4rem; }

  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  .gap-6 { gap: 1.5rem; }
  .gap-8 { gap: 2rem; }

  .p-4 { padding: 1rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .px-8 { padding-left: 2rem; padding-right: 2rem; }
  .px-12 { padding-left: 3rem; padding-right: 3rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
  .py-24 { padding-top: 6rem; padding-bottom: 6rem; }

  .pb-2 { padding-bottom: 0.5rem; }
  .pb-3 { padding-bottom: 0.75rem; }
  .pb-5 { padding-bottom: 1.25rem; }
  .pb-6 { padding-bottom: 1.5rem; }
  .pt-1 { padding-top: 0.25rem; }
  .pt-2 { padding-top: 0.5rem; }
  .pt-4 { padding-top: 1rem; }
  .pt-8 { padding-top: 2rem; }

  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-8 { margin-top: 2rem; }
  .ml-1 { margin-left: 0.25rem; }
  .ml-2 { margin-left: 0.5rem; }

  .-mx-4 { margin-left: -1rem; margin-right: -1rem; }

  /* Layout */
  .flex { display: flex; }
  .inline-flex { display: inline-flex; }
  .grid { display: grid; }
  .hidden { display: none; }
  .block { display: block; }
  .items-start { align-items: flex-start; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .justify-center { justify-content: center; }
  .flex-1 { flex: 1; }
  .flex-shrink-0 { flex-shrink: 0; }
  .flex-wrap { flex-wrap: wrap; }

  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

  .max-w-none { max-width: none; }
  .max-w-5xl { max-width: 64rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .w-6 { width: 1.5rem; }
  .w-8 { width: 2rem; }
  .w-16 { width: 4rem; }
  .w-24 { width: 6rem; }
  .w-32 { width: 8rem; }
  .w-auto { width: auto; }
  .w-full { width: 100%; }
  .h-6 { height: 1.5rem; }
  .h-8 { height: 2rem; }
  .h-16 { height: 4rem; }

  .min-w-\[1\.5rem\] { min-width: 1.5rem; }
  .min-h-screen { min-height: 100vh; }

  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .text-left { text-align: left; }

  .whitespace-nowrap { white-space: nowrap; }
  .whitespace-pre-line { white-space: pre-line; }

  /* Borders */
  .border { border: 1px solid #000; }
  .border-2 { border-width: 2px; }
  .border-4 { border-width: 4px; }
  .border-b { border-bottom: 1px solid #000; }
  .border-b-2 { border-bottom: 2px solid #000; }
  .border-l { border-left: 1px solid #000; }
  .border-l-2 { border-left: 2px solid #000; }
  .border-l-4 { border-left: 4px solid #000; }
  .border-t { border-top: 1px solid #000; }
  
  .border-foreground\/5 { border-color: rgba(0, 0, 0, 0.05); }
  .border-foreground\/10 { border-color: rgba(0, 0, 0, 0.1); }
  .border-foreground\/15 { border-color: rgba(0, 0, 0, 0.15); }
  .border-foreground\/20 { border-color: rgba(0, 0, 0, 0.2); }
  .border-foreground\/30 { border-color: rgba(0, 0, 0, 0.3); }
  .border-foreground\/60 { border-color: rgba(0, 0, 0, 0.6); }

  .bg-foreground\/5 { background-color: rgba(0, 0, 0, 0.05); }
  .bg-foreground\/10 { background-color: rgba(0, 0, 0, 0.1); }
  .bg-secondary\/50 { background-color: rgba(245, 245, 245, 0.5); }

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

  /* Lists */
  .list-disc { list-style-type: disc; }
  .list-inside { list-style-position: inside; }

  /* Prose */
  .prose {
    max-width: 65ch;
  }

  /* Print-specific */
  @media print {
    body {
      font-size: 11pt;
    }

    .print\\:hidden {
      display: none !important;
    }

    .print\\:block {
      display: block !important;
    }

    .print\\:p-8 {
      padding: 2rem !important;
    }

    .print\\:max-w-none {
      max-width: none !important;
    }

    .print\\:space-y-8 > * + * {
      margin-top: 2rem !important;
    }

    .print\\:px-4 {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }

    .print\\:py-3 {
      padding-top: 0.75rem !important;
      padding-bottom: 0.75rem !important;
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

  /* Responsive */
  @media (min-width: 768px) {
    .md\\:px-12 { padding-left: 3rem; padding-right: 3rem; }
    .md\\:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
    .md\\:text-right { text-align: right; }
    .md\\:text-3xl { font-size: 22pt; }
    .md\\:text-4xl { font-size: 26pt; }
    .md\\:text-5xl { font-size: 32pt; }
    .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  /* Color backgrounds */
  .bg-red-50 { background-color: #fef2f2 !important; }
  .bg-blue-50 { background-color: #eff6ff !important; }
  .bg-green-50 { background-color: #f0fdf4 !important; }
  .bg-orange-50 { background-color: #fff7ed !important; }
  .bg-yellow-50 { background-color: #fefce8 !important; }
  .border-red-600 { border-color: #dc2626 !important; }
  .border-blue-600 { border-color: #2563eb !important; }
  .border-green-600 { border-color: #16a34a !important; }
  .border-orange-600 { border-color: #ea580c !important; }
  .border-yellow-600 { border-color: #ca8a04 !important; }
  .text-red-900 { color: #7f1d1d !important; }

  /* Font utilities */
  .capitalize { text-transform: capitalize; }
  .italic { font-style: italic; }
  .font-mono { font-family: 'Courier New', monospace; }
`;

/**
 * Generate HTML from BEO data
 */
function generateHTML(
  type: 'kitchen' | 'service',
  data: KitchenBEOData | ServiceBEOData,
  customStyles?: string
): string {
  // Generate markup using template-based approach
  const markup = type === 'kitchen'
    ? generateKitchenBEOHTML(data as KitchenBEOData)
    : generateServiceBEOHTML(data as ServiceBEOData);
  
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
 * Main PDF generation function
 */
export async function generatePDF(
  options: GeneratePDFOptions
): Promise<PDFGenerationResult> {
  let browser: Browser | null = null;
  const startTime = Date.now();

  try {
    // Generate HTML from BEO data
    const html = generateHTML(options.type, options.data, options.styles);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    const page: Page = await browser.newPage();

    // Set content
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000,
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Merge PDF config
    const pdfConfig: PDFOptions = {
      ...DEFAULT_PDF_CONFIG,
      ...options.config,
    };

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfConfig);

    await browser.close();
    browser = null;

    // Calculate metadata
    const generationTime = Date.now() - startTime;
    const metadata = {
      generatedAt: new Date().toISOString(),
      fileSize: pdfBuffer.length,
      generationTime: `${generationTime}ms`,
    };

    return {
      success: true,
      buffer: pdfBuffer,
      metadata,
    };
  } catch (error) {
    if (browser) {
      await browser.close();
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * Generate PDF and save to file
 */
export async function generatePDFToFile(
  options: GeneratePDFOptions & { outputPath: string }
): Promise<PDFGenerationResult> {
  const result = await generatePDF(options);

  if (result.success && result.buffer) {
    const fs = await import('fs/promises');
    await fs.writeFile(options.outputPath, result.buffer);

    return {
      ...result,
      filePath: options.outputPath,
    };
  }

  return result;
}

/**
 * Generate PDF from URL (for server-side rendered pages)
 */
export async function generatePDFFromURL(
  url: string,
  config?: PDFConfig
): Promise<PDFGenerationResult> {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    const pdfConfig: PDFOptions = {
      ...DEFAULT_PDF_CONFIG,
      ...config,
    };

    const pdfBuffer = await page.pdf(pdfConfig);

    await browser.close();
    browser = null;

    return {
      success: true,
      buffer: pdfBuffer,
      metadata: {
        generatedAt: new Date().toISOString(),
        fileSize: pdfBuffer.length,
      },
    };
  } catch (error) {
    if (browser) {
      await browser.close();
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * Batch PDF generation for multiple BEOs
 */
export async function generateBatchPDFs(
  beos: Array<GeneratePDFOptions>
): Promise<Array<PDFGenerationResult>> {
  const results: Array<PDFGenerationResult> = [];

  for (const beo of beos) {
    const result = await generatePDF(beo);
    results.push(result);
  }

  return results;
}

/**
 * Utility: Get optimal PDF config for BEO type
 */
export function getBEOPDFConfig(type: 'kitchen' | 'service'): PDFConfig {
  const baseConfig = { ...DEFAULT_PDF_CONFIG };

  if (type === 'kitchen') {
    return {
      ...baseConfig,
      headerTemplate: `
        <div style="font-size: 8pt; text-align: center; width: 100%; padding: 0 0.5in;">
          <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
            Kitchen Production Sheet
          </span>
        </div>
      `,
      displayHeaderFooter: true,
    };
  } else {
    return {
      ...baseConfig,
      headerTemplate: `
        <div style="font-size: 8pt; text-align: center; width: 100%; padding: 0 0.5in;">
          <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
            Service Plan
          </span>
        </div>
      `,
      displayHeaderFooter: true,
    };
  }
}

export default {
  generatePDF,
  generatePDFToFile,
  generatePDFFromURL,
  generateBatchPDFs,
  getBEOPDFConfig,
};

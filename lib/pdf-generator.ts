/**
 * PDF Generation Utility for BEO Templates
 * 
 * Converts React/TSX BEO templates to professional PDF documents
 * using Puppeteer with optimized print styling from banquet-blueprint.
 * 
 * Features:
 * - High-quality PDF generation
 * - Maintains print-optimized styling
 * - Custom headers/footers
 * - Configurable page settings
 * - Support for both Kitchen and Service BEOs
 */

import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

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
  component: React.ReactElement;
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
 * Main PDF generation function
 */
export async function generatePDF(
  options: GeneratePDFOptions
): Promise<PDFGenerationResult> {
  let browser: Browser | null = null;
  const startTime = Date.now();

  try {
    // Generate HTML from React component
    const html = generateHTML(options.component, options.styles);

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

/**
 * PDF Generation Utility for BEO Templates
 * 
 * This module provides functionality to convert React/TSX BEO templates
 * to professional PDFs using Puppeteer, maintaining all print-optimized
 * styling from the blueprint repository.
 */

import puppeteer, { Browser, PDFOptions } from 'puppeteer';
import { renderToString } from 'react-dom/server';
import React from 'react';

export interface PDFGenerationOptions {
  /** Page format (default: 'A4') */
  format?: 'A4' | 'Letter' | 'Legal' | 'Tabloid';
  /** Page orientation (default: 'portrait') */
  orientation?: 'portrait' | 'landscape';
  /** Show header/footer (default: false) */
  displayHeaderFooter?: boolean;
  /** Header template HTML */
  headerTemplate?: string;
  /** Footer template HTML */
  footerTemplate?: string;
  /** Page margins in inches (default: 0.5in all sides) */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /** Print background graphics (default: true) */
  printBackground?: boolean;
  /** Scale of the webpage rendering (default: 1) */
  scale?: number;
  /** Paper width (overrides format) */
  width?: string;
  /** Paper height (overrides format) */
  height?: string;
  /** Wait for network idle before generating PDF */
  waitForNetworkIdle?: boolean;
  /** Custom CSS to inject */
  customCSS?: string;
}

export interface PDFGenerationResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
  metadata?: {
    pages: number;
    fileSize: number;
    generationTime: number;
  };
}

/**
 * Generate PDF from a React component
 */
export async function generatePDFFromComponent(
  component: React.ReactElement,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  const startTime = Date.now();
  let browser: Browser | null = null;

  try {
    // Render React component to HTML string
    const htmlContent = renderToString(component);

    // Generate PDF from HTML
    const result = await generatePDFFromHTML(htmlContent, options);

    return {
      ...result,
      metadata: {
        ...result.metadata,
        generationTime: Date.now() - startTime,
      } as PDFGenerationResult['metadata'],
    };
  } catch (error) {
    console.error('[PDF Generator] Error generating PDF from component:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        pages: 0,
        fileSize: 0,
        generationTime: Date.now() - startTime,
      },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate PDF from HTML string
 */
export async function generatePDFFromHTML(
  html: string,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  const startTime = Date.now();
  let browser: Browser | null = null;

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    // Build complete HTML document with BEO styles
    const completeHTML = buildCompleteHTML(html, options.customCSS);

    // Set content
    await page.setContent(completeHTML, {
      waitUntil: options.waitForNetworkIdle ? 'networkidle0' : 'domcontentloaded',
      timeout: 30000,
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Configure PDF options
    const pdfOptions: PDFOptions = {
      format: options.format || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: options.printBackground !== false,
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate || '',
      footerTemplate: options.footerTemplate || '',
      margin: {
        top: options.margin?.top || '0.5in',
        right: options.margin?.right || '0.5in',
        bottom: options.margin?.bottom || '0.5in',
        left: options.margin?.left || '0.5in',
      },
      scale: options.scale || 1,
      preferCSSPageSize: false,
    };

    // Add custom dimensions if provided
    if (options.width) {
      pdfOptions.width = options.width;
    }
    if (options.height) {
      pdfOptions.height = options.height;
    }

    // Generate PDF
    const buffer = await page.pdf(pdfOptions);

    // Get page count (approximate)
    const pages = await estimatePageCount(buffer);

    return {
      success: true,
      buffer,
      metadata: {
        pages,
        fileSize: buffer.length,
        generationTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error('[PDF Generator] Error generating PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        pages: 0,
        fileSize: 0,
        generationTime: Date.now() - startTime,
      },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate PDF from URL
 */
export async function generatePDFFromURL(
  url: string,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  const startTime = Date.now();
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: options.waitForNetworkIdle ? 'networkidle0' : 'domcontentloaded',
      timeout: 30000,
    });

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    const pdfOptions: PDFOptions = {
      format: options.format || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: options.printBackground !== false,
      displayHeaderFooter: options.displayHeaderFooter || false,
      margin: {
        top: options.margin?.top || '0.5in',
        right: options.margin?.right || '0.5in',
        bottom: options.margin?.bottom || '0.5in',
        left: options.margin?.left || '0.5in',
      },
      scale: options.scale || 1,
    };

    const buffer = await page.pdf(pdfOptions);
    const pages = await estimatePageCount(buffer);

    return {
      success: true,
      buffer,
      metadata: {
        pages,
        fileSize: buffer.length,
        generationTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error('[PDF Generator] Error generating PDF from URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        pages: 0,
        fileSize: 0,
        generationTime: Date.now() - startTime,
      },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Build complete HTML document with BEO styling
 */
function buildCompleteHTML(bodyContent: string, customCSS?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BEO Document</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
  
  <style>
    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Patina-Inspired Design System */
    :root {
      --background: #ffffff;
      --foreground: #000000;
      --secondary: #fafaf9;
      --muted-foreground: #666666;
    }

    body {
      font-family: 'Montserrat', system-ui, sans-serif;
      background-color: var(--background);
      color: var(--foreground);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
    }

    /* Typography */
    .font-serif {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    .font-sans {
      font-family: 'Montserrat', system-ui, sans-serif;
    }

    /* Patina Utilities */
    .patina-label {
      font-family: 'Montserrat', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    /* Print Optimization */
    @page {
      size: A4;
      margin: 0.5in;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-size: 11pt !important;
      }

      * {
        animation: none !important;
        transition: none !important;
      }

      /* Force visibility for print */
      [class*="animate-"],
      .patina-reveal {
        opacity: 1 !important;
        transform: none !important;
      }

      /* High contrast typography */
      body, p, span, div {
        color: #000 !important;
      }

      .text-muted-foreground {
        color: #333 !important;
      }

      /* Ensure backgrounds print */
      .bg-secondary,
      .bg-secondary\\/50 {
        background-color: #f5f5f5 !important;
      }

      /* Border visibility */
      .border-foreground {
        border-color: #000 !important;
      }

      .border-foreground\\/20 {
        border-color: rgba(0, 0, 0, 0.2) !important;
      }

      /* Page breaks */
      section {
        break-inside: avoid;
      }

      .h-px {
        height: 1px !important;
        background-color: #000 !important;
      }
    }

    /* Tailwind-like utilities for common classes */
    .flex { display: flex; }
    .grid { display: grid; }
    .hidden { display: none; }
    .block { display: block; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-8 > * + * { margin-top: 2rem; }
    .space-y-12 > * + * { margin-top: 3rem; }
    .space-y-16 > * + * { margin-top: 4rem; }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }
    .gap-12 { gap: 3rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    .px-8 { padding-left: 2rem; padding-right: 2rem; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-5xl { font-size: 3rem; line-height: 1; }
    .font-light { font-weight: 300; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .tracking-tight { letter-spacing: -0.025em; }
    .leading-tight { line-height: 1.25; }
    .leading-relaxed { line-height: 1.8; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .border { border-width: 1px; border-style: solid; }
    .border-2 { border-width: 2px; }
    .border-4 { border-width: 4px; }
    .border-foreground { border-color: var(--foreground); }
    .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
    .border-l-2 { border-left-width: 2px; border-left-style: solid; }
    .border-l-4 { border-left-width: 4px; border-left-style: solid; }
    .bg-secondary { background-color: var(--secondary); }
    .bg-foreground { background-color: var(--foreground); }
    .text-foreground { color: var(--foreground); }
    .text-background { color: var(--background); }
    .text-muted-foreground { color: var(--muted-foreground); }
    .h-16 { height: 4rem; }
    .w-32 { width: 8rem; }
    .h-px { height: 1px; }
    .w-full { width: 100%; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .flex-shrink-0 { flex-shrink: 0; }
    .max-w-4xl { max-width: 56rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    
    ${customCSS || ''}
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>
  `.trim();
}

/**
 * Estimate page count from PDF buffer
 */
async function estimatePageCount(buffer: Buffer): Promise<number> {
  try {
    // Simple estimation based on PDF structure
    // More accurate methods would require a PDF parsing library
    const pdfString = buffer.toString('latin1');
    const pageMatches = pdfString.match(/\/Type[\s]*\/Page[^s]/g);
    return pageMatches ? pageMatches.length : 1;
  } catch (error) {
    console.warn('[PDF Generator] Could not estimate page count:', error);
    return 1;
  }
}

/**
 * Save PDF buffer to file (Node.js environment)
 */
export async function savePDFToFile(
  buffer: Buffer,
  filepath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fs = await import('fs');
    const path = await import('path');

    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filepath, buffer);

    return { success: true };
  } catch (error) {
    console.error('[PDF Generator] Error saving PDF to file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate PDF and return as base64 string (useful for API responses)
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Generate PDF with default BEO styling
 */
export async function generateBEOPDF(
  component: React.ReactElement,
  filename?: string
): Promise<PDFGenerationResult> {
  const result = await generatePDFFromComponent(component, {
    format: 'A4',
    orientation: 'portrait',
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in',
    },
    waitForNetworkIdle: true,
  });

  // Optionally save to file
  if (result.success && result.buffer && filename) {
    await savePDFToFile(result.buffer, filename);
  }

  return result;
}

export default {
  generatePDFFromComponent,
  generatePDFFromHTML,
  generatePDFFromURL,
  generateBEOPDF,
  savePDFToFile,
  bufferToBase64,
};

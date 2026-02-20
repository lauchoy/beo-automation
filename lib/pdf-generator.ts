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
 * 
 * Architecture Note:
 * This library no longer directly imports react-dom/server to avoid
 * Next.js 14 Server Component conflicts. Instead, it calls the
 * /api/pdf/render-html API route which safely handles React rendering.
 */

import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';
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
 * Generate HTML from React component using the render API route
 * 
 * This function calls the /api/pdf/render-html endpoint which safely
 * uses react-dom/server without causing Next.js 14 build issues.
 */
async function generateHTML(
  componentType: 'kitchen' | 'service',
  componentData: any,
  customStyles?: string
): Promise<string> {
  // Determine the base URL for the API call
  // In production, use the full domain; in development, use localhost
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const apiUrl = `${baseUrl}/api/pdf/render-html`;

  console.log(`[PDF Generator] Calling HTML renderer API at ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: componentType,
        data: componentData,
        styles: customStyles,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTML rendering failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.html) {
      throw new Error(result.error || 'HTML rendering failed');
    }

    return result.html;
  } catch (error) {
    console.error('[PDF Generator] Error calling HTML renderer:', error);
    throw new Error(
      `Failed to generate HTML: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract component type and data from React element
 */
function extractComponentInfo(component: React.ReactElement): {
  type: 'kitchen' | 'service';
  data: any;
} {
  // Get the component type name
  const componentName = typeof component.type === 'function' 
    ? component.type.name 
    : 'Unknown';

  // Determine type based on component name
  let type: 'kitchen' | 'service';
  if (componentName.includes('Kitchen')) {
    type = 'kitchen';
  } else if (componentName.includes('Service')) {
    type = 'service';
  } else {
    throw new Error(`Unknown component type: ${componentName}`);
  }

  // Extract data from props
  const data = (component.props as any).data;
  
  if (!data) {
    throw new Error('Component is missing required "data" prop');
  }

  return { type, data };
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
    // Extract component info
    const { type, data } = extractComponentInfo(options.component);

    // Generate HTML from React component via API route
    const html = await generateHTML(type, data, options.styles);

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

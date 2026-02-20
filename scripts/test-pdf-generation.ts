/**
 * Test PDF Generation Script
 * 
 * This script tests the PDF generation functionality with sample BEO data.
 * 
 * Usage:
 *   npx tsx scripts/test-pdf-generation.ts
 * 
 * Or add to package.json:
 *   "test:pdf": "tsx scripts/test-pdf-generation.ts"
 */

import React from 'react';
import { generateBEOPDF, savePDFToFile } from '../lib/pdf-generator';
import { KitchenBEO } from '../components/templates/KitchenBEO';
import { ServiceBEO } from '../components/templates/ServiceBEO';
import { sampleKitchenBEO, sampleServiceBEO } from '../components/templates/sample-data';
import * as fs from 'fs';
import * as path from 'path';

// Ensure output directory exists
const OUTPUT_DIR = path.join(process.cwd(), 'output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function testKitchenBEO() {
  console.log('\n🍳 Testing Kitchen BEO PDF Generation...\n');
  
  const component = React.createElement(KitchenBEO, { data: sampleKitchenBEO });
  const outputPath = path.join(OUTPUT_DIR, 'test-kitchen-beo.pdf');
  
  const result = await generateBEOPDF(component, outputPath);
  
  if (result.success) {
    console.log('✅ Kitchen BEO PDF generated successfully!');
    console.log(`   📄 Pages: ${result.metadata?.pages || 'unknown'}`);
    console.log(`   📦 Size: ${((result.metadata?.fileSize || 0) / 1024).toFixed(2)} KB`);
    console.log(`   ⏱️  Generation Time: ${result.metadata?.generationTime}ms`);
    console.log(`   💾 Saved to: ${outputPath}\n`);
  } else {
    console.error('❌ Kitchen BEO PDF generation failed!');
    console.error(`   Error: ${result.error}\n`);
  }
  
  return result;
}

async function testServiceBEO() {
  console.log('👔 Testing Service BEO PDF Generation...\n');
  
  const component = React.createElement(ServiceBEO, { data: sampleServiceBEO });
  const outputPath = path.join(OUTPUT_DIR, 'test-service-beo.pdf');
  
  const result = await generateBEOPDF(component, outputPath);
  
  if (result.success) {
    console.log('✅ Service BEO PDF generated successfully!');
    console.log(`   📄 Pages: ${result.metadata?.pages || 'unknown'}`);
    console.log(`   📦 Size: ${((result.metadata?.fileSize || 0) / 1024).toFixed(2)} KB`);
    console.log(`   ⏱️  Generation Time: ${result.metadata?.generationTime}ms`);
    console.log(`   💾 Saved to: ${outputPath}\n`);
  } else {
    console.error('❌ Service BEO PDF generation failed!');
    console.error(`   Error: ${result.error}\n`);
  }
  
  return result;
}

async function testBothTemplates() {
  console.log('='.repeat(60));
  console.log('BEO TEMPLATES - PDF GENERATION TEST');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  // Test both templates
  const kitchenResult = await testKitchenBEO();
  const serviceResult = await testServiceBEO();
  
  // Summary
  console.log('='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Kitchen BEO: ${kitchenResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Service BEO: ${serviceResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Total Time: ${Date.now() - startTime}ms`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
  
  // Exit with appropriate code
  const allSuccess = kitchenResult.success && serviceResult.success;
  process.exit(allSuccess ? 0 : 1);
}

// Run tests
testBothTemplates().catch((error) => {
  console.error('\n❌ Unexpected error during testing:');
  console.error(error);
  process.exit(1);
});

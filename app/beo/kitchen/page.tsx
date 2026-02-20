'use client';

import React from 'react';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/components/templates/sample-data';

/**
 * Kitchen BEO Demo Page
 * 
 * Displays the Kitchen BEO template with sample data.
 * Use this page to:
 * - Preview the Kitchen BEO layout
 * - Test print functionality
 * - Generate PDFs
 * - Validate data structure
 * 
 * To view: http://localhost:3000/beo/kitchen
 */
export default function KitchenBEOPage() {
  return <KitchenBEO data={sampleKitchenBEO} />;
}

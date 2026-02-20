'use client';

import React from 'react';
import { ServiceBEO } from '@/components/templates/ServiceBEO';
import { sampleServiceBEO } from '@/components/templates/sample-data';

/**
 * Service BEO Demo Page
 * 
 * Displays the Service BEO template with sample data.
 * Use this page to:
 * - Preview the Service BEO layout
 * - Test print functionality
 * - Generate PDFs
 * - Validate data structure
 * 
 * To view: http://localhost:3000/beo/service
 */
export default function ServiceBEOPage() {
  return <ServiceBEO data={sampleServiceBEO} />;
}

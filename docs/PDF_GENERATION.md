# BEO PDF Generation System

Complete documentation for the BEO PDF generation system using Puppeteer with React/TSX templates and print-optimized styling from the banquet-blueprint reference.

## Overview

The PDF generation system converts React BEO templates into professional, print-ready PDF documents while maintaining the elegant "Patina" design system with high-quality typography and precise formatting.

## Features

- ✅ **Professional PDF Output** - Print-optimized styling with Cormorant Garamond and Montserrat fonts
- ✅ **Two Template Types** - Kitchen BEO and Service BEO with specialized layouts
- ✅ **Print Color Accuracy** - Exact color reproduction with print-color-adjust
- ✅ **Page Break Control** - Intelligent section breaks for clean page layouts
- ✅ **Configurable Settings** - Custom page size, margins, orientation
- ✅ **Batch Generation** - Generate multiple PDFs efficiently
- ✅ **API Endpoint** - RESTful API for PDF generation
- ✅ **Type Safety** - Full TypeScript support with Zod validation

## Installation

The required dependencies are already in `package.json`:

```bash
npm install
```

Dependencies:
- `puppeteer` - Headless Chrome for PDF generation
- `react-dom/server` - Server-side React rendering
- `@types/react` - TypeScript types for React

## Quick Start

### 1. Generate PDF Programmatically

```typescript
import { generatePDF } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import React from 'react';

const kitchenData = {
  header: {
    beoNumber: 'BEO-2024-001',
    eventName: 'Wedding Reception',
    eventDate: 'March 15, 2024',
    eventTime: '6:00 PM',
    clientName: 'John & Jane Doe',
    venue: 'Grand Ballroom',
  },
  // ... rest of data
};

const result = await generatePDF({
  component: React.createElement(KitchenBEO, { data: kitchenData }),
});

if (result.success) {
  // result.buffer contains the PDF data
  console.log('PDF generated:', result.metadata);
}
```

### 2. Generate PDF via API

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "kitchen",
    "data": {
      "header": {
        "beoNumber": "BEO-2024-001",
        "eventName": "Wedding Reception",
        "eventDate": "March 15, 2024",
        "eventTime": "6:00 PM",
        "clientName": "John & Jane Doe",
        "venue": "Grand Ballroom"
      },
      "guests": { "total": 150, "breakdown": [], "dietary": {} },
      "menu": { "appetizers": [], "mains": [], "desserts": [] },
      "prepSchedule": [],
      "equipmentAllocation": [],
      "staffAssignments": []
    }
  }' \
  --output kitchen-beo.pdf
```

### 3. Test with Sample Data

```bash
npm run test:pdf
```

This generates sample PDFs in the `output/` directory.

## Template Types

### Kitchen BEO Template

**Focus**: Kitchen operations and food preparation  
**Component**: `components/templates/KitchenBEO.tsx`

**Sections:**
- BEO Header with event details
- Guest count and dietary requirements
- Production menu with detailed prep instructions
- Prep schedule with priority tasks
- Equipment allocation by station
- Kitchen staff assignments
- Critical allergen information
- Special instructions
- Allergen legend

**Data Structure:**
```typescript
interface KitchenBEOData {
  header: { beoNumber, eventName, eventDate, eventTime, clientName, venue, logoUrl? };
  guests: { total, breakdown, dietary };
  menu: { appetizers, mains, desserts, sides? };
  prepSchedule: PrepTask[];
  equipmentAllocation: EquipmentCategory[];
  staffAssignments: StaffAssignment[];
  specialInstructions?: string;
  allergenNotes?: string[];
}
```

**Menu Item Details:**
- Name and description
- Allergen information with visual badges
- Portion sizes and cook times/temperatures
- Step-by-step prep instructions (numbered)
- Plating instructions
- Scaling notes for quantity adjustment
- Holding temperatures
- Shelf life information

### Service BEO Template

**Focus**: Front-of-house operations and guest service  
**Component**: `components/templates/ServiceBEO.tsx`

**Sections:**
- BEO Header with event details
- Visual service timeline with key milestones
- Floor plan overview (tables, seats, layout)
- Guest management and special needs
- Staff positioning and assignments
- Detailed service flow
- Equipment setup by location
- Bar service details
- Vendor coordination
- Emergency contacts
- Special instructions

**Data Structure:**
```typescript
interface ServiceBEOData {
  header: { beoNumber, eventName, eventDate, eventTime, clientName, venue, logoUrl? };
  timeline: TimelineEvent[];
  floorPlan: { totalTables, totalSeats, layout, specialArrangements };
  staffPositioning: StaffPosition[];
  guestManagement: { totalGuests, expectedArrival, cocktailHour, seatingStyle, specialNeeds };
  serviceFlow: ServiceStep[];
  equipmentSetup: SetupCategory[];
  barService?: BarService;
  vendorCoordination?: VendorInfo[];
  emergencyContacts: EmergencyContact[];
  specialInstructions?: string;
}
```

## PDF Configuration

### Default Settings

```typescript
{
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
}
```

### Custom Configuration

```typescript
import { generatePDF, getBEOPDFConfig } from '@/lib/pdf-generator';

// Use preset config for BEO type
const config = getBEOPDFConfig('kitchen');

// Or create custom config
const customConfig = {
  format: 'Letter',
  orientation: 'landscape',
  margin: { top: '1in', bottom: '1in', left: '0.75in', right: '0.75in' },
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div>Custom Header</div>',
  footerTemplate: '<div>Page <span class="pageNumber"></span></div>',
};

const result = await generatePDF({
  component: myComponent,
  config: customConfig,
});
```

## Design System (Patina)

Based on the banquet-blueprint reference, the PDF templates use:

### Typography
- **Serif Font**: Cormorant Garamond (300, 400, 500, 600 weights)
  - Used for: Headings, numbers, elegant text
- **Sans Font**: Montserrat (400, 500, 600 weights)
  - Used for: Body text, labels, details

### Color Palette
- **Foreground**: Pure black (#000)
- **Background**: Pure white (#FFF)
- **Muted**: Dark gray (#333) for secondary text
- **Accent**: Light gray backgrounds for emphasis

### Spacing & Layout
- **Maximal Whitespace**: Generous spacing between sections
- **1px Dividers**: Ultra-thin black lines between major sections
- **Grid Layouts**: Responsive columns for organized information
- **Page Breaks**: Sections avoid breaking across pages

### Visual Elements
- **Allergen Badges**: Square bordered icons with letter codes (G, D, N, SF, E, S, F)
- **Priority Indicators**: Left border accent for high-priority items
- **Checkboxes**: Clean squares for task completion
- **Timeline Dots**: Visual markers for service events

## API Reference

### POST /api/pdf/generate

Generate a PDF from BEO data.

**Request Body:**
```typescript
{
  type: 'kitchen' | 'service',
  data: KitchenBEOData | ServiceBEOData,
  filename?: string,
  config?: {
    format?: 'A4' | 'Letter' | 'Legal',
    orientation?: 'portrait' | 'landscape'
  }
}
```

**Response:**
- **Success**: PDF file download with headers
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="..."`
  - `X-Generation-Time`: Time taken to generate (ms)
  - `X-BEO-Number`: BEO number from data
  - `X-BEO-Type`: kitchen or service

- **Error**: JSON error response
  ```json
  {
    "success": false,
    "error": "Error message",
    "timestamp": "ISO timestamp"
  }
  ```

### GET /api/pdf/generate

Get information about PDF generator capabilities.

**Response:**
```json
{
  "service": "BEO PDF Generator",
  "version": "1.0.0",
  "capabilities": {
    "types": ["kitchen", "service"],
    "formats": ["A4", "Letter", "Legal"],
    "orientations": ["portrait", "landscape"],
    "features": [...]
  },
  "usage": { ... }
}
```

## Usage Examples

### Example 1: Basic Kitchen BEO

```typescript
import { generatePDFToFile } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import React from 'react';

const data: KitchenBEOData = {
  header: {
    beoNumber: 'BEO-2024-001',
    eventName: 'Corporate Gala',
    eventDate: 'April 20, 2024',
    eventTime: '7:00 PM',
    clientName: 'Tech Corp Inc.',
    venue: 'Convention Center',
  },
  guests: {
    total: 200,
    breakdown: [
      { type: 'Steak', count: 120, color: 'main' },
      { type: 'Salmon', count: 60, color: 'appetizer' },
      { type: 'Vegetarian', count: 20, color: 'dessert' },
    ],
    dietary: { vegetarian: 20, glutenFree: 15 },
  },
  menu: { appetizers: [], mains: [], desserts: [] },
  prepSchedule: [],
  equipmentAllocation: [],
  staffAssignments: [],
};

const result = await generatePDFToFile({
  component: React.createElement(KitchenBEO, { data }),
  outputPath: './output/kitchen-beo.pdf',
});
```

### Example 2: Service BEO with Custom Config

```typescript
import { generatePDF } from '@/lib/pdf-generator';
import { ServiceBEO } from '@/components/templates/ServiceBEO';
import React from 'react';

const result = await generatePDF({
  component: React.createElement(ServiceBEO, { data: serviceBEOData }),
  config: {
    format: 'Letter',
    orientation: 'portrait',
    margin: { top: '0.75in', bottom: '0.75in' },
  },
});

// Save buffer to file or send as response
```

### Example 3: Batch PDF Generation

```typescript
import { generateBatchPDFs } from '@/lib/pdf-generator';
import React from 'react';

const beos = [
  {
    component: React.createElement(KitchenBEO, { data: kitchenData1 }),
  },
  {
    component: React.createElement(KitchenBEO, { data: kitchenData2 }),
  },
  {
    component: React.createElement(ServiceBEO, { data: serviceData1 }),
  },
];

const results = await generateBatchPDFs(beos);

results.forEach((result, index) => {
  if (result.success) {
    console.log(`PDF ${index + 1} generated successfully`);
  }
});
```

### Example 4: Next.js API Route Integration

```typescript
// app/api/my-beo-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import React from 'react';

export async function POST(request: NextRequest) {
  const beoData = await request.json();
  
  const result = await generatePDF({
    component: React.createElement(KitchenBEO, { data: beoData }),
  });

  if (result.success && result.buffer) {
    return new NextResponse(result.buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="beo.pdf"',
      },
    });
  }

  return NextResponse.json({ error: result.error }, { status: 500 });
}
```

## Styling Customization

### Adding Custom Styles

```typescript
const customStyles = `
  .custom-section {
    background: #f5f5f5;
    padding: 2rem;
    border-left: 4px solid #000;
  }
  
  .highlight {
    background: yellow;
    padding: 0.2rem 0.5rem;
  }
`;

const result = await generatePDF({
  component: myComponent,
  styles: customStyles,
});
```

### Modifying Patina Styles

The base Patina styles are defined in `lib/pdf-generator.ts` in the `PATINA_PRINT_STYLES` constant. You can:

1. **Override in component** - Add inline styles or className
2. **Pass custom styles** - Use the `styles` parameter
3. **Modify base styles** - Edit `PATINA_PRINT_STYLES` directly

## Performance Optimization

### Tips for Faster Generation

1. **Reuse Browser Instance** - For batch operations
2. **Minimize External Resources** - Embed fonts and images
3. **Simplify DOM** - Remove unnecessary nested elements
4. **Optimize Images** - Use compressed formats
5. **Limit Page Count** - Break large BEOs into sections

### Expected Generation Times

- Simple BEO (1-2 pages): 1-3 seconds
- Standard BEO (3-5 pages): 3-5 seconds
- Complex BEO (6+ pages): 5-10 seconds

## Troubleshooting

### PDF Generation Fails

**Error**: `Failed to launch browser`

**Solution**: 
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxrandr2 libgbm1 libasound2
```

### Fonts Not Loading

**Error**: Fonts appear as default system fonts

**Solution**: Ensure Google Fonts URL is accessible. For offline, embed fonts:
```typescript
const customStyles = `
  @font-face {
    font-family: 'Cormorant Garamond';
    src: url('path/to/font.woff2') format('woff2');
  }
`;
```

### Large File Sizes

**Issue**: PDFs are too large

**Solutions**:
- Compress images before embedding
- Use web fonts instead of embedding
- Enable PDF compression in Puppeteer config
- Reduce page margins if appropriate

### Page Breaks in Wrong Places

**Issue**: Sections split awkwardly across pages

**Solution**: Add `page-break-inside: avoid` to section components:
```typescript
<section className="page-break-inside-avoid">
  {/* content */}
</section>
```

## Advanced Usage

### Custom Headers/Footers

```typescript
const config = {
  displayHeaderFooter: true,
  headerTemplate: `
    <div style="font-size: 10pt; text-align: center; width: 100%;">
      <span>Company Name - Kitchen Production</span>
    </div>
  `,
  footerTemplate: `
    <div style="font-size: 10pt; text-align: center; width: 100%;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
  `,
  margin: {
    top: '1in',    // Increased for header
    bottom: '1in', // Increased for footer
  },
};
```

### Landscape Orientation

```typescript
const result = await generatePDF({
  component: myComponent,
  config: {
    orientation: 'landscape',
    format: 'A4',
  },
});
```

### Generate from Live URL

```typescript
import { generatePDFFromURL } from '@/lib/pdf-generator';

const result = await generatePDFFromURL(
  'http://localhost:3000/beo/kitchen/BEO-2024-001',
  { format: 'A4' }
);
```

## Integration with Existing Systems

### Airtable Integration

```typescript
import { fetchRecordsFromTable } from '@/lib/airtable-client';

// Fetch BEO data from Airtable
const records = await fetchRecordsFromTable('BEOs', {
  filterByFormula: `{BEO Number} = 'BEO-2024-001'`
});

const beoData = transformAirtableRecord(records[0]);

// Generate PDF
const result = await generatePDF({
  component: React.createElement(KitchenBEO, { data: beoData }),
});
```

### Workflow Integration

```typescript
// In a workflow step
async function generateBEODocuments(beoId: string) {
  const beoData = await fetchBEOData(beoId);
  
  // Generate both Kitchen and Service PDFs
  const [kitchenPDF, servicePDF] = await Promise.all([
    generatePDF({
      component: React.createElement(KitchenBEO, { data: beoData }),
    }),
    generatePDF({
      component: React.createElement(ServiceBEO, { data: beoData }),
    }),
  ]);

  // Save to storage or send via email
  await savePDFsToStorage(kitchenPDF.buffer, servicePDF.buffer);
}
```

## Best Practices

### 1. Data Validation

Always validate BEO data before PDF generation:

```typescript
import { KitchenBEODataSchema } from '@/lib/schemas';

try {
  const validatedData = KitchenBEODataSchema.parse(inputData);
  const result = await generatePDF({ 
    component: React.createElement(KitchenBEO, { data: validatedData }) 
  });
} catch (error) {
  console.error('Validation failed:', error);
}
```

### 2. Error Handling

Implement comprehensive error handling:

```typescript
const result = await generatePDF(options);

if (!result.success) {
  // Log error
  console.error('PDF generation failed:', result.error);
  
  // Notify user or retry
  await notifyUser('PDF generation failed, please try again');
  
  return;
}

// Process successful result
await processGeneratedPDF(result.buffer);
```

### 3. Resource Management

Clean up browser instances in production:

```typescript
// The library handles this automatically, but for custom implementations:
let browser;
try {
  browser = await puppeteer.launch(...);
  // ... PDF generation
} finally {
  if (browser) {
    await browser.close();
  }
}
```

### 4. Caching

Consider caching generated PDFs:

```typescript
import { createHash } from 'crypto';

function generateCacheKey(beoData: KitchenBEOData): string {
  return createHash('md5')
    .update(JSON.stringify(beoData))
    .digest('hex');
}

async function getCachedOrGeneratePDF(data: KitchenBEOData) {
  const cacheKey = generateCacheKey(data);
  const cached = await getFromCache(cacheKey);
  
  if (cached) return cached;
  
  const result = await generatePDF({
    component: React.createElement(KitchenBEO, { data }),
  });
  
  if (result.success) {
    await saveToCache(cacheKey, result.buffer);
  }
  
  return result;
}
```

## Testing

### Manual Testing

```bash
# Run test script
npm run test:pdf

# Check output directory
ls -lh output/
```

### Automated Testing

```typescript
import { generatePDF } from '@/lib/pdf-generator';

describe('PDF Generation', () => {
  it('should generate Kitchen BEO PDF', async () => {
    const result = await generatePDF({
      component: React.createElement(KitchenBEO, { data: mockData }),
    });
    
    expect(result.success).toBe(true);
    expect(result.buffer).toBeDefined();
    expect(result.buffer.length).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    const result = await generatePDF({
      component: null as any, // Invalid component
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## Deployment Considerations

### Production Environment

1. **Install Chromium** - Ensure Chromium is available in production
   ```bash
   # For Docker
   RUN apt-get update && apt-get install -y chromium
   ```

2. **Set Environment Variables**
   ```env
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

3. **Configure Puppeteer for Serverless**
   ```typescript
   const browser = await puppeteer.launch({
     executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
     args: ['--no-sandbox', '--disable-setuid-sandbox'],
   });
   ```

### Vercel/Netlify Deployment

For serverless platforms, consider using:
- **@vercel/og** for simple PDFs
- **Puppeteer with Chrome AWS Lambda layer**
- **External PDF generation service**

### Docker Configuration

```dockerfile
FROM node:18-alpine

# Install Chromium
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

## File Size Guidelines

**Typical PDF Sizes:**
- Kitchen BEO (standard): 200-400 KB
- Service BEO (standard): 150-300 KB
- With images/logos: +100-500 KB per image

**Optimization Tips:**
- Compress images before embedding
- Use SVG for logos when possible
- Limit embedded fonts to used character sets
- Remove unused CSS

## Support & Resources

- **Main README**: [README.md](../README.md)
- **Test Script**: [scripts/test-pdf-generation.ts](../scripts/test-pdf-generation.ts)
- **Kitchen Template**: [components/templates/KitchenBEO.tsx](../components/templates/KitchenBEO.tsx)
- **Service Template**: [components/templates/ServiceBEO.tsx](../components/templates/ServiceBEO.tsx)
- **PDF Generator**: [lib/pdf-generator.ts](../lib/pdf-generator.ts)

## Changelog

### Version 1.0.0 (2024-02-20)
- Initial release
- Kitchen BEO template
- Service BEO template
- PDF generation with Puppeteer
- API endpoint for PDF generation
- Comprehensive documentation
- Test scripts and examples

---

**Status**: ✅ Production Ready  
**Maintained by**: Jimmy Lauchoy  
**Last Updated**: February 20, 2026

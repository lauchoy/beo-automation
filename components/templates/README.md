# BEO Templates & PDF Generation

Professional, print-optimized BEO (Banquet Event Order) templates with PDF generation capabilities based on the banquet-blueprint styling reference.

## Overview

This module provides two specialized BEO templates:
- **Kitchen BEO**: Focus on culinary operations, prep schedules, and kitchen coordination
- **Service BEO**: Focus on front-of-house operations, guest management, and service flow

Both templates feature:
- ✅ Professional "Patina" design system (monochromatic, minimal, elegant)
- ✅ Print-optimized styling with high-quality PDF output
- ✅ Comprehensive allergen tracking and display
- ✅ Detailed prep instructions and scaling notes
- ✅ Timeline and scheduling visualization
- ✅ Staff assignment tracking
- ✅ Equipment allocation management

## Quick Start

### 1. Install Dependencies

```bash
npm install puppeteer react-dom
npm install -D @types/react-dom
```

### 2. Import Templates

```typescript
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { ServiceBEO } from '@/components/templates/ServiceBEO';
import { sampleKitchenBEO, sampleServiceBEO } from '@/components/templates/sample-data';
```

### 3. Use in Your Application

```tsx
import React from 'react';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/components/templates/sample-data';

export default function KitchenBEOPage() {
  return <KitchenBEO data={sampleKitchenBEO} />;
}
```

### 4. Generate PDF

```typescript
import { generateBEOPDF } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/components/templates/sample-data';

// Generate PDF
const component = React.createElement(KitchenBEO, { data: sampleKitchenBEO });
const result = await generateBEOPDF(component, './output/kitchen-beo.pdf');

if (result.success) {
  console.log(`PDF generated: ${result.metadata.pages} pages, ${result.metadata.fileSize} bytes`);
}
```

## Kitchen BEO Template

### Data Structure

```typescript
interface KitchenBEOData {
  header: {
    beoNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    clientName: string;
    venue: string;
    guestCount: number;
    logoUrl?: string;
  };
  menu: {
    appetizers: MenuItem[];
    mains: MenuItem[];
    desserts: MenuItem[];
    sides?: MenuItem[];
  };
  prepSchedule: PrepTask[];
  equipment: {
    cooking: Equipment[];
    prep: Equipment[];
    service: Equipment[];
  };
  staffAssignments: StaffAssignment[];
  specialInstructions?: string;
  dietaryRestrictions?: {
    vegetarian?: number;
    vegan?: number;
    glutenFree?: number;
    nutAllergy?: number;
    other?: string;
  };
}
```

### Features

- **Menu Display**: Organized by course with detailed prep instructions
- **Allergen Tracking**: Visual icons for all major allergens (G, D, N, SF, E, S, F)
- **Prep Schedule**: Prioritized task list with time estimates and dependencies
- **Equipment Allocation**: Categorized by cooking, prep, and service
- **Staff Assignments**: Role-based with responsibilities and member lists
- **Special Instructions**: Highlighted critical information
- **Dietary Summary**: At-a-glance dietary restriction counts

### Usage Example

```tsx
const kitchenData: KitchenBEOData = {
  header: {
    beoNumber: 'BEO-2024-001',
    eventName: 'Anniversary Dinner',
    eventDate: 'Friday, April 12, 2024',
    eventTime: '7:00 PM - 10:00 PM',
    clientName: 'Mr. & Mrs. Anderson',
    venue: 'Private Dining Room',
    guestCount: 50,
  },
  menu: {
    appetizers: [
      {
        id: 'app1',
        name: 'Seared Tuna',
        description: 'Sesame-crusted tuna with wasabi aioli',
        allergens: { fish: true, soy: true, eggs: true },
        portionSize: '3 oz per guest',
        cookTime: '2 min',
        station: 'Sauté',
        prepInstructions: [
          'Cut tuna into 3 oz portions',
          'Coat with sesame seeds',
          'Sear 1 minute per side',
        ],
        scalingNotes: 'For 50 guests: 10 lbs sushi-grade tuna',
      },
    ],
    mains: [],
    desserts: [],
  },
  prepSchedule: [],
  equipment: { cooking: [], prep: [], service: [] },
  staffAssignments: [],
};

<KitchenBEO data={kitchenData} />
```

## Service BEO Template

### Data Structure

```typescript
interface ServiceBEOData {
  header: {
    beoNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    clientName: string;
    venue: string;
    logoUrl?: string;
  };
  timeline: TimelineEvent[];
  staffPositions: StaffPosition[];
  guestManagement: GuestManagement;
  equipment: {
    dining: ServiceEquipment[];
    bar: ServiceEquipment[];
    decor: ServiceEquipment[];
  };
  coordination: ServiceCoordination;
  floorPlan?: string; // URL to floor plan image
  serviceNotes?: string;
}
```

### Features

- **Service Timeline**: Visual timeline with setup, service, and breakdown phases
- **Staff Positioning**: Detailed staff assignments with table/station mapping
- **Guest Management**: Total count, VIP tracking, seating arrangements
- **Equipment Setup**: Dining, bar, and decor equipment with setup times
- **Service Coordination**: Contact info, vendor coordination, critical notes
- **Floor Plan**: Optional floor plan image integration
- **Service Notes**: Critical service information and priorities

### Usage Example

```tsx
const serviceData: ServiceBEOData = {
  header: {
    beoNumber: 'BEO-2024-001',
    eventName: 'Corporate Gala',
    eventDate: 'Thursday, May 20, 2024',
    eventTime: '6:00 PM - 10:00 PM',
    clientName: 'Acme Corporation',
    venue: 'Grand Ballroom',
  },
  timeline: [
    { time: '4:00 PM', label: 'Setup Begins', type: 'setup' },
    { time: '5:30 PM', label: 'Staff Briefing', type: 'setup' },
    { time: '6:00 PM', label: 'Doors Open', sublabel: 'Cocktails', type: 'service' },
    { time: '7:00 PM', label: 'Dinner Service', type: 'service' },
  ],
  staffPositions: [],
  guestManagement: { totalGuests: 200 },
  equipment: { dining: [], bar: [], decor: [] },
  coordination: {},
};

<ServiceBEO data={serviceData} />
```

## PDF Generation API

### Endpoint: POST /api/beo/generate-pdf

Generate a PDF from BEO template data.

#### Request Body

```json
{
  "type": "kitchen" | "service",
  "data": KitchenBEOData | ServiceBEOData,
  "returnFormat": "buffer" | "base64"
}
```

#### Response (buffer format)

Returns PDF file as downloadable attachment with headers:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="BEO-XXX.pdf"`
- `X-Processing-Time: <milliseconds>`
- `X-PDF-Pages: <page count>`

#### Response (base64 format)

```json
{
  "success": true,
  "pdf": "base64-encoded-pdf-data",
  "metadata": {
    "pages": 3,
    "fileSize": 123456,
    "generationTime": 2500,
    "processingTime": 2600,
    "type": "kitchen"
  }
}
```

#### cURL Examples

**Generate Kitchen BEO PDF (download)**
```bash
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "type": "kitchen",
    "data": { ... },
    "returnFormat": "buffer"
  }' \
  --output kitchen-beo.pdf
```

**Generate Service BEO PDF (base64)**
```bash
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "type": "service",
    "data": { ... },
    "returnFormat": "base64"
  }'
```

## PDF Generation Library

### Core Functions

#### `generateBEOPDF(component, filename?)`

Generate PDF with default BEO styling optimized for professional output.

```typescript
import { generateBEOPDF } from '@/lib/pdf-generator';
import React from 'react';
import { KitchenBEO } from '@/components/templates/KitchenBEO';

const component = React.createElement(KitchenBEO, { data: myData });
const result = await generateBEOPDF(component, './output/beo.pdf');
```

#### `generatePDFFromComponent(component, options)`

Generate PDF with custom options.

```typescript
import { generatePDFFromComponent } from '@/lib/pdf-generator';

const result = await generatePDFFromComponent(component, {
  format: 'Letter',
  orientation: 'portrait',
  margin: {
    top: '0.75in',
    bottom: '0.75in',
  },
  printBackground: true,
  waitForNetworkIdle: true,
});
```

#### `generatePDFFromHTML(html, options)`

Generate PDF from HTML string.

```typescript
import { generatePDFFromHTML } from '@/lib/pdf-generator';

const html = '<h1>My BEO</h1><p>Content here</p>';
const result = await generatePDFFromHTML(html, {
  format: 'A4',
  customCSS: 'h1 { color: blue; }',
});
```

#### `generatePDFFromURL(url, options)`

Generate PDF from a live URL.

```typescript
import { generatePDFFromURL } from '@/lib/pdf-generator';

const result = await generatePDFFromURL('http://localhost:3000/beo/kitchen/123', {
  format: 'A4',
  waitForNetworkIdle: true,
});
```

### PDF Options

```typescript
interface PDFGenerationOptions {
  format?: 'A4' | 'Letter' | 'Legal' | 'Tabloid';  // Default: 'A4'
  orientation?: 'portrait' | 'landscape';            // Default: 'portrait'
  printBackground?: boolean;                         // Default: true
  displayHeaderFooter?: boolean;                     // Default: false
  margin?: {
    top?: string;      // Default: '0.5in'
    right?: string;    // Default: '0.5in'
    bottom?: string;   // Default: '0.5in'
    left?: string;     // Default: '0.5in'
  };
  scale?: number;                                   // Default: 1
  waitForNetworkIdle?: boolean;                     // Default: false
  customCSS?: string;                               // Additional CSS
}
```

## Design System

### Typography

- **Serif**: Cormorant Garamond (headings, elegant text)
- **Sans**: Montserrat (body, labels, data)

### Color Palette

- **Primary**: Pure black (#000) / Pure white (#FFF)
- **Secondary**: Bone/cream (#fafaf9)
- **Muted**: Medium gray (#666)

### Custom Classes

- `.patina-label` - All-caps tracked labels (0.15em letter spacing)
- `.patina-divider` - Ultra-thin 1px horizontal dividers
- `.patina-button` - Inverted hover state buttons

### Print Optimization

All templates include:
- High-contrast text for readability
- Exact color rendering
- Proper page breaks
- Optimized font sizes (11pt base)
- Background preservation
- Professional margins

## Integration with Existing Code

### With Airtable Recipe Library

```typescript
import { fetchRecipes } from '@/lib/airtable-client';
import { KitchenBEO } from '@/components/templates/KitchenBEO';

// Fetch recipes from Airtable
const recipes = await fetchRecipes();

// Transform to menu items
const menuItems = recipes.map(recipe => ({
  id: recipe.id,
  name: recipe.name,
  description: recipe.description,
  allergens: parseAllergens(recipe.allergens),
  prepInstructions: recipe.instructions,
  // ... other fields
}));

// Generate BEO
const beoData = {
  header: { /* ... */ },
  menu: {
    appetizers: menuItems.filter(i => i.category === 'appetizer'),
    mains: menuItems.filter(i => i.category === 'main'),
    desserts: menuItems.filter(i => i.category === 'dessert'),
  },
  // ... other sections
};

<KitchenBEO data={beoData} />
```

### With Agent Orchestration

```typescript
import { getOrchestrator } from '@/lib/agents/orchestrator';
import { generateBEOPDF } from '@/lib/pdf-generator';

// Create agent to generate BEO PDFs
const beoAgent = {
  name: 'beo-pdf-generator',
  async execute(input, context) {
    const component = React.createElement(KitchenBEO, { data: input.data });
    const result = await generateBEOPDF(component);
    
    return {
      success: result.success,
      data: {
        pdf: bufferToBase64(result.buffer),
        metadata: result.metadata,
      },
    };
  },
};

const orchestrator = getOrchestrator();
orchestrator.registerAgent(beoAgent);
```

## API Usage Examples

### Generate Kitchen BEO PDF

```bash
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "type": "kitchen",
    "data": {
      "header": {
        "beoNumber": "BEO-2024-001",
        "eventName": "Wedding Reception",
        "eventDate": "March 15, 2024",
        "eventTime": "6:00 PM",
        "clientName": "John & Jane",
        "venue": "Grand Ballroom",
        "guestCount": 100
      },
      "menu": {
        "appetizers": [],
        "mains": [],
        "desserts": []
      },
      "prepSchedule": [],
      "equipment": {
        "cooking": [],
        "prep": [],
        "service": []
      },
      "staffAssignments": []
    }
  }' \
  --output beo.pdf
```

### Get API Documentation

```bash
curl http://localhost:3000/api/beo/generate-pdf
```

### Using in Frontend

```typescript
// React component example
const handleGeneratePDF = async () => {
  const response = await fetch('/api/beo/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'kitchen',
      data: myBEOData,
      returnFormat: 'base64',
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    // Download PDF
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${result.pdf}`;
    link.download = 'kitchen-beo.pdf';
    link.click();
  }
};
```

## Styling Reference

The templates use the "Patina" design system from banquet-blueprint:

### Layout Principles
- **Maximal whitespace**: Gallery-like spacing between sections
- **Ultra-thin borders**: 1px dividers throughout
- **No rounded corners**: Sharp, professional edges
- **Monochromatic palette**: Black and white with gray accents

### Typography Scale
- **H1**: 4xl-5xl (event names)
- **H2**: 3xl-4xl (section headers)
- **H3**: 2xl-3xl (subsection headers)
- **Body**: base-lg (readable, relaxed line height)
- **Labels**: xs-sm (all-caps, tracked)

### Spacing Scale
- **Section spacing**: 16 units (4rem) on screen, 8 units (2rem) on print
- **Content padding**: 8-12 units on screen, 8 units on print
- **Element gaps**: 4-8 units standard

## Customization

### Custom Styling

Add custom CSS to PDF generation:

```typescript
const result = await generatePDFFromComponent(component, {
  customCSS: `
    .custom-header {
      background-color: #f0f0f0;
      padding: 20px;
    }
    .highlight {
      border-left: 4px solid #000;
      padding-left: 16px;
    }
  `,
});
```

### Custom Templates

Create your own BEO template by following the pattern:

```tsx
export const CustomBEO: React.FC<{ data: CustomBEOData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Your custom layout */}
    </div>
  );
};
```

## Troubleshooting

### PDF Generation Fails

**Issue**: PDF generation returns error

**Solutions**:
1. Ensure Puppeteer is installed: `npm install puppeteer`
2. Check system has Chrome/Chromium dependencies
3. Review console logs for detailed error messages
4. Verify data structure matches expected interfaces

### Fonts Not Loading

**Issue**: PDF shows default fonts instead of Cormorant Garamond/Montserrat

**Solution**: 
- Ensure Google Fonts link is present in HTML
- Add `waitForNetworkIdle: true` to PDF options
- Wait for fonts: `await page.evaluateHandle('document.fonts.ready')`

### Images Not Rendering

**Issue**: Logo or floor plan images missing in PDF

**Solution**:
- Use absolute URLs for images, not relative paths
- Ensure images are accessible from server
- Add `waitForNetworkIdle: true` option
- Check image CORS headers

### Large File Sizes

**Issue**: PDFs are too large

**Solution**:
- Optimize images before including
- Reduce unnecessary background graphics
- Use `scale` option to reduce resolution if needed
- Compress images to WebP format

## Performance

### Generation Times

Typical generation times (varies by complexity):
- Simple BEO (1-2 pages): 2-4 seconds
- Medium BEO (3-5 pages): 4-8 seconds
- Complex BEO (6+ pages): 8-15 seconds

### Optimization Tips

1. **Use caching**: Cache generated PDFs for identical data
2. **Background processing**: Generate PDFs in background jobs
3. **Lazy loading**: Generate on-demand rather than preemptively
4. **Cleanup**: Close browser instances promptly
5. **Resource limits**: Limit concurrent PDF generations

## Next Steps

1. **Install Dependencies**:
   ```bash
   npm install puppeteer react-dom
   npm install -D @types/react-dom
   ```

2. **Add Print Styles**:
   Copy `src/index.css` from banquet-blueprint for complete print optimization

3. **Test Templates**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/beo/generate-pdf
   ```

4. **Integrate with Your Data**:
   Connect templates to your Airtable data or other data sources

## Support

For issues or questions:
- Check the main [BEO Automation README](../../README.md)
- Review [PDF Generator source](../../lib/pdf-generator.ts)
- Examine [sample data](./sample-data.ts) for structure examples

---

**Version**: 1.0.0  
**Created**: 2026-02-20  
**Author**: Jimmy Lauchoy  
**Based on**: banquet-blueprint styling reference

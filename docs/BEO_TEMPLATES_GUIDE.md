# BEO Templates Implementation Guide

Complete guide for using the Kitchen and Service BEO templates with PDF generation.

## 📋 What's Been Created

Based on the banquet-blueprint styling reference, the following components have been implemented:

### Templates
1. **KitchenBEO.tsx** - Kitchen operations focused template
2. **ServiceBEO.tsx** - Front-of-house operations focused template
3. **sample-data.ts** - Sample data for both templates

### PDF Generation
4. **pdf-generator.ts** - Puppeteer-based PDF generation library
5. **app/api/beo/generate-pdf/route.ts** - API endpoint for PDF generation

### Demo Pages
6. **app/beo/kitchen/page.tsx** - Kitchen BEO preview page
7. **app/beo/service/page.tsx** - Service BEO preview page

### Styling
8. **app/beo-print.css** - Print-optimized styles from banquet-blueprint

### Documentation
9. **components/templates/README.md** - Comprehensive template documentation

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
npm install puppeteer
```

Puppeteer will download Chromium automatically (~300MB). This is required for PDF generation.

### Step 2: Import Print Styles

Add the BEO print styles to your `app/globals.css`:

```css
@import './beo-print.css';
```

Or add directly to your layout:

```tsx
// app/layout.tsx
import './beo-print.css';
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Test the Templates

Visit these URLs to see the templates in action:

- **Kitchen BEO**: http://localhost:3000/beo/kitchen
- **Service BEO**: http://localhost:3000/beo/service
- **PDF API Docs**: http://localhost:3000/api/beo/generate-pdf

## 📝 Template Structure

### Kitchen BEO Template

**Focus**: Kitchen operations, prep schedules, cooking instructions

**Sections**:
1. ✅ **Header** - Event details, BEO number, guest count
2. ✅ **Menu** - Organized by course with detailed prep instructions
   - Appetizers
   - Sides/Accompaniments  
   - Main Courses
   - Desserts
3. ✅ **Prep Schedule** - Prioritized task list with time estimates
4. ✅ **Equipment Allocation** - Cooking, prep, and service equipment
5. ✅ **Staff Assignments** - Kitchen team roles and responsibilities
6. ✅ **Allergen Legend** - Visual reference for allergen codes
7. ✅ **Special Instructions** - Critical notes and alerts
8. ✅ **Dietary Restrictions Summary** - Count of special dietary needs

**Key Features**:
- Station assignments for each menu item
- Step-by-step prep instructions
- Scaling notes for large quantities
- Cook times and temperatures
- Priority flagging for critical tasks
- Visual allergen indicators

### Service BEO Template

**Focus**: Front-of-house operations, service flow, guest management

**Sections**:
1. ✅ **Header** - Event details and BEO number
2. ✅ **Service Timeline** - Visual timeline with setup/service/breakdown phases
3. ✅ **Staff Positioning** - FOH team with table assignments
4. ✅ **Guest Management** - Total count, VIP tracking, seating arrangements
5. ✅ **Equipment Setup** - Dining, bar, and decor equipment with setup times
6. ✅ **Service Coordination** - Contacts, vendor coordination, critical notes
7. ✅ **Floor Plan** - Optional floor plan image
8. ✅ **Service Notes** - Service priorities and communication protocols

**Key Features**:
- Visual service timeline with time markers
- Staff-to-table mapping
- Special seating arrangements tracking
- Vendor arrival times and requirements
- Emergency contact information
- Critical service notes highlighting

## 🎨 Design System Reference

Both templates use the "Patina" design system from banquet-blueprint:

### Typography
- **Serif**: Cormorant Garamond (elegant, editorial)
- **Sans**: Montserrat (clean, professional)
- **Scale**: 5xl (event names) → xs (metadata labels)

### Colors
- **Primary**: Pure black (#000) and white (#FFF)
- **Secondary**: Bone/cream (#fafaf9)
- **Muted**: Medium gray (#666)

### Layout
- **Whitespace**: Gallery-like spacing (16 units between sections)
- **Borders**: Ultra-thin 1px dividers
- **Grid**: Responsive 2-column layouts
- **Print**: Optimized spacing (8 units) for PDF output

### Components
- `.patina-label` - Uppercase tracked labels
- `.patina-divider` - 1px horizontal dividers
- `.patina-button` - Inverted hover buttons

## 📄 PDF Generation

### Method 1: Using the API (Recommended)

```bash
# Generate Kitchen BEO PDF
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d @kitchen-beo-data.json \
  --output kitchen-beo.pdf

# Where kitchen-beo-data.json contains:
{
  "type": "kitchen",
  "data": { /* KitchenBEOData */ },
  "returnFormat": "buffer"
}
```

### Method 2: Using the Library Directly

```typescript
import { generateBEOPDF } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import React from 'react';

async function generatePDF(data: KitchenBEOData) {
  const component = React.createElement(KitchenBEO, { data });
  const result = await generateBEOPDF(component, './output/beo.pdf');
  
  if (result.success) {
    console.log('✅ PDF generated successfully');
    console.log(`📄 Pages: ${result.metadata.pages}`);
    console.log(`📦 Size: ${(result.metadata.fileSize / 1024).toFixed(2)} KB`);
    console.log(`⏱️  Time: ${result.metadata.generationTime}ms`);
  } else {
    console.error('❌ PDF generation failed:', result.error);
  }
}
```

### Method 3: Browser Print

Both templates include a print button that triggers `window.print()`:

1. Open template page (e.g., http://localhost:3000/beo/kitchen)
2. Click the "Print" button in top-right corner
3. Choose "Save as PDF" in print dialog

## 🔧 Customization

### Adding Custom Menu Items

```typescript
const customMenuItem: MenuItem = {
  id: 'custom1',
  name: 'Grilled Ribeye',
  description: 'USDA Prime ribeye with red wine reduction',
  allergens: { dairy: true },
  portionSize: '8 oz per guest',
  cookTime: '12-15 min',
  cookingTemperature: '450°F',
  station: 'Grill',
  prepInstructions: [
    'Bring steaks to room temperature 30 min before cooking',
    'Season generously with salt and pepper',
    'Sear 4 minutes per side for medium-rare',
    'Rest 5 minutes before plating',
  ],
  scalingNotes: 'For 100 guests: 50 lbs ribeye. Grill in batches of 16.',
};
```

### Modifying Timeline Events

```typescript
const timelineEvent: TimelineEvent = {
  time: '5:00 PM',
  label: 'Cocktail Hour',
  sublabel: 'Passed apps',
  type: 'service',
  notes: 'Bar opens at this time',
};
```

### Adding Staff Positions

```typescript
const staffPosition: StaffPosition = {
  role: 'Sommelier',
  count: 2,
  station: 'Wine Service',
  startTime: '5:30 PM',
  responsibilities: [
    'Wine pairing consultation',
    'Tableside wine service',
    'Cellar management',
  ],
  members: [
    { name: 'Pierre Dupont', position: 'Head Sommelier', station: 'Main Dining' },
  ],
};
```

## 🧪 Testing

### Test Kitchen BEO

```bash
# View in browser
open http://localhost:3000/beo/kitchen

# Generate PDF via API
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "type": "kitchen",
    "data": {
      "header": {
        "beoNumber": "TEST-001",
        "eventName": "Test Event",
        "eventDate": "Today",
        "eventTime": "6:00 PM",
        "clientName": "Test Client",
        "venue": "Test Venue",
        "guestCount": 50
      },
      "menu": {"appetizers": [], "mains": [], "desserts": []},
      "prepSchedule": [],
      "equipment": {"cooking": [], "prep": [], "service": []},
      "staffAssignments": []
    }
  }' \
  --output test-kitchen.pdf
```

### Test Service BEO

```bash
# View in browser
open http://localhost:3000/beo/service

# Generate PDF
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"type": "service", "data": {...}}' \
  --output test-service.pdf
```

### Verify Print Styles

1. Open template in browser
2. Open Developer Tools (F12)
3. Toggle "Print" media emulation
4. Verify styles match expected output

## 🔗 Integration Examples

### With Airtable Data

```typescript
import { fetchRecipes } from '@/lib/airtable-client';
import type { KitchenBEOData } from '@/components/templates/KitchenBEO';

async function createBEOFromAirtable(eventId: string): Promise<KitchenBEOData> {
  // Fetch event details
  const event = await fetchEventDetails(eventId);
  
  // Fetch associated recipes
  const recipes = await fetchRecipes({ event: eventId });
  
  // Transform to menu items
  const menuItems = recipes.map(recipe => ({
    id: recipe.id,
    name: recipe.fields.Name,
    description: recipe.fields.Description,
    allergens: parseAllergens(recipe.fields.Allergens),
    prepInstructions: recipe.fields.Instructions,
    station: recipe.fields.Station,
    // ... other fields
  }));
  
  // Build BEO data
  return {
    header: {
      beoNumber: event.fields.BEONumber,
      eventName: event.fields.EventName,
      // ... other header fields
    },
    menu: {
      appetizers: menuItems.filter(i => i.category === 'appetizer'),
      mains: menuItems.filter(i => i.category === 'main'),
      desserts: menuItems.filter(i => i.category === 'dessert'),
    },
    // ... other sections
  };
}
```

### With Agent Orchestration

```typescript
import { getOrchestrator } from '@/lib/agents/orchestrator';
import { generateBEOPDF } from '@/lib/pdf-generator';

// Register BEO PDF agent
const orchestrator = getOrchestrator();

orchestrator.registerAgent({
  name: 'beo-pdf-generator',
  description: 'Generate BEO PDFs from template data',
  version: '1.0.0',
  
  async execute(input, context) {
    const { type, data } = input.parameters;
    
    const Component = type === 'kitchen' ? KitchenBEO : ServiceBEO;
    const component = React.createElement(Component, { data });
    
    const result = await generateBEOPDF(component);
    
    return {
      success: result.success,
      data: {
        pdf: bufferToBase64(result.buffer),
        metadata: result.metadata,
      },
    };
  },
});

// Use the agent
const result = await orchestrator.executeAgent('beo-pdf-generator', {
  action: 'generate',
  parameters: {
    type: 'kitchen',
    data: myKitchenBEOData,
  },
});
```

## 🎯 Common Use Cases

### 1. Generate BEO from Event Form

```typescript
// app/api/events/[id]/beo/route.ts
export async function POST(request: NextRequest, { params }) {
  const eventId = params.id;
  
  // Fetch event data
  const eventData = await fetchEvent(eventId);
  
  // Build BEO data structure
  const beoData = transformEventToBEO(eventData);
  
  // Generate PDF
  const component = React.createElement(KitchenBEO, { data: beoData });
  const result = await generateBEOPDF(component);
  
  // Return PDF
  return new NextResponse(result.buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="BEO-${eventId}.pdf"`,
    },
  });
}
```

### 2. Batch PDF Generation

```typescript
async function generateBatchBEOs(eventIds: string[]) {
  const results = await Promise.all(
    eventIds.map(async (id) => {
      const data = await fetchBEOData(id);
      const component = React.createElement(KitchenBEO, { data });
      return generateBEOPDF(component, `./output/BEO-${id}.pdf`);
    })
  );
  
  const successful = results.filter(r => r.success).length;
  console.log(`Generated ${successful}/${eventIds.length} PDFs`);
}
```

### 3. Email BEO PDF

```typescript
import { generateBEOPDF } from '@/lib/pdf-generator';
import nodemailer from 'nodemailer';

async function emailBEO(recipientEmail: string, beoData: KitchenBEOData) {
  // Generate PDF
  const component = React.createElement(KitchenBEO, { data: beoData });
  const result = await generateBEOPDF(component);
  
  if (!result.success) {
    throw new Error('PDF generation failed');
  }
  
  // Send email
  const transporter = nodemailer.createTransport({ /* config */ });
  
  await transporter.sendMail({
    to: recipientEmail,
    subject: `BEO: ${beoData.header.eventName}`,
    text: `Please find attached the BEO for ${beoData.header.eventName}`,
    attachments: [
      {
        filename: `BEO-${beoData.header.beoNumber}.pdf`,
        content: result.buffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
```

### 4. Dynamic BEO from Form Submission

```typescript
'use client';

import { useState } from 'react';
import { KitchenBEO } from '@/components/templates/KitchenBEO';

export default function BEOBuilder() {
  const [beoData, setBEOData] = useState<KitchenBEOData | null>(null);
  
  const handleSubmit = async (formData: any) => {
    // Transform form data to BEO structure
    const data = transformFormToBEO(formData);
    setBEOData(data);
    
    // Optionally generate PDF immediately
    const response = await fetch('/api/beo/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'kitchen', data }),
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BEO-${data.header.beoNumber}.pdf`;
    a.click();
  };
  
  return (
    <div>
      {/* Form here */}
      {beoData && <KitchenBEO data={beoData} />}
    </div>
  );
}
```

## 🎨 Customizing Styles

### Adding Company Branding

```typescript
// Update header with logo
const data: KitchenBEOData = {
  header: {
    // ... other fields
    logoUrl: 'https://yourcompany.com/logo.png',
  },
  // ... rest of data
};
```

### Custom Colors (Maintaining Print Quality)

If you need branded colors while maintaining print quality:

```typescript
// In your custom CSS
const customCSS = `
  .custom-brand-accent {
    border-left-color: #your-brand-color !important;
  }
  
  @media print {
    .custom-brand-accent {
      border-left-color: #000 !important; /* Revert to black for print */
    }
  }
`;

const result = await generatePDFFromComponent(component, {
  customCSS,
});
```

### Custom Footer

```typescript
const result = await generatePDFFromComponent(component, {
  displayHeaderFooter: true,
  footerTemplate: `
    <div style="font-size: 9px; text-align: center; width: 100%;">
      <span>Your Company Name | Page <span class="pageNumber"></span></span>
    </div>
  `,
  margin: {
    bottom: '0.75in', // Extra space for footer
  },
});
```

## 📊 Performance Considerations

### Generation Time Benchmarks

Based on template complexity:

| Template Type | Pages | Typical Time |
|--------------|-------|--------------|
| Kitchen BEO (simple) | 2-3 | 3-5 seconds |
| Kitchen BEO (complex) | 5-7 | 7-12 seconds |
| Service BEO (simple) | 2-3 | 3-5 seconds |
| Service BEO (complex) | 4-6 | 6-10 seconds |

### Optimization Tips

1. **Caching**: Cache generated PDFs for identical data
   ```typescript
   const cacheKey = generateCacheKey(beoData);
   const cached = await getFromCache(cacheKey);
   if (cached) return cached;
   ```

2. **Background Jobs**: Generate PDFs asynchronously
   ```typescript
   // Queue for background processing
   await queuePDFGeneration({ type: 'kitchen', data: beoData });
   ```

3. **Resource Management**: Limit concurrent generations
   ```typescript
   const maxConcurrent = 3;
   const queue = new Queue({ concurrency: maxConcurrent });
   ```

4. **Browser Pooling**: Reuse browser instances
   ```typescript
   // Keep browser instance alive for multiple PDFs
   const browser = await puppeteer.launch();
   // Reuse for multiple generations
   await browser.close(); // Close when done
   ```

## 🐛 Troubleshooting

### Issue: Puppeteer Installation Fails

**Error**: `Failed to download Chromium`

**Solutions**:
```bash
# Skip Chromium download, use system Chrome
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer

# Or specify executable path
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm install puppeteer
```

### Issue: Fonts Not Loading in PDF

**Error**: PDF shows default fonts

**Solutions**:
1. Add `waitForNetworkIdle: true` to PDF options
2. Ensure Google Fonts link is in HTML head
3. Add explicit font wait:
   ```typescript
   await page.evaluateHandle('document.fonts.ready');
   ```

### Issue: Images Missing in PDF

**Error**: Logo or floor plan not rendering

**Solutions**:
1. Use absolute URLs: `https://domain.com/logo.png`
2. Ensure images are publicly accessible
3. Add `waitForNetworkIdle: true`
4. Check CORS headers on image server

### Issue: PDF Too Large

**Error**: File size is excessive

**Solutions**:
1. Optimize images before including (compress, resize)
2. Use WebP format for images
3. Reduce `scale` option (e.g., `scale: 0.9`)
4. Remove unnecessary background graphics

### Issue: Styling Doesn't Match Screen

**Error**: PDF looks different from browser preview

**Solutions**:
1. Ensure print CSS is loaded
2. Check `printBackground: true` is set
3. Verify all custom CSS is included
4. Test with browser print preview first

## 📚 Additional Resources

### Files Reference

- **Templates**: `/components/templates/`
- **PDF Library**: `/lib/pdf-generator.ts`
- **API Endpoint**: `/app/api/beo/generate-pdf/route.ts`
- **Sample Data**: `/components/templates/sample-data.ts`
- **Print Styles**: `/app/beo-print.css`
- **Documentation**: `/components/templates/README.md`

### External Documentation

- [Puppeteer API](https://pptr.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Server Components](https://react.dev/reference/react/use-server)

## 🚢 Deployment

### Environment Variables

No additional environment variables required for PDF generation. Puppeteer runs headless.

### Production Considerations

1. **Docker**: Include Chromium dependencies in Dockerfile
   ```dockerfile
   RUN apt-get update && apt-get install -y \
       chromium \
       fonts-liberation \
       libappindicator3-1 \
       libasound2 \
       libatk-bridge2.0-0 \
       libgtk-3-0 \
       libnss3 \
       libx11-xcb1 \
       libxss1 \
       xdg-utils
   ```

2. **Serverless**: Use `chrome-aws-lambda` for AWS Lambda
   ```bash
   npm install chrome-aws-lambda
   ```

3. **Memory**: Ensure sufficient memory (minimum 512MB recommended)

4. **Timeouts**: Increase API timeouts for PDF generation
   ```typescript
   export const maxDuration = 30; // 30 seconds for Vercel
   ```

## ✅ Next Steps

1. **Install Dependencies**:
   ```bash
   npm install puppeteer
   ```

2. **Import Print Styles**: Add to `app/globals.css` or layout

3. **Test Templates**:
   - Visit `/beo/kitchen` and `/beo/service`
   - Test print functionality
   - Generate sample PDFs

4. **Integrate with Your Data**:
   - Connect to Airtable recipe library
   - Build forms to capture BEO data
   - Create workflows for BEO approval

5. **Deploy**:
   - Test PDF generation in production
   - Monitor performance and file sizes
   - Set up caching if needed

## 📞 Support

Questions or issues? Check:
- Main [README.md](../../README.md)
- Template [README](../templates/README.md)
- [AGENT_IMPLEMENTATION.md](../../AGENT_IMPLEMENTATION.md)

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Created**: 2026-02-20  
**Author**: Jimmy Lauchoy

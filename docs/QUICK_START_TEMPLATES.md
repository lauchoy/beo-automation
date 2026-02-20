# Quick Start Guide: BEO Templates & PDF Generation

Get up and running with BEO templates and PDF generation in minutes.

## Prerequisites

- Node.js 18+ installed
- BEO Automation repository cloned
- Dependencies installed (`npm install`)

## Installation

### 1. Install Dependencies

The required dependencies should already be in `package.json`. If not, install them:

```bash
npm install puppeteer react-dom
npm install --save-dev @types/react @types/react-dom tsx
```

### 2. Verify Installation

```bash
# Check if Puppeteer is installed
npm list puppeteer

# Should show: puppeteer@22.0.0 or similar
```

## Quick Test

### Generate Sample PDFs

Run the test script to generate sample PDFs:

```bash
npm run test:pdf
```

This will create two PDFs in the `output/` directory:
- `kitchen-beo-test.pdf` - Kitchen production sheet
- `service-beo-test.pdf` - Front-of-house service plan

Check the output:

```bash
ls -lh output/
open output/kitchen-beo-test.pdf
open output/service-beo-test.pdf
```

## Usage Examples

### Example 1: Display Kitchen BEO in Browser

```typescript
// app/beo/kitchen/[id]/page.tsx
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/lib/sample-data/kitchen-beo-sample';

export default function KitchenBEOPage() {
  return <KitchenBEO data={sampleKitchenBEO} />;
}
```

Navigate to `/beo/kitchen/[id]` and click the Print button to print from browser.

### Example 2: Generate PDF via API

**Start the dev server**:
```bash
npm run dev
```

**Generate Kitchen BEO PDF**:
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "kitchen",
    "data": {
      "header": {
        "beoNumber": "BEO-2024-001",
        "eventName": "Test Event",
        "eventDate": "March 15, 2024",
        "eventTime": "6:00 PM",
        "clientName": "Test Client",
        "venue": "Test Venue"
      },
      "guests": {
        "total": 100,
        "breakdown": [
          {"type": "Chicken", "count": 60, "color": "main"},
          {"type": "Fish", "count": 40, "color": "appetizer"}
        ],
        "dietary": {}
      },
      "menu": {
        "appetizers": [],
        "mains": [],
        "desserts": []
      },
      "prepSchedule": [],
      "equipmentAllocation": [],
      "staffAssignments": []
    },
    "filename": "test-kitchen-beo.pdf"
  }' \
  --output test-kitchen-beo.pdf
```

**Generate Service BEO PDF**:
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "service",
    "data": {
      "header": {
        "beoNumber": "BEO-2024-001-S",
        "eventName": "Test Event",
        "eventDate": "March 15, 2024",
        "eventTime": "6:00 PM",
        "clientName": "Test Client",
        "venue": "Test Venue"
      },
      "timeline": [],
      "floorPlan": {
        "totalTables": 10,
        "totalSeats": 100,
        "layout": "Rounds of 10"
      },
      "staffPositioning": [],
      "guestManagement": {
        "totalGuests": 100,
        "expectedArrival": "5:00 PM",
        "cocktailHour": true,
        "seatingStyle": "plated",
        "specialNeeds": []
      },
      "serviceFlow": [],
      "equipmentSetup": [],
      "emergencyContacts": []
    },
    "filename": "test-service-beo.pdf"
  }' \
  --output test-service-beo.pdf
```

### Example 3: Programmatic PDF Generation

```typescript
import { generatePDF, generatePDFToFile } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/lib/sample-data/kitchen-beo-sample';
import React from 'react';

async function generateMyBEO() {
  // Option 1: Generate to buffer
  const result = await generatePDF({
    component: React.createElement(KitchenBEO, { 
      data: sampleKitchenBEO 
    }),
  });

  if (result.success && result.buffer) {
    console.log('PDF generated!');
    console.log('Size:', result.buffer.length, 'bytes');
    
    // Do something with the buffer
    // - Upload to S3
    // - Send via email
    // - Return in API response
  }

  // Option 2: Generate directly to file
  const fileResult = await generatePDFToFile({
    component: React.createElement(KitchenBEO, { 
      data: sampleKitchenBEO 
    }),
    outputPath: './my-beo.pdf',
  });

  console.log('PDF saved to:', fileResult.filePath);
}
```

## Common Workflows

### Workflow 1: Create BEO → Generate PDF → Email to Staff

```typescript
async function createAndDistributeBEO(eventData: any) {
  // 1. Create BEO data structure
  const kitchenBEO: KitchenBEOData = {
    header: { /* from eventData */ },
    guests: { /* from eventData */ },
    // ... populate from your data source
  };

  // 2. Generate PDF
  const pdf = await generatePDF({
    component: React.createElement(KitchenBEO, { data: kitchenBEO }),
  });

  if (!pdf.success) {
    throw new Error('PDF generation failed');
  }

  // 3. Send email
  await sendEmail({
    to: 'kitchen@venue.com',
    subject: `Kitchen BEO - ${kitchenBEO.header.eventName}`,
    body: 'Please see attached BEO for upcoming event.',
    attachments: [{
      filename: `${kitchenBEO.header.beoNumber}-kitchen.pdf`,
      content: pdf.buffer,
    }],
  });

  console.log('BEO distributed successfully!');
}
```

### Workflow 2: Batch Generation for Week's Events

```typescript
import { generateBatchPDFs } from '@/lib/pdf-generator';

async function generateWeeklyBEOs() {
  // Fetch all BEOs for the week
  const weekBEOs = await fetchBEOsForWeek();

  // Prepare batch
  const batch = weekBEOs.map(beo => ({
    component: React.createElement(KitchenBEO, { data: beo }),
  }));

  // Generate all PDFs
  const results = await generateBatchPDFs(batch);

  // Process results
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`✓ BEO ${index + 1} generated`);
      // Save or upload
    } else {
      console.error(`✗ BEO ${index + 1} failed:`, result.error);
    }
  });
}
```

### Workflow 3: On-Demand PDF from Web UI

```typescript
// Frontend component
'use client';

import { useState } from 'react';

export function BEOPDFGenerator({ beoData }: { beoData: KitchenBEOData }) {
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'kitchen',
          data: beoData,
          filename: `${beoData.header.beoNumber}-kitchen.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Download PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = `${beoData.header.beoNumber}-kitchen.pdf`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleGeneratePDF}
      disabled={generating}
      className="px-4 py-2 bg-black text-white"
    >
      {generating ? 'Generating...' : 'Download PDF'}
    </button>
  );
}
```

## Development Tips

### Tip 1: Hot Reload with Templates

When developing templates, use Vite/Next.js dev server for instant preview:

```bash
npm run dev
# Navigate to your template page
# Edit template components - changes reflect immediately
```

### Tip 2: Preview Before PDF Generation

Always preview in browser first using browser print preview (Cmd/Ctrl + P) to see how the PDF will look.

### Tip 3: Use Sample Data

Reference the sample data files for complete examples:

```typescript
import { sampleKitchenBEO } from '@/lib/sample-data/kitchen-beo-sample';
import { sampleServiceBEO } from '@/lib/sample-data/service-beo-sample';

// Use as-is for testing
<KitchenBEO data={sampleKitchenBEO} />

// Or modify for your needs
const myData = { ...sampleKitchenBEO, header: { ...myHeader } };
```

### Tip 4: Environment-Specific Configuration

```typescript
// Development - faster generation, lower quality
const devConfig = {
  format: 'A4',
  printBackground: false,
  scale: 0.9,
};

// Production - high quality
const prodConfig = {
  format: 'A4',
  printBackground: true,
  scale: 1,
  margin: { top: '0.5in', bottom: '0.5in' },
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
```

## Next Steps

1. **Explore Templates**
   - Open `components/templates/KitchenBEO.tsx`
   - Review component structure
   - Examine styling patterns

2. **Customize for Your Needs**
   - Modify sample data
   - Add custom sections
   - Adjust styling

3. **Integrate with Your System**
   - Connect to Airtable
   - Add to workflows
   - Set up automated distribution

4. **Read Full Documentation**
   - [BEO_TEMPLATES.md](./BEO_TEMPLATES.md)
   - [PDF_GENERATION.md](./PDF_GENERATION.md)

## Troubleshooting Quick Fixes

### PDF Generation Fails

```bash
# Reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer

# For Linux, install dependencies
sudo apt-get install -y chromium-browser
```

### TypeScript Errors

```bash
# Regenerate types
npm run type-check

# Install missing types
npm install --save-dev @types/react @types/react-dom
```

### Output Directory Missing

```bash
# Create output directory
mkdir -p output
chmod 755 output
```

## Getting Help

- **Documentation**: Check `/docs` folder
- **Sample Code**: Review `/scripts/test-pdf-generation.ts`
- **Templates**: Examine `/components/templates`
- **Issues**: Open GitHub issue with details

---

**Ready to generate professional BEOs!** 🎉

Start with `npm run test:pdf` and go from there.

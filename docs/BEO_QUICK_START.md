# BEO Templates - Quick Start Guide

Get up and running with BEO templates in 5 minutes.

## ⚡ 5-Minute Quick Start

### Step 1: Install (1 minute)

```bash
npm install
```

This installs Puppeteer and Chromium (~300MB).

### Step 2: Import Styles (30 seconds)

Add to `app/globals.css`:

```css
@import './beo-print.css';
```

### Step 3: Start Server (30 seconds)

```bash
npm run dev
```

### Step 4: View Templates (1 minute)

Open in browser:
- Kitchen: http://localhost:3000/beo/kitchen
- Service: http://localhost:3000/beo/service

### Step 5: Generate PDFs (2 minutes)

**Option A: Browser Print**
1. Click "Print" button on template page
2. Choose "Save as PDF"

**Option B: API**
```bash
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"type":"kitchen","data":{"header":{"beoNumber":"TEST-001","eventName":"Test","eventDate":"Today","eventTime":"6PM","clientName":"Test","venue":"Test","guestCount":50},"menu":{"appetizers":[],"mains":[],"desserts":[]},"prepSchedule":[],"equipment":{"cooking":[],"prep":[],"service":[]},"staffAssignments":[]}}' \
  --output test.pdf
```

**Option C: Test Script**
```bash
npm install -D tsx
npx tsx scripts/test-pdf-generation.ts
```

## 📋 Template Cheat Sheet

### Kitchen BEO - Data Structure

```typescript
{
  header: { beoNumber, eventName, eventDate, eventTime, clientName, venue, guestCount },
  menu: { appetizers[], mains[], desserts[], sides?[] },
  prepSchedule: [{ label, station, priority?, timeEstimate?, details? }],
  equipment: { cooking[], prep[], service[] },
  staffAssignments: [{ role, count, station, responsibilities?, members? }],
  specialInstructions?: string,
  dietaryRestrictions?: { vegetarian?, vegan?, glutenFree?, nutAllergy? }
}
```

### Service BEO - Data Structure

```typescript
{
  header: { beoNumber, eventName, eventDate, eventTime, clientName, venue },
  timeline: [{ time, label, sublabel?, type?, notes? }],
  staffPositions: [{ role, count, station?, members?, responsibilities? }],
  guestManagement: { totalGuests, vipCount?, seatingLayout?, specialSeating?[] },
  equipment: { dining[], bar[], decor[] },
  coordination: { contactPerson?, emergencyContacts?[], vendorCoordination?[] },
  floorPlan?: string,
  serviceNotes?: string
}
```

## 🎯 Common Tasks

### Import Template

```typescript
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { ServiceBEO } from '@/components/templates/ServiceBEO';
import { sampleKitchenBEO, sampleServiceBEO } from '@/components/templates/sample-data';
```

### Use in Page

```tsx
export default function MyBEOPage() {
  return <KitchenBEO data={sampleKitchenBEO} />;
}
```

### Generate PDF

```typescript
import { generateBEOPDF } from '@/lib/pdf-generator';
import React from 'react';

const component = React.createElement(KitchenBEO, { data: myData });
const result = await generateBEOPDF(component, './output/beo.pdf');
```

### API Call

```typescript
const response = await fetch('/api/beo/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'kitchen',
    data: myBEOData,
  }),
});

const blob = await response.blob();
// Download or display PDF
```

## 🔧 Customization Quick Reference

### Add Menu Item

```typescript
const menuItem: MenuItem = {
  id: 'item1',
  name: 'Dish Name',
  description: 'Description here',
  allergens: { dairy: true, gluten: true },
  portionSize: '6 oz per guest',
  cookTime: '15 min',
  station: 'Grill',
  prepInstructions: ['Step 1', 'Step 2'],
  scalingNotes: 'For 100 guests: ...',
};
```

### Add Timeline Event

```typescript
const event: TimelineEvent = {
  time: '6:00 PM',
  label: 'Dinner Service',
  sublabel: 'First course',
  type: 'service',
  notes: 'Coordinate with kitchen',
};
```

### Add Staff Assignment

```typescript
const staff: StaffAssignment = {
  role: 'Line Cook',
  count: 4,
  station: 'Hot Line',
  startTime: '3:00 PM',
  responsibilities: ['Grill', 'Sauté', 'Roast'],
  members: [{ name: 'Chef Smith' }],
};
```

## 📊 File Reference

| File | Purpose | Size |
|------|---------|------|
| `components/templates/KitchenBEO.tsx` | Kitchen template | 22 KB |
| `components/templates/ServiceBEO.tsx` | Service template | 21 KB |
| `components/templates/sample-data.ts` | Sample data | 22 KB |
| `components/templates/types.ts` | Type definitions | 10 KB |
| `lib/pdf-generator.ts` | PDF library | 15 KB |
| `app/api/beo/generate-pdf/route.ts` | API endpoint | 5 KB |
| `app/beo-print.css` | Print styles | 6 KB |

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Puppeteer won't install | `PUPPETEER_SKIP_DOWNLOAD=true npm install` |
| Fonts not loading | Add `waitForNetworkIdle: true` to PDF options |
| PDF too large | Optimize images, reduce scale |
| Styles not printing | Import `beo-print.css` in layout |
| API timeout | Increase `maxDuration` in route.ts |

## 📚 Documentation Links

- **Full Guide**: [docs/BEO_TEMPLATES_GUIDE.md](./BEO_TEMPLATES_GUIDE.md)
- **Template README**: [components/templates/README.md](../components/templates/README.md)
- **Implementation Summary**: [docs/BEO_TEMPLATES_IMPLEMENTATION.md](./BEO_TEMPLATES_IMPLEMENTATION.md)

## 🎓 Learning Path

1. **Explore Sample Data** → `components/templates/sample-data.ts`
2. **View Templates** → http://localhost:3000/beo/kitchen
3. **Test Print** → Click print button, check preview
4. **Generate PDF** → Use API or test script
5. **Customize Data** → Modify sample data, see changes
6. **Build Integration** → Connect to your data source

## ✅ Checklist

Before going to production:

- [ ] Puppeteer installed successfully
- [ ] Print styles imported in globals.css
- [ ] Templates render correctly in browser
- [ ] Print preview shows proper styling
- [ ] PDF generation works via API
- [ ] Test script runs without errors
- [ ] Fonts load correctly in PDFs
- [ ] All sections display as expected
- [ ] Performance is acceptable (<10s per PDF)
- [ ] Error handling tested

## 🚀 Production Deployment

### Vercel

```bash
# Vercel automatically handles Puppeteer
vercel deploy
```

### Docker

Add to Dockerfile:
```dockerfile
RUN apt-get update && apt-get install -y chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### AWS Lambda

Use `chrome-aws-lambda` package:
```bash
npm install chrome-aws-lambda
```

---

**Ready to use!** 🎉

For detailed information, see [BEO_TEMPLATES_GUIDE.md](./BEO_TEMPLATES_GUIDE.md)

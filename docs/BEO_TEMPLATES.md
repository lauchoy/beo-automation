# BEO Template System

Complete documentation for the BEO (Banquet Event Order) template system, including Kitchen and Service templates with PDF generation capabilities.

## Overview

The BEO Template System provides professional, print-ready templates for banquet event documentation. Based on the elegant "Patina" design system from the banquet-blueprint reference, these templates combine:

- **Professional Typography** - Cormorant Garamond serif with Montserrat sans-serif
- **Print-Optimized Styling** - Designed for both screen and PDF output
- **Comprehensive Data Structures** - Full TypeScript type safety
- **Modular Components** - Reusable, maintainable architecture
- **PDF Generation** - Server-side rendering to high-quality PDFs

## Template Types

### 1. Kitchen BEO Template

**Purpose**: Kitchen operations and food preparation documentation

**File**: `components/templates/KitchenBEO.tsx`

**Key Sections**:
- ✅ BEO Header with event details
- ✅ Guest count and dietary requirements breakdown
- ✅ Production menu with detailed prep instructions
- ✅ Prep schedule with priority tasks and timing
- ✅ Equipment allocation by station
- ✅ Kitchen staff assignments and responsibilities
- ✅ Critical allergen information (highlighted)
- ✅ Special instructions for kitchen team
- ✅ Visual allergen legend

**Optimized For**:
- Executive chefs and sous chefs
- Line cooks and prep teams
- Kitchen coordination and timing
- Food safety and allergen management
- Production planning and scaling

### 2. Service BEO Template

**Purpose**: Front-of-house operations and guest service documentation

**File**: `components/templates/ServiceBEO.tsx`

**Key Sections**:
- ✅ BEO Header with event details
- ✅ Visual service timeline with milestones
- ✅ Floor plan overview (tables, seats, layout)
- ✅ Guest management and special accommodations
- ✅ Staff positioning and section assignments
- ✅ Detailed service flow with timing
- ✅ Equipment setup by location
- ✅ Bar service details and requests
- ✅ Vendor coordination and requirements
- ✅ Emergency contacts (highlighted)
- ✅ Special instructions for service team

**Optimized For**:
- Event captains and floor managers
- Servers and front-of-house staff
- Service coordination and guest flow
- Vendor management
- Timeline execution

## Design System (Patina)

Inspired by high-fashion editorial layouts and modern museum aesthetics.

### Typography

**Serif Font: Cormorant Garamond**
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)
- Usage: Headings, numbers, elegant text, event names
- Character: Classic, sophisticated, editorial

**Sans Font: Montserrat**
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold)
- Usage: Body text, labels, details, instructions
- Character: Clean, modern, highly readable

### Color Palette

**Monochromatic** - Pure black and white with subtle grays

- **Foreground**: #000 (Pure Black)
- **Background**: #FFF (Pure White)
- **Muted**: #333 (Dark Gray) - for secondary text
- **Borders**: #000 with opacity variations
- **Accents**: Background tints (#F5F5F5) for emphasis

### Layout Principles

1. **Maximal Whitespace** - Generous spacing creates breathing room
2. **Ultra-Thin Dividers** - 1px lines separate major sections
3. **Grid Layouts** - Organized, balanced information display
4. **Page Break Control** - Sections don't split awkwardly
5. **Hierarchical Information** - Clear visual hierarchy

### Visual Elements

**Allergen Badges**
- Square bordered icons with letter codes
- G (Gluten), D (Dairy), N (Nuts), SF (Shellfish), E (Eggs), S (Soy), F (Fish)

**Priority Indicators**
- Left border accent (2-4px) for high-priority items
- Critical items have darker backgrounds

**Checkboxes**
- Clean square boxes for task completion
- Print-friendly rendering

**Timeline Visualization**
- Horizontal scrollable timeline with dots
- Color-coded by event type

## Usage

### Basic Implementation

```typescript
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/lib/sample-data/kitchen-beo-sample';

function MyPage() {
  return <KitchenBEO data={sampleKitchenBEO} />;
}
```

### With Custom Print Handler

```typescript
import { KitchenBEO } from '@/components/templates/KitchenBEO';

function MyPage() {
  const handlePrint = async () => {
    // Custom print logic - could trigger PDF generation
    const response = await fetch('/api/pdf/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'kitchen', data: myBEOData }),
    });
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return <KitchenBEO data={myBEOData} onPrint={handlePrint} />;
}
```

### Generate PDF Programmatically

```typescript
import { generatePDF } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import React from 'react';

const result = await generatePDF({
  component: React.createElement(KitchenBEO, { data: kitchenBEOData }),
});

if (result.success && result.buffer) {
  // Save to file system or cloud storage
  await saveToS3(result.buffer, `BEO-${beoNumber}-kitchen.pdf`);
}
```

## Data Structure Reference

### Kitchen BEO Data

```typescript
interface KitchenBEOData {
  header: {
    beoNumber: string;          // "BEO-2024-001"
    eventName: string;          // "Wedding Reception"
    eventDate: string;          // "March 15, 2024"
    eventTime: string;          // "6:00 PM - 11:00 PM"
    clientName: string;         // "John & Jane Doe"
    venue: string;              // "Grand Ballroom"
    logoUrl?: string;           // Optional company logo
  };
  guests: {
    total: number;              // Total guest count
    breakdown: Array<{          // Meal choice breakdown
      type: string;             // "Chicken", "Fish", etc.
      count: number;
      color: 'appetizer' | 'main' | 'dessert' | 'default';
    }>;
    dietary: {                  // Dietary restrictions
      vegetarian?: number;
      vegan?: number;
      glutenFree?: number;
      dairyFree?: number;
      nutAllergy?: number;
    };
  };
  menu: {
    appetizers: MenuItem[];
    mains: MenuItem[];
    desserts: MenuItem[];
    sides?: MenuItem[];
  };
  prepSchedule: PrepTask[];          // Ordered by time
  equipmentAllocation: EquipmentCategory[];
  staffAssignments: StaffAssignment[];
  specialInstructions?: string;      // Free-form text
  allergenNotes?: string[];          // Critical allergen info
}
```

### Service BEO Data

```typescript
interface ServiceBEOData {
  header: { /* same as Kitchen */ };
  timeline: TimelineEvent[];          // Chronological event flow
  floorPlan: {
    totalTables: number;
    totalSeats: number;
    layout: string;                   // "Rounds of 10"
    specialArrangements?: string[];
  };
  staffPositioning: StaffPosition[];  // FOH staff assignments
  guestManagement: {
    totalGuests: number;
    expectedArrival: string;          // "5:00 PM - 5:45 PM"
    cocktailHour: boolean;
    seatingStyle: 'plated' | 'buffet' | 'family-style' | 'stations';
    specialNeeds: SpecialNeed[];
  };
  serviceFlow: ServiceStep[];         // Step-by-step service instructions
  equipmentSetup: SetupCategory[];    // Equipment by location
  barService?: BarService;            // Optional bar details
  vendorCoordination?: VendorInfo[];  // External vendors
  emergencyContacts: EmergencyContact[];
  specialInstructions?: string;
}
```

## Component Architecture

### Composition Pattern

Both templates follow a composition pattern with reusable sub-components:

```
KitchenBEO/ServiceBEO (Main Template)
├── Header Component
├── Section Components
│   ├── Guest Section
│   ├── Menu/Timeline Section
│   ├── Staff Section
│   ├── Equipment Section
│   └── Notes Section
└── Footer Component
```

### Sub-Component Examples

**Kitchen BEO Sub-Components**:
- `KitchenBEOHeader` - Event details header
- `KitchenGuestSection` - Guest count and dietary
- `PrepScheduleSection` - Prep tasks and timing
- `KitchenMenuItem` - Individual menu items with instructions
- `EquipmentAllocationSection` - Equipment by station
- `KitchenStaffSection` - Staff assignments
- `AllergenNotesSection` - Critical allergen warnings
- `AllergenLegend` - Visual allergen key

**Service BEO Sub-Components**:
- `ServiceBEOHeader` - Event details header
- `ServiceTimelineSection` - Visual and detailed timeline
- `FloorPlanSection` - Layout overview
- `GuestManagementSection` - Guest info and special needs
- `StaffPositioningSection` - FOH staff positions
- `ServiceFlowSection` - Step-by-step service guide
- `EquipmentSetupSection` - Setup items by location
- `BarServiceSection` - Bar details
- `VendorCoordinationSection` - Vendor information
- `EmergencyContactsSection` - Critical contacts

## Styling Guide

### CSS Classes

**Typography Classes**:
- `.font-serif` - Cormorant Garamond
- `.font-sans` - Montserrat
- `.text-[size]` - Size scale from xs to 5xl
- `.uppercase` - All caps
- `.tracking-wider` / `.tracking-widest` - Letter spacing

**Layout Classes**:
- `.space-y-[n]` - Vertical spacing
- `.gap-[n]` - Grid/flex gap
- `.grid-cols-[n]` - Grid columns
- `.flex` - Flexbox layout

**Border Classes**:
- `.border-foreground` - Black border
- `.border-l-4` - Left border accent
- `.h-px` - 1px divider line

**Background Classes**:
- `.bg-foreground` - Black background
- `.bg-foreground/5` - 5% black background
- `.bg-red-50` - Light red (for critical sections)

### Print-Specific Classes

```css
.print:hidden          /* Hide on print */
.print:block           /* Show only on print */
.print:p-8             /* Padding on print */
.print:max-w-none      /* Full width on print */
.print:space-y-8       /* Vertical spacing on print */
```

### Custom Patina Classes

```css
.patina-label          /* All-caps tracked label */
.patina-divider        /* 1px horizontal line */
.patina-button         /* Inverted hover button */
.patina-section        /* Section with background */
```

## PDF Generation

See [PDF_GENERATION.md](./PDF_GENERATION.md) for complete PDF documentation.

### Quick PDF Generation

**Via API**:
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d @kitchen-beo-data.json \
  --output kitchen-beo.pdf
```

**Programmatically**:
```typescript
import { generatePDF } from '@/lib/pdf-generator';
import { KitchenBEO } from '@/components/templates/KitchenBEO';
import { sampleKitchenBEO } from '@/lib/sample-data/kitchen-beo-sample';

const result = await generatePDF({
  component: React.createElement(KitchenBEO, { data: sampleKitchenBEO }),
});
```

## Sample Data

Complete sample data available for both templates:

- **Kitchen BEO**: `lib/sample-data/kitchen-beo-sample.ts`
- **Service BEO**: `lib/sample-data/service-beo-sample.ts`

Use these as:
- Development references
- Testing data
- Template documentation
- Client demonstrations

## Best Practices

### Data Preparation

1. **Validate Data** - Use Zod schemas before rendering
2. **Complete Information** - Fill all relevant fields
3. **Consistent Formatting** - Use standard date/time formats
4. **Allergen Accuracy** - Double-check allergen information
5. **Priority Flagging** - Mark critical items clearly

### Template Customization

1. **Extend, Don't Modify** - Create new components that extend base templates
2. **Maintain Type Safety** - Keep TypeScript interfaces updated
3. **Test Print Output** - Always verify PDF before production use
4. **Preserve Design System** - Follow Patina guidelines for consistency

### Performance

1. **Lazy Load Components** - Import templates only when needed
2. **Optimize Images** - Compress logos before embedding
3. **Batch PDF Generation** - Use batch function for multiple BEOs
4. **Cache Generated PDFs** - Store PDFs to avoid regeneration

## Integration Examples

### With Airtable

```typescript
import { fetchRecordsFromTable } from '@/lib/airtable-client';
import { KitchenBEO } from '@/components/templates/KitchenBEO';

async function fetchAndRenderBEO(beoNumber: string) {
  const records = await fetchRecordsFromTable('BEOs', {
    filterByFormula: `{BEO Number} = '${beoNumber}'`,
  });

  if (records.length === 0) {
    throw new Error('BEO not found');
  }

  const beoData = transformAirtableRecord(records[0]);
  
  return <KitchenBEO data={beoData} />;
}
```

### With Workflow System

```typescript
import { generatePDF } from '@/lib/pdf-generator';

async function generateBEODocumentsWorkflow(beoId: string) {
  const beoData = await fetchBEOData(beoId);
  
  // Generate both PDFs in parallel
  const [kitchenPDF, servicePDF] = await Promise.all([
    generatePDF({
      component: React.createElement(KitchenBEO, { data: beoData }),
    }),
    generatePDF({
      component: React.createElement(ServiceBEO, { data: beoData }),
    }),
  ]);

  // Save to cloud storage
  await Promise.all([
    uploadToS3(kitchenPDF.buffer, `${beoId}-kitchen.pdf`),
    uploadToS3(servicePDF.buffer, `${beoId}-service.pdf`),
  ]);

  // Send email to staff
  await sendBEOEmail({
    to: ['kitchen@restaurant.com', 'foh@restaurant.com'],
    attachments: [
      { filename: 'kitchen-beo.pdf', content: kitchenPDF.buffer },
      { filename: 'service-beo.pdf', content: servicePDF.buffer },
    ],
  });
}
```

## Customization Guide

### Adding New Sections

```typescript
// 1. Define data type
interface MyCustomSection {
  title: string;
  content: string;
}

// 2. Add to template data
interface ExtendedKitchenBEOData extends KitchenBEOData {
  customSection?: MyCustomSection;
}

// 3. Create component
const MyCustomSectionComponent: React.FC<{ data: MyCustomSection }> = ({ data }) => {
  return (
    <section className="space-y-6">
      <h2 className="font-serif text-2xl font-medium">{data.title}</h2>
      <p className="text-base">{data.content}</p>
    </section>
  );
};

// 4. Add to template
{data.customSection && (
  <>
    <div className="h-px w-full bg-foreground" />
    <MyCustomSectionComponent data={data.customSection} />
  </>
)}
```

### Custom Styling

```typescript
// Create themed variant
const customStyles = `
  .custom-theme-accent {
    background: #1a1a1a;
    color: #ffffff;
    padding: 1rem;
    border-left: 4px solid #gold;
  }
`;

const result = await generatePDF({
  component: myComponent,
  styles: customStyles,
});
```

### Localization

```typescript
// Add language support
interface LocalizedKitchenBEO extends KitchenBEOData {
  language: 'en' | 'es' | 'fr';
}

const translations = {
  en: { prepSchedule: 'Prep Schedule', equipment: 'Equipment' },
  es: { prepSchedule: 'Horario de Preparación', equipment: 'Equipo' },
  fr: { prepSchedule: 'Programme de Préparation', equipment: 'Équipement' },
};
```

## Testing

### Manual Testing

```bash
# Generate sample PDFs
npm run test:pdf

# Check output
ls -lh output/
open output/kitchen-beo-test.pdf
open output/service-beo-test.pdf
```

### Automated Testing

```typescript
import { generatePDF } from '@/lib/pdf-generator';
import { sampleKitchenBEO } from '@/lib/sample-data/kitchen-beo-sample';

describe('Kitchen BEO Template', () => {
  it('should render without errors', () => {
    expect(() => {
      <KitchenBEO data={sampleKitchenBEO} />
    }).not.toThrow();
  });

  it('should generate valid PDF', async () => {
    const result = await generatePDF({
      component: React.createElement(KitchenBEO, { data: sampleKitchenBEO }),
    });

    expect(result.success).toBe(true);
    expect(result.buffer).toBeDefined();
    expect(result.buffer.length).toBeGreaterThan(10000); // Reasonable PDF size
  });
});
```

## Troubleshooting

### Common Issues

**Issue**: Sections cutting off mid-page

**Solution**: Add `page-break-inside: avoid` to section wrappers
```typescript
<section className="page-break-inside-avoid">
  {/* content */}
</section>
```

**Issue**: Fonts not rendering correctly in PDF

**Solution**: Ensure Google Fonts are loaded before PDF generation. The system automatically waits for fonts with `document.fonts.ready`.

**Issue**: Allergen badges not displaying

**Solution**: Check that allergen types match the defined types exactly:
```typescript
type AllergenType = 'gluten' | 'dairy' | 'nuts' | 'shellfish' | 'eggs' | 'soy' | 'fish';
```

**Issue**: Timeline overflowing on print

**Solution**: The timeline is designed to be horizontally scrollable on screen. On print, it automatically adjusts. If issues persist, reduce the number of timeline events or use the detailed schedule view.

## File Structure

```
beo-automation/
├── components/
│   └── templates/
│       ├── KitchenBEO.tsx      # Kitchen template
│       └── ServiceBEO.tsx      # Service template
├── lib/
│   ├── pdf-generator.ts        # PDF generation utility
│   └── sample-data/
│       ├── kitchen-beo-sample.ts
│       └── service-beo-sample.ts
├── app/
│   └── api/
│       └── pdf/
│           └── generate/
│               └── route.ts     # PDF API endpoint
├── scripts/
│   └── test-pdf-generation.ts  # Test script
└── docs/
    ├── BEO_TEMPLATES.md        # This file
    └── PDF_GENERATION.md       # PDF docs
```

## Related Documentation

- **PDF Generation**: [PDF_GENERATION.md](./PDF_GENERATION.md)
- **Main README**: [../README.md](../README.md)
- **Agent System**: [../lib/agents/README.md](../lib/agents/README.md)

## Roadmap

### Planned Features

- [ ] **Additional Templates**
  - Bartender BEO
  - Setup Crew BEO
  - Client-facing BEO
- [ ] **Interactive Features**
  - Real-time collaboration
  - Task completion tracking
  - Digital signatures
- [ ] **Enhanced PDF**
  - QR codes for digital access
  - Embedded links to recipes
  - Version tracking
- [ ] **Accessibility**
  - Screen reader optimization
  - High contrast mode
  - Larger text options

### Integration Opportunities

- [ ] Email delivery system
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Mobile app compatibility
- [ ] Real-time updates via WebSocket
- [ ] Calendar integration
- [ ] Inventory system connection

## Support

For questions or issues:
- Review [PDF_GENERATION.md](./PDF_GENERATION.md)
- Check sample data files
- Examine existing templates
- Contact: Jimmy Lauchoy

---

**Version**: 1.0.0  
**Created**: February 20, 2026  
**Status**: ✅ Production Ready

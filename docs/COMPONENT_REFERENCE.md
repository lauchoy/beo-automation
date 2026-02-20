# BEO Template Component Reference

Visual guide to all components in the BEO template system.

## Component Hierarchy

### Kitchen BEO Template Structure

```
KitchenBEO
├── Print Button (top-right, hidden on print)
└── Main Container
    ├── KitchenBEOHeader
    │   ├── Logo Area
    │   └── BEO Number
    │   └── Event Details Grid
    │       ├── Event Name & Client
    │       └── Date, Time, Venue
    ├── Divider (1px line)
    ├── Kitchen Badge ("KITCHEN PRODUCTION SHEET")
    ├── KitchenGuestSection
    │   ├── Total Guest Count
    │   ├── Meal Breakdown
    │   └── Dietary Requirements Box
    ├── Divider
    ├── PrepScheduleSection
    │   ├── Critical Tasks (if any)
    │   └── PrepTaskItem[] (all tasks)
    │       ├── Checkbox
    │       ├── Station Badge
    │       ├── Time Estimate
    │       ├── Task Label
    │       ├── Details
    │       └── Dependencies
    ├── Divider
    ├── Production Menu
    │   ├── KitchenCourseSection (Appetizers)
    │   │   └── KitchenMenuItem[]
    │   │       ├── Checkbox
    │   │       ├── Name + Allergen Badges
    │   │       ├── Description
    │   │       ├── Cooking Specs (portion, time, temp)
    │   │       ├── Prep Instructions (numbered list)
    │   │       ├── Plating Instructions (numbered list)
    │   │       └── Scaling Notes (highlighted box)
    │   ├── KitchenCourseSection (Mains)
    │   ├── KitchenCourseSection (Sides) [optional]
    │   └── KitchenCourseSection (Desserts)
    ├── Divider
    ├── EquipmentAllocationSection
    │   └── Equipment Categories[]
    │       ├── Category Name
    │       └── Items List (name, quantity, station, notes)
    ├── Divider
    ├── KitchenStaffSection
    │   └── Staff Assignments[]
    │       ├── Role & Count
    │       ├── Station & Shift Times
    │       ├── Responsibilities List
    │       └── Assigned Members
    ├── Divider
    ├── AllergenNotesSection [if critical notes]
    │   └── Critical Allergen Warnings (red box)
    ├── Divider [if allergen notes]
    ├── SpecialInstructionsSection [if instructions]
    │   └── Free-form Instructions
    ├── Divider [if instructions]
    ├── AllergenLegend
    │   └── Badge Grid (G, D, N, SF, E, S, F)
    └── Print Footer (visible only on print)
        └── Generation Date & BEO Number
```

### Service BEO Template Structure

```
ServiceBEO
├── Print Button (top-right, hidden on print)
└── Main Container
    ├── ServiceBEOHeader
    │   ├── Logo Area
    │   ├── BEO Number
    │   └── Event Details Grid
    ├── Divider
    ├── Service Badge ("FRONT OF HOUSE SERVICE PLAN")
    ├── ServiceTimelineSection
    │   ├── Visual Timeline (horizontal scrollable)
    │   │   └── Timeline Events[] (time, label, dot, connecting lines)
    │   └── Detailed Schedule List
    │       └── Event Details[] (time, label, sublabel, notes)
    ├── Divider
    ├── FloorPlanSection
    │   ├── Statistics (tables, seats, layout)
    │   └── Special Arrangements List
    ├── Divider
    ├── GuestManagementSection
    │   ├── Total Guests & Arrival Time
    │   ├── Service Style
    │   └── Special Needs List
    │       └── Need Items[] (table, guest, requirement, priority)
    ├── Divider
    ├── StaffPositioningSection
    │   ├── Total Staff Count
    │   └── Staff Positions[]
    │       ├── Role & Count
    │       ├── Location & Shift Times
    │       ├── Uniform Details
    │       ├── Responsibilities List
    │       └── Assigned Members
    ├── Divider
    ├── ServiceFlowSection
    │   └── Service Steps[]
    │       ├── Time & Duration
    │       ├── Step Name
    │       ├── Details
    │       └── Staff Involved Tags
    ├── Divider
    ├── EquipmentSetupSection
    │   └── Setup Categories[]
    │       ├── Category & Location
    │       └── Items List
    ├── Divider
    ├── BarServiceSection [if bar service]
    │   ├── Service Type & Bartender Count
    │   ├── Bar Locations
    │   ├── Special Requests
    │   └── Last Call Time
    ├── Divider [if bar]
    ├── VendorCoordinationSection [if vendors]
    │   └── Vendor Cards[]
    │       ├── Vendor Name & Contact
    │       ├── Arrival Time
    │       ├── Setup Area
    │       ├── Requirements List
    │       └── Point of Contact
    ├── Divider [if vendors]
    ├── EmergencyContactsSection
    │   └── Contact Cards[] (red box)
    │       ├── Name & Role
    │       ├── On-Site Badge
    │       └── Phone Number
    ├── Divider [if special instructions]
    ├── SpecialInstructionsSection [if instructions]
    └── Print Footer
```

## Component Details

### Shared Components

#### BEO Header

**Props**:
```typescript
{
  beoNumber: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  clientName: string;
  venue: string;
  logoUrl?: string;
}
```

**Styling**:
- Logo: 16rem height, left-aligned
- BEO Number: Right-aligned, serif 2xl/3xl font
- Event Name: Serif 4xl/5xl, light weight
- Grid: 2-column responsive layout

**Print Behavior**: Maintains full formatting

---

### Kitchen BEO Components

#### KitchenMenuItem

**Key Features**:
- Checkbox for completion tracking
- Allergen badges (inline with name)
- Portion size, cook time, holding temp display
- Numbered prep instructions
- Numbered plating instructions
- Highlighted scaling notes box

**Styling**:
- Name: Serif 2xl/3xl font, medium weight
- Instructions: Numbered list with serif numbers
- Scaling Notes: Left border accent, light background

**Props**:
```typescript
{
  item: MenuItem;
}
```

#### PrepTaskItem

**Key Features**:
- Visual priority indication (border thickness)
- Station badge
- Time estimate
- Assignee name
- Task dependencies list
- Completion checkbox

**Styling**:
- Critical: 4px left border, background tint
- High: 2px left border
- Medium/Low: 1px left border

**Priority Colors**:
- Critical: Bold border + background
- High: Medium border
- Medium/Low: Thin border

#### AllergenBadge

**Design**:
- 8x8 square border (2px)
- Letter code inside (G, D, N, etc.)
- Hover shows full allergen name
- Black border, transparent background

**Types**: G (Gluten), D (Dairy), N (Nuts), SF (Shellfish), E (Eggs), S (Soy), F (Fish)

---

### Service BEO Components

#### ServiceTimelineSection

**Visual Timeline**:
- Horizontal scrollable layout
- Time above each event
- Dot marker (filled for service events)
- Connecting lines between events
- Label and sublabel below
- Responsible party in italics

**Detailed Schedule**:
- Left border accent
- Time + label format
- Notes in muted text

**Props**:
```typescript
{
  events: TimelineEvent[];
}
```

#### StaffPositioningSection

**Key Features**:
- Total staff count (calculated)
- Role cards with:
  - Role name and count
  - Location and shift times
  - Uniform specifications
  - Responsibilities bullet list
  - Assigned member grid

**Styling**:
- Section dividers between roles
- Grid layout for members (2-3 columns)
- Muted text for meta info

#### GuestManagementSection

**Special Needs Display**:
- Priority-based color coding:
  - Critical: Red border + red background
  - Important: Yellow border + yellow background
  - Note: Gray border + light background
- Table number badge
- Guest name (if provided)
- Requirement description
- Priority label for critical items

#### VendorCoordinationSection

**Vendor Cards**:
- Border box container
- Vendor name (bold heading)
- Contact info (phone/email)
- Arrival time (right-aligned)
- Setup area location
- Requirements bullet list
- Point of contact footer

#### EmergencyContactsSection

**Critical Styling**:
- Red background tint
- Red left border (4px)
- White contact cards
- On-site badge for present contacts
- Large phone numbers (mono font)

---

## Styling Reference

### Typography Classes

**Font Families**:
```css
.font-serif     /* Cormorant Garamond */
.font-sans      /* Montserrat */
```

**Sizes**:
```css
.text-xs        /* 10pt print */
.text-sm        /* 11pt print */
.text-base      /* 12pt print */
.text-lg        /* 14pt print */
.text-xl        /* 16pt print */
.text-2xl       /* 18pt print */
.text-3xl       /* 22pt print */
.text-4xl       /* 26pt print */
.text-5xl       /* 32pt print */
```

**Weights**:
```css
.font-light     /* 300 */
.font-medium    /* 500 */
.font-semibold  /* 600 */
.font-bold      /* 700 */
```

**Text Styles**:
```css
.uppercase              /* ALL CAPS */
.tracking-wider         /* 0.15em spacing */
.tracking-widest        /* 0.2em spacing */
```

### Layout Classes

**Spacing**:
```css
.space-y-4      /* 1rem vertical spacing */
.space-y-6      /* 1.5rem */
.space-y-8      /* 2rem */
.space-y-12     /* 3rem */
.space-y-16     /* 4rem */
```

**Grid**:
```css
.grid-cols-1            /* Single column */
.grid-cols-2            /* 2 columns */
.md:grid-cols-2         /* 2 columns on medium+ screens */
.md:grid-cols-3         /* 3 columns on medium+ screens */
```

**Flex**:
```css
.flex
.items-center
.items-start
.justify-between
.gap-2 / gap-3 / gap-4 / gap-6 / gap-8
```

### Color Classes

**Text**:
```css
.text-foreground        /* Black (#000) */
.text-background        /* White (#FFF) */
.text-muted-foreground  /* Dark gray (#333) */
```

**Backgrounds**:
```css
.bg-foreground          /* Black */
.bg-background          /* White */
.bg-foreground/5        /* 5% black tint */
.bg-foreground/10       /* 10% black tint */
.bg-secondary/50        /* Light gray */
```

**Borders**:
```css
.border-foreground      /* Black border */
.border-foreground/20   /* 20% black */
.border-foreground/30   /* 30% black */
.border-l-2            /* Left border 2px */
.border-l-4            /* Left border 4px */
```

### Utility Classes

**Divider**:
```css
.h-px                   /* 1px height line */
.w-full                 /* Full width */
.bg-foreground          /* Black background */

/* Usage */
<div className="h-px w-full bg-foreground" />
```

**Labels**:
```css
/* Patina-style label */
.text-xs.uppercase.tracking-wider.font-semibold
```

**Print Control**:
```css
.print:hidden           /* Hide on print */
.print:block            /* Show only on print */
.print:p-8              /* Padding on print */
.print:space-y-8        /* Spacing on print */
```

## Icon Reference

Using **lucide-react** icons:

### Kitchen BEO Icons
- `ChefHat` - Kitchen badge, menu sections
- `Clock` - Prep schedule
- `Users` - Staff section
- `Package` - Equipment section
- `Printer` - Print button

### Service BEO Icons
- `Utensils` - Service badge
- `Clock` - Timeline section
- `Users` - Staff and guest sections
- `MapPin` - Floor plan section
- `Wine` - Bar service section
- `Music` - Vendor coordination
- `Printer` - Print button

**Note**: Icons are hidden in PDF output (via CSS `svg { display: none; }`)

## Responsive Breakpoints

Following Tailwind defaults:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

**Common Patterns**:
```tsx
<div className="text-2xl md:text-3xl">      {/* Larger on medium+ */}
<div className="grid-cols-1 md:grid-cols-2"> {/* 2 cols on medium+ */}
<div className="px-8 md:px-12">             {/* More padding on medium+ */}
```

## Print Optimization

### Page Breaks

**Avoid breaks inside sections**:
```tsx
<section className="page-break-inside-avoid">
  {/* Content won't split across pages */}
</section>
```

**Force page break before**:
```tsx
<section className="page-break-before">
  {/* Starts on new page */}
</section>
```

### Checkbox Rendering

**Screen** (interactive):
```tsx
<div className="print:hidden">
  <Checkbox ... />
</div>
```

**Print** (static):
```tsx
<div className="hidden print:block">
  <div className="h-6 w-6 border-2 border-foreground bg-foreground" />
</div>
```

### Print-Specific Adjustments

```css
/* Automatic adjustments on print */
- Spacing reduced (space-y-16 → space-y-8)
- Padding reduced (py-24 → p-8)
- Max width removed (max-w-4xl → max-w-none)
- Animations disabled
- Interactive elements hidden
- Static checkboxes shown
```

## Customization Examples

### Add New Menu Course

```typescript
// 1. Add to menu structure in KitchenBEOData
menu: {
  appetizers: [...],
  mains: [...],
  desserts: [...],
  amuses: [...],  // NEW COURSE
}

// 2. Render in template
<KitchenCourseSection 
  course="default" 
  title="Amuse-Bouche" 
  items={data.menu.amuses} 
/>
```

### Custom Priority Levels

```typescript
// Extend PrepPriority type
type ExtendedPriority = PrepPriority | 'urgent' | 'routine';

// Add styling
const priorityStyles = {
  urgent: 'border-l-8 border-red-600 bg-red-50',
  critical: 'border-l-4 border-foreground bg-foreground/5',
  high: 'border-l-2 border-foreground/60',
  medium: 'border-l border-foreground/30',
  low: 'border-l border-foreground/20',
  routine: 'border-l border-foreground/10',
};
```

### Add Custom Section

```typescript
// 1. Create component
const WineListSection: React.FC<{ wines: Wine[] }> = ({ wines }) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-2xl font-medium">Wine List</h2>
      <div className="space-y-4">
        {wines.map(wine => (
          <div key={wine.id} className="border-b border-foreground/20 pb-4">
            <div className="font-serif text-xl">{wine.name}</div>
            <div className="text-sm text-muted-foreground">{wine.varietal}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 2. Add to data type
interface ExtendedServiceBEOData extends ServiceBEOData {
  wineList?: Wine[];
}

// 3. Render in template
{data.wineList && (
  <>
    <div className="h-px w-full bg-foreground" />
    <WineListSection wines={data.wineList} />
  </>
)}
```

## Accessibility

### Screen Readers

**Semantic HTML**:
- `<header>` for BEO header
- `<section>` for major sections
- `<h1>`, `<h2>`, `<h3>` for headings
- `<ul>`, `<ol>` for lists

**ARIA Labels**:
```tsx
<button aria-label="Print Kitchen BEO">
  <Printer />
  <span>Print</span>
</button>
```

### Keyboard Navigation

- Print button is keyboard accessible
- Checkboxes support keyboard interaction
- Focus states visible (not removed)

### Color Contrast

All text meets WCAG AA standards:
- Black (#000) on White (#FFF): 21:1 ratio
- Dark Gray (#333) on White: 12.6:1 ratio
- Emergency text: Red (#7f1d1d) on Light Red (#fef2f2): 8.2:1 ratio

## Performance Notes

### Rendering Performance

**Optimizations**:
- Components are functional (no class overhead)
- Minimal state management
- No unnecessary re-renders
- Efficient list rendering with keys

**Considerations**:
- Large menus (50+ items): Still performant
- Complex prep schedules: No issues
- Multiple staff sections: Renders quickly

### PDF Generation Performance

**Typical Times**:
- Kitchen BEO (5 pages): ~3 seconds
- Service BEO (4 pages): ~2 seconds
- Batch (10 BEOs): ~25 seconds

**Optimizations**:
- Font preloading
- Network idle detection
- Headless browser caching
- Efficient HTML rendering

## Troubleshooting

### Component Not Rendering

**Check**:
1. Data structure matches type definition
2. All required fields are present
3. No TypeScript errors
4. Console for runtime errors

### Styling Issues

**Common Fixes**:
1. Ensure Tailwind CSS is properly configured
2. Check Google Fonts are loading
3. Verify print media queries
4. Test in different browsers

### PDF Issues

**Solutions**:
1. Check Puppeteer installation
2. Verify Chrome/Chromium availability
3. Review PDF generator logs
4. Test with minimal data first

## Code Examples

### Complete Component Usage

```typescript
import { KitchenBEO } from '@/components/templates/KitchenBEO';

export default function BEOPage() {
  const data: KitchenBEOData = {
    header: {
      beoNumber: 'BEO-2024-001',
      eventName: 'Wedding Reception',
      eventDate: 'March 15, 2024',
      eventTime: '6:00 PM - 11:00 PM',
      clientName: 'John & Jane Doe',
      venue: 'Grand Ballroom',
    },
    guests: {
      total: 150,
      breakdown: [
        { type: 'Chicken', count: 80, color: 'main' },
        { type: 'Fish', count: 50, color: 'appetizer' },
        { type: 'Vegetarian', count: 20, color: 'dessert' },
      ],
      dietary: {
        vegetarian: 20,
        vegan: 5,
        glutenFree: 10,
      },
    },
    menu: {
      appetizers: [
        {
          id: 'app1',
          name: 'Seared Scallops',
          description: 'Pan-seared with citrus beurre blanc',
          allergens: ['shellfish', 'dairy'],
          portionSize: '3 scallops',
          cookTime: '4-5 min',
          prepInstructions: [
            'Pat scallops dry',
            'Season with salt and pepper',
            'Sear in hot pan',
          ],
        },
      ],
      mains: [],
      desserts: [],
    },
    prepSchedule: [
      {
        id: 'prep1',
        label: 'Mise en place complete',
        station: 'ALL',
        priority: 'critical',
        timeEstimate: '2:00 PM',
      },
    ],
    equipmentAllocation: [
      {
        category: 'Cookware',
        items: [
          { name: 'Cast Iron Pans', quantity: 6, station: 'Sauté' },
        ],
      },
    ],
    staffAssignments: [
      {
        role: 'Executive Chef',
        count: 1,
        station: 'Kitchen',
        shiftStart: '2:00 PM',
        shiftEnd: '11:00 PM',
        responsibilities: ['Oversight', 'Quality control'],
      },
    ],
  };

  return <KitchenBEO data={data} />;
}
```

## Related Documentation

- **Main Guide**: [docs/BEO_TEMPLATES.md](./BEO_TEMPLATES.md)
- **PDF Guide**: [docs/PDF_GENERATION.md](./PDF_GENERATION.md)
- **Quick Start**: [docs/QUICK_START_TEMPLATES.md](./QUICK_START_TEMPLATES.md)
- **Types**: [lib/types/beo-templates.ts](../lib/types/beo-templates.ts)
- **Samples**: [lib/sample-data/](../lib/sample-data/)

---

**Version**: 1.0.0  
**Last Updated**: February 20, 2026

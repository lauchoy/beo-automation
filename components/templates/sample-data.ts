/**
 * Sample Data for BEO Templates
 * 
 * Use these examples to test the Kitchen and Service BEO templates
 * and understand the expected data structure.
 */

import type { KitchenBEOData } from './KitchenBEO';
import type { ServiceBEOData } from './ServiceBEO';

// Sample Kitchen BEO Data
export const sampleKitchenBEO: KitchenBEOData = {
  header: {
    beoNumber: 'BEO-2024-0892',
    eventName: 'The Whitmore-Chen Wedding Reception',
    eventDate: 'Saturday, March 15, 2025',
    eventTime: '6:00 PM - 11:00 PM',
    clientName: 'Victoria Whitmore & David Chen',
    venue: 'The Conservatory at Willowbrook',
    guestCount: 150,
  },
  menu: {
    appetizers: [
      {
        id: 'app1',
        name: 'Seared Scallops',
        description: 'Pan-seared diver scallops with citrus beurre blanc and microgreens',
        allergens: ['shellfish', 'dairy'],
        portionSize: '3 scallops per guest',
        cookTime: '4-5 min',
        cookingTemperature: 'High heat',
        station: 'Sauté',
        prepInstructions: [
          'Pat scallops dry and season with salt and white pepper',
          'Heat cast iron pan until smoking, add clarified butter',
          'Sear undisturbed for 2 minutes until golden crust forms',
          'Flip and cook 1-2 minutes more until just opaque',
          'Rest 1 minute before plating on warm plates',
        ],
        scalingNotes:
          'For 150 guests: 450 scallops (U-10 size). Prep in batches of 20. Allow 3 pans rotating continuously.',
      },
      {
        id: 'app2',
        name: 'Caprese Skewers',
        description: 'Fresh mozzarella, heirloom tomatoes, basil, balsamic reduction',
        allergens: ['dairy'],
        portionSize: '2 skewers per guest',
        station: 'Garde Manger',
        prepInstructions: [
          'Slice mozzarella into 1-inch cubes, keep chilled',
          'Cut tomatoes into similar-sized wedges',
          'Assemble on 6-inch bamboo skewers: tomato, basil, mozzarella',
          'Drizzle with olive oil, season with flaky salt',
        ],
        scalingNotes:
          'For 150 guests: 300 skewers. Can be assembled 2 hours ahead, cover with damp towel.',
      },
    ],
    mains: [
      {
        id: 'main1',
        name: 'Herb-Crusted Chicken',
        description:
          'Free-range chicken breast with rosemary jus, roasted fingerlings, seasonal vegetables',
        allergens: ['gluten'],
        portionSize: '7 oz breast per guest',
        cookTime: '18-22 min',
        cookingTemperature: '425°F',
        station: 'Grill/Oven',
        prepInstructions: [
          'Brine chicken breasts 4-6 hours in herb salt solution',
          'Pat dry, coat with herb crust (panko, rosemary, thyme, garlic)',
          'Sear skin-side down 4 minutes until golden',
          'Transfer to sheet pans, finish in oven to 165°F internal',
          'Rest 5 minutes before slicing on bias',
        ],
        scalingNotes:
          'For 65 portions: 30 lbs chicken breasts. Brine in 3 batches. Oven capacity is 24 breasts at a time.',
      },
      {
        id: 'main2',
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with lemon dill sauce, wild rice pilaf, asparagus',
        allergens: ['fish', 'dairy'],
        portionSize: '6 oz fillet per guest',
        cookTime: '8-10 min',
        cookingTemperature: 'Medium-high heat',
        station: 'Sauté',
        prepInstructions: [
          'Portion salmon fillets, check for pin bones',
          'Season generously with salt, pepper, and lemon zest',
          'Start skin-side down in hot pan with oil',
          'Cook 4 minutes until skin is crispy, flip',
          'Finish 3-4 minutes until medium (130°F internal)',
        ],
        scalingNotes:
          'For 45 portions: 18 lbs salmon. Skin-on preferred. Cook in batches of 12, hold in 200°F oven max 8 minutes.',
      },
      {
        id: 'main3',
        name: 'Vegetable Wellington',
        description: 'Roasted vegetables in puff pastry with mushroom sauce',
        allergens: ['gluten', 'eggs'],
        portionSize: '1 wellington per guest',
        cookTime: '25-30 min',
        cookingTemperature: '400°F',
        station: 'Pastry/Oven',
        prepInstructions: [
          'Roast vegetables until tender',
          'Layer with spinach and goat cheese in pastry',
          'Wrap tightly, brush with egg wash, score top',
          'Chill 30 minutes before baking',
          'Bake until golden brown and puffed',
        ],
        scalingNotes:
          'For 30 portions: Prep pastry parcels day before, refrigerate unbaked. Bake in batches of 15.',
      },
    ],
    desserts: [
      {
        id: 'des1',
        name: 'Wedding Cake',
        description: 'Three-tier vanilla bean cake with buttercream and fresh flowers',
        allergens: ['gluten', 'dairy', 'eggs'],
        portionSize: '1 slice per guest',
        station: 'Pastry',
        prepInstructions: [
          'Cake pre-cut by pastry team before service',
          'Transfer slices to individual plates using offset spatula',
          'Garnish each plate with fresh berry and mint sprig',
        ],
        scalingNotes:
          '3-tier serves 150. Backup sheet cake in kitchen. Cutting ceremony at 9:15 PM.',
      },
    ],
    sides: [
      {
        id: 'side1',
        name: 'Roasted Fingerling Potatoes',
        description: 'Herb-roasted fingerling potatoes with rosemary and garlic',
        allergens: [],
        portionSize: '4 oz per guest',
        cookTime: '35-40 min',
        cookingTemperature: '425°F',
        station: 'Roast',
        prepInstructions: [
          'Halve fingerling potatoes lengthwise',
          'Toss with olive oil, rosemary, garlic, salt, pepper',
          'Roast until golden and crispy',
          'Finish with fresh herbs and flaky salt',
        ],
        scalingNotes: 'For 150 guests: 40 lbs potatoes. Roast in batches, can hold warm.',
      },
    ],
  },
  prepSchedule: [
    {
      id: 'prep1',
      label: 'Mise en place complete for all stations',
      station: 'ALL',
      priority: 'high',
      timeEstimate: '2:00 PM',
      details:
        'All ingredients prepped, measured, and in position. Verify each station has backup supplies.',
    },
    {
      id: 'prep2',
      label: 'Scallops cleaned, dried, and portioned',
      station: 'Sauté',
      assignee: 'Chef Martinez',
      timeEstimate: '3:00 PM',
      details:
        'Remove side muscle, pat completely dry. Portion 3 per plate on parchment-lined trays.',
    },
    {
      id: 'prep3',
      label: 'All vegetables prepped and blanched',
      station: 'Garde Manger',
      timeEstimate: '3:30 PM',
      details: 'Asparagus, carrots, beans blanched and shocked. Fingerlings par-cooked.',
    },
    {
      id: 'prep4',
      label: 'All sauces prepared and holding at temp',
      station: 'Sauce',
      priority: 'high',
      timeEstimate: '4:00 PM',
      details: 'Rosemary jus, lemon dill sauce, mushroom sauce, beurre blanc. Check temps q30min.',
    },
    {
      id: 'prep5',
      label: 'Allergen-free station verified and isolated',
      station: 'Expo',
      priority: 'high',
      timeEstimate: '5:30 PM',
      details: 'Dedicated pans, utensils, cutting board for Table 7. Clearly marked.',
      dependencies: ['prep1'],
    },
  ],
  equipment: {
    cooking: [
      {
        category: 'Ranges & Ovens',
        items: [
          { name: 'Convection Oven #1', quantity: 1, location: 'Main Kitchen' },
          { name: 'Convection Oven #2', quantity: 1, location: 'Main Kitchen' },
          { name: '6-Burner Range', quantity: 2, location: 'Main Kitchen' },
          { name: 'Flat Top Griddle', quantity: 1, location: 'Line' },
        ],
      },
      {
        category: 'Cookware',
        items: [
          { name: 'Cast Iron Skillets (12")', quantity: 6, location: 'Sauté Station' },
          { name: 'Sheet Pans (Full)', quantity: 20, location: 'Oven Station' },
          { name: 'Sauté Pans (10")', quantity: 8, location: 'Sauté Station' },
          { name: 'Stock Pots (8qt)', quantity: 4, location: 'Sauce Station' },
        ],
      },
    ],
    prep: [
      {
        category: 'Prep Equipment',
        items: [
          { name: 'Food Processor', quantity: 2, location: 'Prep Area' },
          { name: 'Stand Mixer', quantity: 1, location: 'Pastry' },
          { name: 'Cutting Boards (Color-coded)', quantity: 12, location: 'Prep Stations' },
          { name: 'Knife Sets', quantity: 8, location: 'Prep Stations' },
        ],
      },
    ],
    service: [
      {
        category: 'Plating & Serving',
        items: [
          { name: 'Dinner Plates (12")', quantity: 180, location: 'Plate Warmer' },
          { name: 'Dessert Plates (9")', quantity: 165, location: 'Pastry Station' },
          { name: 'Serving Platters', quantity: 30, location: 'Expo' },
          { name: 'Sauce Boats', quantity: 25, location: 'Sauce Station', notes: 'Extra requested' },
        ],
      },
    ],
  },
  staffAssignments: [
    {
      role: 'Executive Chef',
      count: 1,
      station: 'Expo/Oversight',
      startTime: '2:00 PM',
      responsibilities: [
        'Quality control and final plating approval',
        'Coordinate timing between stations',
        'Handle special requests and modifications',
      ],
      members: [{ name: 'Chef Rodriguez', position: 'Executive' }],
    },
    {
      role: 'Sous Chefs',
      count: 2,
      station: 'Hot Line & Cold Station',
      startTime: '2:30 PM',
      responsibilities: [
        'Manage hot line and cold station operations',
        'Train and supervise line cooks',
        'Ensure prep schedule adherence',
      ],
      members: [
        { name: 'Chef Martinez', position: 'Hot Line' },
        { name: 'Chef Thompson', position: 'Cold Station' },
      ],
    },
    {
      role: 'Line Cooks',
      count: 6,
      station: 'Various',
      startTime: '3:00 PM',
      members: [
        { name: 'Cook - Sauté' },
        { name: 'Cook - Grill' },
        { name: 'Cook - Roast' },
        { name: 'Cook - Garde Manger' },
        { name: 'Cook - Sauce' },
        { name: 'Cook - Expo' },
      ],
    },
    {
      role: 'Prep Cooks',
      count: 3,
      station: 'Prep Kitchen',
      startTime: '1:00 PM',
      responsibilities: ['Vegetable prep', 'Protein portioning', 'Sauce prep'],
    },
    {
      role: 'Pastry Team',
      count: 2,
      station: 'Pastry Kitchen',
      startTime: '2:00 PM',
      responsibilities: ['Dessert plating', 'Cake service', 'Garnish prep'],
      notes: 'Coordinate cake cutting at 9:15 PM with event manager',
    },
  ],
  specialInstructions: `CRITICAL ALLERGEN ALERT: Table 7 has 2 guests with severe nut allergies
- Use dedicated pans, utensils, and cutting boards
- Separate prep area clearly marked
- Double-check with FOH before service

VIP TABLE (Head Table):
- Bride is pescatarian (salmon option)
- Groom prefers medium-rare proteins

TIMING NOTES:
- Kids meals to be served 15 minutes before adult mains
- Cake cutting at 9:15 PM - coordinate with event manager
- Client requested extra sauce boats for main course

QUALITY STANDARDS:
- All proteins must be temped before service
- Garnish fresh herbs on pick-up only
- Verify plating consistency every 10th plate`,
  dietaryRestrictions: {
    vegetarian: 30,
    vegan: 8,
    glutenFree: 12,
    nutAllergy: 2,
    other: '1 guest requires low-sodium preparation',
  },
};

// Sample Service BEO Data
export const sampleServiceBEO: ServiceBEOData = {
  header: {
    beoNumber: 'BEO-2024-0892',
    eventName: 'The Whitmore-Chen Wedding Reception',
    eventDate: 'Saturday, March 15, 2025',
    eventTime: '5:00 PM - 11:00 PM',
    clientName: 'Victoria Whitmore & David Chen',
    venue: 'The Conservatory at Willowbrook',
  },
  timeline: [
    {
      time: '3:00 PM',
      label: 'Venue Access',
      sublabel: 'Setup begins',
      type: 'setup',
      notes: 'All vendors must check in at loading dock',
    },
    {
      time: '4:00 PM',
      label: 'Staff Arrival',
      sublabel: 'Team briefing',
      type: 'setup',
      notes: 'Mandatory briefing in staff room',
    },
    {
      time: '5:00 PM',
      label: 'Doors Open',
      sublabel: 'Cocktail hour',
      type: 'service',
      notes: 'Bar opens, passed apps begin',
    },
    {
      time: '6:00 PM',
      label: 'Guests Seated',
      sublabel: 'Dinner service',
      type: 'service',
    },
    {
      time: '6:15 PM',
      label: 'First Course',
      type: 'service',
    },
    {
      time: '7:00 PM',
      label: 'Main Course',
      type: 'service',
    },
    {
      time: '8:00 PM',
      label: 'Dessert & Cake',
      type: 'service',
    },
    {
      time: '9:00 PM',
      label: 'Bar Last Call',
      type: 'service',
    },
    {
      time: '10:00 PM',
      label: 'Last Dance',
      sublabel: 'Event concludes',
      type: 'service',
    },
    {
      time: '11:00 PM',
      label: 'Breakdown',
      sublabel: 'Load out',
      type: 'breakdown',
    },
  ],
  staffPositions: [
    {
      role: 'Event Captain',
      count: 1,
      station: 'Floor Oversight',
      startTime: '3:30 PM',
      responsibilities: [
        'Overall event coordination',
        'Guest relations and VIP management',
        'Coordinate with kitchen and bar',
        'Handle service flow and timing',
      ],
      members: [{ name: 'Sarah Martinez', position: 'Lead Captain', station: 'Floor' }],
    },
    {
      role: 'Floor Captains',
      count: 2,
      station: 'Dining & Cocktail Areas',
      startTime: '3:45 PM',
      responsibilities: [
        'Section oversight and quality control',
        'Server coordination and support',
        'Table management',
      ],
      members: [
        { name: 'James Thompson', position: 'Captain', station: 'Main Dining Room' },
        { name: 'Emily Chen', position: 'Captain', station: 'Cocktail Area' },
      ],
    },
    {
      role: 'Servers',
      count: 10,
      station: 'Table Service',
      startTime: '4:00 PM',
      notes: 'Table assignments provided at briefing. Each server covers 15 guests.',
      members: [
        { name: 'Michael R.', station: 'Tables 1-3' },
        { name: 'Jessica L.', station: 'Tables 4-6' },
        { name: 'David K.', station: 'Tables 7-9' },
        { name: 'Amanda S.', station: 'Tables 10-12' },
        { name: 'Chris P.', station: 'Tables 13-15' },
        { name: 'Nicole W.', station: 'Floater' },
        { name: 'Brandon T.', station: 'Floater' },
        { name: 'Samantha H.', station: 'Cocktail Service' },
        { name: 'Ryan M.', station: 'Cocktail Service' },
        { name: 'Lauren B.', station: 'Cocktail Service' },
      ],
    },
    {
      role: 'Bartenders',
      count: 3,
      station: 'Bar Service',
      startTime: '4:30 PM',
      notes: 'Main bar (2 bartenders), Service bar (1 bartender)',
      members: [
        { name: 'Alex Rivera', station: 'Main Bar' },
        { name: 'Jordan Lee', station: 'Main Bar' },
        { name: 'Casey Park', station: 'Service Bar' },
      ],
    },
    {
      role: 'Bussers',
      count: 4,
      station: 'Floor Support',
      startTime: '4:15 PM',
      responsibilities: ['Table clearing and resetting', 'Water and bread service', 'Support servers'],
      members: [
        { name: 'Team A', station: 'Tables 1-8' },
        { name: 'Team B', station: 'Tables 9-15' },
      ],
    },
  ],
  guestManagement: {
    totalGuests: 150,
    vipCount: 20,
    seatingLayout: '15 rounds of 10, plus head table of 20. Cocktail area separate with lounge seating.',
    flowPlan:
      'Guests enter through main foyer, directed to cocktail area. At 6:00 PM, escort to dining room via east entrance. Dance floor opens after dessert.',
    specialSeating: [
      {
        table: 'Head Table',
        guests: 20,
        notes: 'Bride & Groom + wedding party. Elevated platform. VIP service priority.',
      },
      {
        table: 'Table 1',
        guests: 10,
        notes: 'Parents and grandparents. 2 wheelchair-accessible seats on aisle.',
      },
      {
        table: 'Table 7',
        guests: 10,
        notes: 'ALLERGEN ALERT: 2 guests with severe nut allergies. Special plating required.',
      },
      {
        table: 'Table 12',
        guests: 8,
        notes: 'Kids table. Early meal service at 6:45 PM.',
      },
    ],
  },
  equipment: {
    dining: [
      {
        category: 'Tables & Seating',
        items: [
          { name: 'Round Tables (60")', quantity: 15, location: 'Main Dining', setupTime: '3:00 PM' },
          { name: 'Rectangular Tables (8ft)', quantity: 2, location: 'Head Table', setupTime: '3:00 PM' },
          { name: 'Cocktail Tables (36")', quantity: 8, location: 'Cocktail Area', setupTime: '3:30 PM' },
          { name: 'Chiavari Chairs - Gold', quantity: 160, location: 'Dining & Cocktail', setupTime: '3:00 PM' },
        ],
      },
      {
        category: 'Linens & China',
        items: [
          { name: 'Ivory Tablecloths (120")', quantity: 17, location: 'All Tables' },
          { name: 'Champagne Runners', quantity: 17, location: 'All Tables' },
          { name: 'Ivory Napkins', quantity: 170, location: 'Place Settings' },
          { name: 'Gold Charger Plates', quantity: 160, location: 'Place Settings', notes: 'Rental' },
        ],
      },
    ],
    bar: [
      {
        category: 'Bar Equipment',
        items: [
          { name: 'Main Bar Setup', quantity: 1, location: 'North Wall', setupTime: '3:30 PM' },
          { name: 'Service Bar', quantity: 1, location: 'Kitchen Access', setupTime: '3:30 PM' },
          { name: 'Wine Glasses', quantity: 200, location: 'Bar Stations' },
          { name: 'Champagne Flutes', quantity: 180, location: 'Bar Stations' },
          { name: 'Rocks Glasses', quantity: 120, location: 'Bar Stations' },
        ],
      },
    ],
    decor: [
      {
        category: 'Specialty Items',
        items: [
          { name: 'Centerpiece Florals', quantity: 15, location: 'Guest Tables', setupTime: '4:00 PM', notes: 'Florist delivers' },
          { name: 'Vintage Candlesticks', quantity: 50, location: 'All Tables', notes: 'Rental - handle with care' },
          { name: 'Uplighting Units', quantity: 16, location: 'Perimeter', setupTime: '2:00 PM', notes: 'AV vendor' },
          { name: 'Wireless Microphones', quantity: 2, location: 'Head Table', notes: 'Sound check at 4:30 PM' },
        ],
      },
    ],
  },
  coordination: {
    contactPerson: 'Victoria Whitmore',
    contactPhone: '(555) 123-4567',
    emergencyContacts: [
      {
        name: 'David Chen',
        role: 'Co-Client',
        phone: '(555) 234-5678',
      },
      {
        name: 'Sarah Martinez',
        role: 'Event Captain',
        phone: '(555) 345-6789',
      },
      {
        name: 'Venue Manager',
        role: 'Emergency',
        phone: '(555) 456-7890',
      },
    ],
    vendorCoordination: [
      {
        vendor: 'Elegant Blooms Florist',
        contact: 'Linda Kim (555) 111-2222',
        arrivalTime: '4:00 PM',
        requirements: 'Access to service elevator. Needs 30 min setup time.',
      },
      {
        vendor: 'SoundWave AV',
        contact: 'Mike Stevens (555) 222-3333',
        arrivalTime: '2:00 PM',
        requirements: 'Power access to perimeter. Sound check at 4:30 PM.',
      },
      {
        vendor: 'Premier Party Rentals',
        contact: 'Tom Bradley (555) 333-4444',
        arrivalTime: '2:30 PM',
        requirements: 'Charger plates and specialty linens. Pickup next day by 10 AM.',
      },
      {
        vendor: 'Memories Photography',
        contact: 'Jessica Park (555) 444-5555',
        arrivalTime: '4:30 PM',
        requirements: 'Access to all areas including kitchen for behind-scenes shots.',
      },
    ],
    criticalNotes: [
      'Photographer will need brief kitchen access during cocktail hour',
      'Cake cutting scheduled for 9:15 PM - coordinate with DJ and kitchen',
      'Two guests at Table 1 require wheelchair accessibility',
      'Vendor meals (12) to be served at 6:00 PM in green room',
      'Client has requested classical music during dinner, upbeat after 8:30 PM',
      'All toasts and speeches to occur between 7:45-8:00 PM',
    ],
  },
  serviceNotes: `SERVICE PRIORITIES:

1. VIP SERVICE: Head table receives priority service. All courses served first.

2. TIMING: Strict adherence to timeline. Kitchen expo will signal each course.

3. WATER & BREAD: Constant monitoring. Never let glasses go below half-full.

4. CHAMPAGNE SERVICE: Champagne toast at 8:00 PM. Pre-fill flutes at 7:50 PM.

5. TABLE TRANSITIONS: Clear completed courses promptly. Full table clear before next course.

6. SPECIAL ACCOMMODATIONS:
   - Table 7: Allergen-safe service, use dedicated plates
   - Table 12: Kids service 15 min early
   - Table 1: Accessible service approach from west side

7. DANCE FLOOR: Clear and reset cocktail area by 8:30 PM for dancing.

COMMUNICATION:
- All staff equipped with earpieces
- Channel 1: Floor captains
- Channel 2: Kitchen coordination
- Channel 3: Bar service

REMEMBER: Professional presentation at all times. Smile, be attentive, anticipate needs.`,
};

// Export both samples
export const samples = {
  kitchen: sampleKitchenBEO,
  service: sampleServiceBEO,
};

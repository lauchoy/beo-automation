/**
 * Sample Data for BEO Templates
 *
 * Use these examples to test the Kitchen and Service BEO templates
 * and understand the expected data structure.
 */

import type { KitchenBEOData } from './KitchenBEO';
import type { ServiceBEOData } from './ServiceBEO';

// ---------------------------------------------------------------------------
// Sample Kitchen BEO Data
// Types sourced from KitchenBEO.tsx:
//   PrepTask.priority  : 'critical' | 'high' | 'medium' | 'low'  (required)
//   PrepTask.timeEstimate                                          (required)
//   EquipmentCategory.items[].station                             (required)
//   StaffAssignment.shiftStart / shiftEnd                         (required)
//   KitchenBEOData.guests                                         (required)
//   KitchenBEOData.equipmentAllocation                            (required)
// ---------------------------------------------------------------------------
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

  guests: {
    total: 150,
    breakdown: [
      { type: 'Chicken (main)', count: 65, color: 'main' },
      { type: 'Salmon (main)', count: 45, color: 'main' },
      { type: 'Vegetable Wellington (main)', count: 30, color: 'main' },
      { type: 'Appetizer portions', count: 150, color: 'appetizer' },
      { type: 'Dessert portions', count: 150, color: 'dessert' },
    ],
    dietary: {
      vegetarian: 30,
      vegan: 8,
      glutenFree: 12,
      nutAllergy: 2,
    },
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
        cookTemp: 'High heat',
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
        cookTemp: '425°F',
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
        cookTemp: 'Medium-high heat',
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
        cookTemp: '400°F',
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
        cookTemp: '425°F',
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

  // PrepTask.priority is REQUIRED and must be 'critical'|'high'|'medium'|'low'
  // PrepTask.timeEstimate is REQUIRED
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
      priority: 'high',
      timeEstimate: '3:00 PM',
      assignee: 'Chef Martinez',
      details:
        'Remove side muscle, pat completely dry. Portion 3 per plate on parchment-lined trays.',
    },
    {
      id: 'prep3',
      label: 'All vegetables prepped and blanched',
      station: 'Garde Manger',
      priority: 'medium',
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
      priority: 'critical',
      timeEstimate: '5:30 PM',
      details: 'Dedicated pans, utensils, cutting board for Table 7. Clearly marked.',
      dependencies: ['prep1'],
    },
  ],

  // EquipmentCategory.items must use `station` (not `location`)
  equipmentAllocation: [
    {
      category: 'Ranges & Ovens',
      items: [
        { name: 'Convection Oven #1', quantity: 1, station: 'Main Kitchen' },
        { name: 'Convection Oven #2', quantity: 1, station: 'Main Kitchen' },
        { name: '6-Burner Range', quantity: 2, station: 'Main Kitchen' },
        { name: 'Flat Top Griddle', quantity: 1, station: 'Line' },
      ],
    },
    {
      category: 'Cookware',
      items: [
        { name: 'Cast Iron Skillets (12")', quantity: 6, station: 'Sauté Station' },
        { name: 'Sheet Pans (Full)', quantity: 20, station: 'Oven Station' },
        { name: 'Sauté Pans (10")', quantity: 8, station: 'Sauté Station' },
        { name: 'Stock Pots (8qt)', quantity: 4, station: 'Sauce Station' },
      ],
    },
    {
      category: 'Prep Equipment',
      items: [
        { name: 'Food Processor', quantity: 2, station: 'Prep Area' },
        { name: 'Stand Mixer', quantity: 1, station: 'Pastry' },
        { name: 'Cutting Boards (Color-coded)', quantity: 12, station: 'Prep Stations' },
        { name: 'Knife Sets', quantity: 8, station: 'Prep Stations' },
      ],
    },
    {
      category: 'Plating & Serving',
      items: [
        { name: 'Dinner Plates (12")', quantity: 180, station: 'Plate Warmer' },
        { name: 'Dessert Plates (9")', quantity: 165, station: 'Pastry Station' },
        { name: 'Serving Platters', quantity: 30, station: 'Expo' },
        { name: 'Sauce Boats', quantity: 25, station: 'Sauce Station', notes: 'Extra requested' },
      ],
    },
  ],

  // StaffAssignment requires shiftStart + shiftEnd (not startTime)
  staffAssignments: [
    {
      role: 'Executive Chef',
      count: 1,
      station: 'Expo/Oversight',
      shiftStart: '2:00 PM',
      shiftEnd: '11:00 PM',
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
      shiftStart: '2:30 PM',
      shiftEnd: '11:00 PM',
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
      shiftStart: '3:00 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Execute assigned station production',
        'Maintain station cleanliness and mise en place',
        'Follow prep schedule and quality standards',
      ],
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
      shiftStart: '1:00 PM',
      shiftEnd: '7:00 PM',
      responsibilities: ['Vegetable prep', 'Protein portioning', 'Sauce prep'],
    },
    {
      role: 'Pastry Team',
      count: 2,
      station: 'Pastry Kitchen',
      shiftStart: '2:00 PM',
      shiftEnd: '10:00 PM',
      responsibilities: ['Dessert plating', 'Cake service', 'Garnish prep'],
    },
  ],

  allergenNotes: [
    'Table 7: 2 guests with severe nut allergies — dedicated pans, utensils, cutting board required',
    'All allergen-free plates must be clearly marked before leaving the kitchen',
    'Double-check allergen status with FOH captain before each course service',
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
};

// ---------------------------------------------------------------------------
// Sample Service BEO Data
// Types sourced from ServiceBEO.tsx:
//   ServiceBEOData.floorPlan                            (required)
//   ServiceBEOData.staffPositioning                     (required, not staffPositions)
//   ServiceBEOData.guestManagement.expectedArrival      (required)
//   ServiceBEOData.guestManagement.cocktailHour         (required)
//   ServiceBEOData.guestManagement.seatingStyle         (required)
//   ServiceBEOData.guestManagement.specialNeeds         (required)
//   ServiceBEOData.serviceFlow                          (required)
//   ServiceBEOData.equipmentSetup                       (required)
//   ServiceBEOData.emergencyContacts                    (required)
//   StaffPosition.location / shiftStart / shiftEnd / responsibilities (required)
// ---------------------------------------------------------------------------
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
      time: '9:15 PM',
      label: 'Cake Cutting',
      sublabel: 'Coordinate with DJ & kitchen',
      type: 'coordination',
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

  floorPlan: {
    totalTables: 16,
    totalSeats: 170,
    layout: 'Rounds of 10 + elevated head table',
    specialArrangements: [
      'Head table elevated on platform — 20 seats',
      'Table 1 has 2 wheelchair-accessible seats on aisle (west side)',
      'Table 7 allergen-alert — dedicated service approach',
      'Table 12 kids table — early service at 6:45 PM',
      'Dance floor cleared from cocktail area after 8:30 PM',
    ],
  },

  // staffPositioning (not staffPositions) — StaffPosition requires
  // location, shiftStart, shiftEnd, responsibilities
  staffPositioning: [
    {
      role: 'Event Captain',
      count: 1,
      location: 'Floor Oversight',
      shiftStart: '3:30 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Overall event coordination',
        'Guest relations and VIP management',
        'Coordinate with kitchen and bar',
        'Handle service flow and timing',
      ],
      members: [{ name: 'Sarah Martinez', position: 'Lead Captain', section: 'Floor' }],
    },
    {
      role: 'Floor Captains',
      count: 2,
      location: 'Dining & Cocktail Areas',
      shiftStart: '3:45 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Section oversight and quality control',
        'Server coordination and support',
        'Table management',
      ],
      members: [
        { name: 'James Thompson', position: 'Captain', section: 'Main Dining Room' },
        { name: 'Emily Chen', position: 'Captain', section: 'Cocktail Area' },
      ],
    },
    {
      role: 'Servers',
      count: 10,
      location: 'Table Service',
      shiftStart: '4:00 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Full table service for assigned section',
        'Water, bread, and beverage maintenance',
        'Allergen-aware plating and delivery',
      ],
      members: [
        { name: 'Michael R.', section: 'Tables 1-3' },
        { name: 'Jessica L.', section: 'Tables 4-6' },
        { name: 'David K.', section: 'Tables 7-9' },
        { name: 'Amanda S.', section: 'Tables 10-12' },
        { name: 'Chris P.', section: 'Tables 13-15' },
        { name: 'Nicole W.', section: 'Floater' },
        { name: 'Brandon T.', section: 'Floater' },
        { name: 'Samantha H.', section: 'Cocktail Service' },
        { name: 'Ryan M.', section: 'Cocktail Service' },
        { name: 'Lauren B.', section: 'Cocktail Service' },
      ],
    },
    {
      role: 'Bartenders',
      count: 3,
      location: 'Bar Service',
      shiftStart: '4:30 PM',
      shiftEnd: '10:30 PM',
      responsibilities: [
        'Full bar and beverage service',
        'Maintain bar cleanliness and stock',
        'Last call at 10:00 PM',
      ],
      members: [
        { name: 'Alex Rivera', section: 'Main Bar' },
        { name: 'Jordan Lee', section: 'Main Bar' },
        { name: 'Casey Park', section: 'Service Bar' },
      ],
    },
    {
      role: 'Bussers',
      count: 4,
      location: 'Floor Support',
      shiftStart: '4:15 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Table clearing and resetting',
        'Water and bread service',
        'Support servers',
      ],
      members: [
        { name: 'Team A', section: 'Tables 1-8' },
        { name: 'Team B', section: 'Tables 9-15' },
      ],
    },
  ],

  guestManagement: {
    totalGuests: 150,
    expectedArrival: '5:00 PM',
    cocktailHour: true,
    seatingStyle: 'plated',
    specialNeeds: [
      {
        tableNumber: '7',
        requirement: '2 guests with severe nut allergies — dedicated allergen-free plates and utensils required',
        priority: 'critical',
      },
      {
        tableNumber: '1',
        requirement: '2 wheelchair-accessible seats on aisle (west side approach)',
        priority: 'important',
      },
      {
        tableNumber: '12',
        requirement: 'Kids table — early meal service at 6:45 PM (15 min before adult mains)',
        priority: 'important',
      },
      {
        guestName: 'Victoria Whitmore (Bride)',
        requirement: 'Pescatarian — salmon option only',
        priority: 'note',
      },
      {
        guestName: 'David Chen (Groom)',
        requirement: 'Prefers medium-rare protein preparation',
        priority: 'note',
      },
    ],
  },

  serviceFlow: [
    {
      time: '5:00 PM',
      step: 'Cocktail Hour Service',
      details: 'Pass appetizers throughout cocktail area. Bar opens. Maintain steady rotation of passed apps.',
      staffInvolved: ['Event Captain', 'Servers (cocktail)', 'Bartenders'],
      duration: '60 min',
    },
    {
      time: '6:00 PM',
      step: 'Escort Guests to Dining Room',
      details: 'Direct guests to dining room via east entrance. Ensure all seats filled before first course.',
      staffInvolved: ['Event Captain', 'Floor Captains', 'Servers'],
      duration: '15 min',
    },
    {
      time: '6:15 PM',
      step: 'First Course Service',
      details: 'Serve appetizer plates. Head table first, then remaining tables simultaneously by section.',
      staffInvolved: ['All Servers', 'Bussers'],
      duration: '45 min',
    },
    {
      time: '7:00 PM',
      step: 'Main Course Service',
      details: 'Clear first course. Serve mains. Confirm dietary requirements with Table 7 before plating.',
      staffInvolved: ['All Servers', 'Floor Captains', 'Bussers'],
      duration: '60 min',
    },
    {
      time: '7:45 PM',
      step: 'Toasts & Speeches',
      details: 'Pause table service. Ensure all champagne flutes filled before 7:45 PM. Resume after 8:00 PM.',
      staffInvolved: ['Event Captain', 'Bartenders', 'Servers'],
      duration: '15 min',
    },
    {
      time: '8:00 PM',
      step: 'Champagne Toast',
      details: 'Pre-fill flutes at 7:50 PM. Distribute to all guests including vendors.',
      staffInvolved: ['All Servers', 'Bartenders'],
      duration: '10 min',
    },
    {
      time: '8:15 PM',
      step: 'Dessert Service',
      details: 'Serve dessert plates. Begin clearing cocktail area for dance floor.',
      staffInvolved: ['All Servers', 'Bussers'],
      duration: '45 min',
    },
    {
      time: '9:15 PM',
      step: 'Cake Cutting Ceremony',
      details: 'Coordinate with DJ for music cue. Kitchen pre-slices backup sheet cake.',
      staffInvolved: ['Event Captain', 'Pastry Team'],
      duration: '15 min',
    },
    {
      time: '10:00 PM',
      step: 'Bar Last Call',
      details: 'Announce last call. Begin transitioning guests toward conclusion.',
      staffInvolved: ['Bartenders', 'Event Captain'],
      duration: '30 min',
    },
  ],

  equipmentSetup: [
    {
      category: 'Tables & Seating',
      location: 'Main Dining Room',
      items: [
        { item: 'Round Tables (60")', quantity: 15, setupTime: '3:00 PM' },
        { item: 'Rectangular Tables (8ft) — Head Table', quantity: 2, setupTime: '3:00 PM' },
        { item: 'Cocktail Tables (36")', quantity: 8, setupTime: '3:30 PM' },
        { item: 'Chiavari Chairs - Gold', quantity: 170, setupTime: '3:00 PM' },
      ],
    },
    {
      category: 'Linens & China',
      location: 'All Tables',
      items: [
        { item: 'Ivory Tablecloths (120")', quantity: 17 },
        { item: 'Champagne Runners', quantity: 17 },
        { item: 'Ivory Napkins', quantity: 170 },
        { item: 'Gold Charger Plates', quantity: 170, notes: 'Rental — handle with care' },
      ],
    },
    {
      category: 'Bar Equipment',
      location: 'Bar Stations',
      items: [
        { item: 'Main Bar Setup', quantity: 1, setupTime: '3:30 PM' },
        { item: 'Service Bar', quantity: 1, setupTime: '3:30 PM' },
        { item: 'Wine Glasses', quantity: 200 },
        { item: 'Champagne Flutes', quantity: 180 },
        { item: 'Rocks Glasses', quantity: 120 },
      ],
    },
    {
      category: 'Specialty & Decor',
      location: 'Dining & Perimeter',
      items: [
        { item: 'Centerpiece Florals', quantity: 15, setupTime: '4:00 PM', notes: 'Florist delivers' },
        { item: 'Vintage Candlesticks', quantity: 50, notes: 'Rental - handle with care' },
        { item: 'Uplighting Units', quantity: 16, setupTime: '2:00 PM', notes: 'AV vendor setup' },
        { item: 'Wireless Microphones', quantity: 2, notes: 'Sound check at 4:30 PM' },
      ],
    },
  ],

  barService: {
    type: 'full-bar',
    bartenders: 3,
    locations: ['Main Bar — North Wall', 'Service Bar — Kitchen Access'],
    specialRequests: [
      'Signature cocktail: "Whitmore Blossom" (elderflower spritz)',
      'Non-alcoholic option: sparkling water with citrus garnish',
      'Champagne toast service at 8:00 PM for all 150 guests',
    ],
    lastCall: '10:00 PM',
  },

  vendorCoordination: [
    {
      vendorName: 'Elegant Blooms Florist',
      contact: 'Linda Kim — (555) 111-2222',
      arrivalTime: '4:00 PM',
      setupArea: 'Main Dining Room — service elevator access required',
      requirements: ['Service elevator access', '30 min setup time', 'Water source nearby'],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
    {
      vendorName: 'SoundWave AV',
      contact: 'Mike Stevens — (555) 222-3333',
      arrivalTime: '2:00 PM',
      setupArea: 'Perimeter & head table',
      requirements: ['Power access to perimeter', 'Sound check at 4:30 PM', 'Coordinate DJ cues with captain'],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
    {
      vendorName: 'Premier Party Rentals',
      contact: 'Tom Bradley — (555) 333-4444',
      arrivalTime: '2:30 PM',
      setupArea: 'Staging area — service entrance',
      requirements: ['Charger plates and specialty linens delivery', 'Pickup next day by 10 AM'],
      pointOfContact: 'Venue Manager',
    },
    {
      vendorName: 'Memories Photography',
      contact: 'Jessica Park — (555) 444-5555',
      arrivalTime: '4:30 PM',
      setupArea: 'All areas including kitchen',
      requirements: ['Brief kitchen access during cocktail hour', 'Access to all event areas'],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
  ],

  // EmergencyContact requires onSite: boolean
  emergencyContacts: [
    {
      name: 'Sarah Martinez',
      role: 'Event Captain',
      phone: '(555) 345-6789',
      onSite: true,
    },
    {
      name: 'Victoria Whitmore',
      role: 'Client',
      phone: '(555) 123-4567',
      onSite: true,
    },
    {
      name: 'David Chen',
      role: 'Co-Client',
      phone: '(555) 234-5678',
      onSite: true,
    },
    {
      name: 'Venue Manager',
      role: 'Venue Emergency',
      phone: '(555) 456-7890',
      onSite: true,
    },
  ],

  specialInstructions: `SERVICE PRIORITIES:

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

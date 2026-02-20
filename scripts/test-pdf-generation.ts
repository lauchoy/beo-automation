/**
 * Test Script for PDF Generation
 * 
 * Run with: npm run test:pdf
 * 
 * This script demonstrates PDF generation for both
 * Kitchen and Service BEO templates.
 */

import { generatePDFToFile } from '../lib/pdf-generator';
import { KitchenBEO, type KitchenBEOData } from '../components/templates/KitchenBEO';
import { ServiceBEO, type ServiceBEOData } from '../components/templates/ServiceBEO';
import React from 'react';
import path from 'path';

// Sample Kitchen BEO Data
const sampleKitchenBEO: KitchenBEOData = {
  header: {
    beoNumber: 'BEO-2024-TEST-K001',
    eventName: 'Johnson-Smith Wedding Reception',
    eventDate: 'Saturday, March 15, 2024',
    eventTime: '6:00 PM - 11:00 PM',
    clientName: 'Emily Johnson & Michael Smith',
    venue: 'Grand Ballroom - East Wing',
  },
  guests: {
    total: 150,
    breakdown: [
      { type: 'Herb-Crusted Chicken', count: 65, color: 'main' },
      { type: 'Pan-Seared Salmon', count: 45, color: 'appetizer' },
      { type: 'Vegetable Wellington', count: 30, color: 'dessert' },
      { type: 'Kids Menu', count: 10, color: 'default' },
    ],
    dietary: {
      vegetarian: 30,
      vegan: 5,
      glutenFree: 12,
      dairyFree: 8,
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
        holdingTemp: '140°F',
        prepInstructions: [
          'Pat scallops dry and season with salt and white pepper',
          'Heat cast iron pan until smoking, add clarified butter',
          'Sear undisturbed for 2 minutes until golden crust forms',
          'Flip and cook 1-2 minutes more until just opaque',
          'Rest 1 minute before plating on warm plates',
        ],
        platingInstructions: [
          'Place 3 scallops in triangle formation on warm plate',
          'Pool beurre blanc sauce around scallops',
          'Garnish with microgreens and lemon zest',
        ],
        scalingNotes: 'For 150 guests: 450 scallops (U-10 size). Prep in batches of 20. Allow 3 pans rotating continuously.',
        shelfLife: 'Serve immediately, hold max 5 minutes',
      },
    ],
    mains: [
      {
        id: 'main1',
        name: 'Herb-Crusted Chicken',
        description: 'Free-range chicken breast with rosemary jus, roasted fingerlings, seasonal vegetables',
        allergens: ['gluten'],
        portionSize: '7 oz breast per guest',
        cookTime: '18-22 min',
        cookTemp: '425°F',
        station: 'Roast',
        holdingTemp: '165°F',
        prepInstructions: [
          'Brine chicken breasts 4-6 hours in herb salt solution',
          'Pat dry, coat with herb crust (panko, rosemary, thyme, garlic)',
          'Sear skin-side down 4 minutes until golden',
          'Transfer to sheet pans, finish in oven to 165°F internal',
          'Rest 5 minutes before slicing on bias',
        ],
        scalingNotes: 'For 65 portions: 30 lbs chicken breasts. Brine in 3 batches. Sear in rotation, oven capacity is 24 breasts at a time.',
      },
    ],
    desserts: [
      {
        id: 'des1',
        name: 'Wedding Cake',
        description: 'Three-tier vanilla bean cake with buttercream frosting and fresh flowers',
        allergens: ['gluten', 'dairy', 'eggs'],
        portionSize: '1 slice per guest',
        station: 'Pastry',
        prepInstructions: [
          'Cake pre-cut by pastry team before service',
          'Transfer slices to individual plates using offset spatula',
          'Garnish each plate with fresh berry and mint sprig',
        ],
        scalingNotes: '3-tier serves 150. Backup sheet cake in kitchen for seconds.',
      },
    ],
  },
  prepSchedule: [
    {
      id: 'prep1',
      label: 'Mise en place complete for all stations',
      station: 'ALL',
      priority: 'critical',
      timeEstimate: '2:00 PM',
      details: 'All ingredients prepped, measured, and in position. Verify each station has backup supplies.',
    },
    {
      id: 'prep2',
      label: 'Scallops cleaned, dried, and portioned',
      station: 'Sauté',
      priority: 'high',
      timeEstimate: '3:00 PM',
      assignee: 'Chef Martinez',
      details: 'Remove side muscle, pat completely dry with paper towels.',
    },
    {
      id: 'prep3',
      label: 'Allergen-free station verified and isolated',
      station: 'Expo',
      priority: 'critical',
      timeEstimate: '5:30 PM',
      details: 'Dedicated pans, utensils, and cutting board for nut allergies.',
    },
  ],
  equipmentAllocation: [
    {
      category: 'Cooking Equipment',
      items: [
        { name: 'Cast Iron Pans', quantity: 6, station: 'Sauté', notes: 'Pre-seasoned' },
        { name: 'Sheet Pans', quantity: 12, station: 'Roast' },
        { name: 'Mixing Bowls', quantity: 20, station: 'Prep' },
      ],
    },
    {
      category: 'Service Equipment',
      items: [
        { name: 'Chafing Dishes', quantity: 8, station: 'Expo' },
        { name: 'Sauce Boats', quantity: 30, station: 'Plating' },
      ],
    },
  ],
  staffAssignments: [
    {
      role: 'Executive Chef',
      count: 1,
      station: 'Kitchen - Oversight',
      shiftStart: '2:00 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Overall kitchen coordination',
        'Quality control',
        'Final plating approval',
      ],
      members: [{ name: 'Chef Sarah Martinez', position: 'Lead' }],
    },
    {
      role: 'Sous Chef',
      count: 2,
      station: 'Kitchen - Stations',
      shiftStart: '2:00 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Station management',
        'Timing coordination',
        'Team supervision',
      ],
    },
  ],
  allergenNotes: [
    'Table 7: Two guests with severe nut allergies - use dedicated equipment',
    'Table 12: One guest requires gluten-free alternatives for all courses',
  ],
  specialInstructions: `CRITICAL: Nut allergy guests at Table 7
VIP Table (Head Table): Bride is pescatarian
Cake cutting at 9:15 PM - coordinate with event manager`,
};

// Sample Service BEO Data
const sampleServiceBEO: ServiceBEOData = {
  header: {
    beoNumber: 'BEO-2024-TEST-S001',
    eventName: 'Johnson-Smith Wedding Reception',
    eventDate: 'Saturday, March 15, 2024',
    eventTime: '6:00 PM - 11:00 PM',
    clientName: 'Emily Johnson & Michael Smith',
    venue: 'Grand Ballroom - East Wing',
  },
  timeline: [
    { time: '3:00 PM', label: 'Venue Access', sublabel: 'Setup begins', type: 'setup' },
    { time: '4:00 PM', label: 'Staff Arrival', sublabel: 'Team briefing', type: 'setup' },
    { time: '5:00 PM', label: 'Doors Open', sublabel: 'Cocktail hour', type: 'service' },
    { time: '6:00 PM', label: 'Guests Seated', type: 'service' },
    { time: '6:15 PM', label: 'First Course', type: 'service' },
    { time: '7:00 PM', label: 'Main Course', type: 'service' },
    { time: '8:00 PM', label: 'Dessert & Cake', type: 'service' },
    { time: '10:00 PM', label: 'Last Dance', type: 'service' },
    { time: '11:00 PM', label: 'Breakdown', type: 'breakdown' },
  ],
  floorPlan: {
    totalTables: 15,
    totalSeats: 150,
    layout: 'Round tables of 10',
    specialArrangements: [
      'Head table for 12 guests at north wall',
      'Dance floor in center - 20x20 ft',
      'DJ booth in northeast corner',
      'Gift table at entrance',
    ],
  },
  staffPositioning: [
    {
      role: 'Event Captain',
      count: 1,
      location: 'Floor - Main Area',
      shiftStart: '4:00 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Overall event coordination',
        'Client liaison',
        'Timeline management',
      ],
      uniform: 'Black suit, white shirt, black tie',
      members: [{ name: 'Sarah Martinez', position: 'Lead Captain' }],
    },
    {
      role: 'Servers',
      count: 10,
      location: 'Dining Room',
      shiftStart: '5:00 PM',
      shiftEnd: '10:30 PM',
      responsibilities: [
        'Table service',
        'Course delivery',
        'Guest requests',
      ],
      uniform: 'Black vest, white shirt, black bow tie',
    },
  ],
  guestManagement: {
    totalGuests: 150,
    expectedArrival: '5:00 PM - 5:45 PM',
    cocktailHour: true,
    seatingStyle: 'plated',
    specialNeeds: [
      {
        tableNumber: '1',
        requirement: 'Two guests require wheelchair accessibility',
        priority: 'critical',
      },
      {
        tableNumber: '7',
        guestName: 'Table occupants',
        requirement: 'Severe nut allergies - allergen-free service',
        priority: 'critical',
      },
    ],
  },
  serviceFlow: [
    {
      time: '5:00 PM',
      step: 'Cocktail Hour Service',
      details: 'Passed hors d\'oeuvres and signature cocktails',
      staffInvolved: ['Cocktail Servers', 'Bartenders'],
      duration: '1 hour',
    },
    {
      time: '6:15 PM',
      step: 'First Course Service',
      details: 'Appetizer course, coordinated delivery to all tables',
      staffInvolved: ['Servers', 'Food Runners'],
      duration: '15 minutes',
    },
  ],
  equipmentSetup: [
    {
      category: 'Tables & Seating',
      location: 'Main Dining Area',
      items: [
        { item: 'Round Tables 60"', quantity: 15, setupTime: '3:00 PM' },
        { item: 'Chiavari Chairs', quantity: 150, setupTime: '3:30 PM' },
      ],
    },
    {
      category: 'Linens',
      location: 'All Tables',
      items: [
        { item: 'Ivory Tablecloths 120"', quantity: 15 },
        { item: 'Champagne Runners', quantity: 15 },
        { item: 'Ivory Napkins', quantity: 160 },
      ],
    },
  ],
  barService: {
    type: 'full-bar',
    bartenders: 3,
    locations: ['Main Bar', 'Service Bar'],
    specialRequests: [
      'Signature cocktail: "The Whitmore" - champagne with elderflower',
      'Premium whiskey selection for groom\'s table',
    ],
    lastCall: '10:00 PM',
  },
  vendorCoordination: [
    {
      vendorName: 'Elite DJ Entertainment',
      contact: 'Mike Johnson - (555) 123-4567',
      arrivalTime: '4:00 PM',
      setupArea: 'Northeast corner',
      requirements: [
        '2x 120V outlets',
        '6ft table for equipment',
        'Access to load in from east entrance',
      ],
      pointOfContact: 'Event Captain - Sarah Martinez',
    },
  ],
  emergencyContacts: [
    {
      name: 'Victoria Whitmore',
      role: 'Bride / Primary Client',
      phone: '(555) 555-0123',
      onSite: true,
    },
    {
      name: 'Event Manager On-Call',
      role: 'Emergency Coordinator',
      phone: '(555) 555-0911',
      onSite: false,
    },
  ],
  specialInstructions: `IMPORTANT NOTES:
  
• Photographer will need access to kitchen for behind-the-scenes shots (6:30-7:00 PM)
• Cake cutting ceremony at 9:15 PM - coordinate with DJ and photographer
• Two guests at Table 1 require wheelchair accessibility - ensure clear pathways
• Vendor meals (12 people) to be served at 6:00 PM in green room
• Client has requested extra sauce boats for main course`,
};

// Sample Service BEO Data
const sampleServiceBEO: ServiceBEOData = {
  header: {
    beoNumber: 'BEO-2024-TEST-S001',
    eventName: 'Johnson-Smith Wedding Reception',
    eventDate: 'Saturday, March 15, 2024',
    eventTime: '6:00 PM - 11:00 PM',
    clientName: 'Emily Johnson & Michael Smith',
    venue: 'Grand Ballroom - East Wing',
  },
  timeline: [
    { 
      time: '3:00 PM', 
      label: 'Venue Access', 
      sublabel: 'Setup begins', 
      type: 'setup',
      responsible: 'Setup Crew',
      notes: 'Load in through east entrance',
    },
    { 
      time: '4:00 PM', 
      label: 'Staff Arrival', 
      sublabel: 'Team briefing', 
      type: 'setup',
      responsible: 'Event Captain',
    },
    { 
      time: '5:00 PM', 
      label: 'Doors Open', 
      sublabel: 'Cocktail hour', 
      type: 'service',
      responsible: 'All FOH Staff',
    },
    { 
      time: '6:00 PM', 
      label: 'Guests Seated', 
      type: 'service',
      responsible: 'Floor Captains',
    },
    { 
      time: '6:15 PM', 
      label: 'First Course', 
      type: 'service',
      responsible: 'Servers',
    },
    { 
      time: '7:00 PM', 
      label: 'Main Course', 
      type: 'service',
      responsible: 'Servers',
    },
    { 
      time: '8:00 PM', 
      label: 'Dessert & Cake', 
      type: 'service',
      responsible: 'Servers',
    },
    { 
      time: '9:00 PM', 
      label: 'Bar Last Call', 
      type: 'service',
      responsible: 'Bartenders',
    },
    { 
      time: '10:00 PM', 
      label: 'Last Dance', 
      type: 'service',
      responsible: 'DJ',
    },
    { 
      time: '11:00 PM', 
      label: 'Breakdown', 
      sublabel: 'Load out', 
      type: 'breakdown',
      responsible: 'All Staff',
    },
  ],
  floorPlan: {
    totalTables: 15,
    totalSeats: 150,
    layout: 'Round tables of 10',
    specialArrangements: [
      'Head table (12 guests) positioned at north wall facing room',
      'Dance floor 20x20 ft in center - clear by 5:30 PM',
      'DJ booth in northeast corner with sight lines to dance floor',
      'Gift table and card box at entrance',
      'Cocktail area in adjacent foyer',
    ],
  },
  staffPositioning: [
    {
      role: 'Event Captain',
      count: 1,
      location: 'Floor - Oversight',
      shiftStart: '4:00 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Overall event coordination and timeline management',
        'Primary client liaison and communication',
        'Problem resolution and decision making',
        'Staff supervision and support',
      ],
      uniform: 'Black suit, white shirt, black tie',
      members: [
        { name: 'Sarah Martinez', position: 'Lead Captain' },
      ],
    },
    {
      role: 'Floor Captains',
      count: 2,
      location: 'Dining Sections',
      shiftStart: '4:30 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Section management (Tables 1-7 and 8-15)',
        'Server coordination and support',
        'Course timing and delivery',
        'Guest service quality',
      ],
      uniform: 'Black vest, white shirt, black bow tie',
      members: [
        { name: 'James Thompson', section: 'Tables 1-7' },
        { name: 'Emily Chen', section: 'Tables 8-15' },
      ],
    },
    {
      role: 'Servers',
      count: 10,
      location: 'Dining Room',
      shiftStart: '5:00 PM',
      shiftEnd: '10:30 PM',
      responsibilities: [
        'Table service and guest interaction',
        'Course delivery and presentation',
        'Beverage service',
        'Table maintenance and clearing',
      ],
      uniform: 'Black vest, white shirt, black bow tie',
    },
    {
      role: 'Bartenders',
      count: 3,
      location: 'Bar Stations',
      shiftStart: '4:30 PM',
      shiftEnd: '10:30 PM',
      responsibilities: [
        'Cocktail and beverage service',
        'Bar setup and breakdown',
        'Inventory management',
        'Responsible alcohol service',
      ],
      uniform: 'Black shirt, black apron',
      members: [
        { name: 'Alex Rivera', section: 'Main Bar' },
        { name: 'Jordan Lee', section: 'Main Bar' },
        { name: 'Casey Park', section: 'Service Bar' },
      ],
    },
  ],
  guestManagement: {
    totalGuests: 150,
    expectedArrival: '5:00 PM - 5:45 PM',
    cocktailHour: true,
    seatingStyle: 'plated',
    specialNeeds: [
      {
        tableNumber: '1',
        requirement: 'Two guests require wheelchair accessibility - clear pathways, remove two chairs',
        priority: 'critical',
      },
      {
        tableNumber: '7',
        guestName: 'Multiple guests',
        requirement: 'Severe nut allergies - allergen-free service, dedicated utensils',
        priority: 'critical',
      },
      {
        tableNumber: '12',
        guestName: 'Guest Johnson',
        requirement: 'Gluten-free bread alternative',
        priority: 'important',
      },
    ],
  },
  serviceFlow: [
    {
      time: '5:00 PM',
      step: 'Cocktail Hour Service',
      details: 'Passed hors d\'oeuvres, signature cocktails, wine service in foyer area',
      staffInvolved: ['Cocktail Servers (3)', 'Bartenders (3)'],
      duration: '1 hour',
    },
    {
      time: '6:00 PM',
      step: 'Guest Seating',
      details: 'Coordinate with floor captains to seat guests. Verify all place cards are correct.',
      staffInvolved: ['Floor Captains', 'All Servers'],
      duration: '15 minutes',
    },
    {
      time: '6:15 PM',
      step: 'First Course Service',
      details: 'Synchronized appetizer delivery. All tables served within 5-minute window.',
      staffInvolved: ['Servers', 'Food Runners'],
      duration: '45 minutes',
    },
    {
      time: '7:00 PM',
      step: 'Main Course Service',
      details: 'Plated service from kitchen. Coordinate with sous chef for timing.',
      staffInvolved: ['Servers', 'Floor Captains'],
      duration: '60 minutes',
    },
    {
      time: '8:00 PM',
      step: 'Dessert Service',
      details: 'Pre-plated desserts, coordinate with cake cutting ceremony at 9:15 PM',
      staffInvolved: ['Servers', 'Pastry Team'],
      duration: '45 minutes',
    },
    {
      time: '9:15 PM',
      step: 'Cake Cutting Ceremony',
      details: 'Coordinate with DJ and photographer. Serve cake slices to all guests.',
      staffInvolved: ['Event Captain', 'Servers', 'Pastry Team'],
      duration: '30 minutes',
    },
  ],
  equipmentSetup: [
    {
      category: 'Tables & Seating',
      location: 'Main Dining Area',
      items: [
        { item: 'Round Tables 60"', quantity: 15, setupTime: '3:00 PM' },
        { item: 'Head Table 12ft', quantity: 1, setupTime: '3:00 PM' },
        { item: 'Chiavari Chairs', quantity: 150, setupTime: '3:30 PM' },
        { item: 'Cocktail Tables 36"', quantity: 8, setupTime: '4:00 PM' },
      ],
    },
    {
      category: 'Linens & Decor',
      location: 'All Tables',
      items: [
        { item: 'Ivory Tablecloths 120"', quantity: 17 },
        { item: 'Champagne Runners', quantity: 17 },
        { item: 'Ivory Napkins', quantity: 160 },
      ],
    },
    {
      category: 'Service Items',
      location: 'Various',
      items: [
        { item: 'Wine Glasses', quantity: 200 },
        { item: 'Champagne Flutes', quantity: 180 },
        { item: 'Water Goblets', quantity: 180 },
        { item: 'Dinner Plates', quantity: 180 },
        { item: 'Gold Charger Plates', quantity: 160, notes: 'Rental - handle with care' },
      ],
    },
  ],
  barService: {
    type: 'full-bar',
    bartenders: 3,
    locations: ['Main Bar (Foyer)', 'Service Bar (Kitchen Side)'],
    specialRequests: [
      'Signature cocktail "The Whitmore" - champagne with elderflower liqueur',
      'Premium whiskey selection for groom\'s table',
      'Non-alcoholic craft mocktails available',
    ],
    lastCall: '10:00 PM',
  },
  vendorCoordination: [
    {
      vendorName: 'Elite DJ Entertainment',
      contact: 'Mike Johnson - (555) 123-4567',
      arrivalTime: '4:00 PM',
      setupArea: 'Northeast corner of ballroom',
      requirements: [
        '2x 120V outlets (20 amp circuits)',
        '6ft table for equipment',
        'Load in access from east entrance',
        'Clear sight line to dance floor',
      ],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
    {
      vendorName: 'Moments Photography',
      contact: 'Lisa Chen - (555) 234-5678',
      arrivalTime: '4:30 PM',
      setupArea: 'Mobile throughout venue',
      requirements: [
        'Kitchen access for prep shots (6:30-7:00 PM)',
        'Reserved seating near head table',
        'Coordination for cake cutting at 9:15 PM',
      ],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
  ],
  emergencyContacts: [
    {
      name: 'Victoria Whitmore',
      role: 'Bride / Primary Client',
      phone: '(555) 555-0123',
      onSite: true,
    },
    {
      name: 'David Chen',
      role: 'Groom / Co-Client',
      phone: '(555) 555-0124',
      onSite: true,
    },
    {
      name: 'Sarah Martinez',
      role: 'Event Captain',
      phone: '(555) 555-1000',
      onSite: true,
    },
    {
      name: 'Emergency Services',
      role: 'Venue Security',
      phone: '(555) 555-0911',
      onSite: true,
    },
  ],
  specialInstructions: `CRITICAL REMINDERS:

• Photographer requires kitchen access 6:30-7:00 PM for prep shots
• Cake cutting ceremony at 9:15 PM - coordinate with DJ and photographer
• Two wheelchair-accessible spaces at Table 1 - ensure clear pathways at all times
• Table 7 has severe nut allergies - communicate with kitchen for special handling
• Vendor meals for 12 people served at 6:00 PM in green room
• Client has requested extra champagne be available for toasts

TIMELINE NOTES:
• Doors open precisely at 5:00 PM - all cocktail stations must be ready
• Seating begins promptly at 6:00 PM - floor captains coordinate
• All courses must be served in 5-minute windows across all tables
• Bar last call at 10:00 PM sharp`,
};

/**
 * Main test function
 */
async function testPDFGeneration() {
  console.log('🚀 Starting PDF Generation Tests...\n');

  const outputDir = path.join(process.cwd(), 'output');
  
  // Ensure output directory exists
  const fs = await import('fs/promises');
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }

  // Test 1: Kitchen BEO PDF
  console.log('📄 Test 1: Generating Kitchen BEO PDF...');
  const kitchenResult = await generatePDFToFile({
    component: React.createElement(KitchenBEO, { data: sampleKitchenBEO }),
    outputPath: path.join(outputDir, 'kitchen-beo-test.pdf'),
  });

  if (kitchenResult.success) {
    console.log('✅ Kitchen BEO PDF generated successfully!');
    console.log(`   File: ${kitchenResult.filePath}`);
    console.log(`   Size: ${(kitchenResult.metadata.fileSize || 0) / 1024} KB`);
  } else {
    console.log('❌ Kitchen BEO PDF generation failed:', kitchenResult.error);
  }

  console.log('');

  // Test 2: Service BEO PDF
  console.log('📄 Test 2: Generating Service BEO PDF...');
  const serviceResult = await generatePDFToFile({
    component: React.createElement(ServiceBEO, { data: sampleServiceBEO }),
    outputPath: path.join(outputDir, 'service-beo-test.pdf'),
  });

  if (serviceResult.success) {
    console.log('✅ Service BEO PDF generated successfully!');
    console.log(`   File: ${serviceResult.filePath}`);
    console.log(`   Size: ${(serviceResult.metadata.fileSize || 0) / 1024} KB`);
  } else {
    console.log('❌ Service BEO PDF generation failed:', serviceResult.error);
  }

  console.log('\n✨ PDF Generation Tests Complete!\n');
  console.log(`Output directory: ${outputDir}`);
}

// Run tests
if (require.main === module) {
  testPDFGeneration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testPDFGeneration };

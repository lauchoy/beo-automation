/**
 * Sample Service BEO Data
 * 
 * Complete example data structure for Service BEO template.
 * Use for testing, development, and as a reference.
 */

import { type ServiceBEOData } from '@/components/templates/ServiceBEO';

export const sampleServiceBEO: ServiceBEOData = {
  header: {
    beoNumber: 'BEO-2024-0892',
    eventName: 'The Whitmore-Chen Wedding Reception',
    eventDate: 'Saturday, March 15, 2025',
    eventTime: '5:00 PM – 11:00 PM',
    clientName: 'Victoria Whitmore & David Chen',
    venue: 'The Conservatory at Willowbrook Estate',
  },
  timeline: [
    { 
      time: '3:00 PM', 
      label: 'Venue Access', 
      sublabel: 'Setup crew arrival', 
      type: 'setup',
      responsible: 'Setup Team Lead',
      notes: 'Load in through west service entrance. Elevator available until 4:30 PM.',
    },
    { 
      time: '3:30 PM', 
      label: 'Table Setup', 
      sublabel: 'Tables, chairs, linens', 
      type: 'setup',
      responsible: 'Setup Crew',
      notes: 'Refer to floor plan diagram. Head table first.',
    },
    { 
      time: '4:00 PM', 
      label: 'FOH Staff Arrival', 
      sublabel: 'Team briefing', 
      type: 'setup',
      responsible: 'Event Captain',
      notes: 'Mandatory briefing in staff room. Review special needs.',
    },
    { 
      time: '4:30 PM', 
      label: 'Vendor Arrivals', 
      sublabel: 'DJ, photographer, florist', 
      type: 'setup',
      responsible: 'Event Captain',
      notes: 'Coordinate load-in. Verify power and setup areas.',
    },
    { 
      time: '5:00 PM', 
      label: 'Doors Open', 
      sublabel: 'Cocktail hour begins', 
      type: 'service',
      responsible: 'All FOH Staff',
      notes: 'Signature cocktails and passed hors d\'oeuvres. Soft background music.',
    },
    { 
      time: '5:45 PM', 
      label: 'Seating Begins', 
      sublabel: 'Guest transition', 
      type: 'service',
      responsible: 'Floor Captains',
      notes: 'Gentle announcement at 5:40 PM. Escort guests to tables.',
    },
    { 
      time: '6:00 PM', 
      label: 'All Guests Seated', 
      type: 'service',
      responsible: 'Floor Captains',
      notes: 'Final check of place cards and special seating.',
    },
    { 
      time: '6:15 PM', 
      label: 'First Course Service', 
      sublabel: 'Appetizers', 
      type: 'service',
      responsible: 'All Servers',
      notes: 'Synchronized delivery - all tables within 5-minute window.',
    },
    { 
      time: '7:00 PM', 
      label: 'Welcome Toasts', 
      sublabel: 'Father of bride, best man', 
      type: 'coordination',
      responsible: 'Event Captain',
      notes: 'Coordinate with DJ. Ensure champagne glasses filled.',
    },
    { 
      time: '7:15 PM', 
      label: 'Main Course Service', 
      type: 'service',
      responsible: 'All Servers',
      notes: 'Plated from kitchen. Announce each dish as served.',
    },
    { 
      time: '8:15 PM', 
      label: 'Dessert Service', 
      sublabel: 'Pre-plated desserts', 
      type: 'service',
      responsible: 'All Servers',
      notes: 'Clear mains first. Pre-plated desserts from pastry.',
    },
    { 
      time: '9:00 PM', 
      label: 'Coffee Service', 
      sublabel: 'Coffee, tea, after-dinner drinks', 
      type: 'service',
      responsible: 'Servers',
      notes: 'Offer coffee and tea to all tables.',
    },
    { 
      time: '9:15 PM', 
      label: 'Cake Cutting Ceremony', 
      sublabel: 'Coordinate with photographer', 
      type: 'coordination',
      responsible: 'Event Captain + Pastry',
      notes: 'CRITICAL: Photographer and DJ must be coordinated. Spotlight on couple.',
    },
    { 
      time: '9:30 PM', 
      label: 'Cake Service', 
      sublabel: 'To all guests', 
      type: 'service',
      responsible: 'All Servers',
      notes: 'Pre-sliced in kitchen. Coffee refills offered.',
    },
    { 
      time: '10:00 PM', 
      label: 'Bar Last Call', 
      type: 'service',
      responsible: 'Bartenders',
      notes: 'Announce last call. Final drink orders.',
    },
    { 
      time: '10:30 PM', 
      label: 'Last Dance', 
      sublabel: 'Event conclusion', 
      type: 'service',
      responsible: 'DJ',
      notes: 'Begin subtle guest departure preparations.',
    },
    { 
      time: '11:00 PM', 
      label: 'Event Ends', 
      sublabel: 'Guest departure', 
      type: 'breakdown',
      responsible: 'All Staff',
      notes: 'Assist guests with coats/items. Secure lost & found.',
    },
    { 
      time: '11:15 PM', 
      label: 'Breakdown Begins', 
      sublabel: 'Teardown and cleaning', 
      type: 'breakdown',
      responsible: 'All Staff',
      notes: 'Load out through west entrance. Return rentals to staging area.',
    },
  ],
  floorPlan: {
    totalTables: 18,
    totalSeats: 180,
    layout: 'Rounds of 10 with head table of 12',
    specialArrangements: [
      'Head table (12 guests) elevated 6 inches on riser at north wall',
      'Dance floor 24x24 ft in center - must be clear by 5:30 PM for guest arrival',
      'DJ booth in northeast corner with sight lines to head table and dance floor',
      'Gift table and card box positioned at main entrance with security sight line',
      'Cocktail area in adjacent Garden Room with 8 high-top tables',
      'Wheelchair-accessible spaces at Table 1 - remove 2 chairs, ensure 36" clearance',
      'Photo booth area in southeast corner with backdrop and props',
      'Dessert display table near cake for truffle and tart presentation',
    ],
  },
  staffPositioning: [
    {
      role: 'Event Captain',
      count: 1,
      location: 'Floor - Central Position',
      shiftStart: '4:00 PM',
      shiftEnd: '12:00 AM',
      responsibilities: [
        'Overall event coordination and timeline management',
        'Primary client liaison - handle all client requests',
        'Communication hub between kitchen, FOH, and vendors',
        'Problem resolution and executive decisions',
        'Ensure service quality and guest satisfaction',
        'Coordinate cake cutting ceremony and special moments',
      ],
      uniform: 'Black three-piece suit, white shirt, black silk tie, name badge',
      members: [
        { name: 'Sarah Martinez', position: 'Senior Event Captain' },
      ],
    },
    {
      role: 'Floor Captains',
      count: 2,
      location: 'Dining Sections A & B',
      shiftStart: '4:30 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Section management (Tables 1-9 and Tables 10-18)',
        'Server coordination and timing',
        'Course delivery oversight',
        'Guest service quality assurance',
        'Immediate problem resolution in section',
      ],
      uniform: 'Black vest, white dress shirt, black bow tie',
      members: [
        { name: 'James Thompson', position: 'Floor Captain', section: 'Section A (Tables 1-9)' },
        { name: 'Emily Chen', position: 'Floor Captain', section: 'Section B (Tables 10-18)' },
      ],
    },
    {
      role: 'Lead Servers',
      count: 12,
      location: 'Dining Room - Assigned Sections',
      shiftStart: '5:00 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Table service and guest interaction',
        'Course delivery from kitchen',
        'Wine and beverage service',
        'Table maintenance and resetting',
        'Guest requests and special accommodations',
      ],
      uniform: 'Black vest, white shirt, black bow tie, black slacks/skirt',
      members: [
        { name: 'Server 1', section: 'Tables 1-2' },
        { name: 'Server 2', section: 'Tables 3-4' },
        { name: 'Server 3', section: 'Tables 5-6' },
        { name: 'Server 4', section: 'Tables 7-8' },
        { name: 'Server 5', section: 'Tables 9-10' },
        { name: 'Server 6', section: 'Tables 11-12' },
        { name: 'Server 7', section: 'Tables 13-14' },
        { name: 'Server 8', section: 'Tables 15-16' },
        { name: 'Server 9', section: 'Tables 17-18' },
        { name: 'Server 10', section: 'Head Table' },
        { name: 'Server 11', section: 'Floater / Backup' },
        { name: 'Server 12', section: 'Cocktail Area' },
      ],
    },
    {
      role: 'Food Runners',
      count: 4,
      location: 'Kitchen to Dining Room',
      shiftStart: '5:30 PM',
      shiftEnd: '10:00 PM',
      responsibilities: [
        'Hot food transport from kitchen to servers',
        'Tray coordination and organization',
        'Support servers during course delivery',
        'Return used serviceware to dish',
      ],
      uniform: 'Black shirt, black apron',
    },
    {
      role: 'Bartenders',
      count: 4,
      location: 'Bar Stations',
      shiftStart: '4:30 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Bar setup and pre-service prep',
        'Cocktail and beverage preparation',
        'Responsible alcohol service',
        'Bar inventory and cash handling',
        'Breakdown and cleaning',
      ],
      uniform: 'Black button-down shirt, black apron, name badge',
      members: [
        { name: 'Alex Rivera', section: 'Main Bar - Cocktail Room' },
        { name: 'Jordan Lee', section: 'Main Bar - Cocktail Room' },
        { name: 'Casey Park', section: 'Service Bar - Kitchen Side' },
        { name: 'Morgan Taylor', section: 'Champagne Station' },
      ],
    },
    {
      role: 'Bussers',
      count: 6,
      location: 'Dining Room Sections',
      shiftStart: '5:30 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Table clearing and resetting',
        'Water service and refills',
        'Bread and butter service',
        'Assistance to servers',
        'Maintaining dining room cleanliness',
      ],
      uniform: 'Black shirt, black pants, black apron',
    },
    {
      role: 'Coat Check Attendant',
      count: 1,
      location: 'Main Entrance',
      shiftStart: '4:45 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Coat and personal item check-in',
        'Secure storage of guest belongings',
        'Retrieval at guest departure',
        'Lost and found coordination',
      ],
      uniform: 'Black vest, white shirt',
    },
  ],
  guestManagement: {
    totalGuests: 180,
    expectedArrival: '5:00 PM - 5:50 PM',
    cocktailHour: true,
    seatingStyle: 'plated',
    specialNeeds: [
      {
        tableNumber: '1',
        guestName: 'Guests requiring accommodation',
        requirement: 'Two wheelchair-accessible spaces - remove chairs, ensure 36" clearance from all sides, clear pathway to restroom',
        priority: 'critical',
      },
      {
        tableNumber: '7',
        guestName: 'Johnson family (3 guests)',
        requirement: 'SEVERE NUT ALLERGIES - allergen-free service with dedicated utensils. Kitchen has been notified. Server must confirm before each course.',
        priority: 'critical',
      },
      {
        tableNumber: '12',
        guestName: 'Guest requiring gluten-free',
        requirement: 'Celiac disease - strict gluten-free meal preparation. Separate service items.',
        priority: 'important',
      },
      {
        tableNumber: '15',
        guestName: 'David Chen (Groom)',
        requirement: 'Shellfish sensitivity - substitute chicken for scallop appetizer',
        priority: 'important',
      },
      {
        tableNumber: 'Head Table',
        guestName: 'Victoria Whitmore (Bride)',
        requirement: 'Pescatarian - will have salmon main course',
        priority: 'important',
      },
      {
        tableNumber: '2',
        guestName: 'Parents of bride',
        requirement: 'VIP service - extra attentive, discrete service',
        priority: 'note',
      },
    ],
  },
  serviceFlow: [
    {
      time: '5:00 PM',
      step: 'Cocktail Hour Service Begins',
      details: 'Greet guests at entrance, offer signature cocktail "The Whitmore" (champagne with elderflower). Pass hors d\'oeuvres (3 varieties). Background string quartet in Garden Room.',
      staffInvolved: ['Cocktail Servers (3)', 'Bartenders (Main Bar)', 'Greeters (2)'],
      duration: '1 hour',
    },
    {
      time: '5:45 PM',
      step: 'Gentle Seating Announcement',
      details: 'Event captain makes soft announcement inviting guests to find their seats. Servers assist guests to tables. Verify all place cards are correct.',
      staffInvolved: ['Event Captain', 'All Servers', 'Floor Captains'],
      duration: '15 minutes',
    },
    {
      time: '6:00 PM',
      step: 'All Guests Seated - Water Service',
      details: 'Confirm all guests are seated. Bussers pour water at all tables. Bread and butter service begins. Wine service begins for those who pre-ordered.',
      staffInvolved: ['Bussers', 'Servers', 'Sommeliers'],
      duration: '15 minutes',
    },
    {
      time: '6:15 PM',
      step: 'First Course Service',
      details: 'Appetizer course delivered from kitchen. Servers should announce dish as placing: "Seared diver scallops with citrus beurre blanc." Synchronized delivery to all tables within 5-minute window.',
      staffInvolved: ['All Servers', 'Food Runners', 'Floor Captains'],
      duration: '45 minutes',
    },
    {
      time: '7:00 PM',
      step: 'Welcome Toasts',
      details: 'Father of bride and best man toasts. DJ provides microphone. Servers should pause service and stand attentively. Champagne refills offered immediately after toasts.',
      staffInvolved: ['Event Captain', 'DJ', 'Servers (champagne service)'],
      duration: '15 minutes',
    },
    {
      time: '7:15 PM',
      step: 'Main Course Service',
      details: 'Entrées plated in kitchen and delivered. Servers announce: "Herb-crusted chicken," "Pan-seared salmon," or "Vegetable wellington" based on pre-order. Check for dietary modifications.',
      staffInvolved: ['All Servers', 'Food Runners', 'Floor Captains'],
      duration: '60 minutes',
    },
    {
      time: '8:15 PM',
      step: 'Clear Main Course',
      details: 'Efficient clearing of main course. Ask guests if they\'ve finished. Crumb tables using service cloths.',
      staffInvolved: ['Servers', 'Bussers'],
      duration: '15 minutes',
    },
    {
      time: '8:30 PM',
      step: 'Dessert Service',
      details: 'Pre-plated desserts delivered. Offer coffee and tea service with dessert.',
      staffInvolved: ['Servers', 'Food Runners'],
      duration: '45 minutes',
    },
    {
      time: '9:15 PM',
      step: 'Cake Cutting Ceremony',
      details: 'CRITICAL TIMING: Coordinate with DJ (announcement), photographer (position), and lighting. Bring cake table to head table area. Couple cuts cake, then pastry team cuts remainder in kitchen.',
      staffInvolved: ['Event Captain', 'Pastry Chef', 'Servers', 'DJ', 'Photographer'],
      duration: '15 minutes',
    },
    {
      time: '9:30 PM',
      step: 'Wedding Cake Service',
      details: 'Serve pre-sliced wedding cake to all guests. Offer coffee/tea refills.',
      staffInvolved: ['All Servers'],
      duration: '30 minutes',
    },
    {
      time: '10:00 PM',
      step: 'Bar Last Call Announcement',
      details: 'Bartenders announce last call for alcohol. Continue soft drink and coffee service.',
      staffInvolved: ['Bartenders', 'Event Captain'],
      duration: '30 minutes',
    },
    {
      time: '10:30 PM',
      step: 'Guest Departure Preparations',
      details: 'Begin subtle breakdown of cocktail area. Servers continue to circulate. Coat check prepared for retrievals.',
      staffInvolved: ['Setup Crew', 'Coat Check', 'Servers'],
      duration: '30 minutes',
    },
    {
      time: '11:00 PM',
      step: 'Last Dance & Event Conclusion',
      details: 'DJ plays last song. Thank guests for attending. Assist with coat retrieval and departure.',
      staffInvolved: ['All Staff', 'Coat Check'],
      duration: '15 minutes',
    },
    {
      time: '11:15 PM',
      step: 'Full Breakdown & Load Out',
      details: 'Complete teardown. Load rental items for pickup. Clean and reset venue. Final walkthrough with venue manager.',
      staffInvolved: ['All Staff', 'Setup Crew'],
      duration: '2 hours',
    },
  ],
  guestManagement: {
    totalGuests: 180,
    expectedArrival: '5:00 PM - 5:50 PM',
    cocktailHour: true,
    seatingStyle: 'plated',
    specialNeeds: [
      {
        tableNumber: '1',
        guestName: 'Two guests requiring accommodation',
        requirement: 'Wheelchair accessibility - remove 2 chairs, ensure 36" clearance, clear pathway to restrooms and exit',
        priority: 'critical',
      },
      {
        tableNumber: '7',
        guestName: 'Johnson family members',
        requirement: 'THREE guests with severe nut allergies - allergen-free service, dedicated utensils, verify with kitchen before EVERY course',
        priority: 'critical',
      },
      {
        tableNumber: '12',
        guestName: 'Guest with celiac disease',
        requirement: 'Gluten-free bread basket, gluten-free meal preparation, separate service items',
        priority: 'important',
      },
      {
        tableNumber: '15',
        guestName: 'David Chen (Groom)',
        requirement: 'Shellfish sensitivity - chicken appetizer substitution instead of scallops',
        priority: 'important',
      },
      {
        tableNumber: 'Head Table',
        guestName: 'Victoria Whitmore (Bride)',
        requirement: 'Pescatarian preference - will have salmon main course',
        priority: 'note',
      },
    ],
  },
  serviceFlow: [
    {
      time: '5:00 PM',
      step: 'Cocktail Hour Service',
      details: 'Guest arrival and cocktail service in Garden Room. Passed hors d\'oeuvres (scallop crostini, caprese skewers, mushroom tartlets). Signature cocktails at bar.',
      staffInvolved: ['Cocktail Servers', 'Bartenders', 'Food Runners'],
      duration: '1 hour',
    },
    {
      time: '6:00 PM',
      step: 'Guest Seating & Water Service',
      details: 'Coordinate with floor captains to seat all guests. Bussers immediately pour water. Bread and butter service begins.',
      staffInvolved: ['Floor Captains', 'Servers', 'Bussers'],
      duration: '15 minutes',
    },
    {
      time: '6:15 PM',
      step: 'First Course Service',
      details: 'Synchronized appetizer delivery from kitchen. All tables served within 5-minute window. Announce dishes as served.',
      staffInvolved: ['All Servers', 'Food Runners'],
      duration: '45 minutes',
    },
    {
      time: '7:15 PM',
      step: 'Main Course Service',
      details: 'Hot plated entrées from kitchen. Verify each guest receives correct selection. Extra sauce boats available upon request.',
      staffInvolved: ['All Servers', 'Food Runners', 'Floor Captains'],
      duration: '60 minutes',
    },
    {
      time: '8:30 PM',
      step: 'Dessert Service',
      details: 'Pre-plated desserts with coffee service. Clear all main course items first.',
      staffInvolved: ['Servers', 'Bussers'],
      duration: '45 minutes',
    },
    {
      time: '9:30 PM',
      step: 'Wedding Cake Service',
      details: 'Post-ceremony cake slices to all guests. Coffee and tea refills.',
      staffInvolved: ['All Servers'],
      duration: '30 minutes',
    },
  ],
  equipmentSetup: [
    {
      category: 'Tables & Seating',
      location: 'Main Ballroom',
      items: [
        { item: 'Round Tables 60"', quantity: 18, setupTime: '3:00 PM', notes: 'Standard height 30"' },
        { item: 'Head Table 12ft', quantity: 1, setupTime: '3:00 PM', notes: 'On 6" riser platform' },
        { item: 'Chiavari Chairs (Gold)', quantity: 180, setupTime: '3:30 PM', notes: 'Rental - handle carefully' },
        { item: 'Cocktail Tables 36"', quantity: 10, setupTime: '3:45 PM', notes: 'For Garden Room' },
      ],
    },
    {
      category: 'Linens',
      location: 'All Tables',
      items: [
        { item: 'Ivory Tablecloths 120"', quantity: 20, notes: 'Floor-length for all tables' },
        { item: 'Champagne Gold Runners 14x108"', quantity: 20 },
        { item: 'Ivory Cloth Napkins', quantity: 200, notes: 'Pre-fold in fan style' },
        { item: 'Cocktail Napkins', quantity: 300, notes: 'Embossed with couple initials' },
      ],
    },
    {
      category: 'China & Flatware',
      location: 'Service Area',
      items: [
        { item: 'Dinner Plates 11"', quantity: 200 },
        { item: 'Salad/Appetizer Plates 8"', quantity: 200 },
        { item: 'Dessert Plates 7"', quantity: 200 },
        { item: 'Gold Charger Plates 13"', quantity: 180, notes: 'RENTAL - extreme care' },
        { item: 'Dinner Forks', quantity: 200 },
        { item: 'Salad Forks', quantity: 200 },
        { item: 'Dinner Knives', quantity: 200 },
        { item: 'Soup Spoons', quantity: 180 },
        { item: 'Dessert Forks', quantity: 200 },
        { item: 'Coffee Spoons', quantity: 200 },
      ],
    },
    {
      category: 'Glassware',
      location: 'Bar & Tables',
      items: [
        { item: 'Water Goblets', quantity: 200 },
        { item: 'Red Wine Glasses', quantity: 150 },
        { item: 'White Wine Glasses', quantity: 150 },
        { item: 'Champagne Flutes', quantity: 220, notes: 'Extra for toasts' },
        { item: 'Rocks Glasses', quantity: 100, notes: 'For bar service' },
        { item: 'Highball Glasses', quantity: 100 },
      ],
    },
    {
      category: 'Service Items',
      location: 'Service Stations',
      items: [
        { item: 'Water Pitchers', quantity: 24 },
        { item: 'Coffee Carafes', quantity: 15 },
        { item: 'Tea Pots', quantity: 8 },
        { item: 'Bread Baskets', quantity: 20 },
        { item: 'Butter Dishes', quantity: 20 },
        { item: 'Sauce Boats', quantity: 40, notes: 'Extra per client request' },
        { item: 'Wine Openers', quantity: 12 },
        { item: 'Serving Trays (large)', quantity: 20 },
      ],
    },
    {
      category: 'Decor & Special Items',
      location: 'Various',
      items: [
        { item: 'Centerpiece Arrangements', quantity: 18, setupTime: '4:30 PM', notes: 'Florist delivers - verify placement' },
        { item: 'Votive Candles', quantity: 100, notes: 'Light at 5:45 PM' },
        { item: 'Table Numbers (gold frames)', quantity: 18, notes: 'Place after linens' },
        { item: 'Menu Cards', quantity: 180, notes: 'One per place setting' },
        { item: 'Place Cards', quantity: 180, notes: 'Verify spelling and table assignments' },
      ],
    },
  ],
  barService: {
    type: 'full-bar',
    bartenders: 4,
    locations: [
      'Main Bar - Garden Room (Cocktail Hour)',
      'Service Bar - Behind Main Dining (Dinner Service)',
      'Champagne Station - Entrance (Toast Service)',
    ],
    specialRequests: [
      'Signature Cocktail: "The Whitmore" - Champagne, elderflower liqueur, edible flowers',
      'Premium whiskey selection for groom\'s table (Table 15)',
      'Non-alcoholic craft mocktails available (at least 3 varieties)',
      'Specialty coffee bar during dessert service',
      'Champagne toast during speeches - ensure all glasses filled',
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
        '2x dedicated 120V outlets (20 amp circuits)',
        '6ft table for DJ equipment and laptop',
        'Load-in access from east service entrance',
        'Clear sight line to dance floor and head table',
        'Access to venue sound system for speeches',
        'Wireless microphones (2) for toasts',
      ],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
    {
      vendorName: 'Moments by Lisa Photography',
      contact: 'Lisa Chen - (555) 234-5678',
      arrivalTime: '4:30 PM',
      setupArea: 'Mobile throughout venue',
      requirements: [
        'Reserved seat near head table for equipment',
        'Kitchen access 6:30-7:00 PM for prep shots (coordinate with chef)',
        'Notification before cake cutting (9:15 PM)',
        'Access to bridal suite for preparation photos',
        'List of must-have family photos from bride',
      ],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
    {
      vendorName: 'Elegant Florals by Design',
      contact: 'Rachel Green - (555) 345-6789',
      arrivalTime: '3:30 PM',
      setupArea: 'Service entrance for delivery',
      requirements: [
        'Centerpieces for 18 tables plus head table',
        'Ceremony arch florals to be moved to photo area after ceremony',
        'Bridal bouquet delivered to bride at 4:00 PM',
        'Setup assistance from 2 staff members',
        'Water sources for floral maintenance',
      ],
      pointOfContact: 'Sarah Martinez (Event Captain)',
    },
    {
      vendorName: 'Harmony Strings Quartet',
      contact: 'David Park - (555) 456-7890',
      arrivalTime: '4:45 PM',
      setupArea: 'Garden Room corner',
      requirements: [
        '4 armless chairs',
        'Music stands (bringing own)',
        'Playing during cocktail hour (5:00-6:00 PM)',
        'Soft background during dinner if requested',
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
      name: 'Chef Martinez (Kitchen)',
      role: 'Executive Chef',
      phone: '(555) 555-1001',
      onSite: true,
    },
    {
      name: 'Venue Security',
      role: 'Emergency Services',
      phone: '(555) 555-0911',
      onSite: true,
    },
    {
      name: 'Willowbrook Estate Manager',
      role: 'Venue Management',
      phone: '(555) 555-2000',
      onSite: false,
    },
  ],
  specialInstructions: `🚨 CRITICAL REMINDERS & PRIORITIES:

ALLERGEN PROTOCOLS (CRITICAL):
• Table 7: THREE guests with severe nut allergies
• Kitchen using dedicated nut-free equipment (purple cutting board)
• Server must personally verify each course before delivery
• Have epinephrine auto-injector available (in captain's kit)
• All staff briefed on allergen protocol

VIP SERVICE NOTES:
• Head Table: Bride is pescatarian (salmon), Groom has shellfish sensitivity (chicken appetizer)
• Table 2: Parents of bride - extra attentive, discrete service
• Table 15: Groom's family - premium whiskey selection at bar for this table

VENDOR COORDINATION:
• Photographer requires kitchen access 6:30-7:00 PM - maintain pristine workspace
• DJ must be coordinated for: Welcome announcement (6:00), Toasts (7:00), Cake cutting (9:15), Last dance (10:30)
• Florist delivery at 3:30 PM - verify all centerpieces before signing off
• String quartet plays during cocktail hour only (5:00-6:00 PM)

TIMING CRITICAL ITEMS:
• Cake cutting ceremony at 9:15 PM SHARP - cannot be delayed (photographer schedule)
• Cocktail hour MUST end by 6:00 PM - bride's request for punctuality
• Bar last call exactly at 10:00 PM per venue policy
• Venue MUST be cleared by 1:00 AM (hard deadline)

SPECIAL REQUESTS:
• Extra sauce boats for main course (40 total vs. standard 20)
• Kids' meals served 15 minutes before adult courses
• Vegetarian wellington upgraded with truffle oil (comp from chef)
• Vendor meals (18 people total) served in green room at 6:00 PM
• Extra champagne budget approved for continuous toast service

EQUIPMENT NOTES:
• Gold charger plates are RENTAL - handle with extreme care, verify count at end
• Ivory linens must be kept pristine - spot clean immediately if needed
• Centerpieces contain water - be careful during service
• Photo booth props in southeast corner - ensure guests know location

CLIENT PREFERENCES:
• Couple prefers minimal announcements during dinner
• Background music volume low during meal service
• Cake cutting to be "big moment" with full attention
• Prefer guests linger and enjoy - not rushed

WEATHER CONTINGENCY:
• Garden Room has retractable roof - check forecast day before
• If rain, cocktail hour moves entirely indoors - rearrange per alternate plan
• Outdoor ceremony site has indoor backup location`,
};

export default sampleServiceBEO;

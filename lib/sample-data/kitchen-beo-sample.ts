/**
 * Sample Kitchen BEO Data
 * 
 * Complete example data structure for Kitchen BEO template.
 * Use for testing, development, and as a reference.
 */

import { type KitchenBEOData } from '@/components/templates/KitchenBEO';

export const sampleKitchenBEO: KitchenBEOData = {
  header: {
    beoNumber: 'BEO-2024-0892',
    eventName: 'The Whitmore-Chen Wedding Reception',
    eventDate: 'Saturday, March 15, 2025',
    eventTime: '5:00 PM – 11:00 PM',
    clientName: 'Victoria Whitmore & David Chen',
    venue: 'The Conservatory at Willowbrook Estate',
    guestCount: 180,
  },
  guests: {
    total: 180,
    breakdown: [
      { type: 'Herb-Crusted Chicken', count: 85, color: 'main' },
      { type: 'Pan-Seared Salmon', count: 55, color: 'appetizer' },
      { type: 'Vegetable Wellington', count: 30, color: 'dessert' },
      { type: 'Kids Menu', count: 10, color: 'default' },
    ],
    dietary: {
      vegetarian: 30,
      vegan: 8,
      glutenFree: 15,
      dairyFree: 12,
      nutAllergy: 3,
    },
  },
  menu: {
    appetizers: [
      {
        id: 'app1',
        name: 'Seared Diver Scallops',
        description: 'Pan-seared U-10 scallops with citrus beurre blanc, microgreens, and lemon zest',
        allergens: ['shellfish', 'dairy'],
        portionSize: '3 scallops per guest',
        cookTime: '4-5 min',
        cookTemp: 'High heat (500°F+)',
        station: 'Sauté Station',
        holdingTemp: '140°F minimum',
        shelfLife: 'Serve immediately, max 5 min hold',
        prepInstructions: [
          'Remove side muscle from scallops and pat completely dry with paper towels',
          'Season generously with fine sea salt and white pepper',
          'Heat cast iron pan until smoking hot, add 2 tbsp clarified butter',
          'Place scallops in pan without touching, sear undisturbed for 2 minutes',
          'Flip once golden crust forms, cook 1-2 minutes more until barely opaque',
          'Remove to warm plate, rest 1 minute before plating',
        ],
        platingInstructions: [
          'Warm plates to 140°F before plating',
          'Pool 2 oz beurre blanc in center of plate',
          'Arrange 3 scallops in triangle formation',
          'Garnish with microgreens and fresh lemon zest',
          'Wipe plate rim clean before service',
        ],
        scalingNotes: 'For 180 guests: 540 scallops (U-10 size, approximately 45 lbs). Prep in batches of 24. Requires 4 sauté pans rotating continuously. Have backup pan heating. Order 10% overage for quality control.',
      },
      {
        id: 'app2',
        name: 'Heirloom Tomato Caprese',
        description: 'Fresh mozzarella, heirloom tomatoes, basil, aged balsamic, extra virgin olive oil',
        allergens: ['dairy'],
        portionSize: '4 oz per guest',
        station: 'Garde Manger',
        holdingTemp: 'Room temperature (65-70°F)',
        shelfLife: 'Assemble max 2 hours before service',
        prepInstructions: [
          'Slice mozzarella into 1/2-inch thick rounds, keep refrigerated until 1 hour before',
          'Cut heirloom tomatoes into similar thickness, season with salt',
          'Pick fresh basil leaves, keep in damp towel',
          'Bring to room temperature 30 minutes before plating',
        ],
        platingInstructions: [
          'Alternate tomato and mozzarella slices in overlapping circle',
          'Tuck basil leaves between slices',
          'Drizzle with premium EVOO and aged balsamic',
          'Finish with flaky sea salt and cracked black pepper',
        ],
        scalingNotes: 'For 180 guests: 25 lbs fresh mozzarella, 30 lbs heirloom tomatoes (use variety of colors). Can be pre-plated 2 hours ahead, cover with plastic wrap. Add dressing just before service.',
      },
      {
        id: 'app3',
        name: 'Wild Mushroom Crostini',
        description: 'Assorted wild mushrooms, garlic, thyme, truffle oil on grilled sourdough',
        allergens: ['gluten'],
        portionSize: '2 crostini per guest',
        cookTime: '3-4 min toast',
        cookTemp: '375°F',
        station: 'Sauté Station',
        holdingTemp: 'Serve warm',
        prepInstructions: [
          'Slice sourdough baguette on bias into 1/2-inch rounds',
          'Brush with olive oil, toast until golden on both sides',
          'Clean and slice mushrooms (shiitake, oyster, cremini mix)',
          'Sauté mushrooms in batches - do not overcrowd pan',
          'Add garlic, thyme, deglaze with sherry, reduce',
          'Finish with cream, season with salt and pepper',
        ],
        platingInstructions: [
          'Spoon warm mushroom ragout onto each crostini',
          'Drizzle with white truffle oil',
          'Garnish with fresh thyme sprig',
        ],
        scalingNotes: 'For 180 guests: 360 crostini (order 400 for backup). Mushroom ragout can be made 1 day ahead, reheat gently. Toast bread day-of only. Assemble maximum 10 minutes before service.',
      },
    ],
    mains: [
      {
        id: 'main1',
        name: 'Herb-Crusted Chicken Breast',
        description: 'Airline chicken breast with rosemary-garlic herb crust, roasted fingerling potatoes, seasonal vegetables, rosemary jus',
        allergens: ['gluten'],
        portionSize: '7 oz breast per guest',
        cookTime: '18-22 min',
        cookTemp: '425°F',
        station: 'Roast Station',
        holdingTemp: '165°F (internal temp)',
        shelfLife: 'Hold max 15 minutes in warmer',
        prepInstructions: [
          'Brine chicken breasts 4-6 hours in herb brine (rosemary, thyme, garlic, salt)',
          'Remove from brine, pat completely dry with paper towels',
          'Coat with herb crust mixture (panko, fresh herbs, garlic, lemon zest)',
          'Sear presentation side down in hot pan for 3-4 minutes until golden',
          'Transfer to sheet pans, finish in 425°F oven',
          'Cook to 165°F internal temperature (approximately 18-22 minutes)',
          'Rest 5 minutes before slicing on bias',
        ],
        platingInstructions: [
          'Slice chicken breast on bias into 3 pieces',
          'Fan slices on plate over fingerling potatoes',
          'Arrange seasonal vegetables alongside',
          'Sauce plate with 2 oz rosemary jus',
          'Garnish with fresh rosemary sprig',
        ],
        scalingNotes: 'For 85 portions: 42 lbs chicken breasts (airline cut, approximately 85 pieces). Brine in 3 batches using large containers. Sear in rotation using 4 pans. Oven capacity is 30 breasts per batch - stagger by 6 minutes for continuous service.',
      },
      {
        id: 'main2',
        name: 'Pan-Seared Atlantic Salmon',
        description: 'Scottish salmon with lemon-dill beurre blanc, wild rice pilaf, grilled asparagus',
        allergens: ['fish', 'dairy'],
        portionSize: '6 oz fillet per guest',
        cookTime: '8-10 min total',
        cookTemp: 'Medium-high heat',
        station: 'Sauté Station',
        holdingTemp: '130°F (medium)',
        shelfLife: 'Serve immediately, max 8 min hold',
        prepInstructions: [
          'Portion salmon fillets to 6 oz, check carefully for pin bones',
          'Pat dry and season both sides with salt, pepper, and lemon zest',
          'Heat sauté pan with high-heat oil until shimmering',
          'Place salmon skin-side down, press gently to ensure contact',
          'Cook undisturbed for 4-5 minutes until skin is crispy',
          'Flip carefully, finish cooking 3-4 minutes to medium (130°F)',
        ],
        platingInstructions: [
          'Place wild rice pilaf in center of plate',
          'Top with salmon fillet, skin-side up for presentation',
          'Arrange grilled asparagus spears alongside',
          'Pool lemon-dill beurre blanc around salmon',
          'Garnish with fresh dill frond and lemon wheel',
        ],
        scalingNotes: 'For 55 portions: 24 lbs salmon (skin-on portions preferred). Can be portioned 1 day ahead, keep refrigerated. Cook in batches of 12 using 3 pans. Hold finished salmon in 200°F oven for maximum 8 minutes.',
      },
      {
        id: 'main3',
        name: 'Vegetable Wellington',
        description: 'Roasted vegetables wrapped in puff pastry with mushroom duxelles, port wine reduction, glazed baby carrots',
        allergens: ['gluten', 'eggs'],
        portionSize: 'Individual 6 oz wellington',
        cookTime: '25-30 min',
        cookTemp: '400°F',
        station: 'Pastry/Roast',
        holdingTemp: 'Serve immediately',
        prepInstructions: [
          'Roast vegetables (bell peppers, zucchini, eggplant) until tender, cool',
          'Prepare mushroom duxelles with shallots and thyme, cool completely',
          'Roll puff pastry to 1/8-inch thickness, cut into portions',
          'Layer vegetables and duxelles in center of each pastry square',
          'Brush edges with egg wash, fold and seal tightly',
          'Score top in decorative pattern, brush with egg wash',
          'Refrigerate 30 minutes before baking for best puff',
        ],
        platingInstructions: [
          'Slice wellington on bias to show layers',
          'Fan sliced wellington on plate',
          'Arrange glazed baby carrots alongside',
          'Pool port wine reduction sauce',
          'Garnish with microgreens',
        ],
        scalingNotes: 'For 30 portions: Prep all wellingtons day before, refrigerate unbaked. Bake in batches of 15 using 2 ovens. Can hold in warm oven (200°F) for maximum 10 minutes. Do not stack.',
      },
    ],
    desserts: [
      {
        id: 'des1',
        name: 'Three-Tier Wedding Cake',
        description: 'Vanilla bean cake with vanilla buttercream, fresh flowers, gold leaf accents',
        allergens: ['gluten', 'dairy', 'eggs'],
        portionSize: '2" x 3" slice per guest',
        station: 'Pastry',
        prepInstructions: [
          'Cake delivered pre-assembled by pastry team day before',
          'Store at room temperature in climate-controlled area',
          'Pre-cut slices by pastry team 2 hours before service',
          'Arrange pre-cut slices on trays, keep covered',
        ],
        platingInstructions: [
          'Transfer slice to plate using offset spatula',
          'Garnish with fresh raspberry and mint sprig',
          'Add decorative raspberry coulis swoosh',
          'Dust plate edge with powdered sugar (optional)',
        ],
        scalingNotes: '3-tier cake serves 180 guests. Backup sheet cake in kitchen cooler for seconds/vendor meals. Cutting ceremony at 9:15 PM - coordinate with event captain and photographer. Save top tier for couple.',
      },
      {
        id: 'des2',
        name: 'Artisan Chocolate Truffles',
        description: 'Assortment of dark, milk, and white chocolate truffles with various coatings',
        allergens: ['dairy', 'soy'],
        portionSize: '3 truffles per guest',
        station: 'Pastry',
        holdingTemp: '55-60°F',
        shelfLife: 'Best served same day',
        prepInstructions: [
          'Truffles made 2 days ahead by pastry team',
          'Store in cool, dry place at 55-60°F (NOT refrigerator)',
          'Remove from storage 30 minutes before plating to temper',
          'Arrange on service platters - mix of varieties',
        ],
        platingInstructions: [
          'Place 3 truffles per guest on dessert plate',
          'Mix of dark, milk, and white on each plate',
          'Light dusting of cocoa powder on plate',
          'Add chocolate garnish curl or gold leaf',
        ],
        scalingNotes: 'For 180 guests: 600 truffles total (order 660 with 10% overage). Made 2 days ahead, stored at proper temperature. DO NOT REFRIGERATE day of event as condensation will ruin finish.',
      },
      {
        id: 'des3',
        name: 'Seasonal Berry Tart',
        description: 'Individual tarts with vanilla pastry cream, fresh berries, almond crust, apricot glaze',
        allergens: ['gluten', 'dairy', 'eggs', 'nuts'],
        portionSize: '1 individual 4-inch tart',
        station: 'Pastry',
        holdingTemp: 'Refrigerate until 30 min before service',
        shelfLife: 'Assemble day-of only',
        prepInstructions: [
          'Blind-bake almond tart shells morning of event',
          'Cool completely, store in dry area',
          'Prepare vanilla pastry cream, chill completely',
          'Wash and dry all berries (strawberries, blueberries, raspberries)',
          'Fill tart shells with pastry cream no more than 3 hours before service',
          'Arrange berries in concentric circles for visual appeal',
          'Brush with warm apricot glaze for shine',
        ],
        platingInstructions: [
          'Remove tart from refrigerator 30 minutes before service',
          'Place tart slightly off-center on plate',
          'Add small quenelle of whipped cream',
          'Dust plate rim with powdered sugar',
          'Garnish with mint leaf',
        ],
        scalingNotes: 'For 180 guests: 198 individual tarts (10% backup). Tart shells can be made 2 days ahead, store airtight at room temp. Pastry cream 1 day ahead. Fill and top day-of only, max 3 hours before service.',
      },
    ],
    sides: [
      {
        id: 'side1',
        name: 'Roasted Fingerling Potatoes',
        description: 'Baby fingerlings with rosemary, garlic, olive oil',
        allergens: [],
        portionSize: '4 oz per guest',
        cookTime: '35-40 min',
        cookTemp: '425°F',
        station: 'Roast Station',
        holdingTemp: '180°F',
        prepInstructions: [
          'Wash fingerlings, cut larger ones in half lengthwise',
          'Toss with olive oil, salt, pepper, fresh rosemary, smashed garlic',
          'Roast at 425°F until golden and tender, turning once',
          'Finish with fresh herbs and flaky salt',
        ],
        scalingNotes: 'For 180 guests: 50 lbs fingerling potatoes. Can par-roast 2 hours ahead, finish to order.',
      },
      {
        id: 'side2',
        name: 'Seasonal Vegetable Medley',
        description: 'Grilled asparagus, roasted carrots, sautéed green beans',
        allergens: [],
        portionSize: '5 oz total per guest',
        cookTime: 'Varies by vegetable',
        station: 'Grill/Sauté',
        holdingTemp: '160°F',
        prepInstructions: [
          'Blanch green beans and asparagus, shock in ice water',
          'Peel and slice carrots, roast with honey glaze',
          'Finish asparagus on grill just before service',
          'Sauté green beans with garlic and butter',
        ],
        scalingNotes: 'All vegetables can be prepped and blanched day before. Finish cooking during service.',
      },
    ],
  },
  prepSchedule: [
    {
      id: 'prep1',
      label: 'Complete mise en place for all stations',
      station: 'ALL STATIONS',
      priority: 'critical',
      timeEstimate: '2:00 PM',
      details: 'All ingredients prepped, measured, and positioned. Verify backup supplies at each station. Check equipment functionality.',
      dependencies: [],
    },
    {
      id: 'prep2',
      label: 'Scallops cleaned, portioned, and ready',
      station: 'Sauté',
      priority: 'critical',
      timeEstimate: '3:00 PM',
      assignee: 'Chef Martinez',
      details: 'Remove side muscles, pat bone-dry with paper towels. Portion 3 per plate on parchment-lined sheet trays. Keep refrigerated.',
      dependencies: ['prep1'],
    },
    {
      id: 'prep3',
      label: 'All vegetables prepped and blanched',
      station: 'Garde Manger',
      priority: 'high',
      timeEstimate: '3:00 PM',
      assignee: 'Chef Thompson',
      details: 'Asparagus trimmed and blanched, green beans blanched and shocked, carrots peeled and roasted, fingerlings par-cooked. Label and store properly.',
      dependencies: ['prep1'],
    },
    {
      id: 'prep4',
      label: 'All sauces prepared and holding',
      station: 'Sauce',
      priority: 'critical',
      timeEstimate: '4:00 PM',
      assignee: 'Sous Chef',
      details: 'Rosemary jus, lemon-dill beurre blanc, mushroom ragout, port wine reduction. Check temps every 30 minutes. Bain-marie setup.',
      dependencies: ['prep1'],
    },
    {
      id: 'prep5',
      label: 'Chicken breasts brined, crusted, ready to cook',
      station: 'Roast',
      priority: 'high',
      timeEstimate: '4:30 PM',
      details: 'Remove from brine, dry completely, apply herb crust. Sear and stage on sheet pans. Calculate oven rotation schedule.',
      dependencies: ['prep1'],
    },
    {
      id: 'prep6',
      label: 'Salmon portioned and ready for service',
      station: 'Sauté',
      priority: 'high',
      timeEstimate: '4:30 PM',
      details: 'Check for pin bones again, season, refrigerate on parchment-lined trays.',
      dependencies: ['prep2'],
    },
    {
      id: 'prep7',
      label: 'Vegetable Wellingtons assembled and ready to bake',
      station: 'Pastry',
      priority: 'high',
      timeEstimate: '3:00 PM',
      details: 'Pre-assembled day before. Verify count, brush with egg wash, score tops. Refrigerate until baking.',
      dependencies: [],
    },
    {
      id: 'prep8',
      label: 'Dessert plating stations setup',
      station: 'Pastry',
      priority: 'medium',
      timeEstimate: '5:00 PM',
      assignee: 'Pastry Team',
      details: 'Berry garnishes washed and dried. Mint picked. Coulis in squeeze bottles. Powdered sugar in shakers. Whipped cream ready.',
      dependencies: ['prep1'],
    },
    {
      id: 'prep9',
      label: 'Allergen-free station verified and isolated',
      station: 'Expo',
      priority: 'critical',
      timeEstimate: '5:30 PM',
      assignee: 'Executive Chef',
      details: 'Dedicated pans, utensils, and cutting boards for nut allergy guests (Table 7). Separate prep area clearly marked with red tape. Communicate with all staff. Double-check with FOH.',
      dependencies: [],
    },
    {
      id: 'prep10',
      label: 'Final station check and team briefing',
      station: 'ALL STATIONS',
      priority: 'critical',
      timeEstimate: '5:45 PM',
      assignee: 'Executive Chef',
      details: 'Walk all stations. Verify timing schedule. Review special requests. Address questions. Final check of allergen protocols.',
      dependencies: ['prep1', 'prep2', 'prep3', 'prep4', 'prep5', 'prep6', 'prep7', 'prep8', 'prep9'],
    },
  ],
  equipmentAllocation: [
    {
      category: 'Cookware - Sauté Station',
      items: [
        { name: 'Cast Iron Skillets 12"', quantity: 6, station: 'Sauté', notes: 'Pre-seasoned, scallops & salmon' },
        { name: 'Stainless Steel Sauté Pans', quantity: 8, station: 'Sauté' },
        { name: 'Sauce Pots (2qt)', quantity: 4, station: 'Sauté', notes: 'For beurre blanc' },
      ],
    },
    {
      category: 'Cookware - Roast Station',
      items: [
        { name: 'Full Sheet Pans', quantity: 16, station: 'Roast', notes: 'Chicken, vegetables' },
        { name: 'Half Sheet Pans', quantity: 12, station: 'Roast' },
        { name: 'Roasting Racks', quantity: 10, station: 'Roast' },
      ],
    },
    {
      category: 'Prep Equipment',
      items: [
        { name: 'Large Mixing Bowls', quantity: 20, station: 'Prep' },
        { name: 'Cutting Boards (color-coded)', quantity: 15, station: 'Prep', notes: 'Green=veg, Red=meat, Yellow=poultry, Blue=fish' },
        { name: 'Food Processors', quantity: 3, station: 'Prep' },
      ],
    },
    {
      category: 'Service Equipment',
      items: [
        { name: 'Chafing Dishes', quantity: 10, station: 'Expo', notes: 'For sauce holding' },
        { name: 'Hotel Pans (full size)', quantity: 24, station: 'Expo' },
        { name: 'Plate Warmers', quantity: 4, station: 'Expo', notes: 'Maintain 140°F' },
        { name: 'Sauce Boats (4 oz)', quantity: 40, station: 'Plating' },
      ],
    },
    {
      category: 'Allergen-Free Station',
      items: [
        { name: 'Dedicated Cutting Board (PURPLE)', quantity: 1, station: 'Allergen Station', notes: 'NUT-FREE ONLY' },
        { name: 'Dedicated Knife Set', quantity: 1, station: 'Allergen Station', notes: 'Labeled "NUT-FREE"' },
        { name: 'Dedicated Cookware Set', quantity: 1, station: 'Allergen Station', notes: 'Separate storage' },
      ],
    },
    {
      category: 'Storage',
      items: [
        { name: 'Reach-In Coolers', quantity: 3, station: 'Line', notes: 'Verify temps 36-38°F' },
        { name: 'Hot Holding Cabinets', quantity: 2, station: 'Expo', notes: 'Set to 165°F' },
      ],
    },
  ],
  staffAssignments: [
    {
      role: 'Executive Chef',
      count: 1,
      station: 'Kitchen Oversight',
      shiftStart: '2:00 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Overall kitchen coordination and quality control',
        'Final plating approval and presentation',
        'Staff supervision and support',
        'Communication with FOH captain',
        'Problem resolution and decision making',
      ],
      members: [
        { name: 'Chef Sarah Martinez', position: 'Executive Chef' },
      ],
    },
    {
      role: 'Sous Chef',
      count: 2,
      station: 'Hot Line / Expo',
      shiftStart: '2:00 PM',
      shiftEnd: '11:00 PM',
      responsibilities: [
        'Station coordination and timing',
        'Expediting and quality control',
        'Plating supervision',
        'Temperature monitoring',
      ],
      members: [
        { name: 'Chef James Thompson', position: 'Sous Chef - Hot Line' },
        { name: 'Chef Emily Rodriguez', position: 'Sous Chef - Expo' },
      ],
    },
    {
      role: 'Line Cooks',
      count: 6,
      station: 'Various Stations',
      shiftStart: '2:30 PM',
      shiftEnd: '10:30 PM',
      responsibilities: [
        'Mise en place preparation',
        'Cooking and plating assigned dishes',
        'Station maintenance and organization',
        'Following chef instructions precisely',
      ],
      members: [
        { name: 'Cook A', position: 'Sauté - Scallops' },
        { name: 'Cook B', position: 'Sauté - Salmon' },
        { name: 'Cook C', position: 'Roast - Chicken' },
        { name: 'Cook D', position: 'Vegetable Wellington' },
        { name: 'Cook E', position: 'Vegetables' },
        { name: 'Cook F', position: 'Floater/Backup' },
      ],
    },
    {
      role: 'Pastry Team',
      count: 3,
      station: 'Pastry Kitchen',
      shiftStart: '1:00 PM',
      shiftEnd: '10:00 PM',
      responsibilities: [
        'Dessert preparation and plating',
        'Cake cutting ceremony coordination',
        'Specialty items and garnishes',
      ],
      members: [
        { name: 'Chef Patricia Chen', position: 'Pastry Chef' },
        { name: 'Assistant A', position: 'Pastry Assistant' },
        { name: 'Assistant B', position: 'Pastry Assistant' },
      ],
    },
    {
      role: 'Prep Cooks',
      count: 4,
      station: 'Prep Kitchen',
      shiftStart: '12:00 PM',
      shiftEnd: '8:00 PM',
      responsibilities: [
        'Vegetable preparation and butchery',
        'Sauce and stock preparation',
        'Cleaning and organization',
        'Supporting line cooks as needed',
      ],
    },
    {
      role: 'Dishwashers',
      count: 3,
      station: 'Dish Pit',
      shiftStart: '4:00 PM',
      shiftEnd: '11:30 PM',
      responsibilities: [
        'Dish washing and sanitization',
        'Pot and pan cleaning',
        'Kitchen sanitation',
        'Trash and recycling management',
      ],
    },
  ],
  allergenNotes: [
    '🚨 CRITICAL: Table 7 has THREE guests with severe nut allergies - use dedicated nut-free station (purple cutting board)',
    'Table 12: One guest requires strict gluten-free preparation - use dedicated gluten-free cookware',
    'Table 15: Guest Chen (groom) has shellfish sensitivity - substitute chicken for scallop appetizer',
    'Head Table: Bride (Victoria) is pescatarian - confirm fish or vegetarian option',
  ],
  specialInstructions: `CRITICAL PRIORITIES:

🚨 NUT ALLERGY PROTOCOL - TABLE 7
• Three guests with severe nut allergies
• Use PURPLE cutting board and dedicated utensils ONLY
• Separate prep area with clear signage
• Chef Martinez personally approves all plates
• Communicate with FOH - servers must be briefed

VIP REQUIREMENTS:
• Head Table: Bride is pescatarian (salmon or wellington only)
• Groom prefers proteins cooked medium-rare (not applicable to chicken)
• Parents' table (Table 2): Extra attentive service requested

TIMING COORDINATION:
• Kids meals (10 portions) served 15 minutes before adult courses
• Cake cutting ceremony at 9:15 PM SHARP - coordinate with pastry chef
• Photographer in kitchen 6:30-7:00 PM for prep shots - maintain cleanliness
• Vendor meals (18 people) at 6:00 PM in green room

EQUIPMENT NOTES:
• Client requested extra sauce boats for main course - provide 2 per table
• Gold charger plates are RENTAL - handle with extreme care
• Backup sheet pan for each station in case of overflow

SPECIAL REQUESTS:
• Extra champagne for toasts throughout evening
• Vegetarian Wellington upgraded with truffle oil (no additional charge)
• Additional gluten-free bread basket for Table 12`,
};

export default sampleKitchenBEO;

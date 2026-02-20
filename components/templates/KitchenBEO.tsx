import React from 'react';

// Type Definitions
export interface AllergenType {
  gluten?: boolean;
  dairy?: boolean;
  nuts?: boolean;
  shellfish?: boolean;
  eggs?: boolean;
  soy?: boolean;
  fish?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  allergens: AllergenType;
  portionSize?: string;
  cookTime?: string;
  prepInstructions?: string[];
  scalingNotes?: string;
  station?: string;
  cookingTemperature?: string;
}

export interface PrepTask {
  id: string;
  label: string;
  station: string;
  assignee?: string;
  priority?: 'high' | 'normal' | 'low';
  timeEstimate?: string;
  details?: string;
  dependencies?: string[];
  completed?: boolean;
}

export interface Equipment {
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    location?: string;
    notes?: string;
  }>;
}

export interface StaffAssignment {
  role: string;
  count: number;
  station: string;
  startTime?: string;
  responsibilities?: string[];
  members?: Array<{
    name: string;
    position?: string;
  }>;
}

export interface KitchenBEOData {
  header: {
    beoNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    clientName: string;
    venue: string;
    guestCount: number;
    logoUrl?: string;
  };
  menu: {
    appetizers: MenuItem[];
    mains: MenuItem[];
    desserts: MenuItem[];
    sides?: MenuItem[];
  };
  prepSchedule: PrepTask[];
  equipment: {
    cooking: Equipment[];
    prep: Equipment[];
    service: Equipment[];
  };
  staffAssignments: StaffAssignment[];
  specialInstructions?: string;
  dietaryRestrictions?: {
    vegetarian?: number;
    vegan?: number;
    glutenFree?: number;
    nutAllergy?: number;
    other?: string;
  };
}

// Allergen Icon Component
const AllergenIcon: React.FC<{ type: string; size?: 'sm' | 'md' }> = ({ type, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'h-5 w-5 text-xs' : 'h-6 w-6 text-sm';
  const iconMap: Record<string, string> = {
    gluten: 'G',
    dairy: 'D',
    nuts: 'N',
    shellfish: 'SF',
    eggs: 'E',
    soy: 'S',
    fish: 'F',
  };

  return (
    <div
      className={`${sizeClasses} rounded-full border-2 border-foreground flex items-center justify-center font-bold`}
      title={type}
    >
      {iconMap[type] || type.charAt(0).toUpperCase()}
    </div>
  );
};

// BEO Header Component
const BEOHeader: React.FC<KitchenBEOData['header']> = ({
  beoNumber,
  eventName,
  eventDate,
  eventTime,
  clientName,
  venue,
  guestCount,
  logoUrl,
}) => {
  return (
    <header className="space-y-12">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="h-16 w-auto" />
          ) : (
            <div className="h-16 w-32 border border-foreground flex items-center justify-center">
              <span className="patina-label">KITCHEN</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="patina-label text-muted-foreground mb-2">BEO Number</div>
          <div className="font-serif text-2xl md:text-3xl font-light tracking-tight">
            {beoNumber}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            {eventName}
          </h1>
          <p className="font-sans text-lg text-muted-foreground">{clientName}</p>
        </div>

        <div className="md:text-right space-y-4">
          <div>
            <span className="patina-label text-muted-foreground block mb-1">Date</span>
            <span className="font-serif text-xl">{eventDate}</span>
          </div>
          <div>
            <span className="patina-label text-muted-foreground block mb-1">Service Time</span>
            <span className="font-serif text-xl">{eventTime}</span>
          </div>
          <div>
            <span className="patina-label text-muted-foreground block mb-1">Venue</span>
            <span className="font-serif text-xl">{venue}</span>
          </div>
          <div>
            <span className="patina-label text-muted-foreground block mb-1">Guest Count</span>
            <span className="font-serif text-xl font-semibold">{guestCount} Covers</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Menu Item Component
const MenuItemCard: React.FC<{ item: MenuItem; courseType: string }> = ({ item, courseType }) => {
  const allergenList = Object.entries(item.allergens)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  return (
    <div className="py-8 border-b border-foreground/20 last:border-b-0">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
            {item.name}
          </h3>
          {allergenList.length > 0 && (
            <div className="flex gap-2">
              {allergenList.map((allergen) => (
                <AllergenIcon key={allergen} type={allergen} size="sm" />
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4 text-sm">
          {item.station && (
            <span className="patina-label text-xs bg-foreground text-background px-3 py-1">
              {item.station}
            </span>
          )}
          {item.portionSize && (
            <span className="text-foreground font-medium">{item.portionSize}</span>
          )}
        </div>
      </div>

      <p className="text-foreground text-base md:text-lg leading-relaxed mb-4">
        {item.description}
      </p>

      {(item.cookTime || item.cookingTemperature) && (
        <div className="flex gap-6 text-sm mb-4">
          {item.cookTime && (
            <div>
              <span className="patina-label text-xs">Cook Time:</span>
              <span className="ml-2 text-foreground font-medium">{item.cookTime}</span>
            </div>
          )}
          {item.cookingTemperature && (
            <div>
              <span className="patina-label text-xs">Temperature:</span>
              <span className="ml-2 text-foreground font-medium">{item.cookingTemperature}</span>
            </div>
          )}
        </div>
      )}

      {item.prepInstructions && item.prepInstructions.length > 0 && (
        <div className="pt-4 space-y-3">
          <span className="patina-label text-sm font-semibold text-foreground">Preparation</span>
          <ol className="space-y-2 ml-1">
            {item.prepInstructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-base leading-relaxed">
                <span className="font-serif font-semibold text-lg min-w-[1.5rem]">
                  {index + 1}.
                </span>
                <span className="text-foreground">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {item.scalingNotes && (
        <div className="pt-4 space-y-2">
          <span className="patina-label text-sm font-semibold text-foreground">
            Scaling Notes
          </span>
          <p className="text-foreground text-base leading-relaxed bg-secondary/50 p-4 border-l-2 border-foreground">
            {item.scalingNotes}
          </p>
        </div>
      )}
    </div>
  );
};

// Prep Schedule Component
const PrepSchedule: React.FC<{ tasks: PrepTask[] }> = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return (
      (priorityOrder[a.priority || 'normal'] || 1) - (priorityOrder[b.priority || 'normal'] || 1)
    );
  });

  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Prep Schedule
      </h2>

      <div className="space-y-6">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-4 pb-5 border-b border-foreground/15 ${
              task.priority === 'high'
                ? 'bg-foreground/5 -mx-4 px-4 py-4 border-l-4 border-l-foreground'
                : ''
            }`}
          >
            <div className="pt-1">
              <div className="h-6 w-6 border-2 border-foreground" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="patina-label text-xs font-bold text-foreground bg-foreground/10 px-2 py-1">
                  {task.station}
                </span>
                {task.priority === 'high' && (
                  <span className="patina-label text-xs font-bold text-foreground">
                    ★ PRIORITY
                  </span>
                )}
                {task.timeEstimate && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {task.timeEstimate}
                  </span>
                )}
              </div>

              <span className="font-sans text-lg md:text-xl font-semibold leading-snug block">
                {task.label}
              </span>

              {task.details && (
                <p className="text-base text-muted-foreground leading-relaxed">{task.details}</p>
              )}

              {task.assignee && (
                <span className="text-sm text-muted-foreground font-medium">
                  Assigned: {task.assignee}
                </span>
              )}

              {task.dependencies && task.dependencies.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="patina-label text-xs">Dependencies:</span>
                  <span className="ml-2">{task.dependencies.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Equipment Section Component
const EquipmentSection: React.FC<{ equipment: KitchenBEOData['equipment'] }> = ({ equipment }) => {
  const allEquipment = [
    ...equipment.cooking.map((e) => ({ ...e, type: 'Cooking' })),
    ...equipment.prep.map((e) => ({ ...e, type: 'Prep' })),
    ...equipment.service.map((e) => ({ ...e, type: 'Service' })),
  ];

  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Equipment Allocation
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {allEquipment.map((equipmentGroup, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="patina-label text-base font-semibold text-foreground">
              {equipmentGroup.type} - {equipmentGroup.category}
            </h3>
            <div className="space-y-3">
              {equipmentGroup.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex justify-between items-start py-2 border-b border-foreground/10"
                >
                  <div className="flex-1">
                    <span className="text-base font-medium text-foreground">{item.name}</span>
                    {item.location && (
                      <span className="block text-sm text-muted-foreground mt-1">
                        Location: {item.location}
                      </span>
                    )}
                    {item.notes && (
                      <span className="block text-sm text-muted-foreground mt-1">
                        {item.notes}
                      </span>
                    )}
                  </div>
                  <span className="font-serif text-xl font-semibold text-foreground ml-4">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Staff Assignments Component
const StaffAssignments: React.FC<{ assignments: StaffAssignment[] }> = ({ assignments }) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Kitchen Staff Assignments
      </h2>

      <div className="space-y-8">
        {assignments.map((assignment, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-baseline justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  {assignment.role}
                </h3>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="patina-label text-xs">Station: {assignment.station}</span>
                  {assignment.startTime && (
                    <span className="text-muted-foreground">Start: {assignment.startTime}</span>
                  )}
                </div>
              </div>
              <div className="font-serif text-3xl font-semibold text-foreground">
                {assignment.count}
              </div>
            </div>

            {assignment.responsibilities && assignment.responsibilities.length > 0 && (
              <div className="pl-4 border-l-2 border-foreground/20">
                <span className="patina-label text-xs">Key Responsibilities:</span>
                <ul className="mt-2 space-y-1">
                  {assignment.responsibilities.map((resp, respIdx) => (
                    <li key={respIdx} className="text-base text-foreground">
                      • {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {assignment.members && assignment.members.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {assignment.members.map((member, memberIdx) => (
                  <div key={memberIdx} className="text-sm">
                    <span className="font-medium text-foreground">{member.name}</span>
                    {member.position && (
                      <span className="text-muted-foreground ml-2">({member.position})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Allergen Legend Component
const AllergenLegend: React.FC = () => {
  const allergens = [
    { type: 'gluten', label: 'Gluten' },
    { type: 'dairy', label: 'Dairy' },
    { type: 'nuts', label: 'Tree Nuts' },
    { type: 'shellfish', label: 'Shellfish' },
    { type: 'eggs', label: 'Eggs' },
    { type: 'soy', label: 'Soy' },
    { type: 'fish', label: 'Fish' },
  ];

  return (
    <div className="bg-secondary/50 p-6 border-l-2 border-foreground">
      <h3 className="patina-label text-sm font-semibold text-foreground mb-4">
        Allergen Reference
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allergens.map((allergen) => (
          <div key={allergen.type} className="flex items-center gap-2">
            <AllergenIcon type={allergen.type} size="sm" />
            <span className="text-sm text-foreground">{allergen.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Kitchen BEO Component
export const KitchenBEO: React.FC<{ data: KitchenBEOData }> = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background print:bg-background">
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-foreground text-background border border-foreground transition-all duration-300 hover:bg-background hover:text-foreground print:hidden"
        aria-label="Print Kitchen BEO"
      >
        <span>🖨️</span>
        <span className="patina-label">Print</span>
      </button>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-16 md:px-12 md:py-24 print:p-8 print:max-w-none space-y-16 print:space-y-8">
        {/* Header */}
        <BEOHeader {...data.header} />

        <div className="h-px w-full bg-foreground" />

        {/* Menu Sections */}
        <section className="space-y-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Menu</h2>

          {data.menu.appetizers.length > 0 && (
            <div className="space-y-4">
              <h3 className="patina-label text-base font-semibold text-foreground">Appetizers</h3>
              {data.menu.appetizers.map((item) => (
                <MenuItemCard key={item.id} item={item} courseType="appetizer" />
              ))}
            </div>
          )}

          {data.menu.sides && data.menu.sides.length > 0 && (
            <div className="space-y-4">
              <h3 className="patina-label text-base font-semibold text-foreground">
                Accompaniments
              </h3>
              {data.menu.sides.map((item) => (
                <MenuItemCard key={item.id} item={item} courseType="side" />
              ))}
            </div>
          )}

          {data.menu.mains.length > 0 && (
            <div className="space-y-4">
              <h3 className="patina-label text-base font-semibold text-foreground">Main Course</h3>
              {data.menu.mains.map((item) => (
                <MenuItemCard key={item.id} item={item} courseType="main" />
              ))}
            </div>
          )}

          {data.menu.desserts.length > 0 && (
            <div className="space-y-4">
              <h3 className="patina-label text-base font-semibold text-foreground">Desserts</h3>
              {data.menu.desserts.map((item) => (
                <MenuItemCard key={item.id} item={item} courseType="dessert" />
              ))}
            </div>
          )}
        </section>

        <div className="h-px w-full bg-foreground" />

        {/* Prep Schedule */}
        <PrepSchedule tasks={data.prepSchedule} />

        <div className="h-px w-full bg-foreground" />

        {/* Equipment Allocation */}
        <EquipmentSection equipment={data.equipment} />

        <div className="h-px w-full bg-foreground" />

        {/* Staff Assignments */}
        <StaffAssignments assignments={data.staffAssignments} />

        <div className="h-px w-full bg-foreground" />

        {/* Allergen Legend */}
        <AllergenLegend />

        {/* Special Instructions */}
        {data.specialInstructions && (
          <>
            <div className="h-px w-full bg-foreground" />
            <section className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                Special Instructions
              </h2>
              <div className="bg-secondary/50 p-6 border-l-4 border-foreground">
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {data.specialInstructions}
                </p>
              </div>
            </section>
          </>
        )}

        {/* Dietary Restrictions Summary */}
        {data.dietaryRestrictions && (
          <>
            <div className="h-px w-full bg-foreground" />
            <section className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                Dietary Restrictions Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.dietaryRestrictions.vegetarian && (
                  <div className="text-center p-4 border border-foreground">
                    <div className="font-serif text-3xl font-semibold">
                      {data.dietaryRestrictions.vegetarian}
                    </div>
                    <div className="patina-label text-xs mt-2">Vegetarian</div>
                  </div>
                )}
                {data.dietaryRestrictions.vegan && (
                  <div className="text-center p-4 border border-foreground">
                    <div className="font-serif text-3xl font-semibold">
                      {data.dietaryRestrictions.vegan}
                    </div>
                    <div className="patina-label text-xs mt-2">Vegan</div>
                  </div>
                )}
                {data.dietaryRestrictions.glutenFree && (
                  <div className="text-center p-4 border border-foreground">
                    <div className="font-serif text-3xl font-semibold">
                      {data.dietaryRestrictions.glutenFree}
                    </div>
                    <div className="patina-label text-xs mt-2">Gluten Free</div>
                  </div>
                )}
                {data.dietaryRestrictions.nutAllergy && (
                  <div className="text-center p-4 border border-foreground">
                    <div className="font-serif text-3xl font-semibold">
                      {data.dietaryRestrictions.nutAllergy}
                    </div>
                    <div className="patina-label text-xs mt-2">Nut Allergy</div>
                  </div>
                )}
              </div>
              {data.dietaryRestrictions.other && (
                <p className="text-sm text-muted-foreground mt-4">
                  Other: {data.dietaryRestrictions.other}
                </p>
              )}
            </section>
          </>
        )}

        {/* Print Footer */}
        <footer className="hidden print:block pt-8 border-t border-foreground text-center">
          <p className="patina-label text-muted-foreground">
            Generated {new Date().toLocaleDateString()} • {data.header.beoNumber} • Kitchen BEO
          </p>
        </footer>
      </div>
    </div>
  );
};

export default KitchenBEO;

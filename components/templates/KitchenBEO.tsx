import React from 'react';
import { Printer, ChefHat, Clock, Users, Package } from 'lucide-react';

// Type Definitions
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
  guests: {
    total: number;
    breakdown: Array<{
      type: string;
      count: number;
      color: 'appetizer' | 'main' | 'dessert' | 'default';
    }>;
    dietary: {
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
  prepSchedule: PrepTask[];
  equipmentAllocation: EquipmentCategory[];
  staffAssignments: StaffAssignment[];
  specialInstructions?: string;
  allergenNotes?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  allergens: AllergenType[];
  portionSize?: string;
  cookTime?: string;
  cookTemp?: string;
  prepInstructions: string[];
  scalingNotes?: string;
  station?: string;
  platingInstructions?: string[];
  holdingTemp?: string;
  shelfLife?: string;
}

export type AllergenType = 'gluten' | 'dairy' | 'nuts' | 'shellfish' | 'eggs' | 'soy' | 'fish';

export interface PrepTask {
  id: string;
  label: string;
  station: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeEstimate: string;
  assignee?: string;
  details?: string;
  dependencies?: string[];
  completed?: boolean;
}

export interface EquipmentCategory {
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    station: string;
    notes?: string;
  }>;
}

export interface StaffAssignment {
  role: string;
  count: number;
  station: string;
  shiftStart: string;
  shiftEnd: string;
  responsibilities: string[];
  members?: Array<{
    name: string;
    position?: string;
  }>;
}

interface KitchenBEOProps {
  data: KitchenBEOData;
  onPrint?: () => void;
}

export const KitchenBEO: React.FC<KitchenBEOProps> = ({ data, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Print Button - Hidden on print */}
      <button
        onClick={handlePrint}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-foreground text-background border border-foreground transition-all duration-300 hover:bg-background hover:text-foreground print:hidden"
        aria-label="Print Kitchen BEO"
      >
        <Printer className="w-4 h-4" />
        <span className="font-sans text-xs uppercase tracking-widest">Print</span>
      </button>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-16 md:px-12 md:py-24 print:p-8 print:max-w-none space-y-16 print:space-y-8">
        
        {/* Header Section */}
        <KitchenBEOHeader {...data.header} />

        <div className="h-px w-full bg-foreground" />

        {/* Kitchen Badge */}
        <div className="flex items-center gap-3 bg-foreground text-background px-6 py-4 print:px-4 print:py-3">
          <ChefHat className="w-6 h-6" />
          <span className="font-sans text-sm uppercase tracking-widest font-semibold">
            Kitchen Production Sheet
          </span>
        </div>

        {/* Guest Count & Dietary Requirements */}
        <KitchenGuestSection guests={data.guests} />

        <div className="h-px w-full bg-foreground" />

        {/* Prep Schedule */}
        <PrepScheduleSection tasks={data.prepSchedule} />

        <div className="h-px w-full bg-foreground" />

        {/* Menu Sections */}
        <section className="space-y-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight flex items-center gap-3">
            <ChefHat className="w-8 h-8" />
            Production Menu
          </h2>
          
          {data.menu.appetizers.length > 0 && (
            <KitchenCourseSection 
              course="appetizer" 
              title="Appetizers" 
              items={data.menu.appetizers} 
            />
          )}
          
          {data.menu.mains.length > 0 && (
            <KitchenCourseSection 
              course="main" 
              title="Main Courses" 
              items={data.menu.mains} 
            />
          )}
          
          {data.menu.sides && data.menu.sides.length > 0 && (
            <KitchenCourseSection 
              course="default" 
              title="Sides & Accompaniments" 
              items={data.menu.sides} 
            />
          )}
          
          {data.menu.desserts.length > 0 && (
            <KitchenCourseSection 
              course="dessert" 
              title="Desserts" 
              items={data.menu.desserts} 
            />
          )}
        </section>

        <div className="h-px w-full bg-foreground" />

        {/* Equipment Allocation */}
        <EquipmentAllocationSection equipment={data.equipmentAllocation} />

        <div className="h-px w-full bg-foreground" />

        {/* Staff Assignments */}
        <KitchenStaffSection assignments={data.staffAssignments} />

        <div className="h-px w-full bg-foreground" />

        {/* Allergen Information */}
        {data.allergenNotes && data.allergenNotes.length > 0 && (
          <>
            <AllergenNotesSection notes={data.allergenNotes} />
            <div className="h-px w-full bg-foreground" />
          </>
        )}

        {/* Special Instructions */}
        {data.specialInstructions && (
          <>
            <SpecialInstructionsSection instructions={data.specialInstructions} />
            <div className="h-px w-full bg-foreground" />
          </>
        )}

        {/* Allergen Legend */}
        <AllergenLegend />

        {/* Print Footer */}
        <footer className="hidden print:block pt-8 border-t border-foreground/10 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Generated {new Date().toLocaleDateString()} • {data.header.beoNumber} • Kitchen Production
          </p>
        </footer>
      </div>
    </div>
  );
};

// Sub-components

const KitchenBEOHeader: React.FC<KitchenBEOData['header']> = ({
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
              <span className="text-xs uppercase tracking-wider">Logo</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            BEO Number
          </div>
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
            <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Date
            </span>
            <span className="font-serif text-xl">{eventDate}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Time
            </span>
            <span className="font-serif text-xl">{eventTime}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Venue
            </span>
            <span className="font-serif text-xl">{venue}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Guest Count
            </span>
            <span className="font-serif text-xl">{guestCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const KitchenGuestSection: React.FC<{ guests: KitchenBEOData['guests'] }> = ({ guests }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Guest Count & Requirements
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Total Guests
          </div>
          <div className="font-serif text-5xl font-light">{guests.total}</div>
        </div>

        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Meal Breakdown
          </div>
          {guests.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-foreground/20 pb-2">
              <span className="font-sans font-medium">{item.type}</span>
              <span className="font-serif text-2xl font-light">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {guests.dietary && Object.keys(guests.dietary).length > 0 && (
        <div className="mt-8 p-6 bg-foreground/5 border-l-4 border-foreground">
          <div className="text-xs uppercase tracking-wider font-semibold mb-4">
            Dietary Requirements
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(guests.dietary).map(([key, value]) => 
              value ? (
                <div key={key} className="flex justify-between">
                  <span className="font-sans text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-serif font-medium">{value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const PrepScheduleSection: React.FC<{ tasks: PrepTask[] }> = ({ tasks }) => {
  const criticalTasks = tasks.filter(t => t.priority === 'critical');
  const regularTasks = tasks.filter(t => t.priority !== 'critical');

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Prep Schedule
        </h2>
      </div>

      {criticalTasks.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider font-semibold text-foreground flex items-center gap-2">
            ⚠️ Critical Tasks
          </div>
          {criticalTasks.map(task => (
            <PrepTaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {regularTasks.map(task => (
          <PrepTaskItem key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
};

const PrepTaskItem: React.FC<{ task: PrepTask }> = ({ task }) => {
  const priorityColor = {
    critical: 'border-l-4 border-l-foreground bg-foreground/5',
    high: 'border-l-2 border-l-foreground/60',
    medium: 'border-l border-l-foreground/30',
    low: 'border-l border-l-foreground/20',
  };

  return (
    <div className={`flex items-start gap-4 pb-5 border-b border-foreground/15 ${priorityColor[task.priority]} -mx-4 px-4 py-4`}>
      <div className="print:block pt-1">
        <div className={`h-6 w-6 border-2 border-foreground ${task.completed ? 'bg-foreground' : ''}`} />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-wider font-bold bg-foreground/10 px-2 py-1">
            {task.station}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {task.timeEstimate}
          </span>
          {task.assignee && (
            <span className="text-sm text-muted-foreground">
              • {task.assignee}
            </span>
          )}
        </div>
        
        <span className="font-sans text-lg md:text-xl font-semibold leading-snug block">
          {task.label}
        </span>
        
        {task.details && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {task.details}
          </p>
        )}

        {task.dependencies && task.dependencies.length > 0 && (
          <div className="text-sm text-muted-foreground italic">
            Depends on: {task.dependencies.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

const KitchenCourseSection: React.FC<{
  course: string;
  title: string;
  items: MenuItem[];
}> = ({ course, title, items }) => {
  return (
    <div className="space-y-8">
      <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight border-b-2 border-foreground pb-3">
        {title}
      </h3>
      <div className="space-y-8">
        {items.map(item => (
          <KitchenMenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const KitchenMenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  return (
    <div className="flex items-start gap-6 py-6 border-b border-foreground/20">
      <div className="hidden print:block pt-2">
        <div className="h-6 w-6 border-2 border-foreground" />
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
              {item.name}
            </span>
            {item.allergens.length > 0 && (
              <div className="flex gap-2">
                {item.allergens.map((allergen) => (
                  <AllergenBadge key={allergen} allergen={allergen} />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-4 text-sm font-sans">
            {item.station && (
              <span className="text-xs uppercase tracking-wider bg-foreground/10 px-2 py-1">
                {item.station}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-base leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {/* Cooking Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {item.portionSize && (
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                Portion
              </span>
              <span className="font-medium">{item.portionSize}</span>
            </div>
          )}
          {item.cookTime && (
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                Cook Time
              </span>
              <span className="font-medium">{item.cookTime}</span>
            </div>
          )}
          {item.cookTemp && (
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                Temperature
              </span>
              <span className="font-medium">{item.cookTemp}</span>
            </div>
          )}
          {item.holdingTemp && (
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                Holding Temp
              </span>
              <span className="font-medium">{item.holdingTemp}</span>
            </div>
          )}
        </div>
        
        {/* Prep Instructions */}
        {item.prepInstructions.length > 0 && (
          <div className="pt-4 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Preparation
            </span>
            <ol className="space-y-2 ml-1">
              {item.prepInstructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-base leading-relaxed">
                  <span className="font-serif font-semibold text-lg min-w-[1.5rem]">
                    {index + 1}.
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Plating Instructions */}
        {item.platingInstructions && item.platingInstructions.length > 0 && (
          <div className="pt-4 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Plating
            </span>
            <ol className="space-y-2 ml-1">
              {item.platingInstructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-base leading-relaxed">
                  <span className="font-serif font-semibold text-lg min-w-[1.5rem]">
                    {index + 1}.
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {/* Scaling Notes */}
        {item.scalingNotes && (
          <div className="pt-4 space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Scaling Notes
            </span>
            <p className="text-base leading-relaxed bg-secondary/50 p-4 border-l-2 border-foreground">
              {item.scalingNotes}
            </p>
          </div>
        )}

        {item.shelfLife && (
          <div className="text-sm text-muted-foreground italic">
            Shelf Life: {item.shelfLife}
          </div>
        )}
      </div>
    </div>
  );
};

const EquipmentAllocationSection: React.FC<{ equipment: EquipmentCategory[] }> = ({ equipment }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Package className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Equipment Allocation
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {equipment.map((category, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold border-b border-foreground/30 pb-2">
              {category.category}
            </h3>
            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-start gap-4 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.station}</div>
                    {item.notes && (
                      <div className="text-xs text-muted-foreground italic mt-1">
                        {item.notes}
                      </div>
                    )}
                  </div>
                  <span className="font-serif text-lg font-medium whitespace-nowrap">
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

const KitchenStaffSection: React.FC<{ assignments: StaffAssignment[] }> = ({ assignments }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Staff Assignments
        </h2>
      </div>

      <div className="space-y-6">
        {assignments.map((assignment, index) => (
          <div key={index} className="border-b border-foreground/20 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-sans text-xl font-semibold">{assignment.role}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  {assignment.station} • {assignment.shiftStart} - {assignment.shiftEnd}
                </div>
              </div>
              <span className="font-serif text-2xl font-light">
                {assignment.count} {assignment.count === 1 ? 'person' : 'people'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider font-semibold">
                Responsibilities
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {assignment.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </div>

            {assignment.members && assignment.members.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs uppercase tracking-wider font-semibold">
                  Assigned Staff
                </div>
                <div className="flex flex-wrap gap-3">
                  {assignment.members.map((member, memberIndex) => (
                    <div key={memberIndex} className="bg-foreground/10 px-3 py-1 text-sm">
                      {member.name}
                      {member.position && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({member.position})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const AllergenNotesSection: React.FC<{ notes: string[] }> = ({ notes }) => {
  return (
    <section className="space-y-6 bg-red-50 p-6 border-l-4 border-red-600">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-red-900">
          Critical Allergen Information
        </h2>
      </div>
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div key={index} className="text-base leading-relaxed font-medium text-red-900">
            • {note}
          </div>
        ))}
      </div>
    </section>
  );
};

const SpecialInstructionsSection: React.FC<{ instructions: string }> = ({ instructions }) => {
  return (
    <section className="space-y-6">
      <h2 className="font-serif text-2xl md:text-3xl font-medium">
        Special Instructions
      </h2>
      <div className="prose max-w-none text-base leading-relaxed whitespace-pre-line">
        {instructions}
      </div>
    </section>
  );
};

const AllergenBadge: React.FC<{ allergen: AllergenType }> = ({ allergen }) => {
  const allergenInfo = {
    gluten: { label: 'G', title: 'Gluten' },
    dairy: { label: 'D', title: 'Dairy' },
    nuts: { label: 'N', title: 'Nuts' },
    shellfish: { label: 'SF', title: 'Shellfish' },
    eggs: { label: 'E', title: 'Eggs' },
    soy: { label: 'S', title: 'Soy' },
    fish: { label: 'F', title: 'Fish' },
  };

  const info = allergenInfo[allergen];

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 border-2 border-foreground text-xs font-bold"
      title={info.title}
    >
      {info.label}
    </span>
  );
};

const AllergenLegend: React.FC = () => {
  return (
    <section className="space-y-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold">
        Allergen Legend
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { type: 'gluten' as AllergenType, name: 'Gluten' },
          { type: 'dairy' as AllergenType, name: 'Dairy' },
          { type: 'nuts' as AllergenType, name: 'Nuts' },
          { type: 'shellfish' as AllergenType, name: 'Shellfish' },
          { type: 'eggs' as AllergenType, name: 'Eggs' },
          { type: 'soy' as AllergenType, name: 'Soy' },
          { type: 'fish' as AllergenType, name: 'Fish' },
        ].map((allergen) => (
          <div key={allergen.type} className="flex items-center gap-3">
            <AllergenBadge allergen={allergen.type} />
            <span className="text-sm">{allergen.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KitchenBEO;

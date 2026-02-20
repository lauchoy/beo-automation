import React from 'react';
import { Printer, Clock, Users, MapPin, Utensils, Wine, Music } from 'lucide-react';

// Type Definitions
export interface ServiceBEOData {
  header: {
    beoNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    clientName: string;
    venue: string;
    logoUrl?: string;
  };
  timeline: TimelineEvent[];
  floorPlan: {
    totalTables: number;
    totalSeats: number;
    layout: string;
    specialArrangements?: string[];
  };
  staffPositioning: StaffPosition[];
  guestManagement: {
    totalGuests: number;
    expectedArrival: string;
    cocktailHour: boolean;
    seatingStyle: 'plated' | 'buffet' | 'family-style' | 'stations';
    specialNeeds: SpecialNeed[];
  };
  serviceFlow: ServiceStep[];
  equipmentSetup: SetupCategory[];
  barService?: BarService;
  vendorCoordination?: VendorInfo[];
  emergencyContacts: EmergencyContact[];
  specialInstructions?: string;
}

export interface TimelineEvent {
  time: string;
  label: string;
  sublabel?: string;
  type: 'setup' | 'service' | 'breakdown' | 'coordination';
  responsible?: string;
  notes?: string;
}

export interface StaffPosition {
  role: string;
  count: number;
  location: string;
  shiftStart: string;
  shiftEnd: string;
  responsibilities: string[];
  uniform?: string;
  members?: Array<{
    name: string;
    position?: string;
    section?: string;
  }>;
}

export interface SpecialNeed {
  tableNumber?: string;
  guestName?: string;
  requirement: string;
  priority: 'critical' | 'important' | 'note';
}

export interface ServiceStep {
  time: string;
  step: string;
  details: string;
  staffInvolved: string[];
  duration?: string;
}

export interface SetupCategory {
  category: string;
  location: string;
  items: Array<{
    item: string;
    quantity: number;
    setupTime?: string;
    notes?: string;
  }>;
}

export interface BarService {
  type: 'full-bar' | 'beer-wine' | 'signature-cocktails' | 'no-bar';
  bartenders: number;
  locations: string[];
  specialRequests?: string[];
  lastCall?: string;
}

export interface VendorInfo {
  vendorName: string;
  contact: string;
  arrivalTime: string;
  setupArea: string;
  requirements: string[];
  pointOfContact: string;
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  onSite: boolean;
}

interface ServiceBEOProps {
  data: ServiceBEOData;
  onPrint?: () => void;
}

export const ServiceBEO: React.FC<ServiceBEOProps> = ({ data, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-foreground text-background border border-foreground transition-all duration-300 hover:bg-background hover:text-foreground print:hidden"
        aria-label="Print Service BEO"
      >
        <Printer className="w-4 h-4" />
        <span className="font-sans text-xs uppercase tracking-widest">Print</span>
      </button>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-16 md:px-12 md:py-24 print:p-8 print:max-w-none space-y-16 print:space-y-8">
        
        {/* Header */}
        <ServiceBEOHeader {...data.header} />

        <div className="h-px w-full bg-foreground" />

        {/* Service Badge */}
        <div className="flex items-center gap-3 bg-foreground text-background px-6 py-4 print:px-4 print:py-3">
          <Utensils className="w-6 h-6" />
          <span className="font-sans text-sm uppercase tracking-widest font-semibold">
            Front of House Service Plan
          </span>
        </div>

        {/* Service Timeline */}
        <ServiceTimelineSection events={data.timeline} />

        <div className="h-px w-full bg-foreground" />

        {/* Floor Plan Overview */}
        <FloorPlanSection floorPlan={data.floorPlan} />

        <div className="h-px w-full bg-foreground" />

        {/* Guest Management */}
        <GuestManagementSection guestManagement={data.guestManagement} />

        <div className="h-px w-full bg-foreground" />

        {/* Staff Positioning */}
        <StaffPositioningSection staff={data.staffPositioning} />

        <div className="h-px w-full bg-foreground" />

        {/* Service Flow */}
        <ServiceFlowSection steps={data.serviceFlow} />

        <div className="h-px w-full bg-foreground" />

        {/* Equipment Setup */}
        <EquipmentSetupSection equipment={data.equipmentSetup} />

        <div className="h-px w-full bg-foreground" />

        {/* Bar Service */}
        {data.barService && (
          <>
            <BarServiceSection barService={data.barService} />
            <div className="h-px w-full bg-foreground" />
          </>
        )}

        {/* Vendor Coordination */}
        {data.vendorCoordination && data.vendorCoordination.length > 0 && (
          <>
            <VendorCoordinationSection vendors={data.vendorCoordination} />
            <div className="h-px w-full bg-foreground" />
          </>
        )}

        {/* Emergency Contacts */}
        <EmergencyContactsSection contacts={data.emergencyContacts} />

        {/* Special Instructions */}
        {data.specialInstructions && (
          <>
            <div className="h-px w-full bg-foreground" />
            <SpecialInstructionsSection instructions={data.specialInstructions} />
          </>
        )}

        {/* Print Footer */}
        <footer className="hidden print:block pt-8 border-t border-foreground/10 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Generated {new Date().toLocaleDateString()} • {data.header.beoNumber} • Service Plan
          </p>
        </footer>
      </div>
    </div>
  );
};

// Sub-components

const ServiceBEOHeader: React.FC<ServiceBEOData['header']> = ({
  beoNumber,
  eventName,
  eventDate,
  eventTime,
  clientName,
  venue,
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
        </div>
      </div>
    </header>
  );
};

const ServiceTimelineSection: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Service Timeline
        </h2>
      </div>

      {/* Visual Timeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start min-w-max gap-0">
          {events.map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center text-center min-w-[160px] px-2">
                <div className="font-serif text-xl md:text-2xl font-medium mb-2">
                  {event.time}
                </div>
                <div className={`w-4 h-4 border-2 border-foreground mb-3 ${
                  event.type === 'service' ? 'bg-foreground' : 'bg-background'
                }`} />
                <div className="text-xs uppercase tracking-wider font-semibold mb-1">
                  {event.label}
                </div>
                {event.sublabel && (
                  <div className="text-xs text-muted-foreground">{event.sublabel}</div>
                )}
                {event.responsible && (
                  <div className="text-xs text-muted-foreground mt-2 italic">
                    {event.responsible}
                  </div>
                )}
              </div>
              
              {index < events.length - 1 && (
                <div className="flex-shrink-0 w-12 h-0.5 bg-foreground/40 mt-12" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Timeline */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold">
          Detailed Schedule
        </h3>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex gap-4 border-l-2 border-foreground/30 pl-4 py-2">
              <span className="font-serif text-lg font-medium min-w-[80px]">
                {event.time}
              </span>
              <div className="flex-1">
                <div className="font-semibold">{event.label}</div>
                {event.sublabel && (
                  <div className="text-sm text-muted-foreground">{event.sublabel}</div>
                )}
                {event.notes && (
                  <div className="text-sm text-muted-foreground mt-1 italic">
                    {event.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FloorPlanSection: React.FC<{ floorPlan: ServiceBEOData['floorPlan'] }> = ({ floorPlan }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <MapPin className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Floor Plan & Layout
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Total Tables
          </div>
          <div className="font-serif text-4xl font-light">{floorPlan.totalTables}</div>
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Total Seats
          </div>
          <div className="font-serif text-4xl font-light">{floorPlan.totalSeats}</div>
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Layout Style
          </div>
          <div className="font-sans text-lg font-medium">{floorPlan.layout}</div>
        </div>
      </div>

      {floorPlan.specialArrangements && floorPlan.specialArrangements.length > 0 && (
        <div className="mt-6 p-4 bg-foreground/5 border-l-4 border-foreground">
          <div className="text-xs uppercase tracking-wider font-semibold mb-3">
            Special Arrangements
          </div>
          <ul className="space-y-2">
            {floorPlan.specialArrangements.map((arrangement, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{arrangement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

const GuestManagementSection: React.FC<{ guestManagement: ServiceBEOData['guestManagement'] }> = ({ 
  guestManagement 
}) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Guest Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Total Guests
            </div>
            <div className="font-serif text-5xl font-light">{guestManagement.totalGuests}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Expected Arrival
            </div>
            <div className="font-serif text-2xl font-light">{guestManagement.expectedArrival}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Service Style:
            </span>
            <span className="font-sans font-semibold capitalize">
              {guestManagement.seatingStyle.replace('-', ' ')}
            </span>
          </div>
          {guestManagement.cocktailHour && (
            <div className="bg-foreground/10 px-4 py-2 text-sm">
              ✓ Cocktail Hour Included
            </div>
          )}
        </div>
      </div>

      {guestManagement.specialNeeds.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-wider font-semibold mb-4">
            Special Needs & Requirements
          </h3>
          <div className="space-y-3">
            {guestManagement.specialNeeds.map((need, index) => (
              <div 
                key={index} 
                className={`p-4 border-l-4 ${
                  need.priority === 'critical' 
                    ? 'border-red-600 bg-red-50' 
                    : need.priority === 'important'
                    ? 'border-yellow-600 bg-yellow-50'
                    : 'border-foreground/30 bg-foreground/5'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {need.tableNumber && (
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Table {need.tableNumber}
                      </span>
                    )}
                    {need.guestName && (
                      <span className="text-sm font-medium ml-2">
                        • {need.guestName}
                      </span>
                    )}
                    <div className="mt-2 text-sm">{need.requirement}</div>
                  </div>
                  {need.priority === 'critical' && (
                    <span className="text-xs uppercase tracking-wider font-bold text-red-600">
                      Critical
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const StaffPositioningSection: React.FC<{ staff: StaffPosition[] }> = ({ staff }) => {
  const totalStaff = staff.reduce((sum, position) => sum + position.count, 0);

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" />
          <h2 className="font-serif text-2xl md:text-3xl font-medium">
            Staff Positioning
          </h2>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Total Staff
          </div>
          <div className="font-serif text-3xl font-light">{totalStaff}</div>
        </div>
      </div>

      <div className="space-y-6">
        {staff.map((position, index) => (
          <div key={index} className="border-b border-foreground/20 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-sans text-xl font-semibold">{position.role}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  {position.location} • {position.shiftStart} - {position.shiftEnd}
                </div>
                {position.uniform && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Uniform: {position.uniform}
                  </div>
                )}
              </div>
              <span className="font-serif text-2xl font-light">
                {position.count}
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider font-semibold">
                Responsibilities
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {position.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </div>

            {position.members && position.members.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider font-semibold mb-3">
                  Assigned Staff
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {position.members.map((member, memberIndex) => (
                    <div key={memberIndex} className="bg-foreground/10 px-3 py-2 text-sm">
                      <div className="font-medium">{member.name}</div>
                      {member.section && (
                        <div className="text-xs text-muted-foreground">{member.section}</div>
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

const ServiceFlowSection: React.FC<{ steps: ServiceStep[] }> = ({ steps }) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-2xl md:text-3xl font-medium">
        Service Flow
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="border-l-4 border-foreground/30 pl-6 py-4">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="font-serif text-xl font-medium">{step.time}</div>
              {step.duration && (
                <div className="text-sm text-muted-foreground">
                  Duration: {step.duration}
                </div>
              )}
            </div>
            <h3 className="font-sans text-lg font-semibold mb-2">{step.step}</h3>
            <p className="text-base text-muted-foreground mb-3">{step.details}</p>
            <div className="flex flex-wrap gap-2">
              {step.staffInvolved.map((staff, staffIndex) => (
                <span key={staffIndex} className="text-xs bg-foreground/10 px-2 py-1">
                  {staff}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const EquipmentSetupSection: React.FC<{ equipment: SetupCategory[] }> = ({ equipment }) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-2xl md:text-3xl font-medium">
        Equipment Setup
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {equipment.map((category, index) => (
          <div key={index} className="space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold border-b border-foreground/30 pb-2">
                {category.category}
              </h3>
              <div className="text-xs text-muted-foreground mt-1">{category.location}</div>
            </div>
            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.item}</div>
                    {item.setupTime && (
                      <div className="text-xs text-muted-foreground">
                        Setup: {item.setupTime}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-xs text-muted-foreground italic mt-1">
                        {item.notes}
                      </div>
                    )}
                  </div>
                  <span className="font-serif text-lg font-medium">
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

const BarServiceSection: React.FC<{ barService: BarService }> = ({ barService }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Wine className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Bar Service
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Service Type
            </div>
            <div className="font-sans text-lg font-medium capitalize">
              {barService.type.replace('-', ' ')}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Bartenders
            </div>
            <div className="font-serif text-3xl font-light">{barService.bartenders}</div>
          </div>
          {barService.lastCall && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Last Call
              </div>
              <div className="font-serif text-xl font-medium">{barService.lastCall}</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-3">
              Bar Locations
            </div>
            <ul className="space-y-2">
              {barService.locations.map((location, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span>•</span>
                  <span>{location}</span>
                </li>
              ))}
            </ul>
          </div>

          {barService.specialRequests && barService.specialRequests.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold mb-3">
                Special Requests
              </div>
              <ul className="space-y-2">
                {barService.specialRequests.map((request, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span>•</span>
                    <span>{request}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const VendorCoordinationSection: React.FC<{ vendors: VendorInfo[] }> = ({ vendors }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Music className="w-6 h-6" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Vendor Coordination
        </h2>
      </div>

      <div className="space-y-6">
        {vendors.map((vendor, index) => (
          <div key={index} className="border border-foreground/20 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-sans text-xl font-semibold">{vendor.vendorName}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  Contact: {vendor.contact}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Arrival
                </div>
                <div className="font-serif text-lg font-medium">{vendor.arrivalTime}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold">
                  Setup Area:
                </span>
                <span className="ml-2 text-sm">{vendor.setupArea}</span>
              </div>
              
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold block mb-2">
                  Requirements
                </span>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {vendor.requirements.map((req, reqIndex) => (
                    <li key={reqIndex}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-foreground/10">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Point of Contact:
                </span>
                <span className="ml-2 text-sm font-medium">{vendor.pointOfContact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const EmergencyContactsSection: React.FC<{ contacts: EmergencyContact[] }> = ({ contacts }) => {
  return (
    <section className="space-y-6 bg-red-50 p-6 border-l-4 border-red-600">
      <h2 className="font-serif text-2xl md:text-3xl font-medium text-red-900">
        Emergency Contacts
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact, index) => (
          <div key={index} className="bg-white p-4 border border-red-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-red-900">{contact.name}</div>
                <div className="text-sm text-red-700">{contact.role}</div>
              </div>
              {contact.onSite && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 uppercase tracking-wider">
                  On-Site
                </span>
              )}
            </div>
            <div className="font-mono text-lg font-bold text-red-900 mt-2">
              {contact.phone}
            </div>
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
      <div className="prose max-w-none text-base leading-relaxed whitespace-pre-line bg-foreground/5 p-6 border-l-4 border-foreground">
        {instructions}
      </div>
    </section>
  );
};

export default ServiceBEO;

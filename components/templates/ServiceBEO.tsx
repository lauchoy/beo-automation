import React from 'react';

// Type Definitions
export interface TimelineEvent {
  time: string;
  label: string;
  sublabel?: string;
  type?: 'setup' | 'service' | 'breakdown';
  notes?: string;
}

export interface StaffPosition {
  role: string;
  count: number;
  station?: string;
  responsibilities?: string[];
  members?: Array<{
    name: string;
    position?: string;
    station?: string;
  }>;
  startTime?: string;
  notes?: string;
}

export interface GuestManagement {
  totalGuests: number;
  vipCount?: number;
  seatingLayout?: string;
  specialSeating?: Array<{
    table: string;
    guests: number;
    notes?: string;
  }>;
  flowPlan?: string;
}

export interface ServiceEquipment {
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    location: string;
    setupTime?: string;
    notes?: string;
  }>;
}

export interface ServiceCoordination {
  contactPerson?: string;
  contactPhone?: string;
  emergencyContacts?: Array<{
    name: string;
    role: string;
    phone: string;
  }>;
  vendorCoordination?: Array<{
    vendor: string;
    contact: string;
    arrivalTime?: string;
    requirements?: string;
  }>;
  criticalNotes?: string[];
}

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
  staffPositions: StaffPosition[];
  guestManagement: GuestManagement;
  equipment: {
    dining: ServiceEquipment[];
    bar: ServiceEquipment[];
    decor: ServiceEquipment[];
  };
  coordination: ServiceCoordination;
  floorPlan?: string; // URL to floor plan image
  serviceNotes?: string;
}

// BEO Header Component
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
              <span className="patina-label">SERVICE</span>
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
        </div>
      </div>
    </header>
  );
};

// Service Timeline Component
const ServiceTimeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Service Timeline
      </h2>

      {/* Horizontal Timeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start min-w-max">
          {events.map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center text-center min-w-[140px]">
                <div className="font-serif text-2xl md:text-3xl font-medium mb-2">
                  {event.time}
                </div>
                <div
                  className={`w-4 h-4 border-2 border-foreground mb-3 ${
                    event.type === 'service' ? 'bg-foreground' : 'bg-background'
                  }`}
                />
                <div className="patina-label text-sm md:text-base font-semibold text-foreground mb-1">
                  {event.label}
                </div>
                {event.sublabel && (
                  <div className="text-sm text-muted-foreground font-medium">{event.sublabel}</div>
                )}
                {event.notes && (
                  <div className="text-xs text-muted-foreground mt-2 max-w-[120px]">
                    {event.notes}
                  </div>
                )}
              </div>

              {index < events.length - 1 && (
                <div className="flex-shrink-0 w-16 md:w-24 h-0.5 bg-foreground/40 mt-[2.5rem]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference List */}
      <div className="mt-10 pt-8 border-t border-foreground/20">
        <div className="patina-label text-sm font-semibold text-foreground mb-6">
          Quick Reference
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={index} className="flex items-baseline gap-4">
              <span className="font-serif text-xl md:text-2xl font-medium">{event.time}</span>
              <span className="text-base text-foreground font-medium">{event.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Staff Positioning Component
const StaffPositioning: React.FC<{ positions: StaffPosition[] }> = ({ positions }) => {
  const totalStaff = positions.reduce((sum, pos) => sum + pos.count, 0);

  return (
    <section className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
          Staff Positioning
        </h2>
        <div className="text-right">
          <div className="patina-label text-xs text-muted-foreground mb-1">Total Staff</div>
          <div className="font-serif text-3xl font-semibold text-foreground">{totalStaff}</div>
        </div>
      </div>

      <div className="space-y-8">
        {positions.map((position, idx) => (
          <div key={idx} className="border-b border-foreground/20 pb-6 last:border-b-0">
            <div className="flex items-baseline justify-between flex-wrap gap-4 mb-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  {position.role}
                </h3>
                <div className="flex gap-4 mt-2 text-sm">
                  {position.station && (
                    <span className="patina-label text-xs">Station: {position.station}</span>
                  )}
                  {position.startTime && (
                    <span className="text-muted-foreground">Report: {position.startTime}</span>
                  )}
                </div>
              </div>
              <div className="font-serif text-3xl font-semibold text-foreground">
                {position.count}
              </div>
            </div>

            {position.responsibilities && position.responsibilities.length > 0 && (
              <div className="pl-4 border-l-2 border-foreground/20 mb-4">
                <span className="patina-label text-xs">Key Responsibilities:</span>
                <ul className="mt-2 space-y-1">
                  {position.responsibilities.map((resp, respIdx) => (
                    <li key={respIdx} className="text-base text-foreground">
                      • {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {position.members && position.members.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {position.members.map((member, memberIdx) => (
                  <div key={memberIdx} className="text-sm border-b border-foreground/10 pb-2">
                    <span className="font-medium text-foreground">{member.name}</span>
                    {member.station && (
                      <span className="block text-xs text-muted-foreground mt-1">
                        {member.station}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {position.notes && (
              <div className="mt-4 text-sm text-muted-foreground bg-secondary/30 p-3 border-l-2 border-foreground/30">
                {position.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Guest Management Component
const GuestManagementSection: React.FC<{ management: GuestManagement }> = ({ management }) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Guest Management
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Guest Count */}
        <div className="space-y-4">
          <div className="text-center p-8 border-2 border-foreground">
            <div className="font-serif text-5xl md:text-6xl font-semibold text-foreground">
              {management.totalGuests}
            </div>
            <div className="patina-label text-sm mt-3">Total Guests</div>
          </div>
          {management.vipCount && management.vipCount > 0 && (
            <div className="text-center p-4 border border-foreground/50">
              <div className="font-serif text-3xl font-semibold text-foreground">
                {management.vipCount}
              </div>
              <div className="patina-label text-xs mt-2">VIP Guests</div>
            </div>
          )}
        </div>

        {/* Seating Layout */}
        <div className="space-y-4">
          {management.seatingLayout && (
            <div>
              <span className="patina-label text-sm font-semibold text-foreground block mb-2">
                Seating Layout
              </span>
              <p className="text-base text-foreground leading-relaxed">
                {management.seatingLayout}
              </p>
            </div>
          )}
          {management.flowPlan && (
            <div>
              <span className="patina-label text-sm font-semibold text-foreground block mb-2">
                Guest Flow Plan
              </span>
              <p className="text-base text-foreground leading-relaxed">{management.flowPlan}</p>
            </div>
          )}
        </div>
      </div>

      {/* Special Seating */}
      {management.specialSeating && management.specialSeating.length > 0 && (
        <div className="mt-8">
          <span className="patina-label text-sm font-semibold text-foreground block mb-4">
            Special Seating Arrangements
          </span>
          <div className="grid md:grid-cols-2 gap-4">
            {management.specialSeating.map((seating, idx) => (
              <div
                key={idx}
                className="p-4 border border-foreground/30 bg-secondary/30 space-y-2"
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-xl font-semibold">{seating.table}</span>
                  <span className="text-sm text-muted-foreground">{seating.guests} guests</span>
                </div>
                {seating.notes && (
                  <p className="text-sm text-foreground leading-relaxed">{seating.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// Equipment Setup Component
const EquipmentSetup: React.FC<{ equipment: ServiceBEOData['equipment'] }> = ({ equipment }) => {
  const allEquipment = [
    ...equipment.dining.map((e) => ({ ...e, type: 'Dining' })),
    ...equipment.bar.map((e) => ({ ...e, type: 'Bar' })),
    ...equipment.decor.map((e) => ({ ...e, type: 'Decor' })),
  ];

  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Equipment Setup
      </h2>

      <div className="space-y-8">
        {allEquipment.map((equipmentGroup, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="patina-label text-base font-semibold text-foreground">
              {equipmentGroup.type} - {equipmentGroup.category}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {equipmentGroup.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex justify-between items-start p-4 border border-foreground/20"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-base font-medium text-foreground">{item.name}</span>
                      <span className="font-serif text-xl font-semibold text-foreground ml-4">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Location: {item.location}</div>
                      {item.setupTime && <div>Setup: {item.setupTime}</div>}
                      {item.notes && <div className="text-foreground mt-2">{item.notes}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Service Coordination Component
const ServiceCoordinationSection: React.FC<{ coordination: ServiceCoordination }> = ({
  coordination,
}) => {
  return (
    <section className="space-y-8">
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
        Service Coordination
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Primary Contact */}
        {coordination.contactPerson && (
          <div className="p-6 bg-secondary/50 border-l-4 border-foreground">
            <span className="patina-label text-xs font-semibold text-foreground block mb-3">
              Primary Contact
            </span>
            <div className="space-y-2">
              <div className="text-xl font-semibold text-foreground">
                {coordination.contactPerson}
              </div>
              {coordination.contactPhone && (
                <div className="text-base text-foreground">{coordination.contactPhone}</div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        {coordination.emergencyContacts && coordination.emergencyContacts.length > 0 && (
          <div className="p-6 bg-secondary/50 border-l-4 border-foreground">
            <span className="patina-label text-xs font-semibold text-foreground block mb-3">
              Emergency Contacts
            </span>
            <div className="space-y-3">
              {coordination.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-semibold text-foreground">{contact.name}</div>
                  <div className="text-muted-foreground">{contact.role}</div>
                  <div className="text-foreground">{contact.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vendor Coordination */}
      {coordination.vendorCoordination && coordination.vendorCoordination.length > 0 && (
        <div className="mt-8">
          <span className="patina-label text-sm font-semibold text-foreground block mb-4">
            Vendor Coordination
          </span>
          <div className="space-y-4">
            {coordination.vendorCoordination.map((vendor, idx) => (
              <div key={idx} className="p-4 border border-foreground/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-serif text-xl font-medium">{vendor.vendor}</div>
                  {vendor.arrivalTime && (
                    <div className="text-sm text-muted-foreground">
                      Arrival: {vendor.arrivalTime}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-2">Contact: {vendor.contact}</div>
                {vendor.requirements && (
                  <div className="text-sm text-foreground mt-2 pl-4 border-l-2 border-foreground/20">
                    {vendor.requirements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Notes */}
      {coordination.criticalNotes && coordination.criticalNotes.length > 0 && (
        <div className="mt-8 p-6 bg-foreground/5 border-l-4 border-foreground">
          <span className="patina-label text-sm font-semibold text-foreground block mb-4">
            ⚠️ Critical Service Notes
          </span>
          <ul className="space-y-2">
            {coordination.criticalNotes.map((note, idx) => (
              <li key={idx} className="text-base text-foreground leading-relaxed">
                • {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

// Main Service BEO Component
export const ServiceBEO: React.FC<{ data: ServiceBEOData }> = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background print:bg-background">
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-foreground text-background border border-foreground transition-all duration-300 hover:bg-background hover:text-foreground print:hidden"
        aria-label="Print Service BEO"
      >
        <span>🖨️</span>
        <span className="patina-label">Print</span>
      </button>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-16 md:px-12 md:py-24 print:p-8 print:max-w-none space-y-16 print:space-y-8">
        {/* Header */}
        <ServiceBEOHeader {...data.header} />

        <div className="h-px w-full bg-foreground" />

        {/* Service Timeline */}
        <ServiceTimeline events={data.timeline} />

        <div className="h-px w-full bg-foreground" />

        {/* Staff Positioning */}
        <StaffPositioning positions={data.staffPositions} />

        <div className="h-px w-full bg-foreground" />

        {/* Guest Management */}
        <GuestManagementSection management={data.guestManagement} />

        <div className="h-px w-full bg-foreground" />

        {/* Equipment Setup */}
        <EquipmentSetup equipment={data.equipment} />

        <div className="h-px w-full bg-foreground" />

        {/* Service Coordination */}
        <ServiceCoordinationSection coordination={data.coordination} />

        {/* Floor Plan */}
        {data.floorPlan && (
          <>
            <div className="h-px w-full bg-foreground" />
            <section className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                Floor Plan
              </h2>
              <div className="border-2 border-foreground p-4">
                <img
                  src={data.floorPlan}
                  alt="Floor Plan"
                  className="w-full h-auto"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
              </div>
            </section>
          </>
        )}

        {/* Service Notes */}
        {data.serviceNotes && (
          <>
            <div className="h-px w-full bg-foreground" />
            <section className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                Service Notes
              </h2>
              <div className="bg-secondary/50 p-6 border-l-4 border-foreground">
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {data.serviceNotes}
                </p>
              </div>
            </section>
          </>
        )}

        {/* Print Footer */}
        <footer className="hidden print:block pt-8 border-t border-foreground text-center">
          <p className="patina-label text-muted-foreground">
            Generated {new Date().toLocaleDateString()} • {data.header.beoNumber} • Service BEO
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ServiceBEO;

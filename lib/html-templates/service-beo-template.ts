/**
 * Service BEO HTML Template Generator
 * 
 * Generates HTML for Service BEO documents without using React rendering.
 * This approach is fully compatible with Next.js 14 and Vercel deployment.
 */

import type { ServiceBEOData, TimelineEvent, StaffPosition } from '@/components/templates/types';

/**
 * Generate timeline event HTML
 */
function generateTimelineEvent(event: TimelineEvent, index: number): string {
  const typeStyles = {
    setup: 'bg-blue-50 border-blue-600',
    service: 'bg-green-50 border-green-600',
    breakdown: 'bg-orange-50 border-orange-600',
  };

  const style = event.type ? typeStyles[event.type] : 'bg-foreground/5 border-foreground';

  return `
    <div class="flex gap-6 items-start">
      <div class="flex-shrink-0 w-24 text-right">
        <span class="font-serif text-xl font-medium">${event.time}</span>
      </div>
      <div class="flex-1">
        <div class="${style} border-l-4 p-4 space-y-2">
          <div class="font-sans font-semibold text-lg">${event.label}</div>
          ${event.sublabel ? `<div class="text-sm text-muted-foreground">${event.sublabel}</div>` : ''}
          ${event.notes ? `<div class="text-sm leading-relaxed mt-2">${event.notes}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate complete Service BEO HTML
 */
export function generateServiceBEOHTML(data: ServiceBEOData): string {
  const currentDate = new Date().toLocaleDateString();

  const vendorCoordinationHtml = data.coordination?.vendorCoordination?.length
    ? `
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider font-semibold">Vendor Coordination</h3>
        ${data.coordination.vendorCoordination.map(vendor => `
          <div class="border-b border-foreground/15 pb-3">
            <div class="font-semibold">${vendor.vendor}</div>
            <div class="text-sm text-muted-foreground">Contact: ${vendor.contact}</div>
            ${vendor.arrivalTime ? `<div class="text-sm text-muted-foreground">Arrival: ${vendor.arrivalTime}</div>` : ''}
            ${vendor.requirements ? `<div class="text-sm mt-2">${vendor.requirements}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `
    : '';

  const emergencyContactsHtml = data.coordination?.emergencyContacts?.length
    ? `
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider font-semibold">Emergency Contacts</h3>
        ${data.coordination.emergencyContacts.map(contact => `
          <div class="flex justify-between items-center">
            <div>
              <div class="font-semibold">${contact.name}</div>
              <div class="text-sm text-muted-foreground">${contact.role}</div>
            </div>
            <div class="font-mono text-sm">${contact.phone}</div>
          </div>
        `).join('')}
      </div>
    `
    : '';

  const serviceNotesHtml = data.serviceNotes
    ? `
      <section class="space-y-6">
        <h2 class="font-serif text-2xl md:text-3xl font-medium">Service Notes</h2>
        <div class="prose max-w-none text-base leading-relaxed whitespace-pre-line">
          ${data.serviceNotes}
        </div>
      </section>
      <div class="h-px w-full bg-foreground"></div>
    `
    : '';

  return `
    <div class="min-h-screen bg-background print:bg-white">
      <div class="max-w-5xl mx-auto px-8 py-16 md:px-12 md:py-24 print:p-8 print:max-w-none space-y-16 print:space-y-8">
        
        <!-- Header Section -->
        <header class="space-y-12">
          <div class="flex items-start justify-between gap-8">
            <div class="flex-shrink-0">
              ${data.header.logoUrl
                ? `<img src="${data.header.logoUrl}" alt="Company Logo" class="h-16 w-auto" />`
                : `<div class="h-16 w-32 border border-foreground flex items-center justify-center">
                    <span class="text-xs uppercase tracking-wider">Logo</span>
                  </div>`
              }
            </div>
            <div class="text-right">
              <div class="text-xs uppercase tracking-wider text-muted-foreground mb-2">BEO Number</div>
              <div class="font-serif text-2xl md:text-3xl font-light tracking-tight">${data.header.beoNumber}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="space-y-4">
              <h1 class="font-serif text-4xl md:text-5xl font-light leading-tight">${data.header.eventName}</h1>
              <p class="font-sans text-lg text-muted-foreground">${data.header.clientName}</p>
            </div>

            <div class="md:text-right space-y-4">
              <div>
                <span class="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Date</span>
                <span class="font-serif text-xl">${data.header.eventDate}</span>
              </div>
              <div>
                <span class="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Time</span>
                <span class="font-serif text-xl">${data.header.eventTime}</span>
              </div>
              <div>
                <span class="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Venue</span>
                <span class="font-serif text-xl">${data.header.venue}</span>
              </div>
            </div>
          </div>
        </header>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Service Badge -->
        <div class="flex items-center gap-3 bg-foreground text-background px-6 py-4 print:px-4 print:py-3">
          <span class="font-sans text-sm uppercase tracking-widest font-semibold">Service Plan</span>
        </div>

        <!-- Guest Management -->
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Guest Management</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div class="text-xs uppercase tracking-wider text-muted-foreground mb-3">Total Guests</div>
              <div class="font-serif text-5xl font-light">${data.guestManagement.totalGuests}</div>
              ${data.guestManagement.vipCount ? `
                <div class="mt-4 text-sm">
                  <span class="text-muted-foreground">VIP Guests:</span>
                  <span class="font-serif text-2xl font-medium ml-2">${data.guestManagement.vipCount}</span>
                </div>
              ` : ''}
            </div>
            ${data.guestManagement.seatingLayout ? `
            <div>
              <div class="text-xs uppercase tracking-wider text-muted-foreground mb-3">Seating Layout</div>
              <div class="text-base">${data.guestManagement.seatingLayout}</div>
              ${data.guestManagement.flowPlan ? `
                <div class="mt-4">
                  <div class="text-xs uppercase tracking-wider text-muted-foreground mb-2">Flow Plan</div>
                  <div class="text-sm text-muted-foreground">${data.guestManagement.flowPlan}</div>
                </div>
              ` : ''}
            </div>
            ` : ''}
          </div>

          ${data.guestManagement.specialSeating?.length ? `
          <div class="mt-8 space-y-4">
            <h3 class="text-xs uppercase tracking-wider font-semibold">Special Seating</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${data.guestManagement.specialSeating.map(seating => `
                <div class="border border-foreground/20 p-4">
                  <div class="flex justify-between items-start">
                    <div class="font-semibold">${seating.table}</div>
                    <div class="font-serif text-lg">${seating.guests} guests</div>
                  </div>
                  ${seating.notes ? `<div class="text-sm text-muted-foreground mt-2">${seating.notes}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </section>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Event Timeline -->
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Event Timeline</h2>
          <div class="space-y-6">
            ${data.timeline.map((event, index) => generateTimelineEvent(event, index)).join('')}
          </div>
        </section>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Staff Positions -->
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Staff Positions</h2>
          <div class="space-y-6">
            ${data.staffPositions.map(position => `
              <div class="border-b border-foreground/20 pb-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="font-sans text-xl font-semibold">${position.role}</h3>
                    <div class="text-sm text-muted-foreground mt-1">
                      ${position.station || ''}${position.startTime ? ` • ${position.startTime}` : ''}
                    </div>
                  </div>
                  <span class="font-serif text-2xl font-light">
                    ${position.count} ${position.count === 1 ? 'person' : 'people'}
                  </span>
                </div>

                ${position.responsibilities?.length ? `
                <div class="space-y-3">
                  <div class="text-xs uppercase tracking-wider font-semibold">Responsibilities</div>
                  <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    ${position.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}

                ${position.members?.length ? `
                <div class="mt-4 space-y-2">
                  <div class="text-xs uppercase tracking-wider font-semibold">Assigned Staff</div>
                  <div class="flex flex-wrap gap-3">
                    ${position.members.map(member => `
                      <div class="bg-foreground/10 px-3 py-1 text-sm">
                        ${member.name}${member.position ? ` <span class="text-xs text-muted-foreground ml-2">(${member.position})</span>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${position.notes ? `
                <div class="mt-4 text-sm text-muted-foreground italic">
                  ${position.notes}
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Equipment -->
        ${data.equipment ? `
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Equipment & Setup</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${[...(data.equipment.dining || []), ...(data.equipment.bar || []), ...(data.equipment.decor || [])].map(category => `
              <div class="space-y-4">
                <h3 class="text-xs uppercase tracking-wider font-semibold border-b border-foreground/30 pb-2">
                  ${category.category}
                </h3>
                <div class="space-y-3">
                  ${category.items.map(item => `
                    <div class="flex justify-between items-start gap-4 text-sm">
                      <div class="flex-1">
                        <div class="font-medium">${item.name}</div>
                        <div class="text-xs text-muted-foreground">${item.location}</div>
                        ${item.setupTime ? `<div class="text-xs text-muted-foreground">Setup: ${item.setupTime}</div>` : ''}
                        ${item.notes ? `<div class="text-xs text-muted-foreground italic mt-1">${item.notes}</div>` : ''}
                      </div>
                      <span class="font-serif text-lg font-medium whitespace-nowrap">${item.quantity}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        <div class="h-px w-full bg-foreground"></div>
        ` : ''}

        <!-- Coordination -->
        ${vendorCoordinationHtml || emergencyContactsHtml ? `
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Coordination</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${vendorCoordinationHtml}
            ${emergencyContactsHtml}
          </div>
        </section>
        <div class="h-px w-full bg-foreground"></div>
        ` : ''}

        ${serviceNotesHtml}

        <!-- Print Footer -->
        <footer class="hidden print:block pt-8 border-t border-foreground/10 text-center">
          <p class="text-xs uppercase tracking-wider text-muted-foreground">
            Generated ${currentDate} • ${data.header.beoNumber} • Service Plan
          </p>
        </footer>
      </div>
    </div>
  `;
}

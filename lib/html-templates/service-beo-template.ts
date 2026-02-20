/**
 * Service BEO HTML Template Generator
 * 
 * Generates HTML for Service BEO documents using template literals.
 * This replaces React component rendering to avoid Next.js 14 compatibility issues.
 */

import type { ServiceBEOData } from '@/components/templates/types';

/**
 * Generate Service BEO HTML
 */
export function generateServiceBEOHTML(data: ServiceBEOData): string {
  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 10pt;
        line-height: 1.5;
        color: #1f2937;
        background: white;
        padding: 0.5in;
      }

      .document-header {
        border-bottom: 3px solid #7c3aed;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }

      .header-title {
        font-size: 24pt;
        font-weight: 700;
        color: #6d28d9;
        margin-bottom: 8px;
      }

      .header-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 12px;
      }

      .header-item {
        font-size: 9pt;
      }

      .header-label {
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        font-size: 8pt;
        letter-spacing: 0.05em;
      }

      .header-value {
        color: #1f2937;
        font-weight: 500;
      }

      .section {
        margin-bottom: 32px;
        page-break-inside: avoid;
      }

      .section-title {
        font-size: 14pt;
        font-weight: 700;
        color: #6d28d9;
        border-bottom: 2px solid #ede9fe;
        padding-bottom: 8px;
        margin-bottom: 16px;
      }

      .timeline {
        position: relative;
        padding-left: 40px;
      }

      .timeline::before {
        content: '';
        position: absolute;
        left: 12px;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(to bottom, #7c3aed, #c4b5fd);
      }

      .timeline-event {
        position: relative;
        margin-bottom: 20px;
      }

      .timeline-marker {
        position: absolute;
        left: -33px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 2px #7c3aed;
      }

      .timeline-marker.setup {
        background: #3b82f6;
      }

      .timeline-marker.service {
        background: #10b981;
      }

      .timeline-marker.breakdown {
        background: #f59e0b;
      }

      .timeline-content {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
      }

      .timeline-time {
        font-weight: 700;
        font-size: 11pt;
        color: #7c3aed;
        margin-bottom: 4px;
      }

      .timeline-label {
        font-weight: 600;
        font-size: 10pt;
        color: #111827;
      }

      .timeline-sublabel {
        font-size: 8pt;
        color: #6b7280;
        margin-top: 2px;
      }

      .timeline-notes {
        font-size: 8pt;
        color: #4b5563;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #f3f4f6;
      }

      .staff-grid {
        display: grid;
        gap: 12px;
      }

      .staff-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        background: white;
      }

      .staff-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .staff-role {
        font-weight: 700;
        font-size: 10pt;
        color: #111827;
      }

      .staff-count {
        background: #ede9fe;
        color: #6d28d9;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 8pt;
        font-weight: 600;
      }

      .staff-meta {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 8px;
        font-size: 8pt;
        color: #6b7280;
      }

      .staff-responsibilities {
        margin-top: 8px;
      }

      .staff-responsibilities ul {
        margin-left: 16px;
        font-size: 8pt;
      }

      .staff-members {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .staff-member {
        padding: 4px 8px;
        background: #f3f4f6;
        border-radius: 6px;
        font-size: 7pt;
      }

      .guest-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding: 16px;
        background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        border-radius: 8px;
        margin-bottom: 16px;
      }

      .guest-stat {
        text-align: center;
      }

      .guest-number {
        font-size: 24pt;
        font-weight: 700;
        color: #7c3aed;
      }

      .guest-label {
        font-size: 8pt;
        color: #6d28d9;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .guest-details {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }

      .detail-label {
        font-weight: 600;
        color: #6d28d9;
        font-size: 9pt;
        margin-bottom: 4px;
      }

      .detail-content {
        font-size: 8pt;
        color: #4b5563;
        line-height: 1.6;
      }

      .special-seating {
        display: grid;
        gap: 12px;
      }

      .seating-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        background: white;
      }

      .seating-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .seating-table {
        font-weight: 700;
        font-size: 10pt;
        color: #111827;
      }

      .seating-count {
        background: #dbeafe;
        color: #1e40af;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 8pt;
        font-weight: 600;
      }

      .seating-notes {
        font-size: 8pt;
        color: #4b5563;
        line-height: 1.5;
      }

      .equipment-grid {
        display: grid;
        gap: 16px;
      }

      .equipment-category {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        background: white;
      }

      .equipment-category-title {
        font-weight: 700;
        font-size: 10pt;
        color: #6d28d9;
        margin-bottom: 12px;
      }

      .equipment-items {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .equipment-item {
        padding: 8px;
        background: #f9fafb;
        border-radius: 6px;
        font-size: 8pt;
      }

      .equipment-item-name {
        font-weight: 600;
        color: #111827;
      }

      .equipment-item-qty {
        color: #7c3aed;
        font-weight: 600;
      }

      .coordination-section {
        background: #fef3c7;
        border: 2px solid #f59e0b;
        border-radius: 8px;
        padding: 16px;
      }

      .coordination-title {
        font-weight: 700;
        font-size: 11pt;
        color: #92400e;
        margin-bottom: 12px;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }

      .contact-card {
        background: white;
        border-radius: 6px;
        padding: 12px;
      }

      .contact-name {
        font-weight: 700;
        font-size: 9pt;
        color: #111827;
      }

      .contact-role {
        font-size: 8pt;
        color: #6b7280;
      }

      .contact-phone {
        font-size: 8pt;
        color: #2563eb;
        font-weight: 600;
        margin-top: 4px;
      }

      .vendor-list {
        display: grid;
        gap: 8px;
      }

      .vendor-item {
        background: white;
        border-radius: 6px;
        padding: 12px;
      }

      .vendor-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .vendor-name {
        font-weight: 700;
        font-size: 9pt;
        color: #111827;
      }

      .vendor-time {
        font-size: 8pt;
        color: #10b981;
        font-weight: 600;
      }

      .vendor-contact {
        font-size: 8pt;
        color: #6b7280;
        margin-bottom: 4px;
      }

      .vendor-requirements {
        font-size: 8pt;
        color: #4b5563;
        font-style: italic;
      }

      .critical-notes {
        background: #fee2e2;
        border: 2px solid #ef4444;
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
      }

      .critical-notes-title {
        font-weight: 700;
        font-size: 11pt;
        color: #991b1b;
        margin-bottom: 12px;
      }

      .critical-notes ul {
        margin-left: 20px;
      }

      .critical-notes li {
        font-size: 9pt;
        color: #7f1d1d;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .service-notes {
        background: #eff6ff;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 16px;
      }

      .service-notes-title {
        font-weight: 700;
        font-size: 11pt;
        color: #1e40af;
        margin-bottom: 12px;
      }

      .service-notes-content {
        white-space: pre-line;
        font-size: 9pt;
        color: #1e3a8a;
        line-height: 1.6;
      }

      @media print {
        body {
          padding: 0;
        }

        .section {
          page-break-inside: avoid;
        }
      }
    </style>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Service BEO - ${data.header.beoNumber}</title>
      ${styles}
    </head>
    <body>
      <!-- Header -->
      <div class="document-header">
        <div class="header-title">Service Plan</div>
        <div class="header-grid">
          <div class="header-item">
            <div class="header-label">BEO Number</div>
            <div class="header-value">${data.header.beoNumber}</div>
          </div>
          <div class="header-item">
            <div class="header-label">Event Name</div>
            <div class="header-value">${data.header.eventName}</div>
          </div>
          <div class="header-item">
            <div class="header-label">Date & Time</div>
            <div class="header-value">${data.header.eventDate} • ${data.header.eventTime}</div>
          </div>
          <div class="header-item">
            <div class="header-label">Client</div>
            <div class="header-value">${data.header.clientName}</div>
          </div>
          <div class="header-item">
            <div class="header-label">Venue</div>
            <div class="header-value">${data.header.venue}</div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      ${data.timeline.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Event Timeline</h2>
          <div class="timeline">
            ${data.timeline.map(event => `
              <div class="timeline-event">
                <div class="timeline-marker ${event.type || 'service'}"></div>
                <div class="timeline-content">
                  <div class="timeline-time">${event.time}</div>
                  <div class="timeline-label">${event.label}</div>
                  ${event.sublabel ? `<div class="timeline-sublabel">${event.sublabel}</div>` : ''}
                  ${event.notes ? `<div class="timeline-notes">${event.notes}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Staff Positions -->
      ${data.staffPositions.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Staff Positions</h2>
          <div class="staff-grid">
            ${data.staffPositions.map(position => `
              <div class="staff-card">
                <div class="staff-header">
                  <div class="staff-role">${position.role}</div>
                  <div class="staff-count">${position.count} ${position.count === 1 ? 'person' : 'people'}</div>
                </div>
                <div class="staff-meta">
                  ${position.station ? `<span><strong>Station:</strong> ${position.station}</span>` : ''}
                  ${position.startTime ? `<span><strong>Start:</strong> ${position.startTime}</span>` : ''}
                </div>
                ${position.responsibilities && position.responsibilities.length > 0 ? `
                  <div class="staff-responsibilities">
                    <strong style="font-size: 8pt;">Responsibilities:</strong>
                    <ul>
                      ${position.responsibilities.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                ${position.members && position.members.length > 0 ? `
                  <div class="staff-members">
                    ${position.members.map(member => `
                      <div class="staff-member">
                        ${member.name}${member.position ? ` • ${member.position}` : ''}${member.station ? ` • ${member.station}` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                ${position.notes ? `<div style="margin-top: 8px; font-size: 8pt; color: #6b7280; font-style: italic;">${position.notes}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Guest Management -->
      <div class="section">
        <h2 class="section-title">Guest Management</h2>
        <div class="guest-info">
          <div class="guest-stat">
            <div class="guest-number">${data.guestManagement.totalGuests}</div>
            <div class="guest-label">Total Guests</div>
          </div>
          ${data.guestManagement.vipCount ? `
            <div class="guest-stat">
              <div class="guest-number">${data.guestManagement.vipCount}</div>
              <div class="guest-label">VIP Guests</div>
            </div>
          ` : ''}
        </div>

        ${data.guestManagement.seatingLayout ? `
          <div class="guest-details">
            <div class="detail-label">Seating Layout</div>
            <div class="detail-content">${data.guestManagement.seatingLayout}</div>
          </div>
        ` : ''}

        ${data.guestManagement.flowPlan ? `
          <div class="guest-details">
            <div class="detail-label">Flow Plan</div>
            <div class="detail-content">${data.guestManagement.flowPlan}</div>
          </div>
        ` : ''}

        ${data.guestManagement.specialSeating && data.guestManagement.specialSeating.length > 0 ? `
          <div style="margin-top: 16px;">
            <div class="detail-label" style="margin-bottom: 12px;">Special Seating</div>
            <div class="special-seating">
              ${data.guestManagement.specialSeating.map(seating => `
                <div class="seating-card">
                  <div class="seating-header">
                    <div class="seating-table">${seating.table}</div>
                    <div class="seating-count">${seating.guests} guests</div>
                  </div>
                  ${seating.notes ? `<div class="seating-notes">${seating.notes}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Equipment -->
      <div class="section">
        <h2 class="section-title">Equipment & Setup</h2>
        <div class="equipment-grid">
          ${data.equipment.dining.map(cat => `
            <div class="equipment-category">
              <div class="equipment-category-title">${cat.category}</div>
              <div class="equipment-items">
                ${cat.items.map(item => `
                  <div class="equipment-item">
                    <div class="equipment-item-name">${item.name}</div>
                    <div><span class="equipment-item-qty">Qty: ${item.quantity}</span> • ${item.location}</div>
                    ${item.setupTime ? `<div style="color: #6b7280; margin-top: 2px;">Setup: ${item.setupTime}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          ${data.equipment.bar.map(cat => `
            <div class="equipment-category">
              <div class="equipment-category-title">${cat.category}</div>
              <div class="equipment-items">
                ${cat.items.map(item => `
                  <div class="equipment-item">
                    <div class="equipment-item-name">${item.name}</div>
                    <div><span class="equipment-item-qty">Qty: ${item.quantity}</span> • ${item.location}</div>
                    ${item.setupTime ? `<div style="color: #6b7280; margin-top: 2px;">Setup: ${item.setupTime}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          ${data.equipment.decor.map(cat => `
            <div class="equipment-category">
              <div class="equipment-category-title">${cat.category}</div>
              <div class="equipment-items">
                ${cat.items.map(item => `
                  <div class="equipment-item">
                    <div class="equipment-item-name">${item.name}</div>
                    <div><span class="equipment-item-qty">Qty: ${item.quantity}</span> • ${item.location}</div>
                    ${item.setupTime ? `<div style="color: #6b7280; margin-top: 2px;">Setup: ${item.setupTime}</div>` : ''}
                    ${item.notes ? `<div style="color: #6b7280; margin-top: 2px; font-style: italic;">${item.notes}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Coordination -->
      <div class="section">
        <div class="coordination-section">
          <div class="coordination-title">📋 Event Coordination</div>

          ${data.coordination.contactPerson || data.coordination.contactPhone ? `
            <div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 9pt; margin-bottom: 4px;">Primary Contact</div>
              ${data.coordination.contactPerson ? `<div style="font-size: 9pt;">${data.coordination.contactPerson}</div>` : ''}
              ${data.coordination.contactPhone ? `<div style="font-size: 9pt; color: #2563eb; font-weight: 600;">${data.coordination.contactPhone}</div>` : ''}
            </div>
          ` : ''}

          ${data.coordination.emergencyContacts && data.coordination.emergencyContacts.length > 0 ? `
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 9pt; margin-bottom: 8px;">Emergency Contacts</div>
              <div class="contact-grid">
                ${data.coordination.emergencyContacts.map(contact => `
                  <div class="contact-card">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-role">${contact.role}</div>
                    <div class="contact-phone">${contact.phone}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.coordination.vendorCoordination && data.coordination.vendorCoordination.length > 0 ? `
            <div>
              <div style="font-weight: 600; font-size: 9pt; margin-bottom: 8px;">Vendor Coordination</div>
              <div class="vendor-list">
                ${data.coordination.vendorCoordination.map(vendor => `
                  <div class="vendor-item">
                    <div class="vendor-header">
                      <div class="vendor-name">${vendor.vendor}</div>
                      ${vendor.arrivalTime ? `<div class="vendor-time">⏰ ${vendor.arrivalTime}</div>` : ''}
                    </div>
                    <div class="vendor-contact">${vendor.contact}</div>
                    ${vendor.requirements ? `<div class="vendor-requirements">${vendor.requirements}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.coordination.criticalNotes && data.coordination.criticalNotes.length > 0 ? `
            <div class="critical-notes">
              <div class="critical-notes-title">⚠️ Critical Notes</div>
              <ul>
                ${data.coordination.criticalNotes.map(note => `<li>${note}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Service Notes -->
      ${data.serviceNotes ? `
        <div class="section">
          <div class="service-notes">
            <div class="service-notes-title">📝 Service Notes</div>
            <div class="service-notes-content">${data.serviceNotes}</div>
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

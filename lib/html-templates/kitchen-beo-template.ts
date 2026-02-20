/**
 * Kitchen BEO HTML Template Generator
 * 
 * Generates HTML for Kitchen BEO documents using template literals.
 * This replaces React component rendering to avoid Next.js 14 compatibility issues.
 */

import type { KitchenBEOData, MenuItem, AllergenKey } from '@/components/templates/types';

/**
 * Allergen icon SVG map
 */
const allergenIcons: Record<AllergenKey, string> = {
  gluten: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6"/></svg>`,
  dairy: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19c0-2 4-3 8-3s8 1 8 3M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>`,
  nuts: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>`,
  shellfish: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c-3 0-6 2-6 5 0 4 3 7 6 10 3-3 6-6 6-10 0-3-3-5-6-5z"/></svg>`,
  eggs: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="14" rx="7" ry="10"/></svg>`,
  soy: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="3"/><circle cx="15" cy="12" r="3"/></svg>`,
  fish: `<svg class="allergen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2"/></svg>`,
};

/**
 * Get allergen badges HTML
 */
function getAllergenBadges(allergens: Record<string, boolean>): string {
  const activeAllergens = Object.entries(allergens)
    .filter(([_, active]) => active)
    .map(([key]) => key as AllergenKey);

  if (activeAllergens.length === 0) return '';

  return `
    <div class="allergen-badges">
      ${activeAllergens
        .map(
          (allergen) => `
        <div class="allergen-badge" title="Contains ${allergen}">
          ${allergenIcons[allergen]}
          <span class="allergen-label">${allergen}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * Generate menu item card HTML
 */
function renderMenuItem(item: MenuItem, courseType: string): string {
  const colorMap: Record<string, string> = {
    appetizer: '#10b981',
    main: '#3b82f6',
    dessert: '#f59e0b',
    side: '#8b5cf6',
  };

  const color = colorMap[courseType] || '#6b7280';

  return `
    <div class="menu-item-card">
      <div class="menu-item-header">
        <div class="menu-item-title-row">
          <h4 class="menu-item-name">${item.name}</h4>
          <span class="course-badge" style="background-color: ${color}20; color: ${color};">
            ${courseType}
          </span>
        </div>
        ${getAllergenBadges(item.allergens)}
      </div>

      <p class="menu-item-description">${item.description}</p>

      <div class="menu-item-details">
        ${item.portionSize ? `<div class="detail-item"><strong>Portion:</strong> ${item.portionSize}</div>` : ''}
        ${item.cookTime ? `<div class="detail-item"><strong>Cook Time:</strong> ${item.cookTime}</div>` : ''}
        ${item.cookingTemperature ? `<div class="detail-item"><strong>Temp:</strong> ${item.cookingTemperature}</div>` : ''}
        ${item.station ? `<div class="detail-item"><strong>Station:</strong> ${item.station}</div>` : ''}
      </div>

      ${item.prepInstructions && item.prepInstructions.length > 0 ? `
        <div class="prep-instructions">
          <strong>Prep Instructions:</strong>
          <ol>
            ${item.prepInstructions.map((instruction) => `<li>${instruction}</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      ${item.scalingNotes ? `
        <div class="scaling-notes">
          <strong>Scaling Notes:</strong>
          <p>${item.scalingNotes}</p>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Generate Kitchen BEO HTML
 */
export function generateKitchenBEOHTML(data: KitchenBEOData): string {
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
        border-bottom: 3px solid #2563eb;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }

      .header-title {
        font-size: 24pt;
        font-weight: 700;
        color: #1e40af;
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
        color: #1e40af;
        border-bottom: 2px solid #dbeafe;
        padding-bottom: 8px;
        margin-bottom: 16px;
      }

      .menu-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .menu-item-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        background: white;
        page-break-inside: avoid;
      }

      .menu-item-header {
        margin-bottom: 12px;
      }

      .menu-item-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .menu-item-name {
        font-size: 12pt;
        font-weight: 700;
        color: #111827;
      }

      .course-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 8pt;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .allergen-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .allergen-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: #fee2e2;
        color: #991b1b;
        border-radius: 6px;
        font-size: 7pt;
        font-weight: 600;
      }

      .allergen-icon {
        width: 12px;
        height: 12px;
      }

      .menu-item-description {
        color: #4b5563;
        font-size: 9pt;
        line-height: 1.6;
        margin-bottom: 12px;
      }

      .menu-item-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 6px;
        margin-bottom: 12px;
      }

      .detail-item {
        font-size: 8pt;
        color: #374151;
      }

      .prep-instructions {
        margin-top: 12px;
        padding: 12px;
        background: #eff6ff;
        border-radius: 6px;
      }

      .prep-instructions strong {
        display: block;
        color: #1e40af;
        margin-bottom: 8px;
        font-size: 9pt;
      }

      .prep-instructions ol {
        margin-left: 20px;
      }

      .prep-instructions li {
        font-size: 8pt;
        color: #1f2937;
        margin-bottom: 4px;
      }

      .scaling-notes {
        margin-top: 12px;
        padding: 12px;
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        border-radius: 6px;
      }

      .scaling-notes strong {
        display: block;
        color: #92400e;
        margin-bottom: 4px;
        font-size: 9pt;
      }

      .scaling-notes p {
        font-size: 8pt;
        color: #78350f;
      }

      .prep-schedule {
        display: grid;
        gap: 12px;
      }

      .prep-task {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        background: white;
        display: flex;
        gap: 12px;
      }

      .prep-task-priority {
        width: 4px;
        border-radius: 2px;
      }

      .prep-task-priority.high {
        background: #ef4444;
      }

      .prep-task-priority.normal {
        background: #3b82f6;
      }

      .prep-task-priority.low {
        background: #6b7280;
      }

      .prep-task-content {
        flex: 1;
      }

      .prep-task-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .prep-task-label {
        font-weight: 700;
        font-size: 9pt;
        color: #111827;
      }

      .prep-task-time {
        font-weight: 600;
        font-size: 8pt;
        color: #2563eb;
      }

      .prep-task-meta {
        display: flex;
        gap: 16px;
        font-size: 8pt;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .prep-task-details {
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
        color: #1e40af;
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
        color: #2563eb;
        font-weight: 600;
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
        background: #dbeafe;
        color: #1e40af;
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

      .special-instructions {
        border: 2px solid #f59e0b;
        border-radius: 8px;
        padding: 16px;
        background: #fffbeb;
      }

      .special-instructions-title {
        font-weight: 700;
        font-size: 11pt;
        color: #92400e;
        margin-bottom: 12px;
      }

      .special-instructions-content {
        white-space: pre-line;
        font-size: 9pt;
        color: #78350f;
        line-height: 1.6;
      }

      .dietary-restrictions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 12px;
        background: #fef3c7;
        border-radius: 8px;
      }

      .dietary-item {
        text-align: center;
        padding: 8px;
        background: white;
        border-radius: 6px;
      }

      .dietary-count {
        font-size: 18pt;
        font-weight: 700;
        color: #f59e0b;
      }

      .dietary-label {
        font-size: 8pt;
        color: #92400e;
        text-transform: uppercase;
        letter-spacing: 0.05em;
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
      <title>Kitchen BEO - ${data.header.beoNumber}</title>
      ${styles}
    </head>
    <body>
      <!-- Header -->
      <div class="document-header">
        <div class="header-title">Kitchen Production Sheet</div>
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
          <div class="header-item">
            <div class="header-label">Guest Count</div>
            <div class="header-value">${data.header.guestCount}</div>
          </div>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="section">
        <h2 class="section-title">Menu</h2>
        
        ${data.menu.appetizers.length > 0 ? `
          <h3 style="font-size: 11pt; font-weight: 600; margin: 16px 0 12px; color: #10b981;">Appetizers</h3>
          <div class="menu-grid">
            ${data.menu.appetizers.map(item => renderMenuItem(item, 'appetizer')).join('')}
          </div>
        ` : ''}

        ${data.menu.mains.length > 0 ? `
          <h3 style="font-size: 11pt; font-weight: 600; margin: 16px 0 12px; color: #3b82f6;">Main Courses</h3>
          <div class="menu-grid">
            ${data.menu.mains.map(item => renderMenuItem(item, 'main')).join('')}
          </div>
        ` : ''}

        ${data.menu.sides && data.menu.sides.length > 0 ? `
          <h3 style="font-size: 11pt; font-weight: 600; margin: 16px 0 12px; color: #8b5cf6;">Sides</h3>
          <div class="menu-grid">
            ${data.menu.sides.map(item => renderMenuItem(item, 'side')).join('')}
          </div>
        ` : ''}

        ${data.menu.desserts.length > 0 ? `
          <h3 style="font-size: 11pt; font-weight: 600; margin: 16px 0 12px; color: #f59e0b;">Desserts</h3>
          <div class="menu-grid">
            ${data.menu.desserts.map(item => renderMenuItem(item, 'dessert')).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Prep Schedule -->
      ${data.prepSchedule.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Prep Schedule</h2>
          <div class="prep-schedule">
            ${data.prepSchedule.map(task => `
              <div class="prep-task">
                <div class="prep-task-priority ${task.priority || 'normal'}"></div>
                <div class="prep-task-content">
                  <div class="prep-task-header">
                    <div class="prep-task-label">${task.label}</div>
                    ${task.timeEstimate ? `<div class="prep-task-time">${task.timeEstimate}</div>` : ''}
                  </div>
                  <div class="prep-task-meta">
                    <span><strong>Station:</strong> ${task.station}</span>
                    ${task.assignee ? `<span><strong>Assignee:</strong> ${task.assignee}</span>` : ''}
                  </div>
                  ${task.details ? `<div class="prep-task-details">${task.details}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Equipment -->
      <div class="section">
        <h2 class="section-title">Equipment Allocation</h2>
        <div class="equipment-grid">
          ${data.equipment.cooking.map(cat => `
            <div class="equipment-category">
              <div class="equipment-category-title">${cat.category}</div>
              <div class="equipment-items">
                ${cat.items.map(item => `
                  <div class="equipment-item">
                    <div class="equipment-item-name">${item.name}</div>
                    <div><span class="equipment-item-qty">Qty: ${item.quantity}</span> • ${item.location || 'N/A'}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          ${data.equipment.prep.map(cat => `
            <div class="equipment-category">
              <div class="equipment-category-title">${cat.category}</div>
              <div class="equipment-items">
                ${cat.items.map(item => `
                  <div class="equipment-item">
                    <div class="equipment-item-name">${item.name}</div>
                    <div><span class="equipment-item-qty">Qty: ${item.quantity}</span> • ${item.location || 'N/A'}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          ${data.equipment.service.map(cat => `
            <div class="equipment-category">
              <div class="equipment-category-title">${cat.category}</div>
              <div class="equipment-items">
                ${cat.items.map(item => `
                  <div class="equipment-item">
                    <div class="equipment-item-name">${item.name}</div>
                    <div><span class="equipment-item-qty">Qty: ${item.quantity}</span> • ${item.location || 'N/A'}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Staff Assignments -->
      ${data.staffAssignments.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Staff Assignments</h2>
          <div class="staff-grid">
            ${data.staffAssignments.map(assignment => `
              <div class="staff-card">
                <div class="staff-header">
                  <div class="staff-role">${assignment.role}</div>
                  <div class="staff-count">${assignment.count} ${assignment.count === 1 ? 'person' : 'people'}</div>
                </div>
                <div class="staff-meta">
                  <span><strong>Station:</strong> ${assignment.station}</span>
                  ${assignment.startTime ? `<span><strong>Start:</strong> ${assignment.startTime}</span>` : ''}
                </div>
                ${assignment.responsibilities && assignment.responsibilities.length > 0 ? `
                  <div class="staff-responsibilities">
                    <strong style="font-size: 8pt;">Responsibilities:</strong>
                    <ul>
                      ${assignment.responsibilities.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                ${assignment.members && assignment.members.length > 0 ? `
                  <div class="staff-members">
                    ${assignment.members.map(member => `
                      <div class="staff-member">
                        ${member.name}${member.position ? ` • ${member.position}` : ''}${member.station ? ` • ${member.station}` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                ${assignment.notes ? `<div style="margin-top: 8px; font-size: 8pt; color: #6b7280; font-style: italic;">${assignment.notes}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Dietary Restrictions -->
      ${data.dietaryRestrictions ? `
        <div class="section">
          <h2 class="section-title">Dietary Restrictions</h2>
          <div class="dietary-restrictions">
            ${data.dietaryRestrictions.vegetarian ? `
              <div class="dietary-item">
                <div class="dietary-count">${data.dietaryRestrictions.vegetarian}</div>
                <div class="dietary-label">Vegetarian</div>
              </div>
            ` : ''}
            ${data.dietaryRestrictions.vegan ? `
              <div class="dietary-item">
                <div class="dietary-count">${data.dietaryRestrictions.vegan}</div>
                <div class="dietary-label">Vegan</div>
              </div>
            ` : ''}
            ${data.dietaryRestrictions.glutenFree ? `
              <div class="dietary-item">
                <div class="dietary-count">${data.dietaryRestrictions.glutenFree}</div>
                <div class="dietary-label">Gluten-Free</div>
              </div>
            ` : ''}
            ${data.dietaryRestrictions.nutAllergy ? `
              <div class="dietary-item">
                <div class="dietary-count">${data.dietaryRestrictions.nutAllergy}</div>
                <div class="dietary-label">Nut Allergy</div>
              </div>
            ` : ''}
          </div>
          ${data.dietaryRestrictions.other ? `
            <div style="margin-top: 12px; padding: 12px; background: white; border-radius: 6px; font-size: 8pt;">
              <strong>Other:</strong> ${data.dietaryRestrictions.other}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Special Instructions -->
      ${data.specialInstructions ? `
        <div class="section">
          <div class="special-instructions">
            <div class="special-instructions-title">⚠️ Special Instructions</div>
            <div class="special-instructions-content">${data.specialInstructions}</div>
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

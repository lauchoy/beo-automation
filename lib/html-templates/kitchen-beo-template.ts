/**
 * Kitchen BEO HTML Template Generator
 * 
 * Generates HTML for Kitchen BEO documents without using React rendering.
 * This approach is fully compatible with Next.js 14 and Vercel deployment.
 */

import type { KitchenBEOData, MenuItem, PrepTask, EquipmentCategory, StaffAssignment, AllergenType } from '@/components/templates/types';

/**
 * Generate allergen badge HTML
 */
function generateAllergenBadge(allergen: AllergenType): string {
  const allergenInfo: Record<AllergenType, { label: string; title: string }> = {
    gluten: { label: 'G', title: 'Gluten' },
    dairy: { label: 'D', title: 'Dairy' },
    nuts: { label: 'N', title: 'Nuts' },
    shellfish: { label: 'SF', title: 'Shellfish' },
    eggs: { label: 'E', title: 'Eggs' },
    soy: { label: 'S', title: 'Soy' },
    fish: { label: 'F', title: 'Fish' },
  };

  const info = allergenInfo[allergen];
  return `<span class="inline-flex items-center justify-center w-8 h-8 border-2 border-foreground text-xs font-bold" title="${info.title}">${info.label}</span>`;
}

/**
 * Generate menu item HTML
 */
function generateMenuItem(item: MenuItem): string {
  const allergenBadges = item.allergens.map(generateAllergenBadge).join('');
  
  const prepInstructionsHtml = item.prepInstructions?.length
    ? `
      <div class="pt-4 space-y-3">
        <span class="text-xs uppercase tracking-wider font-semibold">Preparation</span>
        <ol class="space-y-2 ml-1">
          ${item.prepInstructions.map((instruction, index) => `
            <li class="flex gap-3 text-base leading-relaxed">
              <span class="font-serif font-semibold text-lg min-w-[1.5rem]">${index + 1}.</span>
              <span>${instruction}</span>
            </li>
          `).join('')}
        </ol>
      </div>
    `
    : '';

  const platingInstructionsHtml = item.platingInstructions?.length
    ? `
      <div class="pt-4 space-y-3">
        <span class="text-xs uppercase tracking-wider font-semibold">Plating</span>
        <ol class="space-y-2 ml-1">
          ${item.platingInstructions.map((instruction, index) => `
            <li class="flex gap-3 text-base leading-relaxed">
              <span class="font-serif font-semibold text-lg min-w-[1.5rem]">${index + 1}.</span>
              <span>${instruction}</span>
            </li>
          `).join('')}
        </ol>
      </div>
    `
    : '';

  const scalingNotesHtml = item.scalingNotes
    ? `
      <div class="pt-4 space-y-2">
        <span class="text-xs uppercase tracking-wider font-semibold">Scaling Notes</span>
        <p class="text-base leading-relaxed bg-secondary/50 p-4 border-l-2 border-foreground">
          ${item.scalingNotes}
        </p>
      </div>
    `
    : '';

  return `
    <div class="flex items-start gap-6 py-6 border-b border-foreground/20">
      <div class="hidden print:block pt-2">
        <div class="h-6 w-6 border-2 border-foreground"></div>
      </div>
      
      <div class="flex-1 space-y-4">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="font-serif text-2xl md:text-3xl font-medium tracking-tight">${item.name}</span>
            ${allergenBadges ? `<div class="flex gap-2">${allergenBadges}</div>` : ''}
          </div>
          
          ${item.station ? `
          <div class="flex gap-4 text-sm font-sans">
            <span class="text-xs uppercase tracking-wider bg-foreground/10 px-2 py-1">${item.station}</span>
          </div>
          ` : ''}
        </div>
        
        <p class="text-base leading-relaxed text-muted-foreground">${item.description}</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          ${item.portionSize ? `
          <div>
            <span class="text-xs uppercase tracking-wider text-muted-foreground block">Portion</span>
            <span class="font-medium">${item.portionSize}</span>
          </div>
          ` : ''}
          ${item.cookTime ? `
          <div>
            <span class="text-xs uppercase tracking-wider text-muted-foreground block">Cook Time</span>
            <span class="font-medium">${item.cookTime}</span>
          </div>
          ` : ''}
          ${item.cookingTemperature ? `
          <div>
            <span class="text-xs uppercase tracking-wider text-muted-foreground block">Temperature</span>
            <span class="font-medium">${item.cookingTemperature}</span>
          </div>
          ` : ''}
        </div>
        
        ${prepInstructionsHtml}
        ${platingInstructionsHtml}
        ${scalingNotesHtml}
      </div>
    </div>
  `;
}

/**
 * Generate prep task HTML
 */
function generatePrepTask(task: PrepTask): string {
  const priorityColors = {
    high: 'border-l-4 border-l-foreground bg-foreground/5',
    normal: 'border-l-2 border-l-foreground/60',
    low: 'border-l border-l-foreground/30',
  };

  const priority = task.priority || 'normal';
  
  return `
    <div class="flex items-start gap-4 pb-5 border-b border-foreground/15 ${priorityColors[priority]} -mx-4 px-4 py-4">
      <div class="print:block pt-1">
        <div class="h-6 w-6 border-2 border-foreground ${task.completed ? 'bg-foreground' : ''}"></div>
      </div>
      
      <div class="flex-1 space-y-2">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-xs uppercase tracking-wider font-bold bg-foreground/10 px-2 py-1">${task.station}</span>
          ${task.timeEstimate ? `<span class="text-sm text-muted-foreground font-medium">${task.timeEstimate}</span>` : ''}
          ${task.assignee ? `<span class="text-sm text-muted-foreground">• ${task.assignee}</span>` : ''}
        </div>
        
        <span class="font-sans text-lg md:text-xl font-semibold leading-snug block">${task.label}</span>
        
        ${task.details ? `<p class="text-base text-muted-foreground leading-relaxed">${task.details}</p>` : ''}
        
        ${task.dependencies?.length ? `
        <div class="text-sm text-muted-foreground italic">
          Depends on: ${task.dependencies.join(', ')}
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate complete Kitchen BEO HTML
 */
export function generateKitchenBEOHTML(data: KitchenBEOData): string {
  const currentDate = new Date().toLocaleDateString();
  
  const dietaryHtml = data.dietaryRestrictions && Object.keys(data.dietaryRestrictions).length > 0
    ? `
      <div class="mt-8 p-6 bg-foreground/5 border-l-4 border-foreground">
        <div class="text-xs uppercase tracking-wider font-semibold mb-4">Dietary Requirements</div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          ${Object.entries(data.dietaryRestrictions)
            .filter(([_, value]) => value)
            .map(([key, value]) => `
              <div class="flex justify-between">
                <span class="font-sans text-sm capitalize">
                  ${key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span class="font-serif font-medium">${value}</span>
              </div>
            `)
            .join('')}
        </div>
      </div>
    `
    : '';

  const allergenNotesHtml = data.allergenNotes?.length
    ? `
      <section class="space-y-6 bg-red-50 p-6 border-l-4 border-red-600">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <h2 class="font-serif text-2xl md:text-3xl font-medium text-red-900">
            Critical Allergen Information
          </h2>
        </div>
        <div class="space-y-3">
          ${data.allergenNotes.map(note => `
            <div class="text-base leading-relaxed font-medium text-red-900">• ${note}</div>
          `).join('')}
        </div>
      </section>
      <div class="h-px w-full bg-foreground"></div>
    `
    : '';

  const specialInstructionsHtml = data.specialInstructions
    ? `
      <section class="space-y-6">
        <h2 class="font-serif text-2xl md:text-3xl font-medium">Special Instructions</h2>
        <div class="prose max-w-none text-base leading-relaxed whitespace-pre-line">
          ${data.specialInstructions}
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
              <div>
                <span class="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Guests</span>
                <span class="font-serif text-xl">${data.header.guestCount}</span>
              </div>
            </div>
          </div>
        </header>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Kitchen Badge -->
        <div class="flex items-center gap-3 bg-foreground text-background px-6 py-4 print:px-4 print:py-3">
          <span class="font-sans text-sm uppercase tracking-widest font-semibold">Kitchen Production Sheet</span>
        </div>

        ${dietaryHtml}

        <div class="h-px w-full bg-foreground"></div>

        <!-- Prep Schedule -->
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Prep Schedule</h2>
          <div class="space-y-4">
            ${data.prepSchedule.map(generatePrepTask).join('')}
          </div>
        </section>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Menu Sections -->
        <section class="space-y-12">
          <h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight flex items-center gap-3">
            Production Menu
          </h2>
          
          ${data.menu.appetizers?.length ? `
          <div class="space-y-8">
            <h3 class="font-serif text-2xl md:text-3xl font-medium tracking-tight border-b-2 border-foreground pb-3">
              Appetizers
            </h3>
            <div class="space-y-8">
              ${data.menu.appetizers.map(generateMenuItem).join('')}
            </div>
          </div>
          ` : ''}
          
          ${data.menu.mains?.length ? `
          <div class="space-y-8">
            <h3 class="font-serif text-2xl md:text-3xl font-medium tracking-tight border-b-2 border-foreground pb-3">
              Main Courses
            </h3>
            <div class="space-y-8">
              ${data.menu.mains.map(generateMenuItem).join('')}
            </div>
          </div>
          ` : ''}
          
          ${data.menu.sides?.length ? `
          <div class="space-y-8">
            <h3 class="font-serif text-2xl md:text-3xl font-medium tracking-tight border-b-2 border-foreground pb-3">
              Sides & Accompaniments
            </h3>
            <div class="space-y-8">
              ${data.menu.sides.map(generateMenuItem).join('')}
            </div>
          </div>
          ` : ''}
          
          ${data.menu.desserts?.length ? `
          <div class="space-y-8">
            <h3 class="font-serif text-2xl md:text-3xl font-medium tracking-tight border-b-2 border-foreground pb-3">
              Desserts
            </h3>
            <div class="space-y-8">
              ${data.menu.desserts.map(generateMenuItem).join('')}
            </div>
          </div>
          ` : ''}
        </section>

        <div class="h-px w-full bg-foreground"></div>

        <!-- Equipment Allocation -->
        ${data.equipment ? `
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Equipment Allocation</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${[...(data.equipment.cooking || []), ...(data.equipment.prep || []), ...(data.equipment.service || [])].map(category => `
              <div class="space-y-4">
                <h3 class="text-xs uppercase tracking-wider font-semibold border-b border-foreground/30 pb-2">
                  ${category.category}
                </h3>
                <div class="space-y-3">
                  ${category.items.map(item => `
                    <div class="flex justify-between items-start gap-4 text-sm">
                      <div class="flex-1">
                        <div class="font-medium">${item.name}</div>
                        ${item.location ? `<div class="text-xs text-muted-foreground">${item.location}</div>` : ''}
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

        <!-- Staff Assignments -->
        <section class="space-y-8">
          <h2 class="font-serif text-2xl md:text-3xl font-medium">Staff Assignments</h2>
          <div class="space-y-6">
            ${data.staffAssignments.map(assignment => `
              <div class="border-b border-foreground/20 pb-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="font-sans text-xl font-semibold">${assignment.role}</h3>
                    <div class="text-sm text-muted-foreground mt-1">
                      ${assignment.station}${assignment.startTime ? ` • ${assignment.startTime}` : ''}
                    </div>
                  </div>
                  <span class="font-serif text-2xl font-light">
                    ${assignment.count} ${assignment.count === 1 ? 'person' : 'people'}
                  </span>
                </div>

                ${assignment.responsibilities?.length ? `
                <div class="space-y-3">
                  <div class="text-xs uppercase tracking-wider font-semibold">Responsibilities</div>
                  <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    ${assignment.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}

                ${assignment.members?.length ? `
                <div class="mt-4 space-y-2">
                  <div class="text-xs uppercase tracking-wider font-semibold">Assigned Staff</div>
                  <div class="flex flex-wrap gap-3">
                    ${assignment.members.map(member => `
                      <div class="bg-foreground/10 px-3 py-1 text-sm">
                        ${member.name}${member.position ? ` <span class="text-xs text-muted-foreground ml-2">(${member.position})</span>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>

        <div class="h-px w-full bg-foreground"></div>

        ${allergenNotesHtml}
        ${specialInstructionsHtml}

        <!-- Allergen Legend -->
        <section class="space-y-6">
          <h3 class="text-xs uppercase tracking-wider font-semibold">Allergen Legend</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${[
              { type: 'gluten', name: 'Gluten' },
              { type: 'dairy', name: 'Dairy' },
              { type: 'nuts', name: 'Nuts' },
              { type: 'shellfish', name: 'Shellfish' },
              { type: 'eggs', name: 'Eggs' },
              { type: 'soy', name: 'Soy' },
              { type: 'fish', name: 'Fish' },
            ].map(allergen => `
              <div class="flex items-center gap-3">
                ${generateAllergenBadge(allergen.type as AllergenType)}
                <span class="text-sm">${allergen.name}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Print Footer -->
        <footer class="hidden print:block pt-8 border-t border-foreground/10 text-center">
          <p class="text-xs uppercase tracking-wider text-muted-foreground">
            Generated ${currentDate} • ${data.header.beoNumber} • Kitchen Production
          </p>
        </footer>
      </div>
    </div>
  `;
}

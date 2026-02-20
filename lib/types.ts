import { z } from 'zod';

// BEO (Banquet Event Order) Types
export const BEOSchema = z.object({
  id: z.string(),
  eventName: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  clientName: z.string(),
  guestCount: z.number(),
  venue: z.string(),
  status: z.enum(['draft', 'pending', 'approved', 'in-progress', 'completed', 'cancelled']),
  menuItems: z.array(z.string()).optional(),
  specialRequirements: z.string().optional(),
  totalCost: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BEO = z.infer<typeof BEOSchema>;

// Recipe Types
export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    unit: z.string(),
  })),
  instructions: z.array(z.string()),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servings: z.number(),
  dietaryRestrictions: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  cost: z.number().optional(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Workflow Types
export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'in-progress', 'completed', 'failed']),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

export const WorkflowSchema = z.object({
  id: z.string(),
  beoId: z.string(),
  name: z.string(),
  steps: z.array(WorkflowStepSchema),
  status: z.enum(['not-started', 'in-progress', 'completed']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;

// Airtable Response Types
export interface AirtableRecord<T> {
  id: string;
  fields: T;
  createdTime: string;
}

export interface AirtableResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

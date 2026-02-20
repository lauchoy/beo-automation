/**
 * BEO Template Type Definitions
 * 
 * Centralized TypeScript types for Kitchen and Service BEO templates.
 * These types ensure consistency across templates, API routes, and PDF generation.
 */

import { z } from 'zod';

// ============================================================================
// Common Types
// ============================================================================

export type AllergenType = 'gluten' | 'dairy' | 'nuts' | 'shellfish' | 'eggs' | 'soy' | 'fish';

export const AllergenSchema = z.enum(['gluten', 'dairy', 'nuts', 'shellfish', 'eggs', 'soy', 'fish']);

export interface BEOHeader {
  beoNumber: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  clientName: string;
  venue: string;
  logoUrl?: string;
}

export const BEOHeaderSchema = z.object({
  beoNumber: z.string(),
  eventName: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  clientName: z.string(),
  venue: z.string(),
  logoUrl: z.string().url().optional(),
});

// ============================================================================
// Kitchen BEO Types
// ============================================================================

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

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  allergens: z.array(AllergenSchema),
  portionSize: z.string().optional(),
  cookTime: z.string().optional(),
  cookTemp: z.string().optional(),
  prepInstructions: z.array(z.string()),
  scalingNotes: z.string().optional(),
  station: z.string().optional(),
  platingInstructions: z.array(z.string()).optional(),
  holdingTemp: z.string().optional(),
  shelfLife: z.string().optional(),
});

export type PrepPriority = 'critical' | 'high' | 'medium' | 'low';

export interface PrepTask {
  id: string;
  label: string;
  station: string;
  priority: PrepPriority;
  timeEstimate: string;
  assignee?: string;
  details?: string;
  dependencies?: string[];
  completed?: boolean;
}

export const PrepTaskSchema = z.object({
  id: z.string(),
  label: z.string(),
  station: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  timeEstimate: z.string(),
  assignee: z.string().optional(),
  details: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
});

export interface EquipmentCategory {
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    station: string;
    notes?: string;
  }>;
}

export const EquipmentCategorySchema = z.object({
  category: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    station: z.string(),
    notes: z.string().optional(),
  })),
});

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

export const StaffAssignmentSchema = z.object({
  role: z.string(),
  count: z.number().int().positive(),
  station: z.string(),
  shiftStart: z.string(),
  shiftEnd: z.string(),
  responsibilities: z.array(z.string()),
  members: z.array(z.object({
    name: z.string(),
    position: z.string().optional(),
  })).optional(),
});

export interface KitchenBEOData {
  header: BEOHeader;
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

export const KitchenBEODataSchema = z.object({
  header: BEOHeaderSchema,
  guests: z.object({
    total: z.number().int().positive(),
    breakdown: z.array(z.object({
      type: z.string(),
      count: z.number().int().nonnegative(),
      color: z.enum(['appetizer', 'main', 'dessert', 'default']),
    })),
    dietary: z.object({
      vegetarian: z.number().int().nonnegative().optional(),
      vegan: z.number().int().nonnegative().optional(),
      glutenFree: z.number().int().nonnegative().optional(),
      dairyFree: z.number().int().nonnegative().optional(),
      nutAllergy: z.number().int().nonnegative().optional(),
    }),
  }),
  menu: z.object({
    appetizers: z.array(MenuItemSchema),
    mains: z.array(MenuItemSchema),
    desserts: z.array(MenuItemSchema),
    sides: z.array(MenuItemSchema).optional(),
  }),
  prepSchedule: z.array(PrepTaskSchema),
  equipmentAllocation: z.array(EquipmentCategorySchema),
  staffAssignments: z.array(StaffAssignmentSchema),
  specialInstructions: z.string().optional(),
  allergenNotes: z.array(z.string()).optional(),
});

// ============================================================================
// Service BEO Types
// ============================================================================

export type TimelineEventType = 'setup' | 'service' | 'breakdown' | 'coordination';

export interface TimelineEvent {
  time: string;
  label: string;
  sublabel?: string;
  type: TimelineEventType;
  responsible?: string;
  notes?: string;
}

export const TimelineEventSchema = z.object({
  time: z.string(),
  label: z.string(),
  sublabel: z.string().optional(),
  type: z.enum(['setup', 'service', 'breakdown', 'coordination']),
  responsible: z.string().optional(),
  notes: z.string().optional(),
});

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

export const StaffPositionSchema = z.object({
  role: z.string(),
  count: z.number().int().positive(),
  location: z.string(),
  shiftStart: z.string(),
  shiftEnd: z.string(),
  responsibilities: z.array(z.string()),
  uniform: z.string().optional(),
  members: z.array(z.object({
    name: z.string(),
    position: z.string().optional(),
    section: z.string().optional(),
  })).optional(),
});

export type SpecialNeedPriority = 'critical' | 'important' | 'note';

export interface SpecialNeed {
  tableNumber?: string;
  guestName?: string;
  requirement: string;
  priority: SpecialNeedPriority;
}

export const SpecialNeedSchema = z.object({
  tableNumber: z.string().optional(),
  guestName: z.string().optional(),
  requirement: z.string(),
  priority: z.enum(['critical', 'important', 'note']),
});

export type SeatingStyle = 'plated' | 'buffet' | 'family-style' | 'stations';

export interface ServiceStep {
  time: string;
  step: string;
  details: string;
  staffInvolved: string[];
  duration?: string;
}

export const ServiceStepSchema = z.object({
  time: z.string(),
  step: z.string(),
  details: z.string(),
  staffInvolved: z.array(z.string()),
  duration: z.string().optional(),
});

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

export const SetupCategorySchema = z.object({
  category: z.string(),
  location: z.string(),
  items: z.array(z.object({
    item: z.string(),
    quantity: z.number().int().positive(),
    setupTime: z.string().optional(),
    notes: z.string().optional(),
  })),
});

export type BarServiceType = 'full-bar' | 'beer-wine' | 'signature-cocktails' | 'no-bar';

export interface BarService {
  type: BarServiceType;
  bartenders: number;
  locations: string[];
  specialRequests?: string[];
  lastCall?: string;
}

export const BarServiceSchema = z.object({
  type: z.enum(['full-bar', 'beer-wine', 'signature-cocktails', 'no-bar']),
  bartenders: z.number().int().nonnegative(),
  locations: z.array(z.string()),
  specialRequests: z.array(z.string()).optional(),
  lastCall: z.string().optional(),
});

export interface VendorInfo {
  vendorName: string;
  contact: string;
  arrivalTime: string;
  setupArea: string;
  requirements: string[];
  pointOfContact: string;
}

export const VendorInfoSchema = z.object({
  vendorName: z.string(),
  contact: z.string(),
  arrivalTime: z.string(),
  setupArea: z.string(),
  requirements: z.array(z.string()),
  pointOfContact: z.string(),
});

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  onSite: boolean;
}

export const EmergencyContactSchema = z.object({
  name: z.string(),
  role: z.string(),
  phone: z.string(),
  onSite: z.boolean(),
});

export interface ServiceBEOData {
  header: BEOHeader;
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
    seatingStyle: SeatingStyle;
    specialNeeds: SpecialNeed[];
  };
  serviceFlow: ServiceStep[];
  equipmentSetup: SetupCategory[];
  barService?: BarService;
  vendorCoordination?: VendorInfo[];
  emergencyContacts: EmergencyContact[];
  specialInstructions?: string;
}

export const ServiceBEODataSchema = z.object({
  header: BEOHeaderSchema,
  timeline: z.array(TimelineEventSchema),
  floorPlan: z.object({
    totalTables: z.number().int().positive(),
    totalSeats: z.number().int().positive(),
    layout: z.string(),
    specialArrangements: z.array(z.string()).optional(),
  }),
  staffPositioning: z.array(StaffPositionSchema),
  guestManagement: z.object({
    totalGuests: z.number().int().positive(),
    expectedArrival: z.string(),
    cocktailHour: z.boolean(),
    seatingStyle: z.enum(['plated', 'buffet', 'family-style', 'stations']),
    specialNeeds: z.array(SpecialNeedSchema),
  }),
  serviceFlow: z.array(ServiceStepSchema),
  equipmentSetup: z.array(SetupCategorySchema),
  barService: BarServiceSchema.optional(),
  vendorCoordination: z.array(VendorInfoSchema).optional(),
  emergencyContacts: z.array(EmergencyContactSchema),
  specialInstructions: z.string().optional(),
});

// ============================================================================
// Utility Types
// ============================================================================

export type BEOType = 'kitchen' | 'service';

export type BEOData = KitchenBEOData | ServiceBEOData;

// ============================================================================
// Validation Functions
// ============================================================================

export function validateKitchenBEO(data: unknown): KitchenBEOData {
  return KitchenBEODataSchema.parse(data);
}

export function validateServiceBEO(data: unknown): ServiceBEOData {
  return ServiceBEODataSchema.parse(data);
}

export function validateBEOData(type: BEOType, data: unknown): BEOData {
  if (type === 'kitchen') {
    return validateKitchenBEO(data);
  } else {
    return validateServiceBEO(data);
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if BEO data is valid without throwing
 */
export function isValidKitchenBEO(data: unknown): data is KitchenBEOData {
  return KitchenBEODataSchema.safeParse(data).success;
}

export function isValidServiceBEO(data: unknown): data is ServiceBEOData {
  return ServiceBEODataSchema.safeParse(data).success;
}

/**
 * Get validation errors for debugging
 */
export function getKitchenBEOValidationErrors(data: unknown): z.ZodError | null {
  const result = KitchenBEODataSchema.safeParse(data);
  return result.success ? null : result.error;
}

export function getServiceBEOValidationErrors(data: unknown): z.ZodError | null {
  const result = ServiceBEODataSchema.safeParse(data);
  return result.success ? null : result.error;
}

/**
 * Merge partial BEO data with defaults
 */
export function createKitchenBEOWithDefaults(
  partial: Partial<KitchenBEOData>
): KitchenBEOData {
  const defaults: KitchenBEOData = {
    header: {
      beoNumber: '',
      eventName: '',
      eventDate: '',
      eventTime: '',
      clientName: '',
      venue: '',
    },
    guests: {
      total: 0,
      breakdown: [],
      dietary: {},
    },
    menu: {
      appetizers: [],
      mains: [],
      desserts: [],
    },
    prepSchedule: [],
    equipmentAllocation: [],
    staffAssignments: [],
  };

  return {
    ...defaults,
    ...partial,
    header: { ...defaults.header, ...partial.header },
    guests: { ...defaults.guests, ...partial.guests },
    menu: { ...defaults.menu, ...partial.menu },
  };
}

export function createServiceBEOWithDefaults(
  partial: Partial<ServiceBEOData>
): ServiceBEOData {
  const defaults: ServiceBEOData = {
    header: {
      beoNumber: '',
      eventName: '',
      eventDate: '',
      eventTime: '',
      clientName: '',
      venue: '',
    },
    timeline: [],
    floorPlan: {
      totalTables: 0,
      totalSeats: 0,
      layout: '',
    },
    staffPositioning: [],
    guestManagement: {
      totalGuests: 0,
      expectedArrival: '',
      cocktailHour: false,
      seatingStyle: 'plated',
      specialNeeds: [],
    },
    serviceFlow: [],
    equipmentSetup: [],
    emergencyContacts: [],
  };

  return {
    ...defaults,
    ...partial,
    header: { ...defaults.header, ...partial.header },
    floorPlan: { ...defaults.floorPlan, ...partial.floorPlan },
    guestManagement: { ...defaults.guestManagement, ...partial.guestManagement },
  };
}

// ============================================================================
// Type Guards
// ============================================================================

export function isKitchenBEOData(data: BEOData): data is KitchenBEOData {
  return 'menu' in data && 'prepSchedule' in data;
}

export function isServiceBEOData(data: BEOData): data is ServiceBEOData {
  return 'timeline' in data && 'floorPlan' in data;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  KitchenBEOData,
  ServiceBEOData,
  BEOData,
  BEOType,
};

export {
  KitchenBEODataSchema,
  ServiceBEODataSchema,
  BEOHeaderSchema,
  MenuItemSchema,
  PrepTaskSchema,
  EquipmentCategorySchema,
  StaffAssignmentSchema,
  TimelineEventSchema,
  StaffPositionSchema,
  SpecialNeedSchema,
  ServiceStepSchema,
  SetupCategorySchema,
  BarServiceSchema,
  VendorInfoSchema,
  EmergencyContactSchema,
  AllergenSchema,
};

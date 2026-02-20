/**
 * Centralized Type Definitions for BEO Templates
 * 
 * This file contains all TypeScript interfaces and types used across
 * Kitchen and Service BEO templates for better type safety and IDE support.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface BEOHeader {
  beoNumber: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  clientName: string;
  venue: string;
  logoUrl?: string;
}

export interface AllergenType {
  gluten?: boolean;
  dairy?: boolean;
  nuts?: boolean;
  shellfish?: boolean;
  eggs?: boolean;
  soy?: boolean;
  fish?: boolean;
}

export type AllergenKey = 'gluten' | 'dairy' | 'nuts' | 'shellfish' | 'eggs' | 'soy' | 'fish';

// ============================================================================
// Kitchen BEO Types
// ============================================================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  allergens: AllergenType;
  portionSize?: string;
  cookTime?: string;
  cookingTemperature?: string;
  station?: string;
  prepInstructions?: string[];
  scalingNotes?: string;
  category?: 'appetizer' | 'main' | 'dessert' | 'side';
}

export interface MenuSection {
  appetizers: MenuItem[];
  mains: MenuItem[];
  desserts: MenuItem[];
  sides?: MenuItem[];
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

export interface EquipmentItem {
  name: string;
  quantity: number;
  location?: string;
  setupTime?: string;
  notes?: string;
}

export interface Equipment {
  category: string;
  items: EquipmentItem[];
}

export interface StaffMember {
  name: string;
  position?: string;
  station?: string;
}

export interface StaffAssignment {
  role: string;
  count: number;
  station: string;
  startTime?: string;
  responsibilities?: string[];
  members?: StaffMember[];
  notes?: string;
}

export interface DietaryRestrictions {
  vegetarian?: number;
  vegan?: number;
  glutenFree?: number;
  nutAllergy?: number;
  other?: string;
}

export interface KitchenBEOHeader extends BEOHeader {
  guestCount: number;
}

export interface KitchenBEOData {
  header: KitchenBEOHeader;
  menu: MenuSection;
  prepSchedule: PrepTask[];
  equipment: {
    cooking: Equipment[];
    prep: Equipment[];
    service: Equipment[];
  };
  staffAssignments: StaffAssignment[];
  specialInstructions?: string;
  dietaryRestrictions?: DietaryRestrictions;
}

// ============================================================================
// Service BEO Types
// ============================================================================

export type TimelineEventType = 'setup' | 'service' | 'breakdown';

export interface TimelineEvent {
  time: string;
  label: string;
  sublabel?: string;
  type?: TimelineEventType;
  notes?: string;
}

export interface StaffPosition {
  role: string;
  count: number;
  station?: string;
  startTime?: string;
  responsibilities?: string[];
  members?: StaffMember[];
  notes?: string;
}

export interface SpecialSeating {
  table: string;
  guests: number;
  notes?: string;
}

export interface GuestManagement {
  totalGuests: number;
  vipCount?: number;
  seatingLayout?: string;
  specialSeating?: SpecialSeating[];
  flowPlan?: string;
}

export interface ServiceEquipmentItem {
  name: string;
  quantity: number;
  location: string;
  setupTime?: string;
  notes?: string;
}

export interface ServiceEquipment {
  category: string;
  items: ServiceEquipmentItem[];
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
}

export interface VendorCoordination {
  vendor: string;
  contact: string;
  arrivalTime?: string;
  requirements?: string;
}

export interface ServiceCoordination {
  contactPerson?: string;
  contactPhone?: string;
  emergencyContacts?: EmergencyContact[];
  vendorCoordination?: VendorCoordination[];
  criticalNotes?: string[];
}

export interface ServiceBEOData {
  header: BEOHeader;
  timeline: TimelineEvent[];
  staffPositions: StaffPosition[];
  guestManagement: GuestManagement;
  equipment: {
    dining: ServiceEquipment[];
    bar: ServiceEquipment[];
    decor: ServiceEquipment[];
  };
  coordination: ServiceCoordination;
  floorPlan?: string;
  serviceNotes?: string;
}

// ============================================================================
// PDF Generation Types
// ============================================================================

export type PDFFormat = 'A4' | 'Letter' | 'Legal' | 'Tabloid';
export type PDFOrientation = 'portrait' | 'landscape';
export type PDFReturnFormat = 'buffer' | 'base64';

export interface PDFMargin {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface PDFGenerationOptions {
  format?: PDFFormat;
  orientation?: PDFOrientation;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  margin?: PDFMargin;
  printBackground?: boolean;
  scale?: number;
  width?: string;
  height?: string;
  waitForNetworkIdle?: boolean;
  customCSS?: string;
}

export interface PDFMetadata {
  pages: number;
  fileSize: number;
  generationTime: number;
}

export interface PDFGenerationResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
  metadata?: PDFMetadata;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export type BEOTemplateType = 'kitchen' | 'service';

export interface GeneratePDFRequest {
  type: BEOTemplateType;
  data: KitchenBEOData | ServiceBEOData;
  returnFormat?: PDFReturnFormat;
}

export interface GeneratePDFResponse {
  success: boolean;
  pdf?: string; // Base64 encoded if returnFormat === 'base64'
  metadata?: PDFMetadata & {
    processingTime: number;
    type: BEOTemplateType;
  };
  error?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface KitchenBEOProps {
  data: KitchenBEOData;
}

export interface ServiceBEOProps {
  data: ServiceBEOData;
}

export interface MenuItemCardProps {
  item: MenuItem;
  courseType: string;
}

export interface PrepScheduleProps {
  tasks: PrepTask[];
}

export interface StaffAssignmentsProps {
  assignments: StaffAssignment[];
}

export interface ServiceTimelineProps {
  events: TimelineEvent[];
}

export interface StaffPositioningProps {
  positions: StaffPosition[];
}

export interface GuestManagementProps {
  management: GuestManagement;
}

// ============================================================================
// Utility Types
// ============================================================================

export type Priority = 'high' | 'normal' | 'low';
export type AllergenSize = 'sm' | 'md' | 'lg';

// Helper type for partial BEO data (useful for forms)
export type PartialBEOData<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

// Helper type for required fields only
export type RequiredBEOFields = Pick<
  KitchenBEOData,
  'header' | 'menu' | 'prepSchedule' | 'equipment' | 'staffAssignments'
>;

// ============================================================================
// Validation Helpers
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validateKitchenBEOData(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.header?.beoNumber) errors.push('BEO number is required');
  if (!data.header?.eventName) errors.push('Event name is required');
  if (!data.header?.guestCount || data.header.guestCount < 1) {
    errors.push('Guest count must be greater than 0');
  }
  if (!data.menu) errors.push('Menu data is required');
  if (!data.prepSchedule) errors.push('Prep schedule is required');
  if (!data.equipment) errors.push('Equipment data is required');
  if (!data.staffAssignments) errors.push('Staff assignments are required');

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateServiceBEOData(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.header?.beoNumber) errors.push('BEO number is required');
  if (!data.header?.eventName) errors.push('Event name is required');
  if (!data.timeline || data.timeline.length === 0) {
    errors.push('Timeline events are required');
  }
  if (!data.staffPositions) errors.push('Staff positions are required');
  if (!data.guestManagement?.totalGuests || data.guestManagement.totalGuests < 1) {
    errors.push('Total guest count must be greater than 0');
  }
  if (!data.equipment) errors.push('Equipment data is required');

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// ============================================================================
// Exports
// ============================================================================

export type {
  // Re-export all types for convenience
  BEOHeader,
  AllergenType,
  MenuItem,
  MenuSection,
  PrepTask,
  Equipment,
  StaffAssignment,
  KitchenBEOData,
  ServiceBEOData,
  TimelineEvent,
  GuestManagement,
  ServiceCoordination,
  PDFGenerationOptions,
  PDFGenerationResult,
};

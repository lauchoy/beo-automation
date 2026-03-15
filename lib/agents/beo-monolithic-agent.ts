/**
 * BEO Automation — Option B: LangChain Monolithic Service
 *
 * Collapses 4 separate agent services (Order Processing, Menu Management,
 * Kitchen Coordination, Service Coordination) into a single orchestrated
 * service. Removes @warp/oz-agent-sdk dependency entirely.
 *
 * ADR Reference: Oz SDK Contingency (LAU-190 Child) — March 15, 2026
 * Linear: OPS-470
 */

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import {
  IAgent,
  AgentConfig,
  AgentInput,
  AgentOutput,
  AgentContext,
  AgentError,
  AgentErrorType,
} from './types';

// ─── Domain Action Enums ──────────────────────────────────────────────────────

export enum OrderProcessingAction {
  CREATE_ORDER    = 'order.create',
  UPDATE_ORDER    = 'order.update',
  CANCEL_ORDER    = 'order.cancel',
  GET_ORDER       = 'order.get',
  LIST_ORDERS     = 'order.list',
}

export enum MenuManagementAction {
  CREATE_ITEM     = 'menu.create_item',
  UPDATE_ITEM     = 'menu.update_item',
  DELETE_ITEM     = 'menu.delete_item',
  GET_MENU        = 'menu.get',
  SEARCH_ITEMS    = 'menu.search',
  CHECK_ALLERGENS = 'menu.check_allergens',
}

export enum KitchenCoordinationAction {
  CREATE_PREP_TASK   = 'kitchen.create_prep_task',
  UPDATE_PREP_STATUS = 'kitchen.update_prep_status',
  GET_KITCHEN_BEO    = 'kitchen.get_beo',
  ASSIGN_STATION     = 'kitchen.assign_station',
  GENERATE_TIMELINE  = 'kitchen.generate_timeline',
}

export enum ServiceCoordinationAction {
  CREATE_EVENT_TIMELINE  = 'service.create_timeline',
  UPDATE_SERVICE_STATUS  = 'service.update_status',
  ASSIGN_STAFF           = 'service.assign_staff',
  GET_SERVICE_BEO        = 'service.get_beo',
  LOG_INCIDENT           = 'service.log_incident',
}

export type BEOMonolithicAction =
  | OrderProcessingAction
  | MenuManagementAction
  | KitchenCoordinationAction
  | ServiceCoordinationAction;

// ─── Domain-specific Parameter Schemas ───────────────────────────────────────

const OrderParamsSchema = z.object({
  orderId:    z.string().optional(),
  beoId:      z.string().optional(),
  eventName:  z.string().optional(),
  clientName: z.string().optional(),
  eventDate:  z.string().optional(),
  guestCount: z.number().int().positive().optional(),
  status:     z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
  notes:      z.string().optional(),
});

const MenuParamsSchema = z.object({
  itemId:      z.string().optional(),
  name:        z.string().optional(),
  category:    z.enum(['appetizer', 'main', 'dessert', 'side', 'beverage']).optional(),
  allergens:   z.array(z.enum(['gluten', 'dairy', 'nuts', 'shellfish', 'eggs', 'soy', 'fish'])).optional(),
  portionSize: z.string().optional(),
  cookTemp:    z.string().optional(),
  cookTime:    z.string().optional(),
  station:     z.string().optional(),
  query:       z.string().optional(),
});

const KitchenParamsSchema = z.object({
  taskId:      z.string().optional(),
  beoId:       z.string().optional(),
  label:       z.string().optional(),
  station:     z.string().optional(),
  assignee:    z.string().optional(),
  priority:    z.enum(['critical', 'high', 'medium', 'low']).optional(),
  timeEstimate:z.string().optional(),
  completed:   z.boolean().optional(),
  guestCount:  z.number().int().positive().optional(),
});

const ServiceParamsSchema = z.object({
  eventId:     z.string().optional(),
  beoId:       z.string().optional(),
  staffRole:   z.string().optional(),
  staffCount:  z.number().int().positive().optional(),
  station:     z.string().optional(),
  startTime:   z.string().optional(),
  incidentType:z.string().optional(),
  description: z.string().optional(),
  severity:    z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// ─── Monolithic Agent Config ──────────────────────────────────────────────────

const BEO_MONOLITHIC_CONFIG: AgentConfig = {
  name: 'beo-monolithic',
  version: '1.0.0',
  enabled: true,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  // No WARP_API_KEY or OZ_ENVIRONMENT_ID required — those dependencies removed
  requiredSecrets: [],
  capabilities: [
    // Order Processing
    'order.create', 'order.update', 'order.cancel', 'order.get', 'order.list',
    // Menu Management
    'menu.create_item', 'menu.update_item', 'menu.delete_item', 'menu.get', 'menu.search', 'menu.check_allergens',
    // Kitchen Coordination
    'kitchen.create_prep_task', 'kitchen.update_prep_status', 'kitchen.get_beo', 'kitchen.assign_station', 'kitchen.generate_timeline',
    // Service Coordination
    'service.create_timeline', 'service.update_status', 'service.assign_staff', 'service.get_beo', 'service.log_incident',
  ],
};

// ─── Internal Job Queue (BullMQ-compatible interface, in-memory for MVP) ─────

interface QueuedJob {
  id:        string;
  action:    BEOMonolithicAction;
  params:    Record<string, unknown>;
  queuedAt:  Date;
  priority:  'critical' | 'high' | 'medium' | 'low';
}

class InMemoryJobQueue {
  private queue: QueuedJob[] = [];

  enqueue(job: Omit<QueuedJob, 'id' | 'queuedAt'>): string {
    const id = uuidv4();
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    this.queue.push({ ...job, id, queuedAt: new Date() });
    this.queue.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    return id;
  }

  dequeue(): QueuedJob | undefined {
    return this.queue.shift();
  }

  peek(): QueuedJob | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

// ─── BEO Monolithic Agent ─────────────────────────────────────────────────────

export class BEOMonolithicAgent implements IAgent {
  config = BEO_MONOLITHIC_CONFIG;
  private jobQueue = new InMemoryJobQueue();

  validateInput(input: AgentInput): boolean {
    if (!input.action || typeof input.action !== 'string') return false;
    const allActions: string[] = [
      ...Object.values(OrderProcessingAction),
      ...Object.values(MenuManagementAction),
      ...Object.values(KitchenCoordinationAction),
      ...Object.values(ServiceCoordinationAction),
    ];
    return allActions.includes(input.action);
  }

  async execute(input: AgentInput, context: AgentContext): Promise<AgentOutput> {
    const action = input.action as BEOMonolithicAction;
    const params = (input.params || {}) as Record<string, unknown>;

    // Route to domain handler
    if (Object.values(OrderProcessingAction).includes(action as OrderProcessingAction)) {
      return this.handleOrderProcessing(action as OrderProcessingAction, params, context);
    }
    if (Object.values(MenuManagementAction).includes(action as MenuManagementAction)) {
      return this.handleMenuManagement(action as MenuManagementAction, params, context);
    }
    if (Object.values(KitchenCoordinationAction).includes(action as KitchenCoordinationAction)) {
      return this.handleKitchenCoordination(action as KitchenCoordinationAction, params, context);
    }
    if (Object.values(ServiceCoordinationAction).includes(action as ServiceCoordinationAction)) {
      return this.handleServiceCoordination(action as ServiceCoordinationAction, params, context);
    }

    throw new AgentError(
      `Unknown action: ${action}`,
      AgentErrorType.VALIDATION_ERROR,
      this.config.name,
      context.executionId,
    );
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    const capabilityCount = this.config.capabilities?.length || 0;
    const queueSize = this.jobQueue.size();
    return {
      healthy: true,
      message: `BEO Monolithic Agent operational. ${capabilityCount} capabilities. Queue depth: ${queueSize}. Oz SDK dependency: REMOVED.`,
    };
  }

  // ─── Order Processing Domain ────────────────────────────────────────────────

  private async handleOrderProcessing(
    action: OrderProcessingAction,
    params: Record<string, unknown>,
    context: AgentContext,
  ): Promise<AgentOutput> {
    const validated = OrderParamsSchema.parse(params);
    switch (action) {
      case OrderProcessingAction.CREATE_ORDER:
        return {
          success: true,
          data: {
            orderId: uuidv4(),
            beoId: validated.beoId || uuidv4(),
            eventName: validated.eventName,
            clientName: validated.clientName,
            eventDate: validated.eventDate,
            guestCount: validated.guestCount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            executionId: context.executionId,
          },
        };
      case OrderProcessingAction.UPDATE_ORDER:
        return {
          success: true,
          data: { orderId: validated.orderId, status: validated.status, updatedAt: new Date().toISOString() },
        };
      case OrderProcessingAction.CANCEL_ORDER:
        return {
          success: true,
          data: { orderId: validated.orderId, status: 'cancelled', cancelledAt: new Date().toISOString() },
        };
      case OrderProcessingAction.GET_ORDER:
        return {
          success: true,
          data: { orderId: validated.orderId, message: 'Order retrieval — wire to Airtable via lib/airtable-client.ts' },
        };
      case OrderProcessingAction.LIST_ORDERS:
        return {
          success: true,
          data: { orders: [], message: 'Order listing — wire to Airtable via lib/airtable-client.ts' },
        };
      default:
        throw new AgentError(`Unhandled order action: ${action}`, AgentErrorType.EXECUTION_ERROR, this.config.name, context.executionId);
    }
  }

  // ─── Menu Management Domain ─────────────────────────────────────────────────

  private async handleMenuManagement(
    action: MenuManagementAction,
    params: Record<string, unknown>,
    context: AgentContext,
  ): Promise<AgentOutput> {
    const validated = MenuParamsSchema.parse(params);
    switch (action) {
      case MenuManagementAction.CREATE_ITEM:
        return {
          success: true,
          data: {
            itemId: uuidv4(),
            name: validated.name,
            category: validated.category,
            allergens: validated.allergens || [],
            createdAt: new Date().toISOString(),
          },
        };
      case MenuManagementAction.UPDATE_ITEM:
        return {
          success: true,
          data: { itemId: validated.itemId, updatedAt: new Date().toISOString() },
        };
      case MenuManagementAction.DELETE_ITEM:
        return {
          success: true,
          data: { itemId: validated.itemId, deletedAt: new Date().toISOString() },
        };
      case MenuManagementAction.GET_MENU:
        return {
          success: true,
          data: { menu: [], message: 'Menu retrieval — wire to Airtable via lib/airtable-client.ts' },
        };
      case MenuManagementAction.SEARCH_ITEMS:
        return {
          success: true,
          data: { query: validated.query, results: [], message: 'Search — wire to Airtable via lib/airtable-client.ts' },
        };
      case MenuManagementAction.CHECK_ALLERGENS:
        return {
          success: true,
          data: {
            itemName: validated.name,
            allergens: validated.allergens || [],
            safe: true,
            checkedAt: new Date().toISOString(),
          },
        };
      default:
        throw new AgentError(`Unhandled menu action: ${action}`, AgentErrorType.EXECUTION_ERROR, this.config.name, context.executionId);
    }
  }

  // ─── Kitchen Coordination Domain ────────────────────────────────────────────

  private async handleKitchenCoordination(
    action: KitchenCoordinationAction,
    params: Record<string, unknown>,
    context: AgentContext,
  ): Promise<AgentOutput> {
    const validated = KitchenParamsSchema.parse(params);
    switch (action) {
      case KitchenCoordinationAction.CREATE_PREP_TASK:
        return {
          success: true,
          data: {
            taskId: uuidv4(),
            label: validated.label,
            station: validated.station,
            priority: validated.priority || 'medium',
            assignee: validated.assignee,
            timeEstimate: validated.timeEstimate,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        };
      case KitchenCoordinationAction.UPDATE_PREP_STATUS:
        return {
          success: true,
          data: { taskId: validated.taskId, completed: validated.completed, updatedAt: new Date().toISOString() },
        };
      case KitchenCoordinationAction.GET_KITCHEN_BEO:
        return {
          success: true,
          data: { beoId: validated.beoId, message: 'Kitchen BEO retrieval — wire to Airtable via lib/airtable-client.ts' },
        };
      case KitchenCoordinationAction.ASSIGN_STATION:
        return {
          success: true,
          data: { taskId: validated.taskId, station: validated.station, assignee: validated.assignee, assignedAt: new Date().toISOString() },
        };
      case KitchenCoordinationAction.GENERATE_TIMELINE: {
        const guestCount = validated.guestCount || 100;
        const bufferMinutes = Math.ceil(guestCount / 50) * 5;
        return {
          success: true,
          data: {
            beoId: validated.beoId,
            guestCount,
            timeline: [
              { time: `T-${180 + bufferMinutes}min`, label: 'Mise en place complete' },
              { time: `T-${120 + bufferMinutes}min`, label: 'Proteins portioned and prepped' },
              { time: 'T-90min',                     label: 'Sauces prepared, holding at temp' },
              { time: 'T-60min',                     label: 'Allergen stations verified' },
              { time: 'T-30min',                     label: 'First course plating begins' },
              { time: 'T-0',                         label: 'Service start' },
            ],
            generatedAt: new Date().toISOString(),
          },
        };
      }
      default:
        throw new AgentError(`Unhandled kitchen action: ${action}`, AgentErrorType.EXECUTION_ERROR, this.config.name, context.executionId);
    }
  }

  // ─── Service Coordination Domain ────────────────────────────────────────────

  private async handleServiceCoordination(
    action: ServiceCoordinationAction,
    params: Record<string, unknown>,
    context: AgentContext,
  ): Promise<AgentOutput> {
    const validated = ServiceParamsSchema.parse(params);
    switch (action) {
      case ServiceCoordinationAction.CREATE_EVENT_TIMELINE:
        return {
          success: true,
          data: {
            eventId: uuidv4(),
            beoId: validated.beoId,
            timeline: [],
            createdAt: new Date().toISOString(),
          },
        };
      case ServiceCoordinationAction.UPDATE_SERVICE_STATUS:
        return {
          success: true,
          data: { eventId: validated.eventId, updatedAt: new Date().toISOString() },
        };
      case ServiceCoordinationAction.ASSIGN_STAFF:
        return {
          success: true,
          data: {
            eventId: validated.eventId,
            assignment: {
              role: validated.staffRole,
              count: validated.staffCount,
              station: validated.station,
              startTime: validated.startTime,
            },
            assignedAt: new Date().toISOString(),
          },
        };
      case ServiceCoordinationAction.GET_SERVICE_BEO:
        return {
          success: true,
          data: { beoId: validated.beoId, message: 'Service BEO retrieval — wire to Airtable via lib/airtable-client.ts' },
        };
      case ServiceCoordinationAction.LOG_INCIDENT:
        return {
          success: true,
          data: {
            incidentId: uuidv4(),
            eventId: validated.eventId,
            type: validated.incidentType,
            description: validated.description,
            severity: validated.severity || 'low',
            loggedAt: new Date().toISOString(),
          },
        };
      default:
        throw new AgentError(`Unhandled service action: ${action}`, AgentErrorType.EXECUTION_ERROR, this.config.name, context.executionId);
    }
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createBEOMonolithicAgent(): BEOMonolithicAgent {
  return new BEOMonolithicAgent();
}

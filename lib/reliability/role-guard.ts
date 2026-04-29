import { z } from 'zod';

export const ActorRoleSchema = z.enum([
  'chef',
  'lead',
  'service-manager',
  'ops-manager',
  'admin',
  'system',
]);

export const GuardedActionSchema = z.enum([
  'ready_to_generate',
  'resend_latest_version',
  'view_version_history',
  'dead_letter_replay',
  'dead_letter_manual_resolve',
]);

export type ActorRole = z.infer<typeof ActorRoleSchema>;
export type GuardedAction = z.infer<typeof GuardedActionSchema>;

export type RolePolicy = Record<GuardedAction, ActorRole[]>;

const DEFAULT_ROLE_POLICY: RolePolicy = {
  ready_to_generate: ['lead', 'ops-manager', 'admin', 'system'],
  resend_latest_version: ['lead', 'ops-manager', 'admin', 'system'],
  view_version_history: [
    'chef',
    'lead',
    'service-manager',
    'ops-manager',
    'admin',
    'system',
  ],
  dead_letter_replay: ['ops-manager', 'admin', 'system'],
  dead_letter_manual_resolve: ['lead', 'ops-manager', 'admin', 'system'],
};

function isActorRoleArray(value: unknown): value is ActorRole[] {
  return (
    Array.isArray(value) &&
    value.every(item => ActorRoleSchema.safeParse(item).success)
  );
}

export function parseRolePolicyOverridesFromEnv(): Partial<RolePolicy> {
  const raw = process.env.WORKFLOW_ROLE_POLICY_OVERRIDES;

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const overrides: Partial<RolePolicy> = {};

    for (const action of GuardedActionSchema.options) {
      const maybeRoles = parsed[action];
      if (isActorRoleArray(maybeRoles)) {
        overrides[action] = maybeRoles;
      }
    }

    return overrides;
  } catch {
    return {};
  }
}

export function resolveRolePolicy(
  overrides: Partial<RolePolicy> = {}
): RolePolicy {
  const envOverrides = parseRolePolicyOverridesFromEnv();

  const resolved = { ...DEFAULT_ROLE_POLICY };
  for (const action of GuardedActionSchema.options) {
    const overrideRoles = overrides[action] ?? envOverrides[action];
    if (overrideRoles && overrideRoles.length > 0) {
      resolved[action] = overrideRoles;
    }
  }

  return resolved;
}

export function getAllowedRolesForAction(
  action: GuardedAction,
  overrides: Partial<RolePolicy> = {}
): ActorRole[] {
  const policy = resolveRolePolicy(overrides);
  return policy[action];
}

export function isRoleAllowed(
  action: GuardedAction,
  actorRole: ActorRole,
  overrides: Partial<RolePolicy> = {}
): boolean {
  const allowedRoles = getAllowedRolesForAction(action, overrides);
  return allowedRoles.includes(actorRole);
}

export class RoleGuardError extends Error {
  action: GuardedAction;
  actorRole: ActorRole;
  allowedRoles: ActorRole[];

  constructor(action: GuardedAction, actorRole: ActorRole, allowedRoles: ActorRole[]) {
    super(
      `Role ${actorRole} is not allowed to perform action ${action}. Allowed roles: ${allowedRoles.join(', ')}`
    );

    this.name = 'RoleGuardError';
    this.action = action;
    this.actorRole = actorRole;
    this.allowedRoles = allowedRoles;
  }
}

export function assertRoleAllowed(
  action: GuardedAction,
  actorRole: ActorRole,
  overrides: Partial<RolePolicy> = {}
): void {
  const allowedRoles = getAllowedRolesForAction(action, overrides);

  if (!allowedRoles.includes(actorRole)) {
    throw new RoleGuardError(action, actorRole, allowedRoles);
  }
}

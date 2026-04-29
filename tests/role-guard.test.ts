import { describe, expect, it } from 'vitest';
import {
  RoleGuardError,
  getAllowedRolesForAction,
  isRoleAllowed,
  assertRoleAllowed,
  resolveRolePolicy,
} from '@/lib/reliability/role-guard';

describe('role guard', () => {
  it('allows lead to mark ready_to_generate', () => {
    expect(isRoleAllowed('ready_to_generate', 'lead')).toBe(true);
  });

  it('blocks chef from dead_letter_replay', () => {
    expect(isRoleAllowed('dead_letter_replay', 'chef')).toBe(false);
    expect(() => assertRoleAllowed('dead_letter_replay', 'chef')).toThrow(
      RoleGuardError
    );
  });

  it('supports explicit policy overrides', () => {
    const policy = resolveRolePolicy({
      dead_letter_replay: ['ops-manager', 'admin', 'lead'],
    });

    expect(policy.dead_letter_replay).toContain('lead');
    expect(getAllowedRolesForAction('dead_letter_replay', {
      dead_letter_replay: ['ops-manager', 'admin', 'lead'],
    })).toContain('lead');
  });
});

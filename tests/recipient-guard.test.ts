import { describe, expect, it } from 'vitest';
import { findRecipientMismatches } from '@/lib/reliability/recipient-guard';

describe('recipient guard', () => {
  it('passes valid audience/document/version mapping', () => {
    const mismatches = findRecipientMismatches({
      eventId: 'EVT-100',
      runId: 'run-1',
      version: 2,
      dispatches: [
        {
          audience: 'kitchen',
          recipientEmail: 'kitchen@example.com',
          documentUrl: 'https://cdn.example.com/EVT-100_v02_kitchen.pdf',
          documentAudience: 'kitchen',
          documentVersion: 2,
        },
      ],
    });

    expect(mismatches).toEqual([]);
  });

  it('blocks mismatched document audience', () => {
    const mismatches = findRecipientMismatches({
      eventId: 'EVT-101',
      runId: 'run-2',
      version: 1,
      dispatches: [
        {
          audience: 'service',
          recipientEmail: 'service@example.com',
          documentUrl: 'https://cdn.example.com/EVT-101_v01_client.pdf',
          documentAudience: 'client',
          documentVersion: 1,
        },
      ],
    });

    expect(mismatches).toHaveLength(1);
    expect(mismatches[0].expectedAudience).toBe('service');
    expect(mismatches[0].actualAudience).toBe('client');
    expect(mismatches[0].reason).toContain('does not match expected audience');
  });

  it('blocks mismatched version', () => {
    const mismatches = findRecipientMismatches({
      eventId: 'EVT-102',
      runId: 'run-3',
      version: 3,
      dispatches: [
        {
          audience: 'client',
          recipientEmail: 'client@example.com',
          documentUrl: 'https://cdn.example.com/EVT-102_v02_client.pdf',
          documentAudience: 'client',
          documentVersion: 2,
        },
      ],
    });

    expect(mismatches).toHaveLength(1);
    expect(mismatches[0].reason).toContain('does not match event version 3');
  });
});

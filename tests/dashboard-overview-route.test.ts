import { afterEach, describe, expect, it } from 'vitest';
import { GET } from '@/app/api/dashboard/overview/route';

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
});

describe('dashboard overview route', () => {
  it('redacts sensitive integration and workflow diagnostics in production', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);

    for (const workflow of payload.workflows) {
      expect(Array.isArray(workflow.requiredNodes)).toBe(true);
      expect(Array.isArray(workflow.missingNodes)).toBe(true);
      expect(workflow.requiredNodes.length).toBe(0);
      expect(workflow.missingNodes.length).toBe(0);
      expect(workflow.file).toBe(workflow.id);
    }

    for (const integration of payload.integrations) {
      expect(Array.isArray(integration.requiredEnv)).toBe(true);
      expect(Array.isArray(integration.missingEnv)).toBe(true);
      expect(integration.requiredEnv.length).toBe(0);
      expect(integration.missingEnv.length).toBe(0);
    }
  });
});

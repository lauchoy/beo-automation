import { describe, expect, it } from 'vitest';
import { getDopplerSecret, getDopplerSecrets, type DopplerClient } from '@/lib/doppler';

function createMockDopplerClient(): DopplerClient {
  return {
    secrets: {
      async list() {
        return {
          secrets: {
            AIRTABLE_TOKEN: { computed: 'airtable-token' },
            WARP_API_KEY: { raw: 'warp-raw-key' },
          },
        };
      },
      async get(_project: string, _config: string, name: string) {
        return {
          value: {
            computed: `${name}-value`,
          },
        };
      },
    },
  };
}

describe('doppler secret helpers', () => {
  it('maps known secrets from list response safely', async () => {
    const secrets = await getDopplerSecrets(
      'beo-automation',
      'dev',
      createMockDopplerClient()
    );

    expect(secrets.AIRTABLE_TOKEN).toBe('airtable-token');
    expect(secrets.WARP_API_KEY).toBe('warp-raw-key');
    expect(secrets.environment_id).toBe('');
  });

  it('reads one secret value from get response', async () => {
    const value = await getDopplerSecret(
      'MY_SECRET',
      'beo-automation',
      'dev',
      createMockDopplerClient()
    );

    expect(value).toBe('MY_SECRET-value');
  });
});

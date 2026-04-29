import { DopplerSDK } from '@dopplerhq/node-sdk';

// Initialize Doppler SDK
const doppler = new DopplerSDK({
  accessToken: process.env.DOPPLER_TOKEN,
});

export interface DopplerSecrets {
  AIRTABLE_TOKEN: string;
  WARP_API_KEY: string;
  environment_id: string;
}

interface DopplerSecretValue {
  computed?: string;
  raw?: string;
}

type DopplerSecretsMap = Record<string, DopplerSecretValue | string | undefined>;

export interface DopplerClient {
  secrets: {
    list(
      project: string,
      config: string
    ): Promise<{ secrets?: unknown }>;
    get(
      project: string,
      config: string,
      name: string
    ): Promise<{ value?: unknown }>;
  };
}

function extractSecretValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const secretValue = value as DopplerSecretValue;
    if (typeof secretValue.computed === 'string') {
      return secretValue.computed;
    }
    if (typeof secretValue.raw === 'string') {
      return secretValue.raw;
    }
  }

  return '';
}

function normalizeSecretsMap(value: unknown): DopplerSecretsMap {
  if (value && typeof value === 'object') {
    return value as DopplerSecretsMap;
  }

  return {};
}

/**
 * Fetch secrets from Doppler
 * @param project - Doppler project name
 * @param config - Doppler config name (e.g., 'dev', 'stg', 'prd')
 */
export async function getDopplerSecrets(
  project: string = 'beo-automation',
  config: string = 'dev',
  client: DopplerClient = doppler
): Promise<DopplerSecrets> {
  try {
    const secretsResponse = await client.secrets.list(project, config);
    const secrets = normalizeSecretsMap(secretsResponse.secrets);

    return {
      AIRTABLE_TOKEN: extractSecretValue(secrets.AIRTABLE_TOKEN),
      WARP_API_KEY: extractSecretValue(secrets.WARP_API_KEY),
      environment_id: extractSecretValue(secrets.environment_id),
    };
  } catch (error) {
    console.error('Error fetching Doppler secrets:', error);
    throw new Error('Failed to fetch secrets from Doppler');
  }
}

/**
 * Get a single secret from Doppler
 */
export async function getDopplerSecret(
  name: string,
  project: string = 'beo-automation',
  config: string = 'dev',
  client: DopplerClient = doppler
): Promise<string> {
  try {
    const secret = await client.secrets.get(project, config, name);

    return extractSecretValue(secret.value);
  } catch (error) {
    console.error(`Error fetching secret ${name}:`, error);
    throw new Error(`Failed to fetch secret ${name} from Doppler`);
  }
}

export default doppler;

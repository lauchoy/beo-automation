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

// The @dopplerhq/node-sdk SecretsListResponse type does not expose named secret
// keys directly, but the runtime shape is a map of secret name → { computed, raw }.
// We cast through unknown to access the values without bypassing all type safety.
type DopplerSecretValue = { computed: string; raw: string };
type DopplerSecretsMap = Record<string, DopplerSecretValue>;

/**
 * Fetch secrets from Doppler
 * @param project - Doppler project name
 * @param config - Doppler config name (e.g., 'dev', 'stg', 'prd')
 */
export async function getDopplerSecrets(
  project: string = 'beo-automation',
  config: string = 'dev'
): Promise<DopplerSecrets> {
  try {
    const secrets = await doppler.secrets.list(project, config);
    const secretsMap = secrets as unknown as DopplerSecretsMap;

    return {
      AIRTABLE_TOKEN: secretsMap['AIRTABLE_TOKEN']?.computed || '',
      WARP_API_KEY: secretsMap['WARP_API_KEY']?.computed || '',
      environment_id: secretsMap['environment_id']?.computed || '',
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
  config: string = 'dev'
): Promise<string> {
  try {
    const secret = await doppler.secrets.get(project, config, name);
    const secretData = secret as unknown as DopplerSecretValue;

    return secretData.computed || '';
  } catch (error) {
    console.error(`Error fetching secret ${name}:`, error);
    throw new Error(`Failed to fetch secret ${name} from Doppler`);
  }
}

export default doppler;

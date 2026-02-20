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
    const secrets = await doppler.secrets.list({
      project,
      config,
    });

    return {
      AIRTABLE_TOKEN: secrets.AIRTABLE_TOKEN?.computed || '',
      WARP_API_KEY: secrets.WARP_API_KEY?.computed || '',
      environment_id: secrets.environment_id?.computed || '',
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
    const secret = await doppler.secrets.get({
      project,
      config,
      name,
    });

    return secret.computed || '';
  } catch (error) {
    console.error(`Error fetching secret ${name}:`, error);
    throw new Error(`Failed to fetch secret ${name} from Doppler`);
  }
}

export default doppler;

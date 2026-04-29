import { timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';
import { ActorRole, ActorRoleSchema } from '@/lib/reliability/role-guard';

const AUTHORIZATION_SCHEME = 'Bearer ';

export interface WorkflowAuthContext {
  callerId: string;
  callerRole: ActorRole;
}

export class WorkflowAuthError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'WorkflowAuthError';
    this.status = status;
    this.code = code;
  }
}

function parseBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) {
    return null;
  }

  if (!authorizationHeader.startsWith(AUTHORIZATION_SCHEME)) {
    return null;
  }

  const token = authorizationHeader.slice(AUTHORIZATION_SCHEME.length).trim();
  return token.length > 0 ? token : null;
}

function secureTokenMatch(expected: string, provided: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

function resolveCallerRoleFromEnv(): ActorRole {
  const rawRole = process.env.WORKFLOW_CALLER_ROLE ?? 'system';
  const parsedRole = ActorRoleSchema.safeParse(rawRole);

  if (!parsedRole.success) {
    throw new WorkflowAuthError(
      'Server misconfiguration: WORKFLOW_CALLER_ROLE is invalid.',
      500,
      'internal_auth_config_invalid_role'
    );
  }

  return parsedRole.data;
}

export function assertInternalWorkflowAuth(
  request: NextRequest
): WorkflowAuthContext {
  const configuredToken = process.env.WORKFLOW_INTERNAL_TOKEN;

  if (!configuredToken) {
    throw new WorkflowAuthError(
      'Server misconfiguration: WORKFLOW_INTERNAL_TOKEN is not set.',
      500,
      'internal_auth_config_missing_token'
    );
  }

  const providedToken = parseBearerToken(request.headers.get('authorization'));
  if (!providedToken) {
    throw new WorkflowAuthError(
      'Unauthorized: missing or invalid Authorization bearer token.',
      401,
      'internal_auth_missing_token'
    );
  }

  if (!secureTokenMatch(configuredToken, providedToken)) {
    throw new WorkflowAuthError(
      'Unauthorized: token verification failed.',
      401,
      'internal_auth_invalid_token'
    );
  }

  return {
    callerId: 'internal-workflow',
    callerRole: resolveCallerRoleFromEnv(),
  };
}

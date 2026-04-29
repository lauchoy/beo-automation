import { z } from 'zod';

export const AudienceSchema = z.enum(['kitchen', 'service', 'client']);

export type Audience = z.infer<typeof AudienceSchema>;

export const DispatchItemSchema = z.object({
  audience: AudienceSchema,
  recipientEmail: z.string().email(),
  documentUrl: z.string().url(),
  documentAudience: AudienceSchema.optional(),
  documentVersion: z.number().int().positive().optional(),
});

export const DispatchEnvelopeSchema = z.object({
  eventId: z.string().min(1),
  runId: z.string().min(1),
  version: z.number().int().positive(),
  dispatches: z.array(DispatchItemSchema).min(1),
});

export type DispatchItem = z.infer<typeof DispatchItemSchema>;
export type DispatchEnvelope = z.infer<typeof DispatchEnvelopeSchema>;

export interface RecipientMismatch {
  index: number;
  eventId: string;
  runId: string;
  recipientEmail: string;
  expectedAudience: Audience;
  actualAudience: Audience | 'unknown';
  documentUrl: string;
  reason: string;
}

const AUDIENCE_MATCHERS: Record<Audience, RegExp[]> = {
  kitchen: [/\bkitchen\b/i, /\bboh\b/i, /_kitchen(?:\.|$)/i],
  service: [/\bservice\b/i, /\bfoh\b/i, /_service(?:\.|$)/i],
  client: [/\bclient\b/i, /_client(?:\.|$)/i],
};

export function inferAudienceFromDocumentUrl(documentUrl: string): Audience | null {
  for (const [audience, matchers] of Object.entries(AUDIENCE_MATCHERS) as [
    Audience,
    RegExp[],
  ][]) {
    for (const matcher of matchers) {
      if (matcher.test(documentUrl)) {
        return audience;
      }
    }
  }

  return null;
}

function buildMismatch(
  envelope: DispatchEnvelope,
  dispatch: DispatchItem,
  index: number,
  actualAudience: Audience | 'unknown',
  reasons: string[]
): RecipientMismatch {
  return {
    index,
    eventId: envelope.eventId,
    runId: envelope.runId,
    recipientEmail: dispatch.recipientEmail,
    expectedAudience: dispatch.audience,
    actualAudience,
    documentUrl: dispatch.documentUrl,
    reason: reasons.join(' '),
  };
}

export function findRecipientMismatches(
  envelope: DispatchEnvelope
): RecipientMismatch[] {
  return envelope.dispatches
    .map((dispatch, index) => {
      const reasons: string[] = [];
      const inferredAudience = inferAudienceFromDocumentUrl(dispatch.documentUrl);
      const explicitAudience = dispatch.documentAudience;
      const actualAudience = explicitAudience ?? inferredAudience ?? 'unknown';

      if (explicitAudience && explicitAudience !== dispatch.audience) {
        reasons.push(
          `Explicit documentAudience=${explicitAudience} does not match expected audience=${dispatch.audience}.`
        );
      }

      if (!explicitAudience && inferredAudience === null) {
        reasons.push(
          'Unable to infer audience from documentUrl and no explicit documentAudience was provided.'
        );
      }

      if (inferredAudience && inferredAudience !== dispatch.audience) {
        reasons.push(
          `documentUrl appears to belong to ${inferredAudience}, not expected audience=${dispatch.audience}.`
        );
      }

      if (
        explicitAudience &&
        inferredAudience &&
        explicitAudience !== inferredAudience
      ) {
        reasons.push(
          `Explicit documentAudience=${explicitAudience} conflicts with URL-inferred audience=${inferredAudience}.`
        );
      }

      if (
        dispatch.documentVersion !== undefined &&
        dispatch.documentVersion !== envelope.version
      ) {
        reasons.push(
          `Document version ${dispatch.documentVersion} does not match event version ${envelope.version}.`
        );
      }

      if (reasons.length === 0) {
        return null;
      }

      return buildMismatch(envelope, dispatch, index, actualAudience, reasons);
    })
    .filter((item): item is RecipientMismatch => item !== null);
}

export class RecipientMismatchError extends Error {
  mismatches: RecipientMismatch[];

  constructor(mismatches: RecipientMismatch[]) {
    super('Recipient mismatch guard blocked dispatch.');
    this.name = 'RecipientMismatchError';
    this.mismatches = mismatches;
  }
}

export function assertNoRecipientMismatch(envelope: DispatchEnvelope): void {
  const mismatches = findRecipientMismatches(envelope);
  if (mismatches.length > 0) {
    throw new RecipientMismatchError(mismatches);
  }
}

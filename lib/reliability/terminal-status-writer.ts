import { z } from 'zod';

export const TerminalStatusSchema = z.enum(['Generated', 'Error']);

export const TerminalStatusWriteInputSchema = z.object({
  eventId: z.string().min(1),
  runId: z.string().min(1),
  status: TerminalStatusSchema,
  message: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type TerminalStatusWriteInput = z.infer<typeof TerminalStatusWriteInputSchema>;

export interface TerminalStatusWriteResult {
  provider: 'webhook' | 'mock';
  writtenAt: string;
  reference: string;
}

export interface TerminalStatusWriteOptions {
  forceFailure?: boolean;
}

function shouldForceFailure(options: TerminalStatusWriteOptions = {}): boolean {
  if (options.forceFailure) {
    return true;
  }

  return process.env.SIMULATE_TERMINAL_STATUS_FAILURE === 'true';
}

export async function writeTerminalStatus(
  input: TerminalStatusWriteInput,
  options: TerminalStatusWriteOptions = {}
): Promise<TerminalStatusWriteResult> {
  if (shouldForceFailure(options)) {
    throw new Error('Terminal status write failed (forced failure for reliability testing).');
  }

  const webhookUrl = process.env.TERMINAL_STATUS_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: input.eventId,
        runId: input.runId,
        status: input.status,
        message: input.message,
        metadata: input.metadata,
        writtenAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Terminal status webhook failed (${response.status}): ${errorText || 'unknown error'}`
      );
    }

    return {
      provider: 'webhook',
      writtenAt: new Date().toISOString(),
      reference: `${response.status}`,
    };
  }

  return {
    provider: 'mock',
    writtenAt: new Date().toISOString(),
    reference: `mock-${input.eventId}-${input.runId}`,
  };
}

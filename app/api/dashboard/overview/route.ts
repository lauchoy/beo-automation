import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { DeadLetterReason, listDeadLetters } from '@/lib/reliability/dead-letter';
import generationWorkflowArtifact from '@/workflows/n8n/rosalynn-beo-generation-v1.json';
import deadLetterReconcileWorkflowArtifact from '@/workflows/n8n/rosalynn-beo-dead-letter-reconcile-v1.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IntegrationStatus = {
  id: string;
  label: string;
  requiredEnv: string[];
  configured: boolean;
  missingEnv: string[];
};

type WorkflowArtifactStatus = {
  id: string;
  file: string;
  exists: boolean;
  nodeCount: number;
  requiredNodes: string[];
  missingNodes: string[];
  contractReady: boolean;
  updatedAt: string | null;
};

function hasEnv(name: string): boolean {
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0;
}

function getIntegrationStatus(
  id: string,
  label: string,
  requiredEnv: string[]
): IntegrationStatus {
  const missingEnv = requiredEnv.filter((name) => !hasEnv(name));

  return {
    id,
    label,
    requiredEnv,
    configured: missingEnv.length === 0,
    missingEnv,
  };
}

function nodeNamesFromParsedWorkflow(parsed: unknown): string[] {
  if (!parsed || typeof parsed !== 'object') {
    return [];
  }

  const maybeNodes = (parsed as { nodes?: unknown }).nodes;
  if (!Array.isArray(maybeNodes)) {
    return [];
  }

  return maybeNodes
    .map((node) => {
      if (!node || typeof node !== 'object') {
        return '';
      }

      const name = (node as { name?: unknown }).name;
      return typeof name === 'string' ? name : '';
    })
    .filter(Boolean);
}

async function resolveWorkflowUpdatedAt(
  relativeFile: string
): Promise<string | null> {
  const absolutePath = path.join(process.cwd(), relativeFile);

  try {
    const stats = await fs.stat(absolutePath);
    return stats.mtime.toISOString();
  } catch {
    return null;
  }
}

async function getWorkflowArtifactStatus(
  id: string,
  relativeFile: string,
  parsedWorkflow: unknown,
  requiredNodes: string[]
): Promise<WorkflowArtifactStatus> {
  const nodeNames = nodeNamesFromParsedWorkflow(parsedWorkflow);
  const missingNodes = requiredNodes.filter(
    (requiredNode) => !nodeNames.includes(requiredNode)
  );
  const updatedAt = await resolveWorkflowUpdatedAt(relativeFile);

  return {
    id,
    file: relativeFile,
    exists: nodeNames.length > 0,
    nodeCount: nodeNames.length,
    requiredNodes,
    missingNodes,
    contractReady: missingNodes.length === 0,
    updatedAt,
  };
}

async function getDeadLetterCounts(): Promise<Record<DeadLetterReason, number>> {
  const reasons: DeadLetterReason[] = [
    'terminal_status_write_failed',
    'recipient_mismatch_blocked',
    'role_guard_blocked',
  ];

  const entries = await Promise.all(
    reasons.map(async (reason) => {
      const list = await listDeadLetters(reason);
      return [reason, list.length] as const;
    })
  );

  return Object.fromEntries(entries) as Record<DeadLetterReason, number>;
}

export async function GET() {
  try {
    const [generationWorkflow, reconcileWorkflow, deadLetterCounts] =
      await Promise.all([
        getWorkflowArtifactStatus(
          'generation',
          'workflows/n8n/rosalynn-beo-generation-v1.json',
          generationWorkflowArtifact,
          [
            'Schedule Trigger',
            'Init Run Context',
            'Fetch Ready Events',
            'Normalize Ready Events',
            'Build Render Plan',
            'Authorize Ready To Generate',
            'Render Kitchen PDF',
            'Render Service PDF',
            'Render Client PDF',
            'Recipient Mismatch Guard',
            'Send Emails',
            'Mark Generated',
            'Mark Error',
          ]
        ),
        getWorkflowArtifactStatus(
          'dead-letter-reconcile',
          'workflows/n8n/rosalynn-beo-dead-letter-reconcile-v1.json',
          deadLetterReconcileWorkflowArtifact,
          [
            'Schedule Trigger',
            'Fetch Dead Letters',
            'Authorize Dead Letter Replay',
            'Replay Entry',
          ]
        ),
        getDeadLetterCounts(),
      ]);

    const integrations: IntegrationStatus[] = [
      getIntegrationStatus('notion-composio', 'Notion via Composio', [
        'COMPOSIO_MULTI_EXECUTE_URL',
        'COMPOSIO_API_KEY',
        'NOTION_EVENT_DB_ID',
      ]),
      getIntegrationStatus('carbone', 'Carbone Rendering', [
        'CARBONE_API_TOKEN',
        'CARBONE_TEMPLATE_KITCHEN_ID',
        'CARBONE_TEMPLATE_SERVICE_ID',
        'CARBONE_TEMPLATE_CLIENT_ID',
      ]),
      getIntegrationStatus('workflow-auth', 'Internal Workflow Auth', [
        'WORKFLOW_INTERNAL_TOKEN',
        'WORKFLOW_CALLER_ROLE',
      ]),
      getIntegrationStatus('dead-letter-store', 'Dead-Letter Store', [
        'DEAD_LETTER_DIR',
      ]),
    ];

    const configuredIntegrations = integrations.filter(
      (integration) => integration.configured
    ).length;

    const totalDeadLetters = Object.values(deadLetterCounts).reduce(
      (sum, value) => sum + value,
      0
    );

    const workflowsReady =
      generationWorkflow.contractReady && reconcileWorkflow.contractReady;

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      deploymentMode:
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      summary: {
        workflowsReady,
        configuredIntegrations,
        totalIntegrations: integrations.length,
        totalDeadLetters,
      },
      deadLetters: deadLetterCounts,
      workflows: [generationWorkflow, reconcileWorkflow],
      integrations,
    });
  } catch (error) {
    console.error('Failed to build dashboard overview:', error);

    return NextResponse.json(
      {
        error: 'Failed to build dashboard overview',
      },
      { status: 500 }
    );
  }
}

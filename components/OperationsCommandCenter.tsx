'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileStack,
  Layers,
  Link2,
  Mail,
  RefreshCw,
  ShieldAlert,
  Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DeadLetterReason =
  | 'terminal_status_write_failed'
  | 'recipient_mismatch_blocked'
  | 'role_guard_blocked';

interface IntegrationStatus {
  id: string;
  label: string;
  requiredEnv: string[];
  configured: boolean;
  missingEnv: string[];
}

interface WorkflowArtifactStatus {
  id: string;
  file: string;
  exists: boolean;
  nodeCount: number;
  requiredNodes: string[];
  missingNodes: string[];
  contractReady: boolean;
  updatedAt: string | null;
}

interface DashboardOverview {
  generatedAt: string;
  deploymentMode: 'development' | 'production';
  summary: {
    workflowsReady: boolean;
    configuredIntegrations: number;
    totalIntegrations: number;
    totalDeadLetters: number;
  };
  deadLetters: Record<DeadLetterReason, number>;
  workflows: WorkflowArtifactStatus[];
  integrations: IntegrationStatus[];
}

const PIPELINE_STAGES = [
  {
    label: 'Notion Intake',
    description: 'Chef + lead updates event page and sets Ready to Generate.',
    icon: Layers,
  },
  {
    label: 'Guard + Render',
    description: 'Role gate, recipient mismatch check, then audience render jobs.',
    icon: ShieldAlert,
  },
  {
    label: 'Audience Delivery',
    description: 'Kitchen, service, and client email dispatch from generated links.',
    icon: Mail,
  },
  {
    label: 'Recovery Loop',
    description: 'Dead-letter replay handles failed terminal status writes.',
    icon: RefreshCw,
  },
];

function formatUtc(iso: string | null): string {
  if (!iso) return 'Unavailable';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unavailable';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

export default function OperationsCommandCenter() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/dashboard/overview', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to load dashboard (${response.status})`);
        }

        const payload = (await response.json()) as DashboardOverview;

        if (!cancelled) {
          setOverview(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Unknown dashboard error'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!overview) {
      return {
        workflows: 0,
        integrations: '0/0',
        deadLetters: 0,
        mode: 'unknown',
      };
    }

    return {
      workflows: overview.workflows.filter((workflow) => workflow.contractReady)
        .length,
      integrations: `${overview.summary.configuredIntegrations}/${overview.summary.totalIntegrations}`,
      deadLetters: overview.summary.totalDeadLetters,
      mode: overview.deploymentMode,
    };
  }, [overview]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-stone-300/80 bg-[linear-gradient(145deg,#fffdf7_0%,#f4efe3_58%,#efe6d6_100%)] p-8 shadow-[0_22px_80px_-36px_rgba(20,28,38,0.55)] md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(13,94,104,0.16),transparent_44%),radial-gradient(circle_at_88%_0%,rgba(171,124,62,0.24),transparent_38%)]" />
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="tracking-[0.26em] text-xs uppercase text-stone-600">
                Rosalynn Operations Control
              </p>
              <h1 className="mt-3 text-4xl leading-tight text-stone-900 md:text-6xl">
                BEO Command Center
              </h1>
            </div>
            <div className="rounded-2xl border border-teal-800/15 bg-white/80 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Clock3 className="h-4 w-4 text-teal-700" />
                Snapshot {formatUtc(overview?.generatedAt ?? null)}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    'inline-flex h-2.5 w-2.5 rounded-full',
                    overview?.summary.workflowsReady ? 'bg-emerald-500' : 'bg-amber-500'
                  )}
                />
                <span className="text-stone-700">
                  {overview?.summary.workflowsReady
                    ? 'Workflow contracts ready'
                    : 'Workflow contracts need attention'}
                </span>
              </div>
            </div>
          </div>

          <p className="max-w-3xl text-base text-stone-700 md:text-lg">
            Live readiness view for the Notion-to-BEO pipeline: intake, approval,
            versioned audience outputs, dispatch, and dead-letter recovery.
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-stone-300/70 bg-white/75 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Workflow Contracts
                </p>
                <Workflow className="h-4 w-4 text-teal-700" />
              </div>
              <p className="mt-3 text-3xl text-stone-900">{stats.workflows}</p>
              <p className="mt-1 text-sm text-stone-600">Ready JSON artifacts</p>
            </article>

            <article className="rounded-2xl border border-stone-300/70 bg-white/75 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Integration Readiness
                </p>
                <Link2 className="h-4 w-4 text-teal-700" />
              </div>
              <p className="mt-3 text-3xl text-stone-900">{stats.integrations}</p>
              <p className="mt-1 text-sm text-stone-600">Configured connectors</p>
            </article>

            <article className="rounded-2xl border border-stone-300/70 bg-white/75 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Dead-Letter Queue
                </p>
                <AlertTriangle className="h-4 w-4 text-teal-700" />
              </div>
              <p className="mt-3 text-3xl text-stone-900">{stats.deadLetters}</p>
              <p className="mt-1 text-sm text-stone-600">Open reliability entries</p>
            </article>

            <article className="rounded-2xl border border-stone-300/70 bg-white/75 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Runtime Mode
                </p>
                <FileStack className="h-4 w-4 text-teal-700" />
              </div>
              <p className="mt-3 text-3xl uppercase text-stone-900">{stats.mode}</p>
              <p className="mt-1 text-sm text-stone-600">Current environment</p>
            </article>
          </div>
        </div>
      </section>

      {loading && (
        <section className="rounded-2xl border border-stone-300 bg-white/70 p-8 text-stone-700">
          Loading operational snapshot...
        </section>
      )}

      {error && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50/80 p-8 text-rose-800">
          {error}
        </section>
      )}

      {!loading && !error && overview && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PIPELINE_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <article
                  key={stage.label}
                  className="rounded-2xl border border-stone-300 bg-white/80 p-5 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.7)]"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-teal-700" />
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-stone-600">
                      Stage
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl text-stone-900">{stage.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {stage.description}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-stone-300 bg-white/80 p-6">
              <h3 className="text-2xl text-stone-900">Workflow Artifacts</h3>
              <div className="mt-5 space-y-4">
                {overview.workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="rounded-xl border border-stone-200 bg-stone-50/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-base text-stone-900">{workflow.file}</p>
                      <div className="flex items-center gap-2 text-sm">
                        {workflow.contractReady ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700">Ready</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-700">Gaps</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      Nodes: {workflow.nodeCount} | Updated: {formatUtc(workflow.updatedAt)}
                    </p>
                    {workflow.missingNodes.length > 0 && (
                      <p className="mt-2 text-sm text-amber-700">
                        Missing: {workflow.missingNodes.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-stone-300 bg-white/80 p-6">
              <h3 className="text-2xl text-stone-900">Integration Matrix</h3>
              <div className="mt-5 space-y-4">
                {overview.integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="rounded-xl border border-stone-200 bg-stone-50/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-base text-stone-900">{integration.label}</p>
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]',
                          integration.configured
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        )}
                      >
                        {integration.configured ? 'Configured' : 'Missing'}
                      </span>
                    </div>
                    {!integration.configured && (
                      <p className="mt-2 text-sm text-amber-700">
                        Missing env: {integration.missingEnv.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-2xl border border-stone-300 bg-white/80 p-6">
            <h3 className="text-2xl text-stone-900">Reliability Queue</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Terminal Status Write Failures
                </p>
                <p className="mt-2 text-3xl text-stone-900">
                  {overview.deadLetters.terminal_status_write_failed}
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Recipient Mismatch Blocks
                </p>
                <p className="mt-2 text-3xl text-stone-900">
                  {overview.deadLetters.recipient_mismatch_blocked}
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Role Guard Blocks
                </p>
                <p className="mt-2 text-3xl text-stone-900">
                  {overview.deadLetters.role_guard_blocked}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

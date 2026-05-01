#!/usr/bin/env node

import { readFile } from 'fs/promises';
import path from 'path';

const DEFAULT_WORKFLOW_FILES = [
  'workflows/n8n/rosalynn-beo-generation-v1.json',
  'workflows/n8n/rosalynn-beo-dead-letter-reconcile-v1.json',
];

function getConfig() {
  const baseUrl =
    process.env.N8N_API_BASE_URL ||
    process.env.N8N_BASE_URL ||
    process.env.INTERNAL_N8N_BASE_URL ||
    '';
  const apiKey = process.env.N8N_API_KEY || '';

  if (!baseUrl.trim()) {
    throw new Error('Missing N8N_API_BASE_URL (example: https://your-instance.app.n8n.cloud)');
  }

  if (!apiKey.trim()) {
    throw new Error('Missing N8N_API_KEY (instance API key from n8n Settings > API)');
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    apiKey: apiKey.trim(),
  };
}

async function n8nRequest(config, method, endpoint, body) {
  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    method,
    headers: {
      'X-N8N-API-KEY': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      parsed?.message ||
      parsed?.error ||
      text ||
      `HTTP ${response.status}`;
    throw new Error(`${method} ${endpoint} failed (${response.status}): ${message}`);
  }

  return parsed;
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractWorkflowList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

function toWorkflowUpsertPayload(workflow) {
  const payload = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings || {},
  };

  if (typeof workflow.active === 'boolean') {
    payload.active = workflow.active;
  }

  if (Array.isArray(workflow.tags)) {
    payload.tags = workflow.tags;
  }

  return payload;
}

async function findExistingWorkflow(config, workflowName) {
  const list = await n8nRequest(config, 'GET', '/api/v1/workflows?limit=250');
  const workflows = extractWorkflowList(list);
  return workflows.find((item) => item?.name === workflowName) || null;
}

async function upsertWorkflow(config, workflowPath) {
  const absolutePath = path.resolve(process.cwd(), workflowPath);
  const raw = await readFile(absolutePath, 'utf8');
  const workflow = JSON.parse(raw);

  if (!workflow?.name || !Array.isArray(workflow?.nodes)) {
    throw new Error(`Invalid workflow file: ${workflowPath}`);
  }

  const existing = await findExistingWorkflow(config, workflow.name);
  const existingId = existing?.id ?? existing?._id ?? null;

  const payload = toWorkflowUpsertPayload(workflow);

  if (!existingId) {
    const created = await n8nRequest(config, 'POST', '/api/v1/workflows', payload);
    const createdId = created?.id ?? created?.data?.id ?? created?._id ?? '(unknown-id)';
    console.log(`Created workflow: ${workflow.name} (${createdId})`);
    return;
  }

  try {
    await n8nRequest(config, 'PUT', `/api/v1/workflows/${existingId}`, payload);
    console.log(`Updated workflow: ${workflow.name} (${existingId}) via PUT`);
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('405')) {
      throw error;
    }
  }

  await n8nRequest(config, 'PATCH', `/api/v1/workflows/${existingId}`, payload);
  console.log(`Updated workflow: ${workflow.name} (${existingId}) via PATCH`);
}

async function main() {
  const config = getConfig();
  const requested = process.argv.slice(2);
  const workflowFiles = requested.length > 0 ? requested : DEFAULT_WORKFLOW_FILES;

  for (const workflowPath of workflowFiles) {
    await upsertWorkflow(config, workflowPath);
  }

  console.log('n8n workflow sync complete.');
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});

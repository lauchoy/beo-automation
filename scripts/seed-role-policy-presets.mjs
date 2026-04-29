#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const PRESETS = {
  development: {
    ready_to_generate: ['lead', 'ops-manager', 'admin', 'system'],
    resend_latest_version: ['lead', 'ops-manager', 'admin', 'system'],
    view_version_history: [
      'chef',
      'lead',
      'service-manager',
      'ops-manager',
      'admin',
      'system',
    ],
    dead_letter_replay: ['ops-manager', 'admin', 'system'],
    dead_letter_manual_resolve: ['lead', 'ops-manager', 'admin', 'system'],
  },
  staging: {
    ready_to_generate: ['lead', 'ops-manager', 'admin', 'system'],
    resend_latest_version: ['ops-manager', 'admin', 'system'],
    view_version_history: ['lead', 'service-manager', 'ops-manager', 'admin', 'system'],
    dead_letter_replay: ['ops-manager', 'admin', 'system'],
    dead_letter_manual_resolve: ['ops-manager', 'admin', 'system'],
  },
  production: {
    ready_to_generate: ['lead', 'ops-manager', 'admin', 'system'],
    resend_latest_version: ['ops-manager', 'admin', 'system'],
    view_version_history: ['lead', 'service-manager', 'ops-manager', 'admin', 'system'],
    dead_letter_replay: ['ops-manager', 'admin', 'system'],
    dead_letter_manual_resolve: ['ops-manager', 'admin', 'system'],
  },
};

function parseArgs(argv) {
  const args = {
    env: 'development',
    writeFile: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--env' && argv[i + 1]) {
      args.env = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--write' && argv[i + 1]) {
      args.writeFile = argv[i + 1];
      i += 1;
      continue;
    }
  }

  return args;
}

function formatEnvLine(policyObject) {
  return `WORKFLOW_ROLE_POLICY_OVERRIDES=${JSON.stringify(policyObject)}`;
}

function applyEnvLine(filePath, envLine) {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  let content = '';
  if (fs.existsSync(resolvedPath)) {
    content = fs.readFileSync(resolvedPath, 'utf8');
  }

  const lines = content.length > 0 ? content.split('\n') : [];
  const nextLines = [];
  let replaced = false;

  for (const line of lines) {
    if (line.startsWith('WORKFLOW_ROLE_POLICY_OVERRIDES=')) {
      nextLines.push(envLine);
      replaced = true;
    } else {
      nextLines.push(line);
    }
  }

  if (!replaced) {
    if (nextLines.length > 0 && nextLines[nextLines.length - 1] !== '') {
      nextLines.push('');
    }
    nextLines.push(envLine);
  }

  const finalContent = `${nextLines.join('\n').replace(/\n+$/, '')}\n`;
  fs.writeFileSync(resolvedPath, finalContent, 'utf8');

  return resolvedPath;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const preset = PRESETS[args.env];

  if (!preset) {
    console.error(
      `Unknown environment \"${args.env}\". Valid options: ${Object.keys(PRESETS).join(', ')}`
    );
    process.exit(1);
  }

  const envLine = formatEnvLine(preset);

  if (args.writeFile) {
    const outputPath = applyEnvLine(args.writeFile, envLine);
    console.log(`Wrote role policy preset (${args.env}) to ${outputPath}`);
    return;
  }

  console.log(`# ${args.env} role policy preset`);
  console.log(envLine);
}

main();

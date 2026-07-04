#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');
const {
  CT_PACKAGE_NAME,
  hasCtFlag,
  targetDirFromArgs,
  detectPackageManager,
  patchPackageJson,
} = require('./lib');

const args = process.argv.slice(2);

const createPlaywrightResult = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['--yes', 'create-playwright', ...args],
  { stdio: 'inherit' },
);

if (createPlaywrightResult.status !== 0)
  process.exit(createPlaywrightResult.status || 1);

if (!hasCtFlag(args))
  process.exit(0);

const targetDir = path.resolve(process.cwd(), targetDirFromArgs(args));
if (!patchPackageJson(targetDir))
  process.exit(0);

const packageManager = detectPackageManager(targetDir);
const installArgs = packageManager === 'pnpm'
  ? ['add', '--save-dev', CT_PACKAGE_NAME]
  : packageManager === 'yarn'
    ? ['add', '--dev', CT_PACKAGE_NAME]
    : ['install', '--save-dev', CT_PACKAGE_NAME];

const installResult = spawnSync(packageManager, installArgs, {
  cwd: targetDir,
  stdio: 'inherit',
});

if (installResult.status !== 0)
  process.exit(installResult.status || 1);

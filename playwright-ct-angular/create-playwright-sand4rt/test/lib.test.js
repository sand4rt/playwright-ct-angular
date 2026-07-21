const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  CT_PACKAGE_NAME,
  CT_PACKAGE_VERSION,
  CT_PACKAGE_SPEC,
  hasCtFlag,
  targetDirFromArgs,
  detectPackageManager,
  patchPackageJson,
  installArgsForPackageManager,
} = require('../lib');

test('hasCtFlag detects ct mode', () => {
  assert.equal(hasCtFlag(['--ct']), true);
  assert.equal(hasCtFlag(['--quiet']), false);
});

test('targetDirFromArgs ignores option values and returns positional directory', () => {
  assert.equal(targetDirFromArgs(['--ct', '--lang', 'ts', 'my-app']), 'my-app');
  assert.equal(targetDirFromArgs(['--browser', 'chromium,firefox', '--ct']), '.');
});

test('detectPackageManager follows lock file priority', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-playwright-sand4rt-pm-'));
  fs.writeFileSync(path.join(tempDir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0');
  assert.equal(detectPackageManager(tempDir), 'pnpm');

  fs.rmSync(path.join(tempDir, 'pnpm-lock.yaml'));
  fs.writeFileSync(path.join(tempDir, 'yarn.lock'), '# yarn lockfile');
  assert.equal(detectPackageManager(tempDir), 'yarn');

  fs.rmSync(path.join(tempDir, 'yarn.lock'));
  assert.equal(detectPackageManager(tempDir), 'npm');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('patchPackageJson replaces undefined dependency with ct angular package', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-playwright-sand4rt-pkg-'));
  const packageJsonPath = path.join(tempDir, 'package.json');

  fs.writeFileSync(packageJsonPath, JSON.stringify({
    name: 'fixture',
    devDependencies: {
      undefined: '^0.1.0',
      '@types/node': '^20.0.0',
    },
  }, null, 2));

  assert.equal(patchPackageJson(tempDir), true);

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  assert.equal(packageJson.devDependencies.undefined, undefined);
  assert.equal(packageJson.devDependencies['@types/node'], '^20.0.0');
  assert.equal(packageJson.devDependencies[CT_PACKAGE_NAME], CT_PACKAGE_VERSION);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('installArgsForPackageManager enforces exact dependency installs', () => {
  assert.deepEqual(installArgsForPackageManager('npm'), ['install', '--save-dev', '--save-exact', CT_PACKAGE_SPEC]);
  assert.deepEqual(installArgsForPackageManager('pnpm'), ['add', '--save-dev', '--save-exact', CT_PACKAGE_SPEC]);
  assert.deepEqual(installArgsForPackageManager('yarn'), ['add', '--dev', '--exact', CT_PACKAGE_SPEC]);
});

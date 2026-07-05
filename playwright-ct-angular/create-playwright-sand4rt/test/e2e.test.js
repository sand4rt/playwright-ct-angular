const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const { CT_PACKAGE_NAME, CT_PACKAGE_VERSION } = require('../lib');

test('wrapper creates ct project with angular ct dependency installed', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-playwright-sand4rt-e2e-'));
  const projectDir = path.join(tempDir, 'ct-app');
  const wrapperPath = path.resolve(__dirname, '..', 'index.js');

  try {
    const result = spawnSync(process.execPath, [
      wrapperPath,
      '--ct',
      '--quiet',
      '--no-browsers',
      '--no-examples',
      '--lang',
      'ts',
      projectDir,
    ], {
      cwd: tempDir,
      encoding: 'utf8',
    });

    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    const ignoredBuildScripts = output.includes('ERR_PNPM_IGNORED_BUILDS');
    assert.ok(result.status === 0 || (result.status === 1 && ignoredBuildScripts), output);

    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    assert.equal(packageJson.devDependencies?.undefined, undefined);
    assert.equal(packageJson.devDependencies?.[CT_PACKAGE_NAME], CT_PACKAGE_VERSION);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

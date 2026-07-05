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
  const ctAngularDir = path.resolve(__dirname, '..', '..', '..', 'ct-angular');
  const ctAngularPackageLink = path.join(ctAngularDir, 'node_modules', '@sand4rt', 'experimental-ct-angular');
  const npmVersionResult = spawnSync('npm', ['--version'], { encoding: 'utf8' });
  const npmVersion = npmVersionResult.status === 0 ? npmVersionResult.stdout.trim() : '10';

  let originalCtAngularLinkTarget = null;
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
      env: {
        ...process.env,
        npm_config_user_agent: `npm/${npmVersion} node/v${process.versions.node} ${process.platform} ${process.arch}`,
      },
    });

    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    const ignoredBuildScripts = output.includes('ERR_PNPM_IGNORED_BUILDS');
    assert.ok(result.status === 0 || (result.status === 1 && ignoredBuildScripts), output);

    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    assert.equal(packageJson.devDependencies?.undefined, undefined);
    assert.equal(packageJson.devDependencies?.[CT_PACKAGE_NAME], CT_PACKAGE_VERSION);

    const installedPackagePath = path.join(projectDir, 'node_modules', '@sand4rt', 'experimental-ct-angular');
    assert.equal(fs.existsSync(installedPackagePath), true);

    assert.equal(fs.existsSync(ctAngularPackageLink), true);
    const ctAngularLinkStats = fs.lstatSync(ctAngularPackageLink);
    assert.equal(ctAngularLinkStats.isSymbolicLink(), true);
    originalCtAngularLinkTarget = fs.readlinkSync(ctAngularPackageLink);
    fs.rmSync(ctAngularPackageLink, { force: true });
    fs.symlinkSync(installedPackagePath, ctAngularPackageLink, 'dir');

    const existingTestsResult = spawnSync('pnpm', ['--dir', ctAngularDir, 'exec', 'playwright', 'test', '--list'], {
      encoding: 'utf8',
    });
    assert.equal(existingTestsResult.status, 0);
    assert.match(existingTestsResult.stdout, /render\.spec\.ts/);
  } finally {
    if (originalCtAngularLinkTarget !== null) {
      fs.rmSync(ctAngularPackageLink, { force: true });
      fs.symlinkSync(originalCtAngularLinkTarget, ctAngularPackageLink, 'dir');
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

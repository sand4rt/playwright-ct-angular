const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

const CT_PACKAGE_NAME = '@sand4rt/experimental-ct-angular';
const CT_PACKAGE_VERSION = packageJson.config.ctPackageVersion;
const CT_PACKAGE_SPEC = `${CT_PACKAGE_NAME}@${CT_PACKAGE_VERSION}`;

function hasCtFlag(args) {
  return args.includes('--ct');
}

function targetDirFromArgs(args) {
  const optionsWithValues = new Set(['--browser', '--lang']);
  let skipNext = false;
  let targetDir = '.';

  for (const arg of args) {
    if (skipNext) {
      skipNext = false;
      continue;
    }

    if (optionsWithValues.has(arg)) {
      skipNext = true;
      continue;
    }

    if (!arg.startsWith('-'))
      targetDir = arg;
  }

  return targetDir;
}

function detectPackageManager(projectDir) {
  if (fs.existsSync(path.join(projectDir, 'pnpm-lock.yaml')))
    return 'pnpm';
  if (fs.existsSync(path.join(projectDir, 'yarn.lock')))
    return 'yarn';
  return 'npm';
}

function patchPackageJson(projectDir) {
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(packageJsonPath))
    return false;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.devDependencies ??= {};
  delete packageJson.devDependencies.undefined;
  packageJson.devDependencies[CT_PACKAGE_NAME] = CT_PACKAGE_VERSION;

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  return true;
}

function installArgsForPackageManager(packageManager) {
  if (packageManager === 'pnpm')
    return ['add', '--save-dev', '--save-exact', CT_PACKAGE_SPEC];
  if (packageManager === 'yarn')
    return ['add', '--dev', '--exact', CT_PACKAGE_SPEC];
  return ['install', '--save-dev', '--save-exact', CT_PACKAGE_SPEC];
}

module.exports = {
  CT_PACKAGE_NAME,
  CT_PACKAGE_VERSION,
  CT_PACKAGE_SPEC,
  hasCtFlag,
  targetDirFromArgs,
  detectPackageManager,
  patchPackageJson,
  installArgsForPackageManager,
};

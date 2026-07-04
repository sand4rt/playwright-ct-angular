const fs = require('fs');
const path = require('path');

const CT_PACKAGE_NAME = '@sand4rt/experimental-ct-angular';

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
  packageJson.devDependencies[CT_PACKAGE_NAME] = 'latest';

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  return true;
}

module.exports = {
  CT_PACKAGE_NAME,
  hasCtFlag,
  targetDirFromArgs,
  detectPackageManager,
  patchPackageJson,
};

const fs = require('fs');

const angularVersion = process.env.ANGULAR_VERSION;

if (!angularVersion) {
  throw new Error('ANGULAR_VERSION must be set');
}

const path = 'ct-angular/package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
const angularDeps = [
  '@angular/animations',
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
];
const angularDevDeps = [
  '@angular-devkit/build-angular',
  '@angular/cli',
  '@angular/compiler-cli',
];

for (const name of angularDeps)
  pkg.dependencies[name] = angularVersion;

for (const name of angularDevDeps)
  pkg.devDependencies[name] = angularVersion;

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');

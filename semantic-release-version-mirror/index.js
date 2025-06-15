import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { diff } from 'semver';

export async function analyzeCommits(pluginConfig, { cwd, logger }) {

	const { dependency } = pluginConfig;
	const pathToPackageJson = resolve(cwd, './package.json');
	const packageJson = JSON.parse(readFileSync(pathToPackageJson));
	const dependencyVersion = packageJson.dependencies?.[dependency];

	if (!dependencyVersion) {
		throw new Error(`Dependency ${dependency} not found in ${pathToPackageJson}`);
	}

	const currentVersion = packageJson.version;

	const releaseType = diff(currentVersion, dependencyVersion);

	const message = releaseType
		? `${dependency} version changed from ${currentVersion} to ${dependencyVersion} (${releaseType})`
		: `${dependency} version did not change (${dependencyVersion})`;

	logger.log(message);

	return releaseType;
}

export async function prepare(pluginConfig, { cwd, nextRelease, logger }) {
	const pathToPackageJson = resolve(cwd, './package.json');
	const packageJson = JSON.parse(readFileSync(pathToPackageJson));

	packageJson.version = nextRelease.version;
	writeFileSync(pathToPackageJson, JSON.stringify(packageJson, null, 2));

	logger.log(`Updated ${pathToPackageJson} version to ${nextRelease.version}`);
}

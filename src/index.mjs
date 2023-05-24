#!/usr/bin/env node

import { $, chalk, echo, fs, argv, spinner } from 'zx';
import semver from 'semver';

import { detect, getCommand } from '@antfu/ni';

import { nxRenamedPlugins, nxRescopedPlugins } from './nx-rescoped-plugins.mjs';
import { renameObjKeys, sortObjKeys, objKeysDiff } from './utils.mjs';

// configure zx
$.verbose = false;

// get flags
const force = argv['force'] || argv.force || process.argv.includes('--force');
const updateOverrides =
  argv['update-overrides'] || argv.updateOverrides || process.argv.includes('--update-overrides') || process.argv.includes('--updateOverrides');
const skipInstall = argv['skip-install'] || argv.skipInstall || process.argv.includes('--skip-install') || process.argv.includes('--skipInstall');
const dryRun = argv['dry-run'] || argv.dryRun || process.argv.includes('--dry-run') || process.argv.includes('--dryRun');

async function getNxVersion() {
  const { stdout } = await $`nx --version`;
  return getNxVersionFromStdout(stdout);
}

function getNxVersionFromStdout(stdout) {
  const lines = stdout.split('\n');
  let local = lines[1].split(': ')[1].trim();
  let global = lines[2].split(': ')[1].trim();

  if (local === 'Not found') {
    local = null;
  }
  if (global === 'Not found') {
    global = null;
  }

  return { local: semver.coerce(local), global: semver.coerce(global) };
}

const nxVersion = await getNxVersion();
const pmAgent = (await detect()) || 'npm';

if (!force && !nxVersion.local) {
  // generate the pm install command
  const command = getCommand(pmAgent, 'install', ['--save-dev', 'nx']);
  echo(`Nx is not installed locally.\nPlease run "${chalk.yellow(command)}" to install it locally.`);
  process.exit(1);
}

if (!force && semver.lt(nxVersion.local, '16.0.0')) {
  echo(`Nx version is too old.\nPlease update to at least 16.0.0.\nTo update run "${chalk.yellow('nx migrate latest')}"`);
  process.exit(1);
}

if (!fs.existsSync('package.json')) {
  echo(`No package.json found.\nPlease run "${chalk.yellow('npm init -y')}" to create one.`);
  process.exit(1);
}

const packageJsonData = await spinner('Reading package.json', () => fs.readFileSync('package.json'));

let packageJson;
try {
  packageJson = JSON.parse(packageJsonData);
} catch (e) {
  echo(`Error parsing package.json: ${e.message}`);
  process.exit(1);
}

const nxPluginsMap = { ...nxRenamedPlugins, ...nxRescopedPlugins };

if (packageJson.dependencies) {
  const newDependencies = renameObjKeys(packageJson.dependencies, nxPluginsMap);
  objKeysDiff(newDependencies, packageJson.dependencies).forEach((key) => {
    echo(`Dependency ${chalk.red(key)} was renamed to ${chalk.green(newDependencies[key])}`);
  });
  packageJson.dependencies = sortObjKeys(newDependencies);
}
if (packageJson.devDependencies) {
  const newDevDependencies = renameObjKeys(packageJson.devDependencies, nxPluginsMap);
  objKeysDiff(newDevDependencies, packageJson.devDependencies).forEach((key) => {
    echo(`Dev dependency ${chalk.red(key)} was renamed to ${chalk.green(newDevDependencies[key])}`);
  });
  packageJson.devDependencies = sortObjKeys(newDevDependencies);
}
if (packageJson.peerDependencies) {
  const newPeerDependencies = renameObjKeys(packageJson.peerDependencies, nxPluginsMap);
  objKeysDiff(newPeerDependencies, packageJson.peerDependencies).forEach((key) => {
    echo(`Peer dependency ${chalk.red(key)} was renamed to ${chalk.green(newPeerDependencies[key])}`);
  });
  packageJson.peerDependencies = sortObjKeys(newPeerDependencies);
}
if (updateOverrides && packageJson.overrides) {
  const newOverrDependencies = renameObjKeys(packageJson.overrides, nxPluginsMap);
  objKeysDiff(newOverrDependencies, packageJson.overrides).forEach((key) => {
    echo(`Override dependency ${chalk.red(key)} was renamed to ${chalk.green(newOverrDependencies[key])}`);
  });
  packageJson.overrides = sortObjKeys(newOverrDependencies);
}

if (!dryRun) {
  await spinner('Saving package.json', () => fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2)));
}

if (skipInstall && !dryRun) {
  const command = getCommand(pmAgent, 'install');
  echo(`The package.json file was updated with the new dependencies.\nPlease run "${chalk.yellow(command)}" to install the updated dependencies.`);
  process.exit(0);
} else {
  // install the new dependencies
  await $`ni`;
}

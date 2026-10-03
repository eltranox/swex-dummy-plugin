// Packs the plugin into dist/<name>.asar and writes dist/latest.yml for the SWEX plugin auto update.
import { createPackage } from '@electron/asar';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const stage = path.join(dist, 'stage');

// files that end up inside the asar (add folders like node_modules here if the plugin gets runtime dependencies)
const files = ['index.js', 'package.json'];

const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const fileName = `${pkg.name}.asar`;

// owner/repo, set automatically in GitHub Actions
const repository = process.env.GITHUB_REPOSITORY || 'eltranox/swex-dummy-plugin';
const url = `https://github.com/${repository}/releases/download/v${pkg.version}/${fileName}`;

await rm(dist, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
for (const file of files) {
  await cp(path.join(root, file), path.join(stage, file), { recursive: true });
}

const asarPath = path.join(dist, fileName);
await createPackage(stage, asarPath);
await rm(stage, { recursive: true, force: true });

const asar = await readFile(asarPath);
const yml = [
  `version: ${pkg.version}`,
  `file: ${fileName}`,
  `url: ${url}`,
  `sha512: ${createHash('sha512').update(asar).digest('hex')}`,
  `size: ${asar.length}`,
  `releaseDate: ${new Date().toISOString()}`,
  '',
].join('\n');
await writeFile(path.join(dist, 'latest.yml'), yml);

console.log(`Built ${path.relative(root, asarPath)}\n\n${yml}`);

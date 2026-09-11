#!/usr/bin/env node
/**
 * Build the sample catalog bundles that ship as GitHub release assets.
 *
 *   npm run zip:samples
 *   npm run zip:samples -- --source ../anne-import --only anne
 *
 * The zips are NEVER committed — `data-samples/*.zip` is gitignored. They are
 * uploaded to a release:
 *
 *   gh release upload v1.0.0 data-samples/dist/anne-import.zip
 *
 * Layout: each archive keeps a single wrapping folder (`anne-import/…`), so
 * extracting drops one tidy folder rather than 295 loose files. That folder is
 * what you hand to the importer's folder picker — see
 * docs/import-sample-catalog.md. It is also why the zip cannot be uploaded to
 * the importer directly: its root is the folder, not `catalog.xlsx`.
 */

import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'data-samples', 'dist');

/** Bundles we know how to build, and where their source folders usually live. */
const BUNDLES = [
  { id: 'anne', folder: 'anne-import', label: 'Anne modular sofa' },
  { id: 'kitchen', folder: 'kitchen-import', label: 'Kitchen' },
];

/** Files/folders never worth shipping. */
const EXCLUDE = ['.DS_Store', 'Thumbs.db', 'desktop.ini', '__MACOSX', '.git'];

function parseArgs(argv) {
  const args = { source: null, only: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--source') args.source = argv[i + 1];
    if (argv[i] === '--only') args.only = argv[i + 1];
  }
  return args;
}

/** Where to look for a bundle's source folder, in priority order. */
function candidateDirs(folder, explicitSource) {
  const candidates = [];
  if (explicitSource) candidates.push(resolve(explicitSource));
  candidates.push(join(ROOT, 'data-samples', folder));
  candidates.push(resolve(ROOT, '..', folder));
  if (process.env.USERPROFILE) candidates.push(join(process.env.USERPROFILE, 'Downloads', folder));
  if (process.env.HOME) candidates.push(join(process.env.HOME, 'Downloads', folder));
  return candidates;
}

function findSource(folder, explicitSource) {
  for (const dir of candidateDirs(folder, explicitSource)) {
    if (existsSync(join(dir, 'catalog.xlsx'))) return dir;
  }
  return null;
}

function walk(dir) {
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = walk(full);
      files += sub.files;
      bytes += sub.bytes;
    } else {
      files += 1;
      bytes += statSync(full).size;
    }
  }
  return { files, bytes };
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function have(cmd) {
  try {
    execFileSync(cmd, ['-v'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Zip `<parent>/<folder>` into `dest`, preserving the wrapping folder.
 * Uses the `zip` CLI where available, else PowerShell's Compress-Archive.
 */
function makeZip(parent, folder, dest) {
  if (existsSync(dest)) rmSync(dest);

  if (have('zip')) {
    const excludeArgs = EXCLUDE.flatMap((p) => ['-x', `${folder}/**/${p}`, '-x', `${folder}/${p}`]);
    execFileSync('zip', ['-r', '-q', '-9', dest, folder, ...excludeArgs], {
      cwd: parent,
      stdio: 'inherit',
    });
    return 'zip';
  }

  if (process.platform === 'win32') {
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        `Compress-Archive -Path '${join(parent, folder)}' -DestinationPath '${dest}' -CompressionLevel Optimal -Force`,
      ],
      { stdio: 'inherit' },
    );
    return 'Compress-Archive';
  }

  throw new Error('Neither `zip` nor PowerShell is available to build the archive.');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = args.only ? BUNDLES.filter((b) => b.id === args.only) : BUNDLES;

  if (targets.length === 0) {
    console.error(`Unknown bundle "${args.only}". Known: ${BUNDLES.map((b) => b.id).join(', ')}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  let built = 0;
  let skipped = 0;

  for (const bundle of targets) {
    const source = findSource(bundle.folder, targets.length === 1 ? args.source : null);

    if (!source) {
      console.warn(`- ${bundle.folder}: no source folder with a catalog.xlsx found, skipping.`);
      console.warn(`    looked in:\n      ${candidateDirs(bundle.folder, null).join('\n      ')}`);
      skipped += 1;
      continue;
    }

    const { files, bytes } = walk(source);
    const dest = join(OUT_DIR, `${bundle.folder}.zip`);

    console.log(`- ${bundle.folder}: ${files} files, ${mb(bytes)} from ${source}`);
    const via = makeZip(dirname(source), bundle.folder, dest);
    const zipped = statSync(dest).size;
    console.log(`    -> ${dest} (${mb(zipped)}, via ${via})`);

    if (zipped > 100 * 1024 * 1024) {
      console.warn('    !! over 100 MB — GitHub rejects files this size in a repo.');
      console.warn('       Fine as a release asset (2 GB limit); never commit it.');
    }
    built += 1;
  }

  console.log(`\n${built} built, ${skipped} skipped.`);
  if (built > 0) {
    console.log('Upload with:  gh release upload <tag> data-samples/dist/*.zip');
  }
}

main();

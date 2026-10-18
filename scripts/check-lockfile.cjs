#!/usr/bin/env node
/**
 * Guards against the npm arborist crash `TypeError: Invalid Version:`.
 *
 * Root cause: if package-lock.json contains a non-link entry with no
 * `version` field (usually an untracked folder npm recorded as an empty
 * stub), arborist's Node.canDedupe() runs `semver.gte(other.version,
 * this.version)` on the empty string and throws, breaking `npm install`.
 *
 * This script fails fast with the offending path(s) instead.
 * Run: npm run check:lockfile
 */
const fs = require('node:fs');

const files = ['package-lock.json', 'node_modules/.package-lock.json'].filter((f) =>
  fs.existsSync(f),
);

let failed = false;

for (const file of files) {
  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`FAIL :: ${file} is not valid JSON: ${error.message}`);
    failed = true;
    continue;
  }

  const packages = lock.packages ?? {};
  const bad = [];
  for (const [key, entry] of Object.entries(packages)) {
    if (key === '' || entry.link === true) continue;
    if (!Object.prototype.hasOwnProperty.call(entry, 'version')) {
      bad.push(key);
    }
  }

  if (bad.length > 0) {
    failed = true;
    console.error(`FAIL :: ${file} has ${bad.length} version-less (non-link) entr(y/ies):`);
    for (const key of bad) console.error(`  - ${key}`);
    console.error('       Fix: delete the stale folder(s) above plus node_modules and');
    console.error('       package-lock.json, then run `npm install` to regenerate.');
  } else {
    console.log(`OK   :: ${file} — ${Object.keys(packages).length} entries, no version-less stubs`);
  }
}

process.exit(failed ? 1 : 0);

/**
 * Lists every TODO(client) marker in the source so nothing unconfirmed ships by accident.
 * Usage: npm run todo
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = join(import.meta.dirname, '..');
const dirs = ['src', 'public'];
const exts = /\.(astro|ts|tsx|mdx?|css|svg|json)$/;
const marker = /TODO\(client\)[:\s]*(.*)|<Todo\b[^>]*?text="([^"]*)"/g;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : exts.test(name) ? [p] : [];
  });
}

let count = 0;
for (const file of dirs.flatMap((d) => walk(join(root, d)))) {
  const lines = readFileSync(file, 'utf8').split('\n');
  if (file.endsWith(`${sep}Todo.astro`)) continue;
  lines.forEach((line, i) => {
    for (const m of line.matchAll(marker)) {
      const text = (m[1] ?? m[2] ?? '').replace(/\s*(\*\/|-->|\}\s*\/>|"\s*\/>)\s*$/, '').trim();
      console.log(`${relative(root, file)}:${i + 1}  ${text}`);
      count++;
    }
  });
}
console.log(`\n${count} TODO(client) marker${count === 1 ? '' : 's'}.`);

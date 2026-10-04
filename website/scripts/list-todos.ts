/**
 * Lists every TODO(client) marker in the source so nothing unconfirmed ships by accident.
 * Usage: npm run todo
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = join(import.meta.dirname, '..');
const dirs = ['src', 'public'];
const exts = /\.(astro|ts|tsx|mdx?|css|svg|json)$/;
const lineMarker = /TODO\(client\)[:\s]*(.*)/g;
const todoTag = /<Todo\b[\s\S]*?\btext="([^"]*)"/g;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : exts.test(name) ? [p] : [];
  });
}

function lineNumber(src: string, index: number): number {
  return src.slice(0, index).split('\n').length;
}

function clean(text: string): string {
  return text
    .replace(/\s*(\*\/|-->|\}\s*\/>|"\s*\/>)\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

let count = 0;
for (const file of dirs.flatMap((d) => walk(join(root, d)))) {
  if (file.endsWith(`${sep}Todo.astro`)) continue;
  const src = readFileSync(file, 'utf8');
  const rel = relative(root, file);

  for (const re of [lineMarker, todoTag]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const text = clean(m[1] ?? '');
      console.log(`${rel}:${lineNumber(src, m.index)}  ${text}`);
      count++;
    }
  }
}
console.log(`\n${count} TODO(client) marker${count === 1 ? '' : 's'}.`);

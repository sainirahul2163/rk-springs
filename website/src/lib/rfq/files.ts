/** Drawing / photo upload rules for the RFQ. */

export const MAX_FILES = 5;
export const MAX_TOTAL_BYTES = 25 * 1024 * 1024;

export const ALLOWED_EXT = new Set([
  'pdf',
  'dwg',
  'dxf',
  'step',
  'stp',
  'iges',
  'igs',
  'jpg',
  'jpeg',
  'png',
]);

export const ACCEPT_ATTR = [...ALLOWED_EXT].map((ext) => `.${ext}`).join(',');

const BLOCKED_MIME = new Set([
  'text/html',
  'application/javascript',
  'text/javascript',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
]);

export function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export function sanitiseName(name: string): string {
  const base = name.replace(/\\/g, '/').split('/').pop() ?? 'file';
  const cleaned = base
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned || 'file';
}

export function validateFiles(files: readonly File[]): { ok: true } | { ok: false; error: string } {
  if (files.length > MAX_FILES) {
    return { ok: false, error: `Up to ${MAX_FILES} files, 25 MB in total.` };
  }
  let total = 0;
  for (const file of files) {
    total += file.size;
    if (file.size <= 0) return { ok: false, error: `${file.name}: the file is empty.` };
    if (!ALLOWED_EXT.has(extOf(file.name))) {
      return { ok: false, error: `${file.name}: that file type is not accepted.` };
    }
    const mime = file.type.toLowerCase();
    if (mime && BLOCKED_MIME.has(mime)) {
      return { ok: false, error: `${file.name}: that file type is not accepted.` };
    }
  }
  if (total > MAX_TOTAL_BYTES) {
    return { ok: false, error: 'Files must be 25 MB or less in total.' };
  }
  return { ok: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

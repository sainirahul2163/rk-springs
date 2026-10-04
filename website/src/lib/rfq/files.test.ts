import { describe, expect, it } from 'vitest';
import { sanitiseName, validateFiles } from './files';

function fakeFile(name: string, size: number, type = 'application/pdf'): File {
  const bytes = new Uint8Array(Math.min(size, 8));
  const file = new File([bytes], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('sanitiseName', () => {
  it('strips paths and odd characters', () => {
    expect(sanitiseName('../../etc/passwd.pdf')).toBe('passwd.pdf');
    expect(sanitiseName('My Spring (rev 2).PDF')).toBe('My-Spring-rev-2-.PDF');
  });
});

describe('validateFiles', () => {
  it('accepts a PDF', () => {
    expect(validateFiles([fakeFile('part.pdf', 1200)]).ok).toBe(true);
  });

  it('rejects a blocked type', () => {
    const result = validateFiles([fakeFile('page.html', 200, 'text/html')]);
    expect(result.ok).toBe(false);
  });

  it('rejects more than 5 files', () => {
    const files = Array.from({ length: 6 }, (_, i) => fakeFile(`a${i}.pdf`, 10));
    const result = validateFiles(files);
    expect(result.ok).toBe(false);
  });

  it('rejects a total over 25 MB', () => {
    const result = validateFiles([fakeFile('big.pdf', 26 * 1024 * 1024)]);
    expect(result.ok).toBe(false);
  });

  it('rejects an empty file', () => {
    const result = validateFiles([fakeFile('empty.pdf', 0)]);
    expect(result.ok).toBe(false);
  });
});

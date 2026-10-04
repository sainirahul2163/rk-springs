/** RFQ-YYYYMMDD-XXXX (no I/O/0/1 in the suffix, to avoid misreads). */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const RFQ_CODE_RE = /^RFQ-\d{8}-[A-HJ-NP-Z2-9]{4}$/;

export function makeRfqCode(now = new Date(), random: () => number = Math.random): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += CHARS[Math.floor(random() * CHARS.length)];
  }
  return `RFQ-${year}${month}${day}-${suffix}`;
}

export function makeRfqCodeSecure(now = new Date()): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let i = 0;
  return makeRfqCode(now, () => (bytes[i++] ?? 0) / 256);
}

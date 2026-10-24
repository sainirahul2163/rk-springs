import { site } from '@/data/site';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;
/** Below these, a title or description wastes the room Google gives it. */
export const TITLE_MIN = 30;
export const DESCRIPTION_MIN = 70;

/**
 * "Page | RK Springs & Wireforms" when it fits in 60 characters, otherwise
 * "Page | RK Springs", so the keyword phrase is never cut for the brand.
 * Pass `absolute` to use the title exactly as written.
 */
export function formatTitle(title: string, absolute = false): string {
  if (absolute) return title;
  const full = `${title} | ${site.brand}`;
  if ([...full].length <= TITLE_MAX) return full;
  return `${title} | ${site.shortBrand}`;
}

/** Build-time warnings for over-long titles and descriptions (AGENTS.md rule 3). */
export function seoWarnings(path: string, title: string, description: string): string[] {
  const out: string[] = [];
  const t = [...title].length;
  const d = [...description].length;
  if (t > TITLE_MAX) out.push(`title is ${t} chars (max ${TITLE_MAX})`);
  if (d > DESCRIPTION_MAX) out.push(`description is ${d} chars (max ${DESCRIPTION_MAX})`);
  if (!description.trim()) out.push('description is empty');
  return out.map((w) => `[seo] ${path}: ${w}`);
}

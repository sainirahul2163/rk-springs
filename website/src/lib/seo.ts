import { site } from '@/data/site';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** "Page | RK Springs & Wireforms", unless the page title is marked absolute. */
export function formatTitle(title: string, absolute = false): string {
  return absolute ? title : `${title} | ${site.brand}`;
}

/** Build-time warnings for over-long titles and descriptions (AGENTS.md rule 3). */
export function seoWarnings(path: string, title: string, description: string): string[] {
  const out: string[] = [];
  if (title.length > TITLE_MAX) out.push(`title is ${title.length} chars (max ${TITLE_MAX})`);
  if (description.length > DESCRIPTION_MAX)
    out.push(`description is ${description.length} chars (max ${DESCRIPTION_MAX})`);
  if (!description.trim()) out.push('description is empty');
  return out.map((w) => `[seo] ${path}: ${w}`);
}

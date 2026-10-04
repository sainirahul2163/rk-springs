import { expect, type Page } from '@playwright/test';

/** Wait until an Astro React island has hydrated so fills reach component state. */
export async function waitForHydratedInput(page: Page, selector: string) {
  const field = page.locator(selector).first();
  await field.waitFor({ state: 'visible' });
  await expect
    .poll(
      async () => {
        await field.fill('hydrated');
        // SSR inputs accept fills; React remounts shortly after and clears them.
        await new Promise((resolve) => setTimeout(resolve, 250));
        return field.inputValue();
      },
      { timeout: 15_000 },
    )
    .toBe('hydrated');
  await field.fill('');
}

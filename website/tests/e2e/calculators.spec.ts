import { expect, test } from '@playwright/test';
import { waitForHydratedInput } from './helpers';

test('compression calculator reports rate and pre-fills the RFQ', async ({ page }) => {
  await page.goto('/tools/compression-spring-calculator/');
  await page.locator('form[data-ready="true"]').waitFor();
  await waitForHydratedInput(page, 'input[name="d"]');

  await page.locator('input[name="d"]').fill('1');
  await page.locator('input[name="od"]').fill('10');
  await page.locator('input[name="l0"]').fill('25');
  await page.locator('input[name="nt"]').fill('10');
  await page.locator('select[name="material"]').selectOption('music');

  await expect(page).toHaveURL(/d=1/);
  await expect(page.locator('[aria-live="polite"]')).toContainText('1.75');

  const quote = page.getByRole('link', { name: /Get this spring made/i });
  await expect(quote).toHaveAttribute('href', /type=compression/);
  await expect(quote).toHaveAttribute('href', /d=1/);
  await expect(quote).toHaveAttribute('href', /od=10/);
});

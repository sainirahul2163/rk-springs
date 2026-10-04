import { expect, test } from '@playwright/test';
import { waitForHydratedInput } from './helpers';

test('RFQ two-step form submits to a mocked API', async ({ page }) => {
  await page.route('**/api/rfq/', async (route) => {
    expect(route.request().method()).toBe('POST');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, id: 'RFQ-20261004-A2B3' }),
    });
  });

  await page.goto('/request-a-quote/');
  await page.locator('form[data-ready="true"]').waitFor();
  await waitForHydratedInput(page, 'input[name="name"]');

  await page.locator('input[name="name"]').fill('Test Buyer');
  await page.locator('input[name="company"]').fill('Acme Auto');
  await page.locator('input[name="phone"]').fill('9876543210');
  await page.locator('input[name="email"]').fill('buyer@example.com');
  await page.locator('input[name="city"]').fill('Pune');
  await page.locator('select[name="spring_type"]').selectOption('compression');
  await page.locator('input[name="quantity"]').fill('8000');
  await page.locator('input[name="consent"]').check();

  await expect(page.locator('input[name="name"]')).toHaveValue('Test Buyer');
  await expect(page.locator('input[name="company"]')).toHaveValue('Acme Auto');
  await expect(page.locator('input[name="phone"]')).toHaveValue('9876543210');
  await expect(page.locator('input[name="quantity"]')).toHaveValue('8000');
  await expect(page.locator('select[name="spring_type"]')).toHaveValue('compression');
  await expect(page.locator('input[name="consent"]')).toBeChecked();

  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /PDF, DWG/ }).click(),
  ]);
  await chooser.setFiles({
    name: 'drawing.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 test drawing for quote'),
  });
  await expect(page.getByText(/drawing\.pdf/)).toBeVisible();

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Optional dimensions' })).toBeVisible();

  await page.locator('input[name="wire_d"]').fill('1.0');
  await page.locator('input[name="od"]').fill('10');
  await page.getByRole('button', { name: 'Send quote request' }).click();

  await expect(page).toHaveURL(/\/request-a-quote\/thank-you\/\?id=RFQ-20261004-A2B3/);
  await expect(page.locator('#rfq-code')).toHaveText('RFQ-20261004-A2B3');
});

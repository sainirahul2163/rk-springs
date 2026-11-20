import { expect, test, type Page } from '@playwright/test';

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `horizontal overflow ${overflow}px`).toBeLessThanOrEqual(1);
}

/**
 * The shared header (skip link, mega-menu, mobile nav) is on every page except `/`, which has
 * its own header since the homepage swap of 20 Nov 2026. These two tests use a product page;
 * the homepage header is covered separately below.
 */
test('skip link and mega-menu work from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/springs/torsion-springs/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  await page.getByRole('button', { name: 'Springs' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Springs' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.getByRole('link', { name: /Torsion springs/ }).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Springs' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('mobile nav opens from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/springs/torsion-springs/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Torsion springs' }).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('homepage skip link and header menu work from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  // The homepage header uses a native <details> disclosure, so it needs no script.
  const menu = page.locator('details.hdr-menu');
  await page.locator('summary[aria-label="Menu"]').focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', true);
  await expect(menu.getByRole('link', { name: 'Springs' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', false);
});

test('RFQ fields are labelled and reachable by keyboard', async ({ page }) => {
  await page.goto('/request-a-quote/');
  await page.locator('form[data-ready="true"]').waitFor();
  const name = page.getByRole('textbox', { name: 'Your name' });
  await name.focus();
  await expect(name).toBeFocused();
  await page.keyboard.type('Rahul');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Company' })).toBeFocused();
});

test('RFQ continues to step 2 from the keyboard', async ({ page }) => {
  await page.goto('/request-a-quote/');
  await page.locator('form[data-ready="true"]').waitFor();
  await page.locator('input[name="name"]').fill('Rahul');
  await page.locator('input[name="company"]').fill('Acme');
  await page.locator('input[name="phone"]').fill('9876543210');
  await page.locator('input[name="email"]').fill('buyer@example.com');
  await page.locator('input[name="city"]').fill('Pune');
  await page.locator('select[name="spring_type"]').selectOption('compression');
  await page.locator('input[name="quantity"]').fill('8000');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button', { name: 'Continue' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Optional dimensions' })).toBeVisible();
  await page.locator('input[name="wire_d"]').focus();
  await expect(page.locator('input[name="wire_d"]')).toBeFocused();
});

test('compression calculator fields are labelled and reachable by keyboard', async ({ page }) => {
  await page.goto('/tools/compression-spring-calculator/');
  await page.locator('form[data-ready="true"]').waitFor();
  const wire = page.getByRole('textbox', { name: /Wire diameter/ });
  await wire.focus();
  await expect(wire).toBeFocused();
  await page.keyboard.type('1');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: /Outer diameter/ })).toBeFocused();
});

/**
 * The catalogue art sits in a fixed-height box. It once escaped it — an auto-sized grid row took
 * the photo's natural height, so the part painted over its own title and the next card — so this
 * asserts the rendered image (transform included) stays inside the card it belongs to.
 */
test.describe('catalogue art stays inside its card', () => {
  for (const width of [375, 900, 1512, 1920]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.locator('.cat-art').first().waitFor();
      const spills = await page.evaluate(() =>
        [...document.querySelectorAll('.cat-art')].map((art) => {
          const el = art.querySelector('img, svg');
          if (!el) return 0;
          const a = el.getBoundingClientRect();
          const card = art.closest('.cat-card')!.getBoundingClientRect();
          return Math.round(
            Math.max(0, card.top - a.top) +
              Math.max(0, a.bottom - card.bottom) +
              Math.max(0, card.left - a.left) +
              Math.max(0, a.right - card.right),
          );
        }),
      );
      expect(spills.length).toBeGreaterThan(0);
      expect(
        Math.max(...spills),
        `art spills ${Math.max(...spills)}px out of its card`,
      ).toBeLessThanOrEqual(1);
    });
  }
});

const widths = [360, 390, 768, 1024, 1280, 1440];
const overflowPages = [
  { name: 'home', path: '/' },
  { name: 'torsion', path: '/springs/torsion-springs/' },
  { name: 'measure', path: '/resources/how-to-measure-a-spring/' },
  { name: 'calculator', path: '/tools/compression-spring-calculator/' },
  { name: 'rfq', path: '/request-a-quote/' },
];

test.describe('no horizontal scroll', () => {
  for (const width of widths) {
    for (const pageDef of overflowPages) {
      test(`${width}px ${pageDef.name}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(pageDef.path);
        await noHorizontalScroll(page);
      });
    }
  }
});

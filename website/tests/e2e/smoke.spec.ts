import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', title: /Spring Manufacturer in Pune/ },
  { path: '/springs/torsion-springs/', title: /Torsion/ },
  { path: '/resources/how-to-measure-a-spring/', title: /How to Measure/ },
  { path: '/tools/compression-spring-calculator/', title: /Compression/ },
  { path: '/request-a-quote/', title: /quote|RFQ|Request/i },
  { path: '/industries/electrical-switchgear-springs/', title: /Switchgear/ },
  { path: '/landing/', title: /Pune spring factory preview/ },
];

test.describe('smoke', () => {
  for (const page of pages) {
    test(`${page.path} has one H1 and the expected title`, async ({ page: p }) => {
      const errors: string[] = [];
      p.on('pageerror', (err) => errors.push(err.message));
      await p.goto(page.path);
      await expect(p).toHaveTitle(page.title);
      await expect(p.locator('h1')).toHaveCount(1);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

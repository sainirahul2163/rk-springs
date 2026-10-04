import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'dist/',
      '.vercel/',
      '.astro/',
      'node_modules/',
      'scripts/',
      'tests/e2e/',
      'playwright-report/',
      'test-results/',
      '.lighthouseci/',
      'src/components/seo/Analytics.astro',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // Registers the jsx-a11y plugin globally, so the .tsx block below only adds its rules.
  ...astro.configs['jsx-a11y-strict'],
  {
    files: ['**/*.tsx'],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: jsxA11y.flatConfigs.strict.rules,
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);

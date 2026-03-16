import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for beo-automation E2E tests.
 *
 * Base URL resolves in this priority order:
 *  1. PLAYWRIGHT_BASE_URL  – set by CI after Vercel preview deploys
 *  2. VERCEL_URL           – automatically injected by Vercel
 *  3. http://localhost:3000 – local development fallback
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default defineConfig({
  testDir: './e2e',
  /* Maximum time (ms) one test can run */
  timeout: 30_000,
  /* Fail the build on CI if you accidentally left test.only in source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter */
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    /* Collect trace when retrying a failed test */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

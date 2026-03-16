import { test, expect } from '@playwright/test';

/**
 * Smoke test — verifies the homepage loads successfully.
 * This is the fastest gate: if the deployment is broken, this will fail first.
 */
test.describe('Homepage smoke test', () => {
  test('should load the homepage and return HTTP 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('should have a non-empty page title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should render the main content area', async ({ page }) => {
    await page.goto('/');
    // The Next.js app root is always present after hydration
    await expect(page.locator('#__next, main, [role="main"]').first()).toBeVisible();
  });
});

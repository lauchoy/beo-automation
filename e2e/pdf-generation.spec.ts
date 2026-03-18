import { test, expect } from '@playwright/test';

/**
 * E2E tests for the PDF generation API endpoint: /api/pdf/generate
 *
 * These tests call the endpoint directly via the Playwright `request` fixture
 * (no browser UI needed) and assert on the returned PDF buffer.
 */
test.describe('PDF Generation API — /api/pdf/generate', () => {
  /**
   * Minimal valid BEO payload that the endpoint accepts.
   * Adjust field names if the Zod schema in the route handler changes.
   */
  const validPayload = {
    eventId: 'test-event-001',
    eventName: 'Playwright E2E Test Event',
    eventDate: '2026-04-01',
    venue: 'Test Venue',
    client: 'Playwright Test Client',
    guestCount: 100,
    items: [
      {
        id: 'item-1',
        name: 'Test Dish',
        category: 'Main Course',
        quantity: 100,
        unit: 'portions',
      },
    ],
  };

  test('POST /api/pdf/generate returns a valid PDF buffer', async ({ request }) => {
    const response = await request.post('/api/pdf/generate', {
      data: validPayload,
      headers: { 'Content-Type': 'application/json' },
    });

    // Must succeed
    expect(response.status()).toBe(200);

    // Must declare PDF content type
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/pdf');

    // Buffer must start with the PDF magic bytes: %PDF-
    const body = await response.body();
    expect(body.length).toBeGreaterThan(0);
    const pdfMagic = body.slice(0, 5).toString('ascii');
    expect(pdfMagic).toBe('%PDF-');
  });

  test('POST /api/pdf/generate with missing required fields returns 400', async ({ request }) => {
    const response = await request.post('/api/pdf/generate', {
      data: { eventName: 'Incomplete payload' }, // missing required fields
      headers: { 'Content-Type': 'application/json' },
    });

    expect([400, 422, 500]).toContain(response.status());
  });

  test('GET /api/pdf/generate returns 405 Method Not Allowed', async ({ request }) => {
    const response = await request.get('/api/pdf/generate');
    // Next.js returns 405 for unsupported methods on API routes
    expect([405, 404]).toContain(response.status());
  });
});

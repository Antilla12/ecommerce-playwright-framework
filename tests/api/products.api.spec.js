const { test, expect } = require('@playwright/test');
const { apiBaseUrl } = require('../../config/env');

test.describe('Products API @api', () => {
  test('GET all products returns 200 with expected schema', async ({ request }) => {
    const res = await request.get(`${apiBaseUrl}/productsList`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBeTruthy();

    const firstProduct = body.products[0];
    expect(firstProduct).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(String),
      brand: expect.any(String),
      category: expect.any(Object),
    });
  });

  test('GET all brands returns 200 with list', async ({ request }) => {
    const res = await request.get(`${apiBaseUrl}/brandsList`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.brands)).toBeTruthy();
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('POST to productsList (wrong method) returns method-not-supported code', async ({ request }) => {
    // This API returns responseCode 405 in the JSON body even though HTTP status is 200 —
    // a good example of why schema/body validation matters as much as status codes.
    const res = await request.post(`${apiBaseUrl}/productsList`);
    const body = await res.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });
});

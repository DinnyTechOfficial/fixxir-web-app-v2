import { expect, test, type Page } from '@playwright/test';
import { readLiveFixtures } from '../live-fixtures.mjs';

test.skip(process.env.FIXXIR_LIVE_TESTS !== '1', 'Opt in after verifying the feature database and email sink.');
const apiOrigin = new URL(process.env.FIXXIR_LIVE_API_URL || 'http://127.0.0.1:8181').origin;
const fixtures = readLiveFixtures();

test.beforeEach(async ({ request, baseURL }, info) => {
  test.skip(info.title.includes('published combined quote') && !fixtures.quote, 'Supply a published two-job request fixture.');
  test.skip(info.title.includes('paid fixture') && !fixtures.paid, 'Supply a manually confirmed two-job request fixture.');
  test.skip(info.title.includes('withdrawn offer') && !fixtures.review, 'Supply a two-job request under quote review.');
  test.skip(info.title.includes('funds need review') && !fixtures.payment_review, 'Supply a request whose payment needs review.');
  test.skip(info.title.includes('zero acceptance') && !fixtures.zero, 'Supply a published, unpaid zero-value request.');
  const origin = new URL(baseURL!).origin;
  const response = await request.get(`${apiOrigin}/api/v1/catalog/device-types`, { headers: { Origin: origin } });
  expect(response.ok(), `Allow ${origin} in the feature API CORS settings before running browser journeys.`).toBe(true);
  expect(response.headers()['access-control-allow-origin']).toBe(origin);
});

async function localApiOnly(page: Page, allowZeroInitialization = () => false) {
  // Continue real requests; never mock responses or call payment/provider routes.
  await page.route('**/api/v1/**', route => {
    const url = new URL(route.request().url());
    const permitted = !url.pathname.includes('/payment/') ||
      (url.pathname.endsWith('/payment/initialize') && allowZeroInitialization());
    return url.origin === apiOrigin && permitted ? route.continue() : route.abort();
  });
}

test('real API: two-device intake, contact proof, request session, tracking', async ({ page, request }) => {
  await localApiOnly(page);
  const run = crypto.randomUUID();
  const email = `web-live-${run}@example.com`;
  const phone = `+23480${run.replace(/\D/g, '').padEnd(8, '0').slice(0, 8)}`;
  async function catalog<T>(path: string): Promise<T> {
    const response = await request.get(`${apiOrigin}/api/v1${path}`);
    expect(response.ok(), `Local catalog unavailable: ${path}`).toBe(true);
    const body = await response.json();
    expect(body.error).toBeNull();
    return body.data as T;
  }
  const types = await catalog<{ items: { code: string; label: string }[] }>('/catalog/device-types');
  const fixture = process.env.FIXXIR_LIVE_CATALOG_FIXTURE ? JSON.parse(process.env.FIXXIR_LIVE_CATALOG_FIXTURE) as { device_type: string; manufacturer_id: string; model_id: string } : null;
  let chosen: { type: string; brand: string; model: string } | undefined;
  for (const type of types.items) {
    if (fixture && type.code !== fixture.device_type) continue;
    const brands = await catalog<{ items: { id: string; name: string }[] }>(`/catalog/manufacturers?device_type=${encodeURIComponent(type.code)}&page=1&page_size=100`);
    for (const brand of brands.items) {
      if (fixture && brand.id !== fixture.manufacturer_id) continue;
      const models = await catalog<{ items: { id: string; name: string }[] }>(`/catalog/models?manufacturer_id=${encodeURIComponent(brand.id)}&page=1&page_size=100`);
      const model = fixture ? models.items.find(item => item.id === fixture.model_id) : models.items[0];
      if (model) { chosen = { type: type.label, brand: brand.name, model: model.name }; break; }
    }
    if (chosen) break;
  }
  expect(chosen, 'Seed the local catalog or supply a fixture present in its catalog pages.').toBeTruthy();
  if (!chosen) return;
  await page.goto('/repair/request');
  const next = () => page.getByRole('button', { name: 'Continue', exact: true }).click();
  for (let index = 0; index < 2; index++) {
    if (index) await page.getByRole('button', { name: 'Add another device' }).click();
    await page.getByRole('button', { name: chosen.type, exact: true }).click();
    await page.getByRole('combobox', { name: /Manufacturer/ }).fill(chosen.brand);
    await page.getByRole('option', { name: chosen.brand, exact: true }).click();
    await page.getByRole('combobox', { name: /Model/ }).fill(chosen.model);
    await page.getByRole('option', { name: chosen.model, exact: true }).click();
    await next();
    await page.getByRole('button', { name: 'Not sure', exact: true }).click();
    await page.getByLabel('Tell us more').fill(`Local web integration check ${run}, device ${index + 1}.`);
    await page.getByLabel('Serial number (optional)').fill(`WEB-LIVE-${run}-${index + 1}`);
    await next();
  }
  await page.getByLabel('First name').fill('Web');
  await page.getByLabel('Last name').fill('LiveTest');
  await page.getByPlaceholder('Your phone or WhatsApp number').fill(phone);
  await page.getByLabel('Email', { exact: false }).fill(email);
  await next();
  await page.getByLabel('City / area').fill('Lagos');
  await page.getByLabel('State', { exact: false }).selectOption('Lagos');
  await page.getByRole('button', { name: /I will drop it off/ }).click();
  await next();
  await page.getByRole('button', { name: 'No urgent deadline' }).click();
  await next();
  const createdResponse = page.waitForResponse(response => response.request().method() === 'POST' && new URL(response.url()).pathname === '/api/v1/public/service-requests');
  await page.getByRole('button', { name: 'Submit repair request' }).click();
  const response = await createdResponse;
  expect(response.status()).toBe(201);
  const { data: created } = await response.json();
  expect(created.job_count).toBe(2);
  expect(new Set(created.jobs.map((job: { id: string }) => job.id)).size).toBe(2);
  await page.getByRole('link', { name: /Go to repair tracking/ }).click();
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(`wrong-${run}@example.com`);
  const refused = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/service-request-sessions'));
  await page.getByRole('button', { name: 'View request' }).click();
  expect((await refused).status()).toBe(404);
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(email);
  const accessResponse = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/service-request-sessions'));
  const trackingResponse = page.waitForResponse(result => new URL(result.url()).pathname.endsWith(`/service-requests/${created.id}/tracking`));
  await page.getByRole('button', { name: 'View request' }).click();
  const access = await accessResponse;
  expect(access.status()).toBe(201);
  const { data: session } = await access.json();
  expect(session.service_request_id).toBe(created.id);
  expect(typeof session.access_token).toBe('string');
  expect(session.access_token.length).toBe(64);
  const tracking = await trackingResponse;
  expect(tracking.status()).toBe(200);
  expect(tracking.request().headers().authorization === `Bearer ${session.access_token}`).toBe(true);
  const { data: result } = await tracking.json();
  expect(result.id).toBe(created.id); expect(result.job_count).toBe(2);
  await expect(page.getByText(created.public_lookup_code, { exact: true })).toBeVisible();
  await expect(page.getByText('Your quote is being prepared')).toBeVisible();
  await expect(page.getByRole('button', { name: /Prepare full payment/ })).toHaveCount(0);
});

test('real API: published combined quote and optional selection preview', async ({ page }) => {
  const fixture = fixtures.quote!;
  await localApiOnly(page);
  await page.goto('/repair/quote');
  await page.getByRole('textbox', { name: 'Request lookup code' }).fill(fixture.lookup_code);
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(fixture.contact);
  const quoteResponse = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/quote') && response.request().method() === 'GET');
  await page.getByRole('button', { name: 'View request' }).click();
  const response = await quoteResponse;
  expect(response.status()).toBe(200);
  const { data: quote } = await response.json();
  expect(quote.jobs.length).toBeGreaterThanOrEqual(2);
  expect(quote.publication_fingerprint.length).toBeGreaterThan(0);
  await expect(page.getByRole('heading', { name: 'Your combined quote' })).toBeVisible();
  for (const job of quote.jobs) {
    for (const line of job.lines) {
      if (line.selection_type === 'required') await expect(page.getByRole('checkbox', { name: new RegExp(line.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first()).toBeDisabled();
    }
  }
  const optional = quote.jobs.flatMap((job: { lines: { selection_type: string }[] }) => job.lines).find((line: { selection_type: string }) => line.selection_type === 'optional');
  if (optional && !quote.selection_locked) {
    const summary = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/quote/summary'));
    await page.getByRole('checkbox', { name: new RegExp(optional.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
    const preview = await summary;
    expect(preview.status()).toBe(200);
    const { data: selected } = await preview.json();
    expect(selected.publication_fingerprint).toBe(quote.publication_fingerprint);
    expect(selected.jobs.length).toBe(quote.jobs.length);
    expect(selected.payable_fingerprint.length).toBeGreaterThan(0);
  }
});

test('real API: paid fixture keeps payment locked and serves its frozen receipt', async ({ page, request }) => {
  const fixture = fixtures.paid!;
  await localApiOnly(page);
  await page.goto('/repair/track');
  await page.getByRole('textbox', { name: 'Request lookup code' }).fill(fixture.lookup_code);
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(fixture.contact);
  const accessResponse = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/service-request-sessions'));
  const trackingResponse = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/tracking'));
  await page.getByRole('button', { name: 'View request' }).click();
  const { data: session } = await (await accessResponse).json();
  const { data: tracking } = await (await trackingResponse).json();
  expect(tracking.payment_summary.state).toBe('paid');
  expect(tracking.job_count).toBeGreaterThanOrEqual(2);
  await expect(page.getByText('Payment confirmed', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Prepare full payment|Continue full payment/ })).toHaveCount(0);
  const receipt = await request.get(`${apiOrigin}/api/v1/public/service-requests/${session.service_request_id}/receipt`, { headers: { Authorization: `Bearer ${session.access_token}` } });
  expect(receipt.status()).toBe(200);
  const { data } = await receipt.json();
  expect(data.service_request_id).toBe(tracking.id);
  expect(data.quote.jobs.length).toBeGreaterThanOrEqual(2);
  expect(data.quote.jobs.reduce((sum: number, job: { subtotal: number }) => sum + job.subtotal, 0)).toBe(data.quote.total_amount);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download receipt PDF' }).click();
  expect((await download).suggestedFilename()).toBe('fixxir-receipt.pdf');
});

test('real API: withdrawn offer hides prices and payment during quote review', async ({ page }) => {
  const fixture = fixtures.review!;
  await localApiOnly(page);
  await page.goto('/repair/quote');
  await page.getByRole('textbox', { name: 'Request lookup code' }).fill(fixture.lookup_code);
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(fixture.contact);
  const tracking = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/tracking'));
  const quote = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/quote'));
  await page.getByRole('button', { name: 'View request' }).click();
  const { data } = await (await tracking).json();
  expect(data.job_count).toBeGreaterThanOrEqual(2);
  expect(data.overall_status).toBe('quote_under_review');
  expect((await quote).status()).toBe(412);
  await expect(page.getByText('Your quote is being reviewed')).toBeVisible();
  await expect(page.getByRole('button', { name: /Prepare full payment|Continue full payment/ })).toHaveCount(0);
  await expect(page.getByText(/₦/)).toHaveCount(0);
});

test('real API: funds need review without claiming payment is settled', async ({ page }) => {
  const fixture = fixtures.payment_review!;
  await localApiOnly(page);
  await page.goto('/repair/quote');
  await page.getByRole('textbox', { name: 'Request lookup code' }).fill(fixture.lookup_code);
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(fixture.contact);
  const tracking = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/tracking'));
  await page.getByRole('button', { name: 'View request' }).click();
  const { data } = await (await tracking).json();
  expect(data.payment_summary.state).toBe('needs_review');
  await expect(page.getByRole('alert').filter({ hasText: 'Do not make another payment' })).toBeVisible();
  const pay = page.getByRole('button', { name: /Prepare full payment|Continue full payment/ });
  if (await pay.count()) await expect(pay).toBeDisabled();
  await expect(page.getByText('Payment confirmed', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download receipt PDF' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Pay securely with Paystack' })).toHaveCount(0);
});

test('real API: zero acceptance needs no provider and produces no paid receipt', async ({ page }) => {
  const fixture = fixtures.zero!;
  let permitInitialization = false;
  await localApiOnly(page, () => permitInitialization);
  await page.goto('/repair/quote');
  await page.getByRole('textbox', { name: 'Request lookup code' }).fill(fixture.lookup_code);
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill(fixture.contact);
  const quoteResponse = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/quote'));
  await page.getByRole('button', { name: 'View request' }).click();
  const { data: quote } = await (await quoteResponse).json();
  expect(quote.total_amount).toBe(0);
  expect(quote.selection_locked).toBe(false);
  permitInitialization = true;
  const accepted = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/payment/initialize'));
  await page.getByRole('button', { name: 'Confirm services' }).click();
  const result = await accepted;
  expect(result.status()).toBe(200);
  const { data } = await result.json();
  expect(data.state).toBe('payment_not_required');
  expect(data.payment).toBeUndefined();
  await expect(page.getByText('Your services are confirmed. No payment is required.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download receipt PDF' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Pay securely with Paystack' })).toHaveCount(0);
});

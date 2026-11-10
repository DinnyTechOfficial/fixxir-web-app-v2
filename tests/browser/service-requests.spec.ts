import { expect, test, type Page } from '@playwright/test';

const id = '11111111-1111-4111-8111-111111111111';
const session = { service_request_id: id, access_token: 'a'.repeat(64), expires_at: new Date(Date.now() + 3600000).toISOString() };
const detail = {
  id, public_lookup_code: 'ABCD1234', job_count: 2, overall_status: 'awaiting_payment',
  collection: { status: 'received' }, return: { status: 'awaiting_devices' },
  quote_summary: { publication_id: 'pub', publication_fingerprint: 'p', total_amount: 55000, currency: 'NGN' }, payment_summary: { state: 'unpaid' },
  jobs: [{ id: 'job-a', device_name: 'MacBook Pro', status: 'diagnosed' }, { id: 'job-b', device_name: 'iPhone', status: 'diagnosed' }],
};
const quote = {
  publication_id: 'pub', publication_fingerprint: 'p', payable_fingerprint: 's', currency: 'NGN', total_amount: 55000, selection_locked: false,
  jobs: [
    { repair_job_id: 'job-a', device_name: 'MacBook Pro', subtotal: 20000, lines: [{ id: 'required-a', label: 'Screen repair', selection_type: 'required', selected: true, amount: 20000 }] },
    { repair_job_id: 'job-b', device_name: 'iPhone', subtotal: 35000, lines: [{ id: 'required-b', label: 'Battery repair', selection_type: 'required', selected: true, amount: 30000 }, { id: 'optional', label: 'Cleaning', selection_type: 'optional', selected: true, amount: 5000 }] },
  ],
};

async function savedAccess(page: Page) {
  await page.addInitScript(value => sessionStorage.setItem('fixxir-service-request-session-v1', JSON.stringify(value)), session);
}

test('tracking uses a request session and hides unpublished prices', async ({ page }) => {
  await savedAccess(page);
  await page.route('**/api/v1/**', route => {
    if (route.request().url().endsWith('/quote')) return route.fulfill({ status: 412, json: { error: { message: 'Not published' } } });
    expect(route.request().headers().authorization).toBe(`Bearer ${session.access_token}`);
    return route.fulfill({ json: { data: { ...detail, quote_summary: null }, error: null } });
  });
  await page.goto('/repair/track/ABCD1234');
  await expect(page.getByText('MacBook Pro', { exact: true })).toBeVisible();
  await expect(page.getByText('iPhone', { exact: true })).toBeVisible();
  await expect(page.getByText('Your quote is being prepared')).toBeVisible();
  await expect(page.getByRole('button', { name: /Prepare full payment/ })).toHaveCount(0);
  await expect(page.getByText(/₦/)).toHaveCount(0);
});

test('one full payment handles 202 and displays every supported method', async ({ page }) => {
  await savedAccess(page);
  let initializations = 0;
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/quote')) return route.fulfill({ json: { data: quote } });
    if (path.endsWith('/payment/initialize')) {
      const body = route.request().postDataJSON();
      expect(body.expected_publication_fingerprint).toBe('p');
      expect(body.jobs).toEqual([{ repair_job_id: 'job-a', selected_optional_line_ids: [] }, { repair_job_id: 'job-b', selected_optional_line_ids: ['optional'] }]);
      if (++initializations === 1) return route.fulfill({ status: 202, headers: { 'Retry-After': '2' }, json: { data: { state: 'initializing', retry_after_seconds: 2 } } });
      return route.fulfill({ json: { data: { state: 'ready', payment: { reference: 'ref-one', amount: 55000, currency: 'NGN', methods: {
        hosted_checkout: { authorization_url: 'https://checkout.paystack.com/test' },
        generated_transfer_account: { bank_name: 'Generated Bank', account_name: 'Ada', account_number: '1234567890' },
        company_bank_transfer_fallback: { bank_name: 'Company Bank', account_name: 'Fixxir', account_number: '0987654321', payment_reference_note: 'ref-one' },
      } } } } });
    }
    return route.fulfill({ json: { data: detail } });
  });
  await page.goto('/repair/quote');
  await page.getByRole('button', { name: /Prepare full payment/ }).click();
  await expect(page.getByText('Preparing your full request payment…')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pay securely with Paystack' })).toHaveAttribute('href', 'https://checkout.paystack.com/test');
  await expect(page.getByText('Generated Bank')).toBeVisible();
  await expect(page.getByText('Company Bank', { exact: true })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: /Cleaning/ })).toBeDisabled();
  expect(initializations).toBe(2);
});

test('stale initialization reloads review state and removes payment', async ({ page }) => {
  await savedAccess(page);
  let withdrawn = false;
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/payment/initialize')) { withdrawn = true; return route.fulfill({ status: 409, json: { error: { message: 'Offer changed' } } }); }
    if (path.endsWith('/quote')) return withdrawn ? route.fulfill({ status: 412, json: { error: { message: 'Withdrawn' } } }) : route.fulfill({ json: { data: quote } });
    return route.fulfill({ json: { data: withdrawn ? { ...detail, overall_status: 'quote_under_review', quote_summary: null } : detail } });
  });
  await page.goto('/repair/quote');
  await page.getByRole('button', { name: /Prepare full payment/ }).click();
  await expect(page.getByText('Your quote is being reviewed')).toBeVisible();
  await expect(page.getByRole('button', { name: /Prepare full payment/ })).toHaveCount(0);
  await expect(page.getByRole('alert').filter({ hasText: 'offer changed' })).toBeVisible();
});

test('return URL is not proof of payment and receipts require auth', async ({ page }) => {
  await savedAccess(page);
  let paid = false;
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/payment/verify')) {
      expect(route.request().postDataJSON()).toEqual({ reference: 'known-ref' });
      return route.fulfill({ json: { data: { state: paid ? 'paid' : 'pending' } } });
    }
    if (path.endsWith('/receipt/pdf')) {
      expect(route.request().headers().authorization).toBe(`Bearer ${session.access_token}`);
      return route.fulfill({ contentType: 'application/pdf', body: '%PDF-1.4\n%%EOF' });
    }
    if (path.endsWith('/quote')) return route.fulfill({ json: { data: { ...quote, selection_locked: paid } } });
    return route.fulfill({ json: { data: { ...detail, payment_summary: { state: paid ? 'paid' : 'pending' } } } });
  });
  await page.goto('/repair/payment/return?reference=known-ref');
  await expect(page.getByRole('status').filter({ hasText: 'Payment status: pending' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download receipt PDF' })).toHaveCount(0);
  paid = true;
  await page.getByRole('button', { name: 'Check payment status' }).click();
  await expect(page.getByRole('button', { name: 'Download receipt PDF' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download receipt PDF' }).click();
  expect((await download).suggestedFilename()).toBe('fixxir-receipt.pdf');
});

test('email token is exchanged only on click and removed from the URL', async ({ page }) => {
  let exchanges = 0;
  await page.route('**/api/v1/**', route => {
    if (route.request().url().endsWith('/exchange')) { exchanges++; return route.fulfill({ json: { data: session } }); }
    if (route.request().url().endsWith('/quote')) return route.fulfill({ json: { data: quote } });
    return route.fulfill({ json: { data: detail } });
  });
  await page.goto(`/repair/quote#email_token=${'b'.repeat(64)}`);
  await expect(page.getByRole('button', { name: 'Continue securely' })).toBeVisible();
  expect(exchanges).toBe(0);
  expect(new URL(page.url()).hash).toBe('');
  await page.getByRole('button', { name: 'Continue securely' }).click();
  await expect(page.getByRole('heading', { name: 'Your combined quote' })).toBeVisible();
  expect(exchanges).toBe(1);
});

test('multi-device intake keeps IDs through editing and reuses the creation token on retry', async ({ page }) => {
  let summaries = 0;
  let creations = 0;
  let firstPayload: Record<string, unknown> | undefined;
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/device-types')) return route.fulfill({ json: { data: { items: [{ code: 'phone', label: 'Phone', issues: ['No power'] }] } } });
    if (path.endsWith('/manufacturers')) return route.fulfill({ json: { data: { items: [{ id: 'brand', name: 'Apple' }], has_next: false } } });
    if (path.endsWith('/models')) return route.fulfill({ json: { data: { items: [{ id: 'model', name: 'iPhone 15' }], has_next: false } } });
    if (path.endsWith('/summary')) {
      summaries++;
      const input = route.request().postDataJSON();
      expect(input.service_type).toBe('repair'); expect(input.jobs).toHaveLength(2);
      expect(input.model_id).toBeUndefined();
      expect(new Set(input.jobs.map((job: { client_item_id: string }) => job.client_item_id)).size).toBe(2);
      expect(input.return_handoff_method).toBe('courier_return');
      expect(input.return_address_line_1).toBe('20 Return Street');
      expect(input.jobs[0].device_serial_number).toBe('edited-serial');
      return route.fulfill({ json: { data: { token: 'submission-token' } } });
    }
    if (path.endsWith('/service-requests')) {
      creations++;
      const input = route.request().postDataJSON();
      if (!firstPayload) firstPayload = input;
      else expect(input).toEqual(firstPayload);
      expect(input.submission_token).toBe('submission-token');
      if (creations === 1) return route.fulfill({ status: 503, json: { error: { message: 'Retry this submission' } } });
      return route.fulfill({ json: { data: { id, public_lookup_code: 'ABCD1234', job_count: 2 } } });
    }
    return route.fulfill({ status: 404, json: { error: { message: 'Unexpected route' } } });
  });
  await page.goto('/repair/request');
  const continueStep = () => page.getByRole('button', { name: 'Continue', exact: true }).click();
  async function device(serial: string) {
    await page.getByRole('button', { name: 'Phone', exact: true }).click();
    await page.getByRole('combobox', { name: /Manufacturer/ }).fill('Apple');
    await page.getByRole('option', { name: 'Apple', exact: true }).click();
    await page.getByRole('combobox', { name: /Model/ }).fill('iPhone');
    await page.getByRole('option', { name: 'iPhone 15', exact: true }).click();
    await continueStep();
    await page.getByRole('button', { name: 'No power', exact: true }).click();
    await page.getByLabel('Serial number (optional)').fill(serial);
    await continueStep();
  }
  await device('first-serial');
  await page.getByRole('button', { name: 'Add another device' }).click();
  await device('second-serial');
  await expect(page.getByRole('button', { name: 'Edit', exact: true })).toHaveCount(2);
  const originalIds = await page.locator('[data-client-item-id]').evaluateAll(elements => elements.map(element => element.getAttribute('data-client-item-id')));
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
  await continueStep();
  await page.getByLabel('Serial number (optional)').fill('edited-serial');
  await continueStep();
  expect(await page.locator('[data-client-item-id]').evaluateAll(elements => elements.map(element => element.getAttribute('data-client-item-id')))).toEqual(originalIds);
  await page.getByLabel('First name').fill('Ada');
  await page.getByLabel('Last name').fill('Okafor');
  await page.getByPlaceholder('Your phone or WhatsApp number').fill('+2348012345678');
  await page.getByLabel('Email', { exact: false }).fill('ada@example.com');
  await continueStep();
  await page.getByLabel('City / area').fill('Lagos');
  await page.getByLabel('State', { exact: false }).selectOption('Lagos');
  await page.getByRole('button', { name: /I will drop it off/ }).click();
  await continueStep();
  await page.getByRole('button', { name: 'No urgent deadline' }).click();
  await continueStep();
  await page.getByLabel('Return method').selectOption('courier_return');
  await page.getByLabel('Return address', { exact: true }).fill('20 Return Street');
  await page.getByLabel('Return city', { exact: true }).fill('Lagos');
  await page.getByLabel('Return state', { exact: true }).fill('Lagos');
  await page.getByRole('button', { name: 'Submit repair request' }).click();
  await expect(page.getByText('Retry this submission')).toBeVisible();
  await page.getByRole('button', { name: 'Submit repair request' }).click();
  await expect(page).toHaveURL(/\/repair\/request\/success\?lookup=ABCD1234/);
  await expect(page.getByRole('list', { name: 'Submitted devices' }).getByRole('listitem')).toHaveCount(2);
  expect(summaries).toBe(1); expect(creations).toBe(2);
});

test('optional services use full-job previews and submit the returned payable fingerprint', async ({ page }) => {
  await savedAccess(page);
  const selected = structuredClone(quote);
  selected.jobs[1].lines[1].selected = false;
  selected.jobs[1].subtotal = 30000;
  selected.total_amount = 50000;
  selected.payable_fingerprint = 'changed-selection';
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/quote/summary')) {
      expect(route.request().postDataJSON()).toEqual({ expected_publication_fingerprint: 'p', jobs: [{ repair_job_id: 'job-a', selected_optional_line_ids: [] }, { repair_job_id: 'job-b', selected_optional_line_ids: [] }] });
      return route.fulfill({ json: { data: selected } });
    }
    if (path.endsWith('/payment/initialize')) {
      expect(route.request().postDataJSON().expected_payable_fingerprint).toBe('changed-selection');
      return route.fulfill({ status: 412, json: { error: { message: 'Offer withdrawn' } } });
    }
    if (path.endsWith('/quote')) return route.fulfill({ json: { data: quote } });
    return route.fulfill({ json: { data: detail } });
  });
  await page.goto('/repair/quote');
  await expect(page.getByRole('checkbox', { name: /Screen repair/ })).toBeDisabled();
  await page.getByRole('checkbox', { name: /Cleaning/ }).uncheck();
  const pay = page.getByRole('button', { name: /Prepare full payment of ₦50,000/ });
  await expect(pay).toBeEnabled();
  await pay.click();
  await expect(page.getByRole('alert').filter({ hasText: 'offer changed' })).toBeVisible();
});

test('accepted pending checkout can resume after refresh without changing selections', async ({ page }) => {
  await savedAccess(page);
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/payment/initialize')) return route.fulfill({ json: { data: { state: 'ready', summary: { ...quote, selection_locked: true }, payment: { provider: 'paystack', status: 'pending', reference: 'same-ref', amount: 55000, currency: 'NGN', methods: { hosted_checkout: { authorization_url: 'https://checkout.paystack.com/same-checkout' } } } } } });
    if (path.endsWith('/quote')) return route.fulfill({ json: { data: { ...quote, selection_locked: true } } });
    return route.fulfill({ json: { data: { ...detail, payment_summary: { state: 'pending' } } } });
  });
  await page.goto('/repair/quote');
  await expect(page.getByRole('checkbox', { name: /Cleaning/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Continue full payment' }).click();
  await expect(page.getByRole('link', { name: 'Pay securely with Paystack' })).toHaveAttribute('href', 'https://checkout.paystack.com/same-checkout');
});

test('needs_review is not paid and blocks another payment', async ({ page }) => {
  await savedAccess(page);
  let initializations = 0;
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/payment/initialize')) initializations++;
    if (path.endsWith('/quote')) return route.fulfill({ json: { data: quote } });
    return route.fulfill({ json: { data: { ...detail, payment_summary: { state: 'needs_review' } } } });
  });
  await page.goto('/repair/quote');
  await expect(page.getByRole('alert').filter({ hasText: 'Do not make another payment' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Prepare full payment/ })).toBeDisabled();
  await expect(page.getByText('Payment confirmed', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download receipt PDF' })).toHaveCount(0);
  expect(initializations).toBe(0);
});

test('zero quote confirms services without checkout or a fabricated paid receipt', async ({ page }) => {
  await savedAccess(page);
  let accepted = false;
  const freeQuote = { ...quote, total_amount: 0, jobs: quote.jobs.map(job => ({ ...job, subtotal: 0, lines: job.lines.map(line => ({ ...line, amount: 0 })) })) };
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/payment/initialize')) { accepted = true; return route.fulfill({ json: { data: { state: 'payment_not_required', summary: { ...freeQuote, selection_locked: true }, available_methods: [] } } }); }
    if (path.endsWith('/quote')) return route.fulfill({ json: { data: { ...freeQuote, selection_locked: accepted } } });
    return route.fulfill({ json: { data: { ...detail, payment_summary: { state: accepted ? 'payment_not_required' : 'unpaid' } } } });
  });
  await page.goto('/repair/quote');
  await page.getByRole('button', { name: 'Confirm services' }).click();
  await expect(page.getByText('Your services are confirmed. No payment is required.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pay securely with Paystack' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continue full payment' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download receipt PDF' })).toHaveCount(0);
});

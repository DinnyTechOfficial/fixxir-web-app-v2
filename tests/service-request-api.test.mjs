import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
class PublicApiError extends Error {
  constructor(message, status, code, details) { super(message); Object.assign(this, { status, code, details }); }
}
const compiled = ts.transpileModule(readFileSync(new URL('../app/repair/service-request-api.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const compiledModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)(name => name === './public-api' ? { apiBase: 'https://api.example.test', PublicApiError } : require(name), compiledModule, compiledModule.exports);
const api = compiledModule.exports;
const session = { service_request_id: '11111111-1111-4111-8111-111111111111', access_token: 'a'.repeat(64), expires_at: new Date(Date.now() + 60000).toISOString() };

test('202 preserves status, retry guidance, request identity and auth', async () => {
  const old = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, `https://api.example.test/api/v1/public/service-requests/${session.service_request_id}/payment/initialize`);
    assert.equal(init.headers.get('Authorization'), `Bearer ${session.access_token}`);
    assert.equal(init.cache, 'no-store'); assert.equal(init.credentials, 'omit');
    assert.ok(init.signal, 'network calls have a bounded timeout');
    return new Response(JSON.stringify({ data: { state: 'initializing' }, error: null }), { status: 202, headers: { 'Retry-After': '7' } });
  };
  try {
    const result = await api.serviceRequestApi(session, '/payment/initialize', { method: 'POST', body: '{}' });
    assert.equal(result.status, 202); assert.equal(result.retryAfter, 7); assert.equal(result.data.state, 'initializing');
  } finally { globalThis.fetch = old; }
});
test('stale and withdrawn responses retain structured status', async () => {
  const old = globalThis.fetch;
  try {
    for (const status of [409, 412]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ error: { code: 'stale', message: 'Offer changed', details: { publication: 'changed' } } }), { status });
      await assert.rejects(api.serviceRequestApi(session, '/quote'), error => error.status === status && error.code === 'stale' && error.details.publication === 'changed');
    }
  } finally { globalThis.fetch = old; }
});
test('all supported payment instructions survive transport', async () => {
  const old = globalThis.fetch;
  const methods = { hosted_checkout: { authorization_url: 'https://checkout.paystack.com/test' }, generated_transfer_account: { account_number: '123' }, company_bank_transfer_fallback: { account_number: '456' } };
  globalThis.fetch = async () => new Response(JSON.stringify({ data: { state: 'ready', payment: { methods } }, error: null }));
  try { assert.deepEqual((await api.serviceRequestApi(session, '/payment/initialize')).data.payment.methods, methods); }
  finally { globalThis.fetch = old; }
});
test('session storage accepts only current valid request sessions', () => {
  const store = new Map([['fixxir-quote-session-v1', '{"repair_id":"old"}']]);
  const old = globalThis.sessionStorage;
  globalThis.sessionStorage = { getItem: key => store.get(key), setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) };
  try {
    assert.equal(api.readRequestSession(), null);
    api.saveRequestSession(session);
    assert.equal(store.has('fixxir-quote-session-v1'), false);
    assert.deepEqual(api.readRequestSession(), session);
    assert.throws(() => api.validateSession({ ...session, service_request_id: '-'.repeat(36) }));
    assert.throws(() => api.validateSession({ ...session, expires_at: '2000-01-01' }));
    assert.throws(() => api.validateSession({ ...session, service_request_id: undefined, repair_id: session.service_request_id }));
    api.clearRequestSession(); assert.equal(api.readRequestSession(), null);
  } finally { globalThis.sessionStorage = old; }
});
test('network failures are retryable errors, not payment success', async () => {
  const old = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('offline'); };
  try { await assert.rejects(api.serviceRequestApi(session, '/payment/verify'), error => error.status === 0); }
  finally { globalThis.fetch = old; }
});

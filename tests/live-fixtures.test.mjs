import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLiveFixtures } from './live-fixtures.mjs';

test('local fixture artifact supplies states without tokens or secrets in errors', () => {
  const fixtures = parseLiveFixtures(JSON.stringify({ quote: { lookup_code: 'LOCAL-QUOTE', contact: 'fixture@example.test' }, paid: { lookup_code: 'LOCAL-PAID', contact: 'fixture@example.test' } }));
  assert.equal(fixtures.quote.lookup_code, 'LOCAL-QUOTE');
  assert.equal(fixtures.paid.lookup_code, 'LOCAL-PAID');
  assert.equal(fixtures.review, undefined);
});
test('invalid fixture is rejected without echoing its contents', () => {
  assert.throws(() => parseLiveFixtures(JSON.stringify({ paid: { contact: 'do-not-print-this' } })), error => !error.message.includes('do-not-print-this') && error.message.includes('paid'));
});
test('API published fixture maps to the web quote case', () => {
  assert.equal(parseLiveFixtures(JSON.stringify({ published: { lookup_code: 'LOCAL', contact: 'fixture@example.test' } })).quote.lookup_code, 'LOCAL');
});

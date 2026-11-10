import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentSelection, canPay, canResumePayment, nextPollDelay, shouldRenewSubmission } from '../app/repair/service-request-rules.mjs';

test('selections include every job but never remove required lines', () => {
  assert.deepEqual(paymentSelection({ publication_fingerprint: 'p', payable_fingerprint: 's', jobs: [
    { repair_job_id: 'a', lines: [{ id: 'required', selection_type: 'required', selected: true }, { id: 'optional', selection_type: 'optional', selected: true }] },
    { repair_job_id: 'b', lines: [] },
  ] }), { expected_publication_fingerprint: 'p', expected_payable_fingerprint: 's', jobs: [
    { repair_job_id: 'a', selected_optional_line_ids: ['optional'] }, { repair_job_id: 'b', selected_optional_line_ids: [] },
  ] });
});
test('only a published unlocked unpaid offer can start payment', () => {
  const quote = { publication_fingerprint: 'p', payable_fingerprint: 's', total_amount: 0, jobs: [], selection_locked: false };
  assert.equal(canPay(quote, 'unpaid'), true);
  assert.equal(canPay({ ...quote, state: 'withdrawn' }, 'unpaid'), false);
  assert.equal(canPay({ ...quote, selection_locked: true }, 'pending'), false);
  assert.equal(canPay(quote, 'paid'), false);
  assert.equal(canPay(quote, 'needs_review'), false);
  assert.equal(canPay(quote, 'payment_not_required'), false);
  assert.equal(canPay(null, 'unpaid'), false);
});
test('polling is bounded and retry advice is clamped', () => {
  assert.equal(nextPollDelay(0, 2), 2000);
  assert.equal(nextPollDelay(0, -1), 2000);
  assert.equal(nextPollDelay(0, 1000), 10000);
  assert.equal(nextPollDelay(10, 2), null);
});
test('active checkout can be recovered without unlocking selections', () => {
  const quote = { publication_fingerprint: 'p', payable_fingerprint: 's', selection_locked: true };
  assert.equal(canResumePayment(quote, 'pending'), true);
  assert.equal(canResumePayment(quote, 'initialized'), true);
  assert.equal(canResumePayment(quote, 'unpaid'), true);
  assert.equal(canResumePayment(quote, 'uncertain'), false);
  assert.equal(canResumePayment(quote, 'paid'), false);
  assert.equal(canResumePayment(quote, 'needs_review'), false);
  assert.equal(canResumePayment({ ...quote, total_amount: 0 }, 'unpaid'), false);
  assert.equal(canResumePayment({ ...quote, state: 'withdrawn' }, 'pending'), false);
});
test('only a confirmed invalid submission token permits a new summary', () => {
  assert.equal(shouldRenewSubmission({ status: 400, details: { submission_token: 'request a new summary' } }), true);
  assert.equal(shouldRenewSubmission({ status: 503 }), false);
  assert.equal(shouldRenewSubmission({ status: 0 }), false);
  assert.equal(shouldRenewSubmission({ status: 409 }), false);
});

export function paymentSelection(quote) {
  return {
    expected_publication_fingerprint: quote.publication_fingerprint,
    expected_payable_fingerprint: quote.payable_fingerprint,
    jobs: quote.jobs.map(job => ({ repair_job_id: job.repair_job_id,
      selected_optional_line_ids: job.lines.filter(line => line.selection_type === 'optional' && line.selected).map(line => line.id) })),
  };
}

export function canPay(quote, paymentStatus) {
  return Boolean(quote && quote.publication_fingerprint && quote.payable_fingerprint &&
    !quote.selection_locked && !['withdrawn', 'under_review', 'draft'].includes(quote.state) &&
    !['paid', 'pending', 'initialized', 'initializing', 'uncertain', 'payment_review', 'needs_review', 'payment_not_required'].includes(paymentStatus));
}

export function nextPollDelay(attempt, seconds) {
  if (attempt >= 10) return null;
  return Math.min(10, Math.max(2, Number.isFinite(Number(seconds)) ? Number(seconds) : 2)) * 1000;
}

export function canResumePayment(quote, paymentStatus) {
  return Boolean(quote?.publication_fingerprint && quote?.payable_fingerprint &&
    !(quote.total_amount === 0 && quote.selection_locked) &&
    !['withdrawn', 'under_review', 'draft'].includes(quote.state) &&
    (['pending', 'initialized', 'initializing'].includes(paymentStatus) || (paymentStatus === 'unpaid' && quote.selection_locked)));
}

export function shouldRenewSubmission(error) {
  return error?.status === 400 && error.details?.submission_token === 'request a new summary';
}

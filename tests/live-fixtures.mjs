import { readFileSync } from 'node:fs';

const envNames = {
  quote: 'FIXXIR_LIVE_QUOTE_FIXTURE', paid: 'FIXXIR_LIVE_PAID_FIXTURE',
  review: 'FIXXIR_LIVE_REVIEW_FIXTURE', payment_review: 'FIXXIR_LIVE_PAYMENT_REVIEW_FIXTURE',
  zero: 'FIXXIR_LIVE_ZERO_FIXTURE',
};

/** @typedef {{lookup_code: string, contact: string}} LiveFixture */
/** @returns {Partial<Record<'quote'|'paid'|'review'|'payment_review'|'zero', LiveFixture>>} */
export function parseLiveFixtures(raw) {
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid local live fixture artifact.');
  const result = {};
  for (const key of Object.keys(envNames)) {
    const value = parsed[key] ?? (key === 'quote' ? parsed.published : undefined);
    if (value == null) continue;
    if (typeof value.lookup_code !== 'string' || !value.lookup_code.trim() || typeof value.contact !== 'string' || !value.contact.trim()) {
      throw new Error(`Invalid ${key} fixture: lookup_code and contact are required.`);
    }
    result[key] = { lookup_code: value.lookup_code, contact: value.contact };
  }
  return result;
}

/** @returns {Partial<Record<'quote'|'paid'|'review'|'payment_review'|'zero', LiveFixture>>} */
export function readLiveFixtures() {
  let fixtures = process.env.FIXXIR_LIVE_FIXTURE_FILE ? parseLiveFixtures(readFileSync(process.env.FIXXIR_LIVE_FIXTURE_FILE, 'utf8')) : {};
  for (const [key, name] of Object.entries(envNames)) {
    if (process.env[name]) fixtures = { ...fixtures, ...parseLiveFixtures(JSON.stringify({ [key]: JSON.parse(process.env[name]) })) };
  }
  return fixtures;
}

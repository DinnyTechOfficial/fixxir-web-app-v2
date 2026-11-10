import { apiBase, PublicApiError } from './public-api';

export interface RequestSession { service_request_id: string; public_lookup_code?: string; access_token: string; expires_at: string }
export interface QuoteLine { id: string; label: string; summary?: string; selection_type: string; selected: boolean; amount: number }
export interface CombinedQuote {
  publication_id: string; publication_fingerprint: string; payable_fingerprint: string;
  state?: string; total_amount: number; currency: string; selection_locked: boolean;
  jobs: { repair_job_id: string; device_name: string; subtotal: number; lines: QuoteLine[] }[];
}
export interface RequestDetail {
  id: string; public_lookup_code: string; job_count: number; overall_status: string;
  collection: { status?: string; handoff_status?: string; handoff_method?: string };
  return: { status?: string; handoff_status?: string; handoff_method?: string };
  quote_summary?: { state?: string; status?: string } | null;
  payment_summary?: { state: string };
  jobs: { id: string; client_item_id?: string; device_name?: string; device_manufacturer?: string; device_model?: string;
    description?: string; status: string; quote_ready?: boolean; received_at?: string; returned_at?: string }[];
  timeline?: { id: string; code: string; status?: string; occurred_at: string; repair_job_id: string }[];
  blocking_reasons?: string[];
}
interface BankMethod { bank_name: string; account_name: string; account_number: string; payment_reference_note?: string; expires_at?: string }
export interface RequestPayment {
  state: string; payment_id?: string; retry_after_seconds?: number;
  summary?: CombinedQuote;
  available_methods?: string[];
  payment?: { provider: string; reference: string; status: string; amount: number; currency: string; methods?: {
    hosted_checkout?: { authorization_url: string; expires_at?: string };
    generated_transfer_account?: BankMethod; company_bank_transfer_fallback?: BankMethod;
  } };
}

const sessionKey = 'fixxir-service-request-session-v1';
export function validateSession(value: RequestSession): RequestSession {
  if (!value || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.service_request_id) ||
      !/^[a-f0-9]{64}$/i.test(value.access_token) || !(Date.parse(value.expires_at) > Date.now())) {
    throw new PublicApiError('Your request session has expired. Verify your details again.', 401);
  }
  return value;
}
export function clearRequestSession() {
  try { sessionStorage.removeItem(sessionKey); } catch { /* Access can continue in memory. */ }
}
export function saveRequestSession(value: RequestSession) {
  validateSession(value);
  try {
    sessionStorage.removeItem('fixxir-quote-session-v1');
    sessionStorage.removeItem('fixxir-repair-payment-flow');
    sessionStorage.setItem(sessionKey, JSON.stringify({ service_request_id: value.service_request_id, access_token: value.access_token, expires_at: value.expires_at }));
  } catch { /* Access can continue in memory. */ }
}
export function readRequestSession(): RequestSession | null {
  try { const raw = sessionStorage.getItem(sessionKey); return raw ? validateSession(JSON.parse(raw)) : null; }
  catch { clearRequestSession(); return null; }
}

export async function requestApi<T>(path: string, init?: RequestInit, session?: RequestSession): Promise<{ data: T; status: number; retryAfter: number }> {
  if (!apiBase) throw new PublicApiError('Request access is not available. Please contact Fixxir.', 503);
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (init?.body) headers.set('Content-Type', 'application/json');
  if (session) headers.set('Authorization', `Bearer ${validateSession(session).access_token}`);
  let response: Response;
  try {
    const timeout = AbortSignal.timeout(30000);
    const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
    response = await fetch(`${apiBase}/api/v1${path}`, { ...init, signal, headers, cache: 'no-store', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer' });
  } catch { throw new PublicApiError('We could not reach Fixxir. Check your connection and try again.', 0); }
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.error || !payload?.data) {
    throw new PublicApiError(payload?.error?.message || 'We could not complete this request.', response.status, payload?.error?.code, payload?.error?.details);
  }
  return { data: payload.data, status: response.status, retryAfter: Number(response.headers.get('Retry-After')) || 2 };
}
export function serviceRequestApi<T>(session: RequestSession, suffix = '', init?: RequestInit) {
  return requestApi<T>(`/public/service-requests/${encodeURIComponent(session.service_request_id)}${suffix}`, init, session);
}
export async function openRequestSession(lookup: string, contact: string) {
  const value = contact.trim();
  const { data } = await requestApi<RequestSession>('/public/service-request-sessions', { method: 'POST', body: JSON.stringify({ lookup_code: lookup.trim(), ...(value.includes('@') ? { email: value } : { phone: value }) }) });
  return validateSession(data);
}
export async function exchangeRequestToken(token: string) {
  const { data } = await requestApi<RequestSession>('/public/service-request-sessions/exchange', { method: 'POST', body: JSON.stringify({ email_token: token }) });
  return validateSession(data);
}
export async function downloadRequestDocument(session: RequestSession, suffix: '/receipt/pdf' | '/receipt/image' | '/quote/pdf') {
  const response = await fetch(`${apiBase}/api/v1/public/service-requests/${encodeURIComponent(session.service_request_id)}${suffix}`, {
    headers: { Authorization: `Bearer ${validateSession(session).access_token}` }, cache: 'no-store', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer',
  });
  if (!response.ok) throw new PublicApiError('This document is not available yet.', response.status);
  const contentType = response.headers.get('Content-Type') || '';
  if (!(suffix.endsWith('/pdf') ? contentType.includes('application/pdf') : contentType.startsWith('image/'))) throw new Error('Invalid document response.');
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a'); link.href = url; link.download = `fixxir-${suffix.includes('receipt') ? 'receipt' : 'quote'}.${suffix.endsWith('/pdf') ? 'pdf' : 'png'}`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function isPrivateDevelopmentHost(hostname: string) {
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname) || hostname.endsWith(".local")) return true;
  const octets = hostname.split(".").map(Number);
  if (octets.length !== 4 || octets.some(octet => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false;
  return octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168);
}

function resolveApiBase() {
  const configured = process.env.NEXT_PUBLIC_FIXXIR_API_URL?.trim();
  if (!configured) return '';
  try {
    const url = new URL(configured);
    const development = process.env.NODE_ENV === 'development' && isPrivateDevelopmentHost(url.hostname);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && development)) || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) return '';
    return url.origin;
  } catch { return ''; }
}

export const apiBase = resolveApiBase();
export interface ApiEnvelope<T> { data: T; error: { code: string; message: string; details?: Record<string, string> } | null }
export interface PublicDeviceType { code: string; label: string; issues: string[] }
export interface PublicCatalogItem { id: string; name: string }
export interface PublicCatalogPage<T> { items: T[]; page: number; page_size: number; total_count: number; has_next: boolean }

export class PublicApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string>;
  constructor(message: string, status: number, code?: string, details?: Record<string, string>) {
    super(message); this.name = 'PublicApiError'; this.status = status; this.code = code; this.details = details;
  }
}

export function publicApiConfigured() { return Boolean(apiBase); }
export function getPublicDeviceTypes() { return publicApi<{ items: PublicDeviceType[] }>('/catalog/device-types'); }
export function getPublicManufacturers(deviceType: string, query = '', page = 1, init?: RequestInit) {
  const params = new URLSearchParams({ device_type: deviceType, page: String(page), page_size: '20' });
  if (query.trim()) params.set('q', query.trim());
  return publicApi<PublicCatalogPage<PublicCatalogItem>>(`/catalog/manufacturers?${params}`, init);
}
export function getPublicModels(manufacturerId: string, query = '', page = 1, init?: RequestInit) {
  const params = new URLSearchParams({ manufacturer_id: manufacturerId, page: String(page), page_size: '20' });
  if (query.trim()) params.set('q', query.trim());
  return publicApi<PublicCatalogPage<PublicCatalogItem>>(`/catalog/models?${params}`, init);
}

export async function publicApi<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBase) throw new PublicApiError('Repair requests are not available yet. Please contact Fixxir on WhatsApp.', 503);
  let response: Response;
  try {
    const headers = new Headers(init?.headers); headers.set('Accept', 'application/json');
    if (init?.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const timeout = AbortSignal.timeout(30000);
    response = await fetch(`${apiBase}/api/v1${path}`, {
      ...init, headers, signal: init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
      cache: 'no-store', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer',
    });
  } catch { throw new PublicApiError('We could not reach Fixxir right now. Check your connection and try again.', 0); }
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || payload?.error || !payload?.data) throw new PublicApiError(payload?.error?.message || 'We could not complete that request. Please try again.', response.status, payload?.error?.code, payload?.error?.details);
  return payload.data;
}

export function formatNaira(amount?: number | null) {
  if (amount == null) return 'Not available yet';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(amount);
}

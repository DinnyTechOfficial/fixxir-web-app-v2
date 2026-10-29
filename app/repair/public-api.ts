function isPrivateDevelopmentHost(hostname: string) {
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname) || hostname.endsWith(".local")) return true;
  const octets = hostname.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false;
  return octets[0] === 10 ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168);
}

function resolveApiBase() {
  const configuredBase = process.env.NEXT_PUBLIC_FIXXIR_API_URL?.trim();
  if (!configuredBase) return "";

  try {
    const url = new URL(configuredBase);
    const insecureDevelopmentOrigin = process.env.NODE_ENV === "development" && isPrivateDevelopmentHost(url.hostname);
    if ((url.protocol !== "https:" && !(url.protocol === "http:" && insecureDevelopmentOrigin)) ||
      url.username || url.password || url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) {
      return "";
    }
    return url.origin;
  } catch {
    return "";
  }
}

const apiBase = resolveApiBase();

export interface ApiEnvelope<T> {
  data: T;
  error: { code: string; message: string; details?: Record<string, string> } | null;
}

export interface PublicDeviceType {
  code: string;
  label: string;
  issues: string[];
}

export interface PublicCatalogItem {
  id: string;
  name: string;
}

export interface PublicCatalogPage<T> {
  items: T[];
  page: number;
  page_size: number;
  total_count: number;
  has_next: boolean;
}

export interface RepairTracking {
  job: {
    id: string;
    public_lookup_code: string;
    device_category: string;
    device_manufacturer: string;
    device_model: string;
    intake_description: string;
    status: string;
    quote_status: string;
    payment_status: string;
    collection_handoff_method: string;
    collection_handoff_status: string;
    created_at: string;
    updated_at: string;
  };
  quote?: {
    status: string;
    subtotal: number;
    total: number;
    payable_amount: number;
    notes: string;
    estimated_duration_days?: number;
  } | null;
  quote_lines: Array<{
    id: string;
    label: string;
    summary: string;
    severity: string;
    selection_type: string;
    selected: boolean;
    amount: number;
  }>;
  timeline: Array<{ event_code: string; title: string; occurred_at: string; note: string }>;
  payment?: {
    payment_method: string;
    status: string;
    amount: number;
    currency: string;
    authorization_url?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    payment_reference_note?: string;
    expires_at?: string;
    paid_at?: string;
  } | null;
  payable_amount?: number | null;
  support_contact: { name: string; phone: string; whatsapp_phone: string };
  tracking_progress: {
    current_step_code: string;
    percent_complete: number;
    steps: Array<{ code: string; title: string; description: string; state: string; status_label: string; occurred_at?: string }>;
  };
}

export interface PaymentInitialization {
  summary: { quote?: RepairTracking["quote"]; quote_lines: RepairTracking["quote_lines"]; payable_amount: number };
  available_methods: string[];
  payment: {
    provider: string;
    reference: string;
    amount: number;
    currency: string;
    methods: {
      hosted_checkout?: { authorization_url: string; expires_at?: string };
      generated_transfer_account?: { bank_name: string; account_name: string; account_number: string; expires_at?: string };
      company_bank_transfer_fallback?: { bank_name: string; account_name: string; account_number: string; payment_reference_note: string; expires_at?: string };
    };
  };
}

export interface RepairSession {
  repair_id: string;
  access_token: string;
  expires_at: string;
}

function validateRepairSession(session: RepairSession) {
  const expiry = Date.parse(session.expires_at);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.repair_id) ||
    !/^[0-9a-f]{64}$/i.test(session.access_token) || !Number.isFinite(expiry) || expiry <= Date.now()) {
    throw new PublicApiError("Fixxir returned an invalid or expired repair session. Please try again.", 502);
  }
  return session;
}

export class PublicApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string>;

  constructor(message: string, status: number, code?: string, details?: Record<string, string>) {
    super(message);
    this.name = "PublicApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function publicApiConfigured() {
  return Boolean(apiBase);
}

export function createRepairSession(lookupCode: string, contact: string) {
  const normalizedContact = contact.trim();
  const contactFields = normalizedContact.includes("@")
    ? { email: normalizedContact }
    : { phone: normalizedContact };

  return publicApi<RepairSession>("/public/repair-sessions", {
    method: "POST",
    body: JSON.stringify({ lookup_code: lookupCode.trim(), ...contactFields }),
  }).then(validateRepairSession);
}

export function exchangeRepairEmailToken(emailToken: string) {
  return publicApi<RepairSession>("/public/repair-sessions/exchange", {
    method: "POST",
    body: JSON.stringify({ email_token: emailToken }),
  }).then(validateRepairSession);
}

export function logoutRepairSession(accessToken: string) {
  return publicApi<{ revoked: boolean }>("/public/repair-sessions/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function publicRepairApi<T>(repairId: string, accessToken: string, path = "", init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  return publicApi<T>(`/public/repairs/${encodeURIComponent(repairId)}${path}`, { ...init, headers });
}

export function getPublicDeviceTypes() {
  return publicApi<{ items: PublicDeviceType[] }>("/catalog/device-types");
}

export function getPublicManufacturers(deviceType: string, query = "", page = 1, init?: RequestInit) {
  const params = new URLSearchParams({
    device_type: deviceType,
    page: String(page),
    page_size: "20",
  });
  if (query.trim()) params.set("q", query.trim());
  return publicApi<PublicCatalogPage<PublicCatalogItem>>(`/catalog/manufacturers?${params}`, init);
}

export function getPublicModels(manufacturerId: string, query = "", page = 1, init?: RequestInit) {
  const params = new URLSearchParams({
    manufacturer_id: manufacturerId,
    page: String(page),
    page_size: "20",
  });
  if (query.trim()) params.set("q", query.trim());
  return publicApi<PublicCatalogPage<PublicCatalogItem>>(`/catalog/models?${params}`, init);
}

export async function publicApi<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBase) throw new PublicApiError("Repair tracking is not available yet. Please contact Fixxir on WhatsApp.", 503);

  let response: Response;
  try {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    response = await fetch(`${apiBase}/api/v1${path}`, {
      ...init,
      headers,
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
    });
  } catch {
    throw new PublicApiError("We could not reach Fixxir right now. Check your connection and try again.", 0);
  }

  const payload = await response.json().catch(() => ({})) as ApiEnvelope<T>;
  if (!response.ok || payload.error) {
    throw new PublicApiError(payload.error?.message || "We could not complete that request. Please try again.", response.status, payload.error?.code, payload.error?.details);
  }
  return payload.data;
}

export function formatNaira(amountInNaira?: number | null) {
  if (amountInNaira == null) return "Not available yet";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(amountInNaira);
}

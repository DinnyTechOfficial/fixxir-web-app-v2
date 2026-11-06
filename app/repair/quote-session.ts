import type { RepairSession } from "./public-api";

const storageKey = "fixxir-quote-session-v1";

export interface SavedQuoteCheckout {
  url: string;
  reference: string;
  expires_at: string;
  amount: number;
  currency: string;
}

interface SavedQuoteAccess {
  session: RepairSession;
  checkout?: SavedQuoteCheckout;
}

export function clearQuoteSession() {
  try { window.sessionStorage.removeItem(storageKey); } catch { /* Storage may be unavailable. */ }
}

function validSession(value: unknown): value is RepairSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<RepairSession>;
  return typeof session.repair_id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.repair_id) &&
    typeof session.access_token === "string" && /^[0-9a-f]{64}$/i.test(session.access_token) &&
    typeof session.expires_at === "string" && Number.isFinite(Date.parse(session.expires_at)) && Date.parse(session.expires_at) > Date.now();
}

function validCheckout(value: unknown): value is SavedQuoteCheckout {
  if (!value || typeof value !== "object") return false;
  const checkout = value as Partial<SavedQuoteCheckout>;
  try {
    const url = new URL(checkout.url || "");
    return url.origin === "https://checkout.paystack.com" && !url.username && !url.password &&
      typeof checkout.reference === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(checkout.reference) &&
      typeof checkout.expires_at === "string" && Date.parse(checkout.expires_at) > Date.now() &&
      typeof checkout.amount === "number" && Number.isFinite(checkout.amount) && checkout.amount > 0 && checkout.currency === "NGN";
  } catch { return false; }
}

export function readQuoteSession(): SavedQuoteAccess | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<SavedQuoteAccess> | null;
    if (!validSession(saved?.session)) {
      clearQuoteSession();
      return null;
    }
    return { session: saved.session, ...(validCheckout(saved.checkout) ? { checkout: saved.checkout } : {}) };
  } catch {
    clearQuoteSession();
    return null;
  }
}

export function saveQuoteSession(session: RepairSession) {
  if (!validSession(session)) return;
  const previous = readQuoteSession();
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify({
      session: { repair_id: session.repair_id, access_token: session.access_token, expires_at: session.expires_at },
      ...(previous?.session.repair_id === session.repair_id && previous.checkout ? { checkout: previous.checkout } : {}),
    }));
  } catch { /* The active page still works when storage is unavailable. */ }
}

export function saveQuoteCheckout(checkout: SavedQuoteCheckout) {
  const saved = readQuoteSession();
  if (!saved || !validCheckout(checkout)) return;
  try { window.sessionStorage.setItem(storageKey, JSON.stringify({ session: saved.session, checkout })); } catch { /* Keep checkout in memory. */ }
}

const referenceKeys = ["payment_reference", "reference", "trxref"];
export const paymentReturnKeys = [...referenceKeys, "status", "payment_status", "payment_return", "repair_id", "session_id", "access_token", "token"];
const statusHints = new Set(["true", "false", "success", "successful", "paid", "confirmed", "failed", "failure", "pending", "cancelled"]);

export function parsePaymentReturn(params: Pick<URLSearchParams, "get" | "has">) {
  const reference = referenceKeys.map((key) => params.get(key) || "").find((value) => /^[a-zA-Z0-9_-]{1,128}$/.test(value)) || "";
  const status = (params.get("status") || params.get("payment_status") || "").toLowerCase();
  const id = params.get("repair_id") || "";
  const repairId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id.toLowerCase() : "";
  return { reference, repairId, statusHint: statusHints.has(status) ? status : "", hasReturn: params.get("payment_return") === "1" || referenceKeys.some((key) => params.has(key)) || statusHints.has(status) };
}

export function paymentTrackingURL(params: URLSearchParams, pathname = "") {
  const legacyRepairId = pathname.match(/^\/repair\/(?:track\/?)?([0-9a-f-]{36})\/payment\/confirm\/?$/i)?.[1];
  if (legacyRepairId && !params.has("repair_id")) params.set("repair_id", legacyRepairId);
  const payment = parsePaymentReturn(params);
  const query = new URLSearchParams({ payment_return: "1" });
  if (payment.reference) query.set("payment_reference", payment.reference);
  if (payment.repairId) query.set("repair_id", payment.repairId);
  if (payment.statusHint) query.set("status", payment.statusHint);
  return `/repair/track?${query}`;
}

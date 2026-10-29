"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronDown, CircleAlert, ClipboardCheck, Copy, CreditCard, Loader2, LockKeyhole, RefreshCw, Share2, ShieldCheck, Wrench } from "lucide-react";
import { FIXXIR_PHONE_DISPLAY, getFixxirWhatsAppUrl } from "../../site-info";
import {
  createRepairSession,
  exchangeRepairEmailToken,
  formatNaira,
  publicRepairApi,
  type PaymentInitialization,
  type RepairSession,
  type RepairTracking,
} from "../public-api";

function isValidPaymentReference(value: string) {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(value);
}

function getEmailTokenFromFragment() {
  if (typeof window === "undefined") return "";
  const token = new URLSearchParams(window.location.hash.slice(1)).get("email_token") || "";
  return /^[a-f0-9]{64}$/i.test(token) ? token : "";
}

function subscribeToFragmentChange(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getServerEmailToken() {
  return "";
}

function getPaymentFlowSnapshot() {
  if (typeof window === "undefined") return "";
  try {
    const saved = JSON.parse(window.sessionStorage.getItem("fixxir-repair-payment-flow") || "{}") as { lookup?: unknown; reference?: unknown };
    const lookup = typeof saved.lookup === "string" ? saved.lookup.slice(0, 64) : "";
    const reference = typeof saved.reference === "string" && isValidPaymentReference(saved.reference) ? saved.reference : "";
    return lookup || reference ? JSON.stringify({ lookup, reference }) : "";
  } catch {
    return "";
  }
}

function subscribeToPaymentFlow(onChange: () => void) {
  window.addEventListener("fixxir-payment-flow-change", onChange);
  return () => window.removeEventListener("fixxir-payment-flow-change", onChange);
}

function getServerPaymentFlow() {
  return "";
}

function getPickupCodeFromPath() {
  if (typeof window === "undefined") return "";
  const match = window.location.pathname.match(/^\/repair\/track\/([a-f\d]{8})\/?$/i);
  return match?.[1]?.toUpperCase() || "";
}

function subscribeToPickupCode(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("fixxir-pickup-code-change", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("fixxir-pickup-code-change", onChange);
  };
}

function getServerPickupCode() {
  return "";
}

function updatePickupCodePath(code: string) {
  if (typeof window === "undefined") return;
  const path = code ? `/repair/track/${encodeURIComponent(code)}` : "/repair/track";
  if (window.location.pathname === path) return;
  window.history.replaceState(null, "", path);
  window.dispatchEvent(new Event("fixxir-pickup-code-change"));
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

function parsePaymentFlow(value: string) {
  if (!value) return { lookup: "", reference: "" };
  try {
    return JSON.parse(value) as { lookup: string; reference: string };
  } catch {
    return { lookup: "", reference: "" };
  }
}

function getTrustedPaymentURL(value: string) {
  const url = new URL(value);
  if (url.origin !== "https://checkout.paystack.com" || url.username || url.password) {
    throw new Error("Invalid payment destination");
  }
  return url;
}

function formatTrackingDate(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return "";
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function RepairTrackingPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center text-gray-600">Loading repair tracking…</main>}><TrackingContent /></Suspense>;
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const lookupFromUrl = searchParams.get("lookup") || "";
  const paymentReference = searchParams.get("reference") || searchParams.get("trxref") || "";
  const emailToken = useSyncExternalStore(subscribeToFragmentChange, getEmailTokenFromFragment, getServerEmailToken);
  const paymentFlow = parsePaymentFlow(useSyncExternalStore(subscribeToPaymentFlow, getPaymentFlowSnapshot, getServerPaymentFlow));
  const pickupCode = useSyncExternalStore(subscribeToPickupCode, getPickupCodeFromPath, getServerPickupCode);
  const [lookup, setLookup] = useState(lookupFromUrl);
  const [lookupWasEdited, setLookupWasEdited] = useState(false);
  const lookupValue = lookupWasEdited ? lookup : (lookup || paymentFlow.lookup || pickupCode);
  const [contact, setContact] = useState("");
  const [repairId, setRepairId] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [returnReference, setReturnReference] = useState(isValidPaymentReference(paymentReference) ? paymentReference : "");
  const [tracking, setTracking] = useState<RepairTracking | null>(null);
  const [paymentInit, setPaymentInit] = useState<PaymentInitialization | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [showAllProgressSteps, setShowAllProgressSteps] = useState(false);
  const verifyAttempted = useRef("");
  const returnedReference = returnReference || (paymentFlow.lookup === lookupValue ? paymentFlow.reference : "");

  const refresh = useCallback(async (session: RepairSession) => {
    setLoading(true);
    setError("");
    try {
      const result = await publicRepairApi<RepairTracking>(session.repair_id, session.access_token);
      setRepairId(session.repair_id);
      setSessionToken(session.access_token);
      setTracking(result);
      setLookup(result.job.public_lookup_code);
      updatePickupCodePath(result.job.public_lookup_code);
      setContact("");
    } catch (err) {
      setTracking(null);
      setRepairId("");
      setSessionToken("");
      setError(err instanceof Error ? err.message : "We could not load this repair.");
    } finally {
      setLoading(false);
    }
  }, [setContact, setError, setLoading, setLookup, setRepairId, setSessionToken, setTracking]);

  const verifyPayment = useCallback(async (id: string, token: string, reference: string) => {
    setBusy(true);
    setNotice("Checking the payment status with Fixxir…");
    setError("");
    try {
      await publicRepairApi(id, token, "/payment/verify", {
        method: "POST",
        body: JSON.stringify({ reference }),
      });
      setNotice("Payment status checked.");
      window.sessionStorage.removeItem("fixxir-repair-payment-flow");
      window.dispatchEvent(new Event("fixxir-payment-flow-change"));
      const cleanURL = new URL(window.location.href);
      cleanURL.searchParams.delete("reference");
      cleanURL.searchParams.delete("trxref");
      window.history.replaceState(null, "", `${cleanURL.pathname}${cleanURL.search}${cleanURL.hash}`);
      await refresh({ repair_id: id, access_token: token, expires_at: "" });
    } catch (err) {
      setNotice("");
      setError(err instanceof Error ? err.message : "We could not verify the payment yet.");
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentURL = new URL(window.location.href);
    const queryReference = currentURL.searchParams.get("reference") || currentURL.searchParams.get("trxref") || "";
    const hadLookupInURL = currentURL.searchParams.has("lookup");
    currentURL.searchParams.delete("lookup");
    if (queryReference) {
      currentURL.searchParams.delete("reference");
      currentURL.searchParams.delete("trxref");
    }
    if (queryReference || hadLookupInURL) {
      window.history.replaceState(null, "", `${currentURL.pathname}${currentURL.search}${currentURL.hash}`);
    }
  }, [lookupFromUrl, paymentReference]);

  useEffect(() => {
    const reference = returnedReference;
    if (!reference || !repairId || !sessionToken || verifyAttempted.current === reference) return;
    verifyAttempted.current = reference;
    void verifyPayment(repairId, sessionToken, reference);
  }, [repairId, returnedReference, sessionToken, verifyPayment]);

  const verifyRepair = async () => {
    setPaymentInit(null);
    if (!lookupValue.trim() || !contact.trim()) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const session = await createRepairSession(lookupValue, contact);
      await refresh(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not verify those details.");
    } finally {
      setBusy(false);
    }
  };

  const findRepair = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void verifyRepair();
  };

  const continueFromEmail = async () => {
    if (!emailToken) return;
    const token = emailToken;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.dispatchEvent(new Event("hashchange"));
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const session = await exchangeRepairEmailToken(token);
      await refresh(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "This quote link is invalid or expired. Request a fresh link or verify your repair details.");
    } finally {
      setBusy(false);
    }
  };

  const startPayment = async () => {
    if (!tracking) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const selected = tracking.quote_lines.filter((line) => line.selection_type === "optional" && line.selected).map((line) => line.id);
      if (!repairId || !sessionToken) throw new Error("Verify your repair details again to continue.");
      const result = await publicRepairApi<PaymentInitialization>(repairId, sessionToken, "/payment/initialize", {
        method: "POST",
        body: JSON.stringify({ selected_optional_line_ids: selected }),
      });
      const checkoutURL = result.payment.methods.hosted_checkout?.authorization_url;
      if (checkoutURL) getTrustedPaymentURL(checkoutURL);
      setPaymentInit(result);
      setTracking((current) => current ? {
        ...current,
        quote: result.summary.quote ?? current.quote,
        quote_lines: result.summary.quote_lines,
        payable_amount: result.summary.payable_amount,
      } : current);
      setNotice("Choose a payment method below to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not start payment. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const updateOptionalLine = async (lineId: string, selected: boolean) => {
    if (!tracking) return;
    const selectedIds = tracking.quote_lines
      .filter((line) => line.selection_type === "optional" && (line.id === lineId ? selected : line.selected))
      .map((line) => line.id);
    setBusy(true);
    setError("");
    try {
      if (!repairId || !sessionToken) throw new Error("Verify your repair details again to update this quote.");
      const summary = await publicRepairApi<{ quote?: RepairTracking["quote"]; quote_lines: RepairTracking["quote_lines"]; payable_amount: number }>(
        repairId,
        sessionToken,
        "/quote/summary",
        { method: "POST", body: JSON.stringify({ selected_quote_line_ids: selectedIds }) },
      );
      setTracking({ ...tracking, quote: summary.quote ?? tracking.quote, quote_lines: summary.quote_lines, payable_amount: summary.payable_amount });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not update the quote selection.");
    } finally {
      setBusy(false);
    }
  };

  const resumePayment = (authorizationURL: string) => {
    try {
      const url = getTrustedPaymentURL(authorizationURL);
      try {
        window.sessionStorage.setItem("fixxir-repair-payment-flow", JSON.stringify({ lookup: tracking?.job.public_lookup_code || "", reference: paymentInit?.payment.reference || "" }));
        window.dispatchEvent(new Event("fixxir-payment-flow-change"));
      } catch {
        // Payment can continue when browser storage is unavailable.
      }
      window.location.assign(url.toString());
    } catch {
      setError("We could not validate the secure payment destination. Please contact Fixxir.");
    }
  };

  const trackingShareURL = tracking && typeof window !== "undefined"
    ? new URL(`/repair/track/${encodeURIComponent(tracking.job.public_lookup_code)}`, window.location.origin).toString()
    : "";

  const copyTrackingLink = async () => {
    if (!trackingShareURL) return;
    try {
      await copyTextToClipboard(trackingShareURL);
      setShareMessage("Link copied. The recipient will need the repair email or phone number to verify.");
    } catch {
      setShareMessage("Couldn’t copy the link here. You can copy it from the address bar.");
    }
  };

  const shareTrackingLink = async () => {
    if (!trackingShareURL) return;
    setShareMessage("");
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Track your Fixxir repair",
          text: "Here’s the link to track this Fixxir repair. The recipient will need the repair email or phone number to verify.",
          url: trackingShareURL,
        });
        setShareMessage("Repair link shared. The recipient will need the repair email or phone number to verify.");
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copyTrackingLink();
  };

  const money = (value?: number | null) => formatNaira(value);
  const transfer = paymentInit?.payment.methods.generated_transfer_account || paymentInit?.payment.methods.company_bank_transfer_fallback;
  const transferDetails: Array<{ label: string; value: string }> = transfer && paymentInit ? [
    { label: "Bank", value: transfer.bank_name },
    { label: "Account name", value: transfer.account_name },
    { label: "Account number", value: transfer.account_number },
    { label: "Payment reference", value: "payment_reference_note" in transfer ? String(transfer.payment_reference_note || paymentInit.payment.reference) : paymentInit.payment.reference },
  ] : [];

  const progressSteps = tracking ? [...tracking.tracking_progress.steps].reverse() : [];
  const completedOrCurrentSteps = progressSteps.filter((step) => step.state === "completed" || step.state === "current");
  const collapsedProgressSteps = completedOrCurrentSteps.length > 0 ? completedOrCurrentSteps : progressSteps.slice(0, 3);
  const visibleProgressSteps = showAllProgressSteps ? progressSteps : collapsedProgressSteps;

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[#f3f6fb] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full px-2 text-sm font-semibold text-[#53647d] transition hover:bg-white hover:text-blue-700"><ArrowLeft size={17} /> Fixxir home</Link>
        {!tracking && <div className="mt-4 grid overflow-hidden rounded-[2rem] border border-[#dfe7f2] bg-white shadow-[0_24px_70px_-38px_rgba(16,33,63,0.42)] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative isolate overflow-hidden bg-[#10213f] p-7 text-white sm:p-10 lg:p-12">
            <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-[1px] border-white/10" />
            <div aria-hidden="true" className="absolute -right-8 -top-12 -z-10 h-48 w-48 rounded-full border-[1px] border-white/10" />
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#b8d2ff]"><Wrench size={13} /> Repair tracking</p>
            <h1 className="mt-6 max-w-lg text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">Your repair, <span className="text-[#9fc4ff]">without the guesswork.</span></h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#d1dced] sm:text-base">One secure place to follow progress, review your repair quote, and complete payment.</p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Wrench, label: "Follow repair progress" },
                { icon: ClipboardCheck, label: "Review and approve your quote" },
                { icon: CreditCard, label: "Complete payment securely" },
              ].map(({ icon: Icon, label }) => <li key={label} className="flex items-center gap-3 text-sm font-medium text-[#e3ebf8]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#a9caff]"><Icon size={17} /></span>{label}</li>)}
            </ul>
            <p className="mt-9 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-[#aebed5]"><ShieldCheck size={16} className="text-[#9fc4ff]" /> Private access. Your contact details stay off the page URL.</p>
          </section>

          <section className="p-6 sm:p-9 lg:p-12">
            {!tracking ? <>
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><LockKeyhole size={20} /></span>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Secure lookup</p><h2 className="mt-1 text-2xl font-black tracking-tight text-[#10213f]">Access your repair</h2><p className="mt-1 text-sm leading-5 text-[#71819a]">Enter the details from your Fixxir confirmation.</p></div>
              </div>
              {emailToken && <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <p className="text-sm leading-5 text-[#3f5575]">A secure quote link was detected. Continue only if you opened this link from Fixxir.</p>
                <button type="button" onClick={() => void continueFromEmail()} disabled={busy} className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 font-bold text-[#10213f] shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50 disabled:opacity-60">{busy ? "Opening your quote…" : "Continue to quote"}</button>
              </div>}
              <form onSubmit={findRepair} className="mt-7 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#273b59]" htmlFor="repair-lookup">Repair lookup code</label>
                  <input id="repair-lookup" autoComplete="off" maxLength={64} value={lookupValue} onChange={(event) => { setLookupWasEdited(true); setLookup(event.target.value); }} placeholder="e.g. ABCD1234" className="min-h-12 w-full rounded-xl border border-[#d8e1ed] bg-white px-4 text-[#10213f] outline-none transition placeholder:text-[#9aa8ba] focus:border-blue-500 focus:ring-4 focus:ring-blue-100" required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#273b59]" htmlFor="repair-contact">Email or phone number</label>
                  <input id="repair-contact" type="text" autoComplete="off" maxLength={254} value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Used when you requested the repair" className="min-h-12 w-full rounded-xl border border-[#d8e1ed] bg-white px-4 text-[#10213f] outline-none transition placeholder:text-[#9aa8ba] focus:border-blue-500 focus:ring-4 focus:ring-blue-100" required />
                  <p className="mt-2 text-xs leading-5 text-[#71819a]">For a phone number, include the country code (for example, +234).</p>
                </div>
                <button type="submit" disabled={busy || loading || !lookupValue.trim() || !contact.trim()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{busy || loading ? <Loader2 size={18} className="animate-spin" /> : null}{busy || loading ? "Checking your repair…" : "Verify repair"}</button>
              </form>
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#71819a]"><LockKeyhole size={14} className="mt-0.5 shrink-0" />Your details are sent securely to Fixxir and are not added to the page URL.</p>
            </> : <div className="rounded-2xl border border-green-100 bg-green-50/60 p-5">
              <div className="flex items-start gap-3"><CheckCircle2 size={21} className="mt-0.5 shrink-0 text-green-700" /><div><p className="font-bold text-[#183f30]">Secure access is active</p><p className="mt-1 text-sm leading-5 text-[#547166]">Your repair details are available in this page session.</p></div></div>
            </div>}
          </section>
        </div>}

        {error && <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-800 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><CircleAlert size={19} className="mt-0.5 shrink-0 text-red-600" /><div><p className="font-bold">We couldn’t complete that request</p><p className="mt-1 leading-5 text-red-700">{error}</p></div></div>
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            {!tracking && lookupValue.trim() && contact.trim() && <button type="button" disabled={busy || loading} onClick={() => void verifyRepair()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60"><RefreshCw size={14} className={busy || loading ? "animate-spin" : ""} />Try again</button>}
            {returnedReference && tracking && repairId && sessionToken && <button type="button" disabled={busy} onClick={() => { verifyAttempted.current = ""; void verifyPayment(repairId, sessionToken, returnedReference); }} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60">Try payment verification again</button>}
          </div>
        </div>}
        {notice && <div role="status" className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">{notice}</div>}
        {returnedReference && !tracking && <p role="status" className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">Payment return received. Verify your repair details above to check its status with Fixxir.</p>}
        {busy && !notice && <p role="status" className="mt-4 text-sm text-gray-600">Working on your request…</p>}

        {tracking && <div className="mt-6 space-y-5">
          <section className="overflow-hidden rounded-3xl border border-[#d8ebdf] bg-[#fbfefc] shadow-sm">
            <div className="bg-brand p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div><p className="text-xs font-bold uppercase tracking-wider text-blue-100">Reference {tracking.job.public_lookup_code}</p><h2 className="mt-2 text-2xl font-black text-white">{tracking.job.device_manufacturer} {tracking.job.device_model}</h2><p className="mt-2 text-sm text-blue-100">{tracking.job.intake_description}</p></div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button type="button" onClick={() => void shareTrackingLink()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"><Share2 size={15} /> Share</button>
                <button type="button" onClick={() => void copyTrackingLink()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"><Copy size={15} /> Copy link</button>
                <button type="button" onClick={() => void refresh({ repair_id: repairId, access_token: sessionToken, expires_at: "" })} disabled={loading || !repairId || !sessionToken} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
                {shareMessage && <p role="status" className="basis-full text-right text-xs leading-5 text-blue-100">{shareMessage}</p>}
              </div>
            </div>
            </div>
            <div className="bg-[#fbfefc] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-[#e4efe7] pb-5">
              <h3 className="text-lg font-extrabold text-[#173b2e]">Service timeline</h3>
              <span className="rounded-full bg-[#e8f5ec] px-3 py-1 text-xs font-bold text-[#21815a]">{Math.min(100, Math.max(0, tracking.tracking_progress.percent_complete))}% complete</span>
            </div>
            <ol className="mt-6">
              {visibleProgressSteps.map((step, index, visibleSteps) => {
                const isCompleted = step.state === "completed";
                const isActive = isCompleted || step.state === "current";
                const occurredAt = formatTrackingDate(step.occurred_at);
                return <li key={step.code} className="relative flex gap-4 pb-7 last:pb-0">
                  {index < visibleSteps.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[7px] top-4 -mb-1 w-0.5 ${isCompleted ? "bg-[#1c9b67]" : "bg-[#dfe8e2]"}`} />}
                  <span aria-hidden="true" className={`relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-4 ring-[#fbfefc] ${isActive ? "bg-[#15945f]" : "border-2 border-[#d7e0da] bg-[#fbfefc]"}`}>
                    {step.state === "current" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <div className={`min-w-0 flex-1 ${isActive ? "" : "opacity-55"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h4 className="font-bold text-[#182a22]">{step.title}</h4>
                      <span className={`text-xs font-semibold ${isActive ? "text-[#21815a]" : "text-[#7f8c84]"}`}>{step.status_label || step.state.replaceAll("_", " ")}</span>
                    </div>
                    {occurredAt && <time className="mt-1 block text-sm text-[#66756c]">{occurredAt}</time>}
                    {step.description && <p className="mt-1 text-sm leading-5 text-[#66756c]">{step.description}</p>}
                  </div>
                </li>;
              })}
            </ol>
            {progressSteps.length > collapsedProgressSteps.length && <button type="button" aria-expanded={showAllProgressSteps} onClick={() => setShowAllProgressSteps((expanded) => !expanded)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold text-[#168357] transition hover:bg-[#e8f5ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168357]">{showAllProgressSteps ? "Show fewer steps" : "See all steps"}<ChevronDown size={17} className={`transition-transform ${showAllProgressSteps ? "rotate-180" : ""}`} /></button>}
            </div>
          </section>

          {tracking.timeline.length > 0 && <section className="rounded-3xl border border-[#e3eaf3] bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-black text-[#10213f]">Latest updates</h2><ol className="mt-5 space-y-4">{[...tracking.timeline].reverse().map((event, index) => <li key={`${event.event_code}-${event.occurred_at}-${index}`} className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" /><div><p className="font-semibold text-[#243752]">{event.title}</p>{event.note && <p className="mt-1 text-sm text-[#63738b]">{event.note}</p>}<time className="mt-1 block text-xs text-[#8a99ad]">{new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.occurred_at))}</time></div></li>)}</ol></section>}

          {tracking.quote && <section className="rounded-3xl border border-[#e3eaf3] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#71819a]">Diagnosis & quote</p><h2 className="mt-2 text-xl font-black text-[#10213f]">{tracking.quote.status === "sent" ? "Review your repair plan" : "Repair estimate"}</h2>{tracking.quote.notes && <p className="mt-2 text-sm text-[#53647d]">{tracking.quote.notes}</p>}</div><p className="text-xl font-black text-brand">{money(tracking.payable_amount ?? tracking.quote.payable_amount)}</p></div>
            <div className="mt-5 divide-y divide-gray-100">{tracking.quote_lines.map((line) => <label key={line.id} className="flex items-start gap-3 py-4"><input type="checkbox" checked={line.selected} disabled={busy || line.selection_type !== "optional" || tracking.quote?.status !== "sent"} onChange={(event) => void updateOptionalLine(line.id, event.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600" /><span className="min-w-0 flex-1"><strong className="block text-sm text-[#1b2e4c]">{line.label}</strong>{line.summary && <span className="mt-1 block text-sm text-[#63738b]">{line.summary}</span>}<span className="mt-1 block text-xs capitalize text-[#8a99ad]">{line.selection_type} · {line.severity}</span></span><strong className="shrink-0 text-sm text-[#243752]">{money(line.amount)}</strong></label>)}</div>
            {tracking.quote.status === "sent" && <div className="mt-4"><p className="mb-3 text-sm text-[#63738b]">Optional items can be selected before payment. Starting payment saves your selection and confirms acceptance of this quote.</p><button type="button" onClick={() => void startPayment()} disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"><CreditCard size={18} />{busy ? "Preparing payment…" : `Continue to payment · ${money(tracking.payable_amount ?? tracking.quote.payable_amount)}`}</button></div>}
            {tracking.quote.estimated_duration_days != null && <p className="mt-4 text-xs text-[#71819a]">Estimated duration: {tracking.quote.estimated_duration_days} days</p>}
          </section>}

          {paymentInit && transfer && <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:p-8"><h2 className="text-xl font-black text-[#10213f]">Bank transfer details</h2><p className="mt-2 text-sm text-[#53647d]">Transfer {money(paymentInit.payment.amount)} and include the payment reference if one is shown.</p><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">{transferDetails.map(({ label, value }) => <div key={label} className="rounded-xl bg-white p-3"><dt className="text-xs text-[#71819a]">{label}</dt><dd className="mt-1 break-all font-bold text-[#1b2e4c]">{value}</dd></div>)}</dl><p className="mt-4 text-xs text-[#53647d]">Payment status updates after Fixxir confirms the transfer. Use Refresh to check progress.</p></section>}

          {paymentInit?.payment.methods.hosted_checkout?.authorization_url && <section className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm"><h2 className="font-black text-[#10213f]">Secure card or bank payment</h2><p className="mt-2 text-sm text-[#53647d]">Continue to Paystack to complete {money(paymentInit.payment.amount)}.</p><button type="button" onClick={() => resumePayment(paymentInit.payment.methods.hosted_checkout!.authorization_url)} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-5 font-bold text-white hover:bg-green-700">Pay securely</button></section>}

          {tracking.payment && <section className="rounded-3xl border border-[#e3eaf3] bg-white p-6 shadow-sm"><h2 className="font-black text-[#10213f]">Payment status</h2><p className="mt-2 text-sm capitalize text-[#53647d]">{tracking.payment.status.replaceAll("_", " ")} · {money(tracking.payment.amount)}</p>{tracking.payment.status !== "paid" && tracking.payment.authorization_url && <button type="button" onClick={() => resumePayment(tracking.payment!.authorization_url!)} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-brand px-5 font-bold text-white">Resume secure payment</button>}</section>}
        </div>}

        <p className="mt-6 text-center text-sm text-[#71819a]">Need help? <a href={getFixxirWhatsAppUrl(lookupValue ? `Hi Fixxir, I need help tracking repair ${lookupValue}.` : "Hi Fixxir, I need help with a repair.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800">WhatsApp {FIXXIR_PHONE_DISPLAY}</a></p>
      </div>
    </main>
  );
}

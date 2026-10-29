"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, CircleCheck, Copy, Share2 } from "lucide-react";
import { FIXXIR_PHONE_DISPLAY, getFixxirWhatsAppUrl } from "../../../site-info";

async function copyText(value: string) {
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

export default function RepairRequestSuccess() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Loading confirmation…</main>}>
      <RepairRequestSuccessContent />
    </Suspense>
  );
}

function RepairRequestSuccessContent() {
  const searchParams = useSearchParams();
  const lookupCode = searchParams.get("lookup") || searchParams.get("requestId") || "";
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const trackingPath = lookupCode ? `/repair/track/${encodeURIComponent(lookupCode)}` : "/repair/track";

  const copyCode = async () => {
    try {
      await copyText(lookupCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setShareMessage("Copy isn’t available in this browser. Select the code above to copy it.");
    }
  };

  const shareCode = async () => {
    const trackingUrl = new URL(trackingPath, window.location.origin).toString();
    const shareData = {
      title: "Track my Fixxir repair",
      text: `My Fixxir repair lookup code is ${lookupCode}. I can track it at ${trackingUrl}. The email address or phone number used for the request is also needed to verify access.`,
      url: trackingUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Share sheet opened.");
      } else {
        await copyText(shareData.text);
        setShareMessage("Repair code and tracking link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareMessage("Could not share right now. You can copy the code instead.");
    }
  };

  return (
    <main className="flex min-h-screen items-center bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-sm sm:p-10">
        {lookupCode ? (
          <>
            <CircleCheck className="mx-auto h-14 w-14 text-emerald-600" aria-hidden="true" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Request received</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#10213f] sm:text-4xl">Your repair is in good hands.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">We’ve received your repair request. Save this lookup code so you can return to your repair details and follow progress.</p>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Your repair lookup code</p>
              <p className="mt-2 select-all font-mono text-3xl font-black tracking-[0.14em] text-[#10213f]" aria-label={`Lookup code ${lookupCode}`}>{lookupCode}</p>
              <p className="mt-3 text-sm leading-5 text-slate-600">To verify access to tracking, you’ll also need the email address or phone number you used in your request.</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => void copyCode()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                {copied ? <Check size={18} /> : <Copy size={18} />}{copied ? "Code copied" : "Copy lookup code"}
              </button>
              <button type="button" onClick={() => void shareCode()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                <Share2 size={18} />Share code
              </button>
            </div>
            {shareMessage && <p role="status" className="mt-3 text-sm text-slate-600">{shareMessage}</p>}

            <Link href={trackingPath} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Go to repair tracking<ArrowRight size={19} />
            </Link>
            <p className="mt-5 text-sm text-slate-500">Need help? <a href={getFixxirWhatsAppUrl(`Hi Fixxir, I just submitted a repair request. My lookup code is ${lookupCode}.`)} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline underline-offset-2">WhatsApp {FIXXIR_PHONE_DISPLAY}</a></p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black text-[#10213f]">No repair confirmation found</h1>
            <p className="mt-3 text-slate-600">Start a repair request or enter your lookup code on the tracking page.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/repair/request" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 font-bold text-white hover:bg-blue-700">Start a repair request</Link>
              <Link href="/repair/track" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50">Go to tracking</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

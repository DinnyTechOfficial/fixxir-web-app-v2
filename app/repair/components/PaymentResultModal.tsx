"use client";

import { useEffect, useId, useRef } from "react";
import { CheckCircle2, CircleAlert, Clock3, Loader2 } from "lucide-react";

export type PaymentResult = "checking" | "confirmed" | "pending" | "failed" | "error";

export default function PaymentResultModal({ open, result, busy, error, onOkay, onCheckAgain }: {
  open: boolean; result: PaymentResult; busy: boolean; error: string;
  onOkay: () => void; onCheckAgain: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const checking = busy || result === "checking";
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [open]);
  const title = result === "confirmed" ? "Payment confirmed" : result === "pending" ? "Payment pending" : result === "failed" ? "Payment unsuccessful" : result === "error" ? "We couldn’t confirm payment" : "Checking payment…";
  const description = result === "confirmed" ? "Your payment has been confirmed. Your repair tracking is up to date." : result === "pending" ? "Your payment is still processing. Check again before making another payment." : result === "failed" ? "Payment was not completed. You can retry payment from your repair plan." : result === "error" ? "Please try checking again. We haven’t marked this payment as successful." : "Please wait while Fixxir verifies your payment and updates your repair.";
  return <dialog ref={ref} aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={checking} onCancel={(event) => { event.preventDefault(); if (!checking) onOkay(); }} className="m-auto w-[calc(100vw-2rem)] max-w-md rounded-3xl border-0 bg-white p-0 text-[#10213f] shadow-xl backdrop:bg-slate-900/45">
    <div className="p-7 sm:p-9">
      {checking ? <Loader2 size={38} className="animate-spin text-blue-600" /> : result === "confirmed" ? <CheckCircle2 size={38} className="text-green-600" /> : result === "pending" ? <Clock3 size={38} className="text-amber-600" /> : <CircleAlert size={38} className="text-red-600" />}
      <div role="status" aria-live="polite"><h2 id={titleId} className="mt-5 text-2xl font-black">{title}</h2><p id={descriptionId} className="mt-3 text-sm leading-6 text-[#61708a]">{description}</p></div>
      {result === "error" && error && <p role="alert" className="mt-3 text-sm leading-6 text-red-700">{error}</p>}
      <div className="mt-6 flex flex-col gap-3">
        <button type="button" onClick={onOkay} disabled={checking} className="min-h-12 rounded-xl bg-brand px-5 font-bold text-white hover:bg-brand-hover disabled:opacity-50">{checking ? "Checking…" : "Okay"}</button>
        {!checking && result !== "confirmed" && <button type="button" onClick={onCheckAgain} className="min-h-11 rounded-xl border border-[#dce5f1] px-5 text-sm font-semibold text-[#53647d] hover:bg-gray-50">Check again</button>}
      </div>
    </div>
  </dialog>;
}

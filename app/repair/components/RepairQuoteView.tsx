"use client";

import Link from "next/link";
import { Check, CheckCircle2, ChevronRight, Clock3, CreditCard, Loader2, LockKeyhole, Share2, ShieldCheck } from "lucide-react";
import { formatNaira, type RepairTracking } from "../public-api";
import { getFixxirWhatsAppUrl } from "../../site-info";

interface Props {
  ready: boolean;
  busy: boolean;
  loading: boolean;
  emailToken: string;
  recovery: boolean;
  tracking: RepairTracking | null;
  lookup: string;
  contact: string;
  error: string;
  notice: string;
  shareMessage: string;
  paymentLink: string;
  paymentLinkExpiresAt?: string;
  onContinue: () => void;
  onRecover: () => void;
  onVerify: (event: React.FormEvent<HTMLFormElement>) => void;
  onLookup: (value: string) => void;
  onContact: (value: string) => void;
  onOptional: (id: string, selected: boolean) => void;
  onPay: () => void;
  onShare: () => void;
}

const primary = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50";
const input = "min-h-12 w-full rounded-xl border border-[#dce5f1] bg-white px-4 text-sm text-[#10213f] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60";

function Feedback({ error, notice }: { error: string; notice: string }) {
  return <>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p>}
    {notice && !error && <p role="status" className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">{notice}</p>}
  </>;
}

export default function RepairQuoteView(props: Props) {
  const { ready, busy, loading, emailToken, recovery, tracking, lookup, contact, error, notice, shareMessage, paymentLink, paymentLinkExpiresAt, onContinue, onRecover, onVerify, onLookup, onContact, onOptional, onPay, onShare } = props;
  const working = busy || loading;
  const expiresAt = paymentLinkExpiresAt && Number.isFinite(Date.parse(paymentLinkExpiresAt))
    ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(paymentLinkExpiresAt))
    : "";

  if (!ready || (!tracking && working)) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6" aria-busy="true">
      <div role="status" className="text-center"><Loader2 size={30} className="mx-auto animate-spin text-brand" /><p className="mt-4 text-sm font-semibold text-[#10213f]">{ready ? "Opening your quote…" : "Loading your quote…"}</p><p className="mt-1 text-sm text-[#61708a]">Please wait a moment.</p></div>
    </main>;
  }

  const quote = tracking?.quote;
  const paid = tracking?.job.payment_status === "paid" || tracking?.payment?.status === "paid";
  const cancelled = tracking?.job.status === "cancelled";
  const editable = quote?.status === "sent" && !paid && !cancelled;
  const total = tracking?.payable_amount ?? quote?.payable_amount;
  const payable = quote && ["sent", "accepted"].includes(quote.status) && !paid && !cancelled;
  const disabled = working || total == null || total <= 0;

  return <main className="min-h-screen bg-[#f7f9fc] px-4 pb-10 pt-6 sm:px-6 sm:pt-9">
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-center justify-between sm:mb-10">
        <Link href="/" aria-label="Fixxir home" className="text-2xl font-black tracking-tight text-[#10213f]">fixxir<span className="text-brand">.</span></Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#61708a]"><LockKeyhole size={13} /> Secure quote</span>
      </header>

      {!tracking ? <section className="mx-auto mt-8 max-w-lg rounded-3xl border border-[#dce5f1] bg-white p-6 shadow-[0_12px_45px_-28px_rgba(16,33,63,0.25)] sm:mt-16 sm:p-9">
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand"><LockKeyhole size={23} /></span>
        <h1 className="text-2xl font-black tracking-tight text-[#10213f] sm:text-3xl">Your repair quote is ready</h1>
        <p className="mt-3 text-sm leading-6 text-[#61708a]">Review the recommended repairs, choose any optional services, and pay securely.</p>
        <div className="mt-6 space-y-4"><Feedback error={error} notice={notice} /></div>
        {emailToken && !recovery && <button type="button" onClick={onContinue} disabled={working} className={`${primary} mt-7`}>Continue to quote <ChevronRight size={18} /></button>}
        {!emailToken && !recovery && <p role="status" className="mt-6 text-sm leading-6 text-[#61708a]">Open the link from your Fixxir quote email, or use your repair details to access the quote.</p>}
        {!recovery ? <button type="button" onClick={onRecover} disabled={working} className="mt-4 min-h-11 w-full rounded-xl px-3 text-sm font-semibold text-[#61708a] transition hover:bg-gray-50 hover:text-brand disabled:opacity-50">Use repair details instead</button> : <form method="post" onSubmit={onVerify} className="mt-6 space-y-4">
          <div><label htmlFor="quote-lookup" className="mb-2 block text-sm font-semibold text-[#273b59]">Repair lookup code</label><input id="quote-lookup" name="lookup" value={lookup} onChange={(event) => onLookup(event.target.value)} disabled={working} required maxLength={64} autoComplete="off" placeholder="e.g. ABCD1234" className={input} /></div>
          <div><label htmlFor="quote-contact" className="mb-2 block text-sm font-semibold text-[#273b59]">Email or phone number</label><input id="quote-contact" name="contact" value={contact} onChange={(event) => onContact(event.target.value)} disabled={working} required maxLength={254} autoComplete="off" placeholder="Used for this repair" className={input} /><p className="mt-2 text-xs leading-5 text-[#61708a]">For a phone number, include the country code.</p></div>
          <button type="submit" disabled={working} className={primary}>View quote <ChevronRight size={18} /></button>
        </form>}
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#71819a]"><ShieldCheck size={14} /> Your repair details stay private.</p>
      </section> : <>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#71819a]">Repair {tracking.job.public_lookup_code}</p><h1 className="mt-2 text-2xl font-black tracking-tight text-[#10213f] sm:text-3xl">{tracking.job.device_manufacturer} {tracking.job.device_model}</h1><p className="mt-2 text-sm text-[#61708a]">{tracking.job.intake_description}</p></div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${paid ? "bg-green-50 text-green-700" : "bg-white text-[#61708a] ring-1 ring-[#dce5f1]"}`}>{paid ? "Paid" : cancelled ? "Cancelled" : quote?.status === "accepted" ? "Quote confirmed" : "Repair quote"}</span>
        </div>
        <div className="mb-5 space-y-3"><Feedback error={error} notice={notice} /></div>
        {!quote ? <section className="rounded-3xl border border-[#dce5f1] bg-white p-7"><h2 className="text-lg font-bold text-[#10213f]">Your quote is being prepared</h2><p className="mt-2 text-sm leading-6 text-[#61708a]">Fixxir will email you when your repair quote is ready.</p></section> : <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_290px]">
          <section className="overflow-hidden rounded-3xl border border-[#dce5f1] bg-white">
            <div className="border-b border-[#edf1f6] p-6"><h2 className="text-lg font-bold text-[#10213f]">Your repair plan</h2><p className="mt-2 text-sm leading-6 text-[#61708a]">{editable ? "Required repairs are included. Uncheck any optional repairs you don’t want." : paid ? "Payment received for your confirmed repair plan." : cancelled ? "This repair has been cancelled." : "Your selected repairs are confirmed and ready for payment."}</p>{quote.notes && <p className="mt-3 text-sm leading-6 text-[#61708a]">{quote.notes}</p>}</div>
            <div className="divide-y divide-[#edf1f6] px-6">
              {tracking.quote_lines.map((line) => {
                const optional = line.selection_type === "optional";
                return <div key={line.id} className="flex items-start gap-3 py-5">
                  {optional ? <input type="checkbox" id={`quote-line-${line.id}`} aria-label={`Include ${line.label}`} checked={line.selected} disabled={!editable || working} onChange={(event) => onOptional(line.id, event.target.checked)} className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 accent-[#1769e0] disabled:cursor-default disabled:opacity-50" /> : <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand"><Check size={15} /></span>}
                  <div className="min-w-0 flex-1">{optional ? <label htmlFor={`quote-line-${line.id}`} className="cursor-pointer text-sm font-bold leading-6 text-[#10213f]">{line.label}</label> : <h3 className="text-sm font-bold leading-6 text-[#10213f]">{line.label}</h3>}{line.summary && <p className="mt-1 text-sm leading-6 text-[#61708a]">{line.summary}</p>}<span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${optional ? "bg-gray-100 text-[#61708a]" : "bg-blue-50 text-blue-700"}`}>{optional ? "Optional" : "Required"}</span></div>
                  <span className={`shrink-0 pt-0.5 text-sm font-bold leading-6 ${line.selected ? "text-[#10213f]" : "text-[#8c99ac]"}`}>{formatNaira(line.amount)}</span>
                </div>;
              })}
            </div>
          </section>
          <aside className="rounded-3xl border border-[#dce5f1] bg-white p-6 md:sticky md:top-6">
            <p className="text-sm font-semibold text-[#61708a]">{paid ? "Amount paid" : "Total to pay"}</p><p className="mt-2 text-3xl font-black tracking-tight text-[#10213f]">{formatNaira(total)}</p>
            {working && <p role="status" className="mt-2 flex items-center gap-2 text-xs text-[#61708a]"><Loader2 size={12} className="animate-spin" /> Updating your quote…</p>}
            {quote.estimated_duration_days != null && <p className="mt-4 flex items-center gap-2 text-xs text-[#61708a]"><Clock3 size={14} /> Estimated repair: {quote.estimated_duration_days} {quote.estimated_duration_days === 1 ? "day" : "days"}</p>}
            {paid ? <p className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700"><CheckCircle2 size={18} /> Payment confirmed</p> : payable ? <>
              <button type="button" onClick={onPay} disabled={disabled} className={`${primary} mt-6`}><CreditCard size={17} /> {working ? "Please wait…" : `Pay ${formatNaira(total)}`}</button>
              {total != null && total <= 0 && <p className="mt-3 text-xs leading-5 text-[#61708a]">Select at least one repair before continuing to payment.</p>}
              <button type="button" onClick={onShare} disabled={disabled} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dce5f1] px-3 text-sm font-semibold text-[#273b59] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"><Share2 size={15} /> Share payment link</button>
              <p className="mt-3 text-xs leading-5 text-[#71819a]">Paying or creating a payment link confirms your selected repairs. A friend can pay using the link without your repair login.</p>
            </> : null}
            {paymentLink && !paid && !cancelled && <div className="mt-5 border-t border-[#edf1f6] pt-4"><label htmlFor="payment-share-link" className="text-xs font-semibold text-[#61708a]">Secure payment link</label><input id="payment-share-link" aria-label="Secure payment link" readOnly value={paymentLink} onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-10 w-full rounded-lg border border-[#dce5f1] bg-[#f7f9fc] px-3 text-xs text-[#53647d]" />{expiresAt && <p className="mt-2 text-xs leading-5 text-[#71819a]">Link expires {expiresAt}.</p>}</div>}
            {shareMessage && <p role="status" className="mt-3 text-xs leading-5 text-blue-700">{shareMessage}</p>}
            <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[#71819a]"><LockKeyhole size={12} /> Payments secured by Paystack</p>
          </aside>
        </div>}
      </>}
      <footer className="mt-8 text-center text-xs text-[#71819a]">Need a hand? <a href={getFixxirWhatsAppUrl("Hi Fixxir, I need help with my repair quote.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#53647d] underline underline-offset-2">Contact Fixxir</a></footer>
    </div>
  </main>;
}

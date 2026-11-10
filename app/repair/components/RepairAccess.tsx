"use client";

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreditCard, Loader2, LockKeyhole, RefreshCw } from 'lucide-react';
import { formatNaira, PublicApiError } from '../public-api';
import { canPay, canResumePayment, nextPollDelay, paymentSelection } from '../service-request-rules.mjs';
import { clearRequestSession, downloadRequestDocument, exchangeRequestToken, openRequestSession, readRequestSession, requestApi, saveRequestSession, serviceRequestApi, type CombinedQuote, type RequestDetail, type RequestPayment, type RequestSession } from '../service-request-api';
import { getFixxirWhatsAppUrl } from '../../site-info';

const button = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50';
const field = 'min-h-12 w-full rounded-xl border border-[#dce5f1] bg-white px-4 text-sm text-[#10213f] focus:border-blue-500';
const card = 'rounded-3xl border border-[#dce5f1] bg-white p-6';

export default function RepairAccess({ mode = 'tracking' }: { mode?: 'tracking' | 'quote' | 'payment-return' }) {
  return <Suspense fallback={<main className="p-10 text-center">Loading your request…</main>}><RequestAccess mode={mode} /></Suspense>;
}

function RequestAccess({ mode }: { mode: 'tracking' | 'quote' | 'payment-return' }) {
  const params = useSearchParams();
  const [lookup, setLookup] = useState(params.get('lookup') || '');
  const [contact, setContact] = useState('');
  const [emailToken, setEmailToken] = useState('');
  const [session, setSession] = useState<RequestSession | null>(null);
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [quote, setQuote] = useState<CombinedQuote | null>(null);
  const [payment, setPayment] = useState<RequestPayment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('price_too_high');
  const [rejectionComments, setRejectionComments] = useState('');
  const mounted = useRef(true);
  const operation = useRef(false);
  const initialized = useRef(false);
  const selectionVersion = useRef(0);
  const quoteRef = useRef<CombinedQuote | null>(null);

  const load = useCallback(async (access: RequestSession, expectedLookup?: string) => {
    const { data } = await serviceRequestApi<RequestDetail>(access, '/tracking');
    if (expectedLookup && data.public_lookup_code.toUpperCase() !== expectedLookup.toUpperCase()) {
      clearRequestSession(); throw new Error('Verify access for this request.');
    }
    if (!mounted.current) return;
    setSession(access); saveRequestSession(access); setDetail(data); setLookup(data.public_lookup_code);
    setPayment(null); quoteRef.current = null; setQuote(null);
    try {
      const result = await serviceRequestApi<CombinedQuote>(access, '/quote');
      if (mounted.current && data.overall_status !== 'quote_under_review' && !['withdrawn', 'under_review', 'draft'].includes(result.data.state || '') &&
          !['withdrawn', 'under_review'].includes(data.quote_summary?.state || data.quote_summary?.status || '')) {
        quoteRef.current = result.data; setQuote(result.data);
      }
    } catch (cause) {
      if (!(cause instanceof PublicApiError && [404, 409, 412].includes(cause.status))) throw cause;
    }
    return data;
  }, []);

  const handleError = useCallback((cause: unknown) => {
    if (!mounted.current) return;
    if (cause instanceof PublicApiError && [401, 403, 404, 410].includes(cause.status)) {
      clearRequestSession(); setSession(null); setDetail(null); setQuote(null); setPayment(null);
    }
    setError(cause instanceof Error ? cause.message : 'Please try again.');
  }, []);

  const verify = useCallback(async (access: RequestSession) => {
    const reference = params.get('reference') || params.get('trxref') || '';
    if (reference && !/^[a-zA-Z0-9_-]{1,128}$/.test(reference)) throw new Error('Invalid payment reference.');
    const { data } = await serviceRequestApi<RequestPayment>(access, '/payment/verify', { method: 'POST', body: JSON.stringify(reference ? { reference } : {}) });
    if (!mounted.current) return;
    const state = data.payment?.status || data.state;
    const latest = await load(access);
    setNotice(latest?.payment_summary?.state === 'needs_review' ? 'Your payment needs review. Please contact Fixxir before making another payment.' : state === 'paid' || state === 'already_paid' ? 'Payment confirmed.' : `Payment status: ${state || 'pending'}. You can check again.`);
  }, [load, params]);

  useEffect(() => {
    mounted.current = true;
    const clock = setInterval(() => setNow(Date.now()), 1000);
    if (!initialized.current) {
      initialized.current = true;
      const fragment = new URLSearchParams(window.location.hash.slice(1)).get('email_token') || '';
      const pathCode = window.location.pathname.match(/^\/repair\/track\/([a-zA-Z0-9_-]{1,64})\/?$/)?.[1];
      const expected = params.get('lookup') || pathCode;
      const clean = new URL(window.location.href);
      for (const key of ['contact', 'email', 'phone', 'lookup']) clean.searchParams.delete(key);
      window.history.replaceState(null, '', `${clean.pathname}${clean.search}${fragment ? '' : clean.hash}`);
      void Promise.resolve().then(async () => {
        if (expected) setLookup(expected);
        if (fragment) {
          clearRequestSession();
          if (/^[a-f0-9]{64}$/i.test(fragment)) setEmailToken(fragment);
          else setError('This email link is invalid. Verify your request details instead.');
          return;
        }
        const saved = readRequestSession();
        if (!saved) return;
        setBusy(true);
        try { await load(saved, expected); if (mode === 'payment-return') await verify(saved); }
        catch (cause) { handleError(cause); }
        finally { if (mounted.current) setBusy(false); }
      });
    }
    return () => { mounted.current = false; clearInterval(clock); };
  }, [handleError, load, mode, params, verify]);

  async function accessRequest(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (operation.current) return;
    operation.current = true; setBusy(true); setError('');
    clearRequestSession();
    try {
      const access = emailToken ? await exchangeRequestToken(emailToken) : await openRequestSession(lookup, contact);
      setEmailToken(''); setContact('');
      await load(access);
      if (mode === 'payment-return') await verify(access);
    } catch (cause) { setEmailToken(''); handleError(cause); }
    finally { operation.current = false; if (mounted.current) setBusy(false); }
  }

  async function changeOptional(jobId: string, lineId: string, selected: boolean) {
    if (!session || !quote || busy || quote.selection_locked) return;
    const version = ++selectionVersion.current;
    setBusy(true); setError(''); setPayment(null);
    const changed = { ...quote, jobs: quote.jobs.map(job => job.repair_job_id === jobId ? { ...job, lines: job.lines.map(line => line.id === lineId && line.selection_type === 'optional' ? { ...line, selected } : line) } : job) };
    setQuote(changed);
    try {
      const { data } = await serviceRequestApi<CombinedQuote>(session, '/quote/summary', { method: 'POST', body: JSON.stringify({ expected_publication_fingerprint: changed.publication_fingerprint, jobs: paymentSelection(changed).jobs }) });
      if (version === selectionVersion.current && mounted.current) { quoteRef.current = data; setQuote(data); }
    } catch (cause) { setQuote(quote); await refreshAfterConflict(cause); }
    finally { if (mounted.current) setBusy(false); }
  }

  async function refreshAfterConflict(cause: unknown) {
    if (cause instanceof PublicApiError && [409, 412].includes(cause.status) && session) {
      setPayment(null); quoteRef.current = null; setQuote(null);
      try { await load(session); } catch (refreshError) { handleError(refreshError); }
      setError('The offer changed or is under review. Check the latest details before continuing.');
    } else handleError(cause);
  }

  async function initializePayment() {
    const current = quoteRef.current;
    if (!session || !current || operation.current || busy || !(canPay(current, detail?.payment_summary?.state || '') || canResumePayment(current, detail?.payment_summary?.state || ''))) return;
    operation.current = true; setBusy(true); setError(''); setNotice('Preparing your full request payment…'); setPayment(null);
    const body = JSON.stringify(paymentSelection(current));
    try {
      for (let attempt = 0; mounted.current; attempt++) {
        const result = await serviceRequestApi<RequestPayment>(session, '/payment/initialize', { method: 'POST', body });
        if (!mounted.current) break;
        if (result.status === 202 || result.data.state === 'initializing') {
          const delay = nextPollDelay(attempt, result.data.retry_after_seconds || result.retryAfter);
          if (delay === null) { setNotice('Payment is still being prepared. Refresh before checking again.'); break; }
          await new Promise(resolve => setTimeout(resolve, delay)); continue;
        }
        setPayment(result.data);
        if (['paid', 'already_paid', 'payment_not_required'].includes(result.data.state)) {
          const latest = await load(session);
          setNotice(latest?.payment_summary?.state === 'needs_review' ? 'Your payment needs review. Please contact Fixxir before making another payment.' : result.data.state === 'payment_not_required' ? 'Your services are confirmed. No payment is required.' : 'Payment confirmed.');
        } else {
          setNotice('Use one of the available methods below to pay the full request.');
          const frozen = { ...(result.data.summary || current), selection_locked: true };
          quoteRef.current = frozen; setQuote(frozen);
        }
        break;
      }
    } catch (cause) {
      if (!(cause instanceof PublicApiError && [409, 412].includes(cause.status))) {
        try { await load(session); } catch { /* Keep the original payment error. */ }
      }
      await refreshAfterConflict(cause);
    }
    finally { operation.current = false; if (mounted.current) setBusy(false); }
  }

  async function perform(action: () => Promise<unknown>) {
    if (operation.current) return;
    operation.current = true; setBusy(true); setError('');
    try { await action(); } catch (cause) { handleError(cause); }
    finally { operation.current = false; if (mounted.current) setBusy(false); }
  }

  const paymentNotRequired = detail?.payment_summary?.state === 'payment_not_required' ||
    (quote?.total_amount === 0 && quote.selection_locked && detail?.payment_summary?.state !== 'needs_review');
  const paid = detail?.payment_summary?.state === 'paid' && !paymentNotRequired;
  const paymentNeedsReview = detail?.payment_summary?.state === 'needs_review';
  const review = detail?.overall_status === 'quote_under_review' || ['withdrawn', 'under_review'].includes(detail?.quote_summary?.state || detail?.quote_summary?.status || '');
  const methods = payment?.payment?.methods;
  const checkout = methods?.hosted_checkout;
  let checkoutUrl = '';
  if (checkout) {
    try { const url = new URL(checkout.authorization_url); if (url.origin === 'https://checkout.paystack.com' && !url.username && !url.password && (!checkout.expires_at || (now > 0 && Date.parse(checkout.expires_at) > now))) checkoutUrl = url.href; } catch { /* Never open an untrusted checkout. */ }
  }

  return <main className="min-h-screen bg-[#f7f9fc] px-4 py-10 sm:px-6"><div className="mx-auto max-w-4xl space-y-6">
    <header className="flex items-center justify-between"><Link href="/" className="text-2xl font-black text-[#10213f]">fixxir<span className="text-brand">.</span></Link><span className="flex items-center gap-2 text-xs text-[#61708a]"><LockKeyhole size={14} /> Secure request</span></header>
    <h1 className="text-3xl font-black text-[#10213f]">{mode === 'quote' ? 'Your repair quote' : mode === 'payment-return' ? 'Payment status' : 'Track your repair request'}</h1>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-xl bg-blue-50 p-4 text-blue-800">{notice}</p>}
    {paymentNeedsReview && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">Your payment needs review. Do not make another payment. Contact Fixxir for help.</p>}
    {busy && <p role="status" className="flex items-center gap-2 text-[#61708a]"><Loader2 size={18} className="animate-spin" /> Please wait…</p>}
    {!detail ? <section className={`${card} mx-auto max-w-lg`}>
      <h2 className="mb-4 text-lg font-bold text-[#10213f]">Access your request</h2>
      {emailToken ? <><button className={button} disabled={busy} onClick={() => void accessRequest()}>Continue securely</button><button className="mt-4 block text-brand" onClick={() => setEmailToken('')}>Use request details instead</button></> : <form onSubmit={accessRequest} className="space-y-4">
        <label className="block text-sm font-semibold">Request lookup code<input className={`${field} mt-2`} required maxLength={64} value={lookup} onChange={event => setLookup(event.target.value)} autoComplete="off" /></label>
        <label className="block text-sm font-semibold">Email or phone number<input className={`${field} mt-2`} required maxLength={254} value={contact} onChange={event => setContact(event.target.value)} autoComplete="off" /></label>
        <button className={button} disabled={busy}>View request</button>
      </form>}
    </section> : <>
      <section className={card}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-[#10213f]">{detail.public_lookup_code}</h2><p className="mt-2 text-[#61708a]">{detail.job_count} devices · {detail.overall_status.replaceAll('_', ' ')}</p></div><button className={button} disabled={busy} onClick={() => session && void perform(() => load(session))}><RefreshCw size={16} /> Refresh</button></div>
        <div className="mt-5 divide-y divide-[#edf1f6]">{detail.jobs.map(job => <article key={job.id} className="py-4"><h3 className="font-bold text-[#10213f]">{job.device_name || `${job.device_manufacturer || ''} ${job.device_model || 'Device'}`}</h3><p className="mt-1 text-sm text-[#61708a]">{job.status.replaceAll('_', ' ')}</p>{job.description && <p className="mt-1 text-sm text-[#61708a]">{job.description}</p>}<p className="mt-2 text-xs text-[#61708a]">{job.returned_at ? 'Device returned' : job.received_at ? 'Device received · Return not yet confirmed' : 'Device receipt not yet confirmed'}{job.quote_ready && !quote ? ' · Quote ready' : ''}</p></article>)}</div>
        <div className="mt-4 grid gap-3 text-sm text-[#61708a] sm:grid-cols-2"><p>Collection: {detail.collection?.status || detail.collection?.handoff_status || 'Awaiting confirmation'}</p><p>Return: {detail.return?.status || detail.return?.handoff_status || 'Awaiting confirmation'}</p></div>
      </section>
      {!quote ? <section className={card}><h2 className="text-lg font-bold text-[#10213f]">{review ? 'Your quote is being reviewed' : 'Your quote is being prepared'}</h2><p className="mt-2 text-sm text-[#61708a]">We will notify you when the combined quote is ready. Payment is not available.</p></section> : <section className={card}>
        <h2 className="text-xl font-bold text-[#10213f]">{paid ? 'Your confirmed services' : 'Your combined quote'}</h2>
        {quote.jobs.map(job => <article key={job.repair_job_id} className="mt-6 border-t border-[#edf1f6] pt-5"><h3 className="font-bold text-[#10213f]">{job.device_name}</h3>{job.lines.map(line => <label key={line.id} className="flex items-start gap-3 py-4 text-sm"><input type="checkbox" checked={line.selection_type === 'required' || line.selected} disabled={busy || paid || quote.selection_locked || line.selection_type !== 'optional'} onChange={event => void changeOptional(job.repair_job_id, line.id, event.target.checked)} className="mt-1 h-5 w-5 accent-[#1769e0]" /><span className="flex-1"><strong className="block text-[#10213f]">{line.label}</strong><span className="block text-[#61708a]">{line.summary}</span><span className="text-xs text-[#61708a]">{line.selection_type}</span></span><strong>{formatNaira(line.amount)}</strong></label>)}<p className="text-right font-semibold">Device subtotal: {formatNaira(job.subtotal)}</p></article>)}
        <div className="mt-6 border-t border-[#dce5f1] pt-5"><p className="text-2xl font-black text-[#10213f]">Total: {formatNaira(quote.total_amount)}</p>{paymentNotRequired ? <p className="mt-3 font-bold text-green-700">Services confirmed · No payment required</p> : paid ? <p className="mt-3 font-bold text-green-700">Payment confirmed</p> : <button className={`${button} mt-4`} disabled={busy || !(canPay(quote, detail.payment_summary?.state || '') || canResumePayment(quote, detail.payment_summary?.state || ''))} onClick={() => void initializePayment()}><CreditCard size={17} />{canResumePayment(quote, detail.payment_summary?.state || '') ? 'Continue full payment' : quote.total_amount === 0 ? 'Confirm services' : `Prepare full payment of ${formatNaira(quote.total_amount)}`}</button>}</div>
        <button className="mt-4 text-sm font-semibold text-brand underline" disabled={busy} onClick={() => session && void perform(() => downloadRequestDocument(session, '/quote/pdf'))}>Download quote PDF</button>
        {!paid && !quote.selection_locked && <details className="mt-5 border-t border-[#edf1f6] pt-4"><summary className="cursor-pointer text-sm font-semibold text-[#61708a]">Decline this combined quote</summary><form className="mt-4 space-y-3" onSubmit={event => {
          event.preventDefault();
          if (!session) return;
          void perform(async () => {
            try {
              await serviceRequestApi(session, '/quote/reject', { method: 'POST', body: JSON.stringify({ expected_publication_fingerprint: quote.publication_fingerprint, reason: rejectionReason, comments: rejectionComments.trim() }) });
              await load(session); setNotice('The combined quote was declined. Fixxir will review your feedback.');
            } catch (cause) { await refreshAfterConflict(cause); }
          });
        }}><label className="block text-sm">Reason<select className={`${field} mt-2`} value={rejectionReason} onChange={event => setRejectionReason(event.target.value)}><option value="price_too_high">Price too high</option><option value="repair_time_too_long">Repair time too long</option><option value="unnecessary_repairs">Unnecessary repairs</option><option value="second_opinion">I want a second opinion</option><option value="other">Other</option></select></label><label className="block text-sm">Comments<textarea className={`${field} mt-2 p-3`} required={rejectionReason === 'other'} maxLength={2000} value={rejectionComments} onChange={event => setRejectionComments(event.target.value)} /></label><p className="text-xs text-[#61708a]">This declines the whole combined offer, not an individual service.</p><button className={button} disabled={busy}>Decline combined quote</button></form></details>}
      </section>}
      {!paid && !paymentNeedsReview && methods && <section className={`${card} space-y-5`}><h2 className="text-xl font-bold">Pay the full request</h2><p>{formatNaira(payment?.payment?.amount)} · Reference: {payment?.payment?.reference}</p>
        {checkoutUrl && <><a href={checkoutUrl} rel="noreferrer" className={button}>Pay securely with Paystack</a><button className="ml-3 text-sm text-brand underline" onClick={() => void perform(async () => { await navigator.clipboard.writeText(checkoutUrl); setNotice('Secure payment link copied.'); })}>Copy payment link</button></>}
        {(['generated_transfer_account', 'company_bank_transfer_fallback'] as const).map(key => { const bank = methods[key]; return bank ? <div key={key} className="rounded-xl bg-blue-50 p-4 text-sm"><h3 className="font-bold">{key === 'generated_transfer_account' ? 'Bank transfer' : 'Company bank transfer'}</h3><p>{bank.bank_name}</p><p>{bank.account_name}</p><p className="select-all font-mono">{bank.account_number}</p>{bank.payment_reference_note && <p>Reference: {bank.payment_reference_note}</p>}{bank.expires_at && <p>Valid until {new Date(bank.expires_at).toLocaleString()}</p>}<p>Transfer the full amount only. Verify payment after transferring.</p></div> : null; })}
      </section>}
      <section className={`${card} flex flex-wrap gap-4`}><button className={button} disabled={busy} onClick={() => session && void perform(() => verify(session))}>Check payment status</button>{paid && <><button className={button} disabled={busy} onClick={() => session && void perform(() => downloadRequestDocument(session, '/receipt/pdf'))}>Download receipt PDF</button><button className="text-brand underline" disabled={busy} onClick={() => session && void perform(() => downloadRequestDocument(session, '/receipt/image'))}>Download receipt image</button></>}</section>
      {!!detail.timeline?.length && <section className={card}><h2 className="font-bold">Request updates</h2><ol className="mt-4 space-y-4">{detail.timeline.map(event => <li key={event.id}><p>{event.code.replaceAll('_', ' ')}</p><p className="text-xs text-[#61708a]">{detail.jobs.find(job => job.id === event.repair_job_id)?.device_model || 'Device update'}</p><time className="text-xs text-[#61708a]">{new Date(event.occurred_at).toLocaleString()}</time></li>)}</ol></section>}
      <button className="text-sm text-[#61708a] underline" disabled={busy} onClick={() => session && void perform(async () => { await requestApi('/public/service-request-sessions/logout', { method: 'POST' }, session); clearRequestSession(); setSession(null); setDetail(null); setQuote(null); setPayment(null); })}>Sign out of this request</button>
    </>}
    <footer className="text-center text-sm text-[#61708a]">Need help? <a className="underline" href={getFixxirWhatsAppUrl()} target="_blank" rel="noopener noreferrer">Contact Fixxir</a></footer>
  </div></main>;
}

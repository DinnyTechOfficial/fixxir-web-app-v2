"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FIXXIR_BUSINESS_ADDRESS,
  FIXXIR_PHONE_DISPLAY,
  FIXXIR_PHONE_LINK,
  FIXXIR_SUPPORT_HOURS,
  getFixxirWhatsAppUrl,
} from "../../../site-info";

export default function RepairRequestSuccess() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-600">Checking request confirmation...</div>}>
      <RepairRequestSuccessContent />
    </Suspense>
  );
}

function RepairRequestSuccessContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const emailAccepted = searchParams.get("emailAccepted") === "1";

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          {requestId ? <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" /> : <MessageCircle className="mx-auto h-16 w-16 text-blue-600" />}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {requestId ? "Your repair request has been received." : "No request to confirm yet."}
        </h1>

        <div className="bg-white rounded-lg border-2 border-green-200 p-8 mb-8">
          {requestId ? (
            <div className="space-y-3 text-gray-700">
              <p>Our team will review the details and contact you to confirm the next step.</p>
              <p className="font-semibold">Request reference: <span className="text-blue-700">{requestId}</span></p>
              <p role="status">
                {emailAccepted
                  ? "The confirmation email was accepted for sending to the address you provided. Check your inbox and spam folder."
                  : "Your request was saved, but the confirmation email could not be queued. Please contact Fixxir if you need the details resent."}
              </p>
            </div>
          ) : (
            <p className="text-gray-700">
              This page only confirms a request after successful submission. Start a repair request or contact Fixxir directly.
            </p>
          )}
        </div>

        <p className="text-lg text-gray-700 mb-8">
          Support hours: <strong>{FIXXIR_SUPPORT_HOURS}</strong>. We&apos;ll confirm availability, any applicable fees,
          and next steps when you contact us.
        </p>

        <div className="mb-8">
          <a
            href={getFixxirWhatsAppUrl(requestId ? `Hi Fixxir, I have a question about repair request ${requestId}.` : "Hi Fixxir, I'd like to request a device repair.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {requestId ? "Ask Fixxir about this request" : "Contact Fixxir on WhatsApp"}
          </a>
          <p className="mt-3 text-sm text-gray-600">{FIXXIR_PHONE_DISPLAY}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h2 className="font-bold text-gray-900 mb-2">Workshop address</h2>
          <p className="text-sm text-gray-700">{FIXXIR_BUSINESS_ADDRESS}</p>
          <p className="mt-3 text-sm text-gray-700">Please contact us to confirm arrangements before visiting.</p>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Prefer to call? <a href={`tel:${FIXXIR_PHONE_LINK}`} className="text-green-700 font-semibold">{FIXXIR_PHONE_DISPLAY}</a>
        </p>

        <Link
          href="/"
          className="inline-block text-blue-600 font-semibold hover:underline mt-6"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

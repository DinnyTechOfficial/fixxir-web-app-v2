import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  FIXXIR_BUSINESS_ADDRESS,
  FIXXIR_PHONE_DISPLAY,
  FIXXIR_PHONE_LINK,
  FIXXIR_SUPPORT_HOURS,
  getFixxirWhatsAppUrl,
} from "../../../site-info";

export default function RepairRequestSuccess() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <MessageCircle className="w-16 h-16 text-green-600 mx-auto" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          One last step to contact Fixxir.
        </h1>

        <div className="bg-white rounded-lg border-2 border-green-200 p-8 mb-8">
          <p className="text-gray-700">
            This website does not yet send or save repair requests. Contact Fixxir directly on WhatsApp to
            request a repair. Your details from the form have not been sent.
          </p>
        </div>

        <p className="text-lg text-gray-700 mb-8">
          Support hours: <strong>{FIXXIR_SUPPORT_HOURS}</strong>. We&apos;ll confirm availability, any applicable fees,
          and next steps when you contact us.
        </p>

        <div className="mb-8">
          <a
            href={getFixxirWhatsAppUrl("Hi Fixxir, I'd like to request a device repair.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Contact Fixxir on WhatsApp
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

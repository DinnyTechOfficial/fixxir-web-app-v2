"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { paymentTrackingURL } from "../payment-return";

export default function PaymentReturnRedirect() {
  useEffect(() => {
    window.location.replace(paymentTrackingURL(new URLSearchParams(window.location.search), window.location.pathname));
  }, []);
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]" aria-busy="true"><p role="status" className="flex items-center gap-3 text-sm text-[#53647d]"><Loader2 className="animate-spin" size={22} />Opening repair tracking…</p></main>;
}

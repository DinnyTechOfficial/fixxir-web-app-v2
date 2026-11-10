import type { Metadata } from "next";
import PaymentReturnRedirect from "../../components/PaymentReturnRedirect";

export const metadata: Metadata = {
  title: "Payment status | Fixxir",
  description: "Securely confirm your repair payment with Fixxir.",
  alternates: { canonical: "/repair/payment/return" },
  robots: { index: false, follow: false },
};

export default function PaymentReturnPage() {
  return <PaymentReturnRedirect />;
}

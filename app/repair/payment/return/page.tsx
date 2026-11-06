import type { Metadata } from "next";
import RepairAccess from "../../components/RepairAccess";

export const metadata: Metadata = {
  title: "Payment status | Fixxir",
  description: "Securely confirm your repair payment with Fixxir.",
  alternates: { canonical: "/repair/payment/return" },
  robots: { index: false, follow: false },
};

export default function PaymentReturnPage() {
  return <RepairAccess mode="payment-return" />;
}

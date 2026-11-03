import type { Metadata } from "next";
import RepairAccess from "../components/RepairAccess";

export const metadata: Metadata = {
  title: "Review your repair quote | Fixxir",
  description: "Review your Fixxir repair quote, choose optional services, and continue to secure payment.",
  alternates: { canonical: "/repair/quote" },
  robots: { index: false, follow: false },
};

export default function RepairQuotePage() {
  return <RepairAccess mode="quote" />;
}

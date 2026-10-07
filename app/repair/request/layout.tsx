import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Phone or Laptop Repair | Fixxir",
  description:
    "Tell Fixxir what is wrong with your phone or laptop to start a repair request. We serve customers in Lagos and Abuja.",
  alternates: {
    canonical: "/repair/request",
  },
  openGraph: {
    title: "Request a Phone or Laptop Repair | Fixxir",
    description:
      "Tell Fixxir what is wrong with your phone or laptop to start a repair request. We serve customers in Lagos and Abuja.",
    url: "/repair/request",
  },
  twitter: {
    title: "Request a Phone or Laptop Repair | Fixxir",
    description:
      "Tell Fixxir what is wrong with your phone or laptop to start a repair request. We serve customers in Lagos and Abuja.",
  },
};

export default function RepairRequestLayout({
  children,
}: LayoutProps<"/repair/request">) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repair Request Confirmation | Fixxir",
  description:
    "Check your Fixxir repair request confirmation and find the next steps for your device repair.",
  alternates: {
    canonical: "/repair/request/success",
  },
  robots: {
    index: false,
  },
};

export default function RepairRequestSuccessLayout({
  children,
}: LayoutProps<"/repair/request/success">) {
  return children;
}

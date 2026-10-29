import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track your repair | Fixxir",
  description: "Follow your Fixxir repair progress, review your quote, and continue to secure payment.",
  alternates: { canonical: "/repair/track" },
  robots: { index: false, follow: false },
};

export default function RepairTrackLayout({ children }: LayoutProps<"/repair/track">) {
  return children;
}

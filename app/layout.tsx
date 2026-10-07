import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "./site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fixxir | Device repair without the stress",
  description:
    "Get phone and laptop repairs in Lagos and Abuja without the stress. Fixxir manages diagnosis, clear repair approvals, updates and quality checks.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Fixxir",
    title: "Fixxir | Device repair without the stress",
    description:
      "Get phone and laptop repairs in Lagos and Abuja without the stress. Fixxir manages diagnosis, clear repair approvals, updates and quality checks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixxir | Device repair without the stress",
    description:
      "Get phone and laptop repairs in Lagos and Abuja without the stress. Fixxir manages diagnosis, clear repair approvals, updates and quality checks.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import { ShieldCheck, Wrench } from "lucide-react";
import { getFixxirWhatsAppUrl } from "../site-info";

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-[#dce5f1] px-5 py-16 sm:px-8 sm:py-24 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="hero-backdrop-image absolute -inset-3 bg-cover bg-center opacity-60 sm:inset-0 sm:opacity-100"
        style={{
          backgroundImage: "url('/images/fixxir-hero-landing.webp')",
          backgroundPosition: "65% center",
        }}
      />
      <div className="absolute inset-0 bg-[#f7f9fc]/55 sm:hidden" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(247,249,252,0.96)_0%,rgba(236,242,249,0.88)_42%,rgba(236,242,249,0.16)_72%)] sm:block" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_35%)] sm:block" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="max-w-[640px]">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">
            Phone & laptop repair in Lagos and Abuja
          </p>
          <h1 className="text-[clamp(3rem,6vw,5.8rem)] font-black leading-[0.9] tracking-[-0.06em] text-[#10213f]">
            Device repair without the stress.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#61708a]">
            Fixxir manages your phone or laptop repair from diagnosis to return, with
            clear pricing, your approval before work begins, repair updates and quality
            checks.
          </p>

          <div id="hero-actions" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/repair/request"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1769e0] px-6 font-bold text-white shadow-[0_12px_24px_rgba(23,105,224,0.23)] transition hover:bg-[#0d4db4]"
            >
              Start a repair <Wrench size={17} />
            </a>
            <a
              href={getFixxirWhatsAppUrl("Hi Fixxir, I need device repair help")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c7d5e7] bg-white/85 px-6 font-bold text-[#10213f] backdrop-blur-sm transition hover:border-[#1769e0] hover:text-[#1769e0]"
            >
              Chat on WhatsApp <span className="text-[#1ca56c]">●</span>
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-[#61708a]">
            <ShieldCheck size={16} className="text-[#1ca56c]" /> Pickup & return available
            Contact us to confirm pickup availability.
          </p>
        </div>

      </div>
    </section>
  );
}

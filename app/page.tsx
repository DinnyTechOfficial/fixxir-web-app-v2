"use client";

import Image from "next/image";
import HeroSection from "./components/HeroSection";
import TrustSignals from "./components/TrustSignals";
import ProblemDifferentiation from "./components/ProblemDifferentiation";
import ServicesSection from "./components/ServicesSection";
import HowItWorks from "./components/HowItWorks";
import TrustPrivacy from "./components/TrustPrivacy";
import ReviewsSection from "./components/ReviewsSection";
import FAQSection from "./components/FAQSection";
import B2BSection from "./components/B2BSection";
import FinalCTA from "./components/FinalCTA";
import {
  FIXXIR_BUSINESS_ADDRESS,
  FIXXIR_PHONE_DISPLAY,
  FIXXIR_PHONE_LINK,
  FIXXIR_SUPPORT_HOURS,
  getFixxirWhatsAppUrl,
} from "./site-info";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [areHeroActionsVisible, setAreHeroActionsVisible] = useState(true);
  const [isMobileCTAHidden, setIsMobileCTAHidden] = useState(false);
  const closeMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const showMobileCTA = !areHeroActionsVisible && !isMobileCTAHidden;

  useEffect(() => {
    const heroActions = document.getElementById("hero-actions");
    if (!heroActions) return;

    const observer = new IntersectionObserver(([entry]) => {
      setAreHeroActionsVisible(entry.isIntersecting);
    });
    observer.observe(heroActions);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeMenuButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [isMobileMenuOpen]);

  const trapMenuFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !mobileMenuRef.current) return;
    const focusable = Array.from(
      mobileMenuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div className="bg-[#f7f9fc] text-[#10213f]">
      <header className="sticky top-0 z-30 border-b border-[#dce5f1]/80 bg-[#f7f9fc]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="inline-flex items-center gap-2 text-xl font-black tracking-tighter text-[#10213f]">
            <Image src="/logo/fixxir-mark.png" alt="" width={36} height={36} priority unoptimized />
            <span>fixxir<span className="text-[#1769e0]">.</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#61708a] lg:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="transition hover:text-[#1769e0]">How it works</a>
            <a href="#services" className="transition hover:text-[#1769e0]">Services</a>
            <a href="#why-fixxir" className="transition hover:text-[#1769e0]">Why Fixxir</a>
            <a href="#business" className="transition hover:text-[#1769e0]">For business</a>
            <a href="#faq" className="transition hover:text-[#1769e0]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden px-3 py-2 text-sm font-semibold text-[#61708a] lg:block">Contact</a>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
              aria-label="Open site menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#dce5f1] text-[#10213f] transition hover:bg-white lg:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close site menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-[#10213f]/45"
          />
          <aside
            id="mobile-site-menu"
            ref={mobileMenuRef}
            onKeyDown={trapMenuFocus}
            className="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] flex-col border-l border-[#dce5f1] bg-[#f7f9fc] p-5 shadow-2xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <a href="#top" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center gap-2 text-xl font-black text-[#10213f]">
                <Image src="/logo/fixxir-mark.png" alt="" width={32} height={32} unoptimized />
                <span>fixxir<span className="text-[#1769e0]">.</span></span>
              </a>
              <button
                ref={closeMenuButtonRef}
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close site menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#52627b] hover:bg-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 text-base font-semibold text-[#33445f]">
              <a onClick={() => setIsMobileMenuOpen(false)} href="#how-it-works" className="rounded-lg px-3 py-3 hover:bg-white">How it works</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#services" className="rounded-lg px-3 py-3 hover:bg-white">Services</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#why-fixxir" className="rounded-lg px-3 py-3 hover:bg-white">Why Fixxir</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#business" className="rounded-lg px-3 py-3 hover:bg-white">For business</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#faq" className="rounded-lg px-3 py-3 hover:bg-white">FAQ</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#contact" className="rounded-lg px-3 py-3 hover:bg-white">Contact</a>
            </nav>
            <a
              href="/repair/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1769e0] px-5 font-bold text-white shadow-[0_8px_20px_rgba(23,105,224,0.2)] transition hover:bg-[#0d4db4]"
            >
              Start a repair <ArrowRight size={17} />
            </a>
          </aside>
        </div>
      )}
      {/* Quick actions appear after the hero actions scroll out of view. */}
      {showMobileCTA && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dce5f1] bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-[#10213f] shadow-[0_-8px_24px_rgba(16,33,63,0.12)] backdrop-blur sm:hidden">
          <div className="flex gap-3">
            <a href={getFixxirWhatsAppUrl("Hi Fixxir, I need device repair help")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#c7d5e7] px-3 text-sm font-bold text-[#10213f]">
              WhatsApp
            </a>
            <a
              href="/repair/request"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#1769e0] px-3 text-sm font-bold text-white"
            >
              Start a repair
            </a>
            <button
              onClick={() => setIsMobileCTAHidden(true)}
              aria-label="Hide quick actions"
              title="Hide quick actions"
              className="inline-flex w-10 items-center justify-center rounded-lg text-[#52627b] hover:bg-[#eef4fc]"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main content with padding for sticky bar on mobile */}
      <div className="pb-20 sm:pb-0">
        <HeroSection />
        <TrustSignals />
        <ProblemDifferentiation />
        <ServicesSection />
        <HowItWorks />
        <TrustPrivacy />
        <ReviewsSection />
        <FAQSection />
        <B2BSection />
        <FinalCTA />

        {/* Footer */}
        <footer id="contact" className="bg-[#10213f] py-10 px-4 text-[#b7c4d8] sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="mb-4 inline-flex items-center gap-2 font-black tracking-tighter text-white">
                  <Image src="/logo/fixxir-mark.png" alt="" width={28} height={28} unoptimized />
                  <span>fixxir<span className="text-[#70a9ff]">.</span></span>
                </h3>
                <p className="text-sm">
                  Device repair without the stress.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/repair/request" className="hover:text-white transition">
                      Start a repair
                    </a>
                  </li>
                  <li>
                    <a href="#business" className="hover:text-white transition">
                      Business repair
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li>{FIXXIR_BUSINESS_ADDRESS}</li>
                  <li><a href={`tel:${FIXXIR_PHONE_LINK}`} className="hover:text-white transition">{FIXXIR_PHONE_DISPLAY}</a></li>
                  <li><a href={getFixxirWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">WhatsApp</a></li>
                  <li>Hours: {FIXXIR_SUPPORT_HOURS}</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#314463] pt-8 text-center text-sm">
              <p>&copy; 2026 Fixxir. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

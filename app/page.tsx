"use client";

import Launch100Banner from "./components/Launch100Banner";
import HeroSection from "./components/HeroSection";
import TrustSignals from "./components/TrustSignals";
import ProblemDifferentiation from "./components/ProblemDifferentiation";
import ServicesSection from "./components/ServicesSection";
import HowItWorks from "./components/HowItWorks";
import Launch100Section from "./components/Launch100Section";
import TrustPrivacy from "./components/TrustPrivacy";
import ReviewsSection from "./components/ReviewsSection";
import FAQSection from "./components/FAQSection";
import B2BSection from "./components/B2BSection";
import FinalCTA from "./components/FinalCTA";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

export default function Home() {
  const [showMobileCTA, setShowMobileCTA] = useState(true);

  return (
    <div className="bg-[#f7f9fc] text-[#10213f]">
      <header className="sticky top-0 z-30 border-b border-[#dce5f1]/80 bg-[#f7f9fc]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="text-xl font-black tracking-tighter text-[#10213f]">fixxir<span className="text-[#1769e0]">.</span></a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#61708a] lg:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="transition hover:text-[#1769e0]">How it works</a>
            <a href="#services" className="transition hover:text-[#1769e0]">Services</a>
            <a href="#why-fixxir" className="transition hover:text-[#1769e0]">Why Fixxir</a>
            <a href="#business" className="transition hover:text-[#1769e0]">For business</a>
            <a href="#faq" className="transition hover:text-[#1769e0]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#faq" className="hidden px-3 py-2 text-sm font-semibold text-[#61708a] sm:block">Track repair</a>
            <a href="/repair/request" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1769e0] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(23,105,224,0.2)] transition hover:bg-[#0d4db4]">
              Start a repair <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </header>
      {/* Sticky mobile CTA bar */}
      {showMobileCTA && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-blue-600 text-white p-4 shadow-lg z-40">
          <div className="flex gap-3">
            <a href="https://wa.me/2349000000000?text=Hi%20Fixxir%2C%20I%20need%20device%20repair%20help" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-white/40 px-3 text-sm font-bold text-white">
              WhatsApp
            </a>
            <a
              href="/repair/request"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-3 text-sm font-bold text-[#1769e0]"
            >
              Start a repair
            </a>
            <button
              onClick={() => setShowMobileCTA(false)}
              aria-label="Dismiss mobile actions"
              className="px-2 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main content with padding for sticky bar on mobile */}
      <div className={showMobileCTA ? "pb-20 sm:pb-0" : ""}>
        <Launch100Banner />
        <HeroSection />
        <TrustSignals />
        <ProblemDifferentiation />
        <ServicesSection />
        <HowItWorks />
        <Launch100Section />
        <TrustPrivacy />
        <ReviewsSection />
        <FAQSection />
        <B2BSection />
        <FinalCTA />

        {/* Footer */}
        <footer className="bg-[#10213f] py-10 px-4 text-[#b7c4d8] sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="mb-4 font-black tracking-tighter text-white">fixxir<span className="text-[#70a9ff]">.</span></h3>
                <p className="text-sm">
                  Device repair without the stress.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Start a repair
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Track repair
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Business repair
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Contact us
                    </a>
                  </li>
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

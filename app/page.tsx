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

export default function Home() {
  const [showMobileCTA, setShowMobileCTA] = useState(true);

  return (
    <div className="bg-white">
      {/* Sticky mobile CTA bar */}
      {showMobileCTA && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-blue-600 text-white p-4 shadow-lg z-40">
          <div className="flex gap-3">
            <a
              href="/repair/request"
              className="flex-1 bg-white text-blue-600 font-semibold py-2 px-4 rounded text-center text-sm"
            >
              Start a repair
            </a>
            <button
              onClick={() => setShowMobileCTA(false)}
              className="text-white text-2xl leading-none px-2"
            >
              ×
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
        <footer className="bg-gray-900 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">Fixxir</h3>
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
            <div className="border-t border-gray-700 pt-8 text-center text-sm">
              <p>&copy; 2026 Fixxir. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

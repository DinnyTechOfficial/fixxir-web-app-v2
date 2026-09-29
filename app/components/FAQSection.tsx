import { FIXXIR_BUSINESS_ADDRESS, FIXXIR_SUPPORT_HOURS, getFixxirWhatsAppUrl } from "../site-info";

const faqs = [
  {
    question: "What devices do you work on?",
    answer: "Fixxir currently accepts repair requests for phones and laptops.",
  },
  {
    question: "Where is Fixxir located?",
    answer: FIXXIR_BUSINESS_ADDRESS,
  },
  {
    question: "Can I get a price before repair work begins?",
    answer: "Contact Fixxir with your device and issue details. We will confirm the diagnostic process and quote before repair work is authorized.",
  },
  {
    question: "Will you start repairing before I approve?",
    answer: "No. Repair work should only begin after you have reviewed and approved the proposed repair.",
  },
  {
    question: "How do I confirm pickup, timing, or current terms?",
    answer: `Contact us on WhatsApp during our support hours (${FIXXIR_SUPPORT_HOURS}). We will confirm availability and any applicable fees before scheduling.`,
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="bg-[#eef4fc] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">Good to know</p>
        <h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group cursor-pointer rounded-2xl border border-[#dce5f1] bg-white p-5 transition hover:border-[#9dbfea]"
            >
              <summary className="flex items-center justify-between font-bold text-[#10213f] group-open:text-[#1769e0]">
                {faq.question}
                <span className="text-[#1769e0] transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
        <a
          href={getFixxirWhatsAppUrl("Hi Fixxir, I have a question about device repair")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex font-semibold text-[#1769e0] hover:underline"
        >
          Ask us on WhatsApp
        </a>
      </div>
    </section>
  );
}

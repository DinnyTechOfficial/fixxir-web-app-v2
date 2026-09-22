const faqs = [
  {
    question: "What devices does Fixxir repair?",
    answer:
      "Yes. Once your device is received, you'll see live status updates. We notify you at every milestone via WhatsApp.",
  },
  {
    question: "Can I know the price before handing over my device?",
    answer:
      "Tell us your urgency when submitting the repair request. We'll prioritize where possible and confirm feasibility during diagnosis.",
  },
  {
    question: "Will you start repairing before I approve?",
    answer:
      "Currently, Fixxir Launch 100 covers selected Lagos locations for pickup and return. We're expanding soon.",
  },
  {
    question: "Do you offer pickup and delivery?",
    answer:
      "We accept card (Visa, Mastercard) and bank transfer via Paystack. Payment is required after you approve the quote.",
  },
  {
    question: "How long will my repair take?",
    answer:
      "Yes, before diagnosis starts. After diagnosis, cancellation terms apply. Contact us on WhatsApp to discuss.",
  },
  {
    question: "What happens if the issue returns?",
    answer:
      "Yes, but we'll document all existing damage during intake. Your quote is for the fault you reported, not pre-existing damage.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="bg-[#eef4fc] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">Good to know</p><h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group cursor-pointer rounded-2xl border border-[#dce5f1] bg-white p-5 transition hover:border-[#9dbfea]"
            >
              <summary className="flex items-center justify-between font-bold text-[#10213f] group-open:text-[#1769e0]">
                {faq.question}
                <span className="text-[#1769e0] transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="text-gray-700 mt-4 text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

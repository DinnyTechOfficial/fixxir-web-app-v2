const faqs = [
  {
    question: "Can I track my repair in real-time?",
    answer:
      "Yes. Once your device is received, you'll see live status updates. We notify you at every milestone via WhatsApp.",
  },
  {
    question: "What if I need my device back faster?",
    answer:
      "Tell us your urgency when submitting the repair request. We'll prioritize where possible and confirm feasibility during diagnosis.",
  },
  {
    question: "Do you service devices outside Lagos?",
    answer:
      "Currently, Fixxir Launch 100 covers selected Lagos locations for pickup and return. We're expanding soon.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept card (Visa, Mastercard) and bank transfer via Paystack. Payment is required after you approve the quote.",
  },
  {
    question: "Can I cancel my repair request?",
    answer:
      "Yes, before diagnosis starts. After diagnosis, cancellation terms apply. Contact us on WhatsApp to discuss.",
  },
  {
    question: "Do you repair devices with existing cracks or damage?",
    answer:
      "Yes, but we'll document all existing damage during intake. Your quote is for the fault you reported, not pre-existing damage.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-sm transition"
            >
              <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-blue-600">
                {faq.question}
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-700 mt-4 text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

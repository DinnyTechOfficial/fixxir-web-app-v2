const steps = [
  { number: "1", title: "Tell us what happened", description: "Submit device details and issue" },
  { number: "2", title: "Pickup / handoff", description: "We pick up or you hand off the device" },
  { number: "3", title: "Diagnosis & quote", description: "We diagnose and show you the repair plan" },
  { number: "4", title: "Approve & pay", description: "You approve the quote and pay securely" },
  { number: "5", title: "Repair + updates", description: "We repair and keep you informed" },
  { number: "6", title: "QA + return", description: "Quality check, then return to you" },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How Fixxir Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-gray-50 rounded-lg p-6">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                {step.number}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

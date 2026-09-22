const proofPoints = [
  {
    title: "Clear diagnosis",
    description: "Know exactly what's wrong before repair",
  },
  {
    title: "No repair without approval",
    description: "You approve the quote before any work starts",
  },
  {
    title: "Repair updates",
    description: "Real-time status updates on your device",
  },
  {
    title: "Quality check before return",
    description: "QA tested and confirmed before returning",
  },
  {
    title: "One accountable process",
    description: "From handoff to return, one Fixxir journey",
  },
];

export default function TrustSignals() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Fixxir
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {proofPoints.map((point) => (
            <div key={point.title} className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

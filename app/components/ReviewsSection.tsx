const reviews = [
  {
    name: "Chioma O.",
    device: "iPhone 13 Screen",
    text: "Fixed my screen in 24 hours and kept me updated every step. No surprises on the bill.",
  },
  {
    name: "Adeyemi T.",
    device: "Lenovo Laptop Battery",
    text: "Finally found someone I can trust with device repair. Clear diagnosis, fair price, quick turnaround.",
  },
  {
    name: "Ngozi P.",
    device: "Samsung Galaxy Battery",
    text: "The ₦5,000 care credit from Launch 100 was perfect. Using it to fix my sister's phone.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Trusted by Fixxir customers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
              <p className="font-semibold text-gray-900">{review.name}</p>
              <p className="text-sm text-gray-600">{review.device}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-8">
          Reviews from actual Launch 100 customers. We only show real reviews.
        </p>
      </div>
    </section>
  );
}

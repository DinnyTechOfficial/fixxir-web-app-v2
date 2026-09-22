export default function ServicesSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What we repair
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Phones */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Phones</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>iPhone</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Samsung</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Tecno</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Infinix</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Select other Android devices</span>
              </li>
            </ul>
          </div>

          {/* Laptops */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Laptops</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>HP</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Dell</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Lenovo</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>MacBook</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-3">•</span>
                <span>Select Windows laptops</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-gray-700">
            <strong>Complex repairs:</strong> For motherboard repairs and serious
            liquid damage, we perform a diagnosis first before quoting. This ensures we
            can deliver an accurate repair plan.
          </p>
        </div>
      </div>
    </section>
  );
}

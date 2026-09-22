export default function FinalCTA() {
  return (
    <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to get your device fixed?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          No account needed. Just tell us what happened and we'll take care of the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/repair/request"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Start a repair
          </a>
          <a
            href="https://wa.me/2349000000000?text=Hi%20Fixxir%2C%20I%20need%20device%20repair%20help"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

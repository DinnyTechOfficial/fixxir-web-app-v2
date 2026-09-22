export default function Launch100Section() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Launch 100 Program
        </h2>
        <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Who qualifies</h3>
            <p className="text-gray-700">
              The first 100 completed, paying B2C repairs in Lagos with Fixxir pickup or drop-off.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Your benefit</h3>
            <p className="text-gray-700">
              <strong>₦5,000 Care Credit</strong> — applied toward a future repair or referred friend's repair.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Eligibility criteria</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span>Device diagnosed before approval</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span>Quote approved and payment completed</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span>Device returned and accepted</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span>Must be within Launch 100 position window</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Care Credit expires</h3>
            <p className="text-gray-700">
              90 days from issue date. Use it for your own repair or give it to a friend.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
            <p className="text-sm text-gray-700">
              No hidden conditions. Straightforward repair, straightforward reward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProblemDifferentiation() {
  return (
    <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          The problem we solve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg text-red-600 mb-4">Without Fixxir</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✗</span>
                <span>Unclear prices and hidden costs</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✗</span>
                <span>Chasing technicians for updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✗</span>
                <span>Timelines keep changing</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✗</span>
                <span>Nobody is accountable</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✗</span>
                <span>Unclear repair status and progress</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-green-600 mb-4">Fixxir way</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Clear diagnosis and pricing upfront</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Real-time updates to your device status</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Realistic timelines, delivered</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>One Fixxir process, accountable end-to-end</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Track your repair from start to return</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

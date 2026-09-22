export default function TrustPrivacy() {
  return (
    <section className="bg-[#f7f9fc] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">Before you hand it over</p><h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">Your device is personal. We treat it that way.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Will you access my data?
            </h3>
            <p className="text-gray-700">
              No. We don&apos;t access, back up, or retain your personal data on your device. We diagnose
              the hardware fault only. If you want data removed before handoff, let us know.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              What parts are being used?
            </h3>
            <p className="text-gray-700">
              We use genuine or certified equivalent parts. Your diagnosis and quote will specify
              the parts. You can ask questions before approving any repair.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              What if the repair fails again?
            </h3>
            <p className="text-gray-700">
              Repairs come with a warranty. If the same fault reoccurs within the warranty period,
              we&apos;ll rework it at no cost. Details on your quote.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              How long will it take?
            </h3>
            <p className="text-gray-700">
              Most standard repairs (screen, battery, keyboard) take 24–48 hours from receipt.
              Complex repairs may take longer. Your diagnosis will include the timeline.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Who has my device?
            </h3>
            <p className="text-gray-700">
              One accountable Fixxir process. Your device is tracked from pickup through diagnosis,
              repair, QA, and return. You can see status anytime in your tracking page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

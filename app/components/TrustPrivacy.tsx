export default function TrustPrivacy() {
  return (
    <section className="bg-[#f7f9fc] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">Before you hand it over</p><h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">Your device is personal. We treat it that way.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Will you access my data?
            </h3>
            <p className="text-gray-700">
              Ask us what access is needed for your specific diagnosis before handing over your device.
              Keep a backup of important data and remove personal information where practical.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              What parts are being used?
            </h3>
            <p className="text-gray-700">
              Parts are certified by Fixxir. Your quote should identify the part type and source
              before you approve the repair.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              What if the repair fails again?
            </h3>
            <p className="text-gray-700">
              Warranty coverage depends on the repair. Ask us to provide the duration, exclusions,
              and remedy in writing before you approve.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              How long will it take?
            </h3>
            <p className="text-gray-700">
              Repair time depends on the fault and part availability. Ask us for an estimate after
              diagnosis and before approving the repair.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f1] bg-white p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Who has my device?
            </h3>
            <p className="text-gray-700">
              Contact Fixxir directly for updates. Online repair tracking is not currently available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

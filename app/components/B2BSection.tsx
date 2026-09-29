import { getFixxirWhatsAppUrl } from "../site-info";

export default function B2BSection() {
  const businessContactUrl = getFixxirWhatsAppUrl(
    "Hi Fixxir, I'd like to discuss business repair services",
  );

  return (
    <section id="business" className="bg-[#10213f] px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#86b7ff]">For teams</p>
          <h2 className="max-w-xl text-4xl font-black tracking-tighter sm:text-5xl">
            Your outsourced device repair desk.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#b7c4d8]">
            Fixxir handles B2B repairs for teams and organizations. Let us manage your device repair
            pipeline so your team stays focused.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={businessContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-bold text-[#10213f] transition hover:bg-[#eef4fc]"
            >
              Book a Business Repair Pilot
            </a>
            <a
              href={businessContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#496181] px-6 font-bold text-white transition hover:border-white"
            >
              Talk to Fixxir
            </a>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["One repair contact", "Centralized approvals", "Pickup coordination", "Repair visibility", "Repair history"].map((item) => (
            <div key={item} className="rounded-xl border border-[#314463] bg-[#18345e] p-4 text-sm font-bold text-[#dbeaff]">
              ✓ <span className="ml-2">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

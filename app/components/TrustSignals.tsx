import { Activity, ClipboardCheck, Search, ShieldCheck, Waypoints } from "lucide-react";

const proofPoints = [
  [Search, "Clear diagnosis", "Understand the problem before deciding."],
  [ClipboardCheck, "You approve the repair", "No unexpected work or surprise charges."],
  [Activity, "Repair updates", "Know when your repair moves forward or something changes."],
  [ShieldCheck, "Quality checked", "Your device is tested before return."],
  [Waypoints, "One accountable process", "From handoff to return, Fixxir owns the journey."],
];

export default function TrustSignals() {
  return (
    <section id="why-fixxir" className="bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">The Fixxir difference</p><h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">Repair without the uncertainty.</h2><p className="mt-5 text-lg leading-8 text-[#61708a]">You should always know what is happening, what it costs and what happens next.</p></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {proofPoints.map(([Icon, title, description], index) => (
            <div key={title as string} className={`rounded-2xl border border-[#dce5f1] bg-[#f7f9fc] p-5 transition hover:-translate-y-1 hover:border-[#9dbfea] hover:bg-white hover:shadow-[0_14px_30px_rgba(16,33,63,0.08)] ${index === 0 ? "lg:translate-y-5" : ""}`}>
              <Icon size={22} className="text-[#1769e0]" />
              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#8a9ab1]">0{index + 1}</p>
              <h3 className="mt-2 font-bold text-[#10213f]">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-[#61708a]">{description as string}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

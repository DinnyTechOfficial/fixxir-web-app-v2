const steps = [
  { number: "1", title: "Tell us what happened", description: "Submit device details and issue" },
  { number: "2", title: "Pickup / handoff", description: "We pick up or you hand off the device" },
  { number: "3", title: "Diagnosis & quote", description: "We diagnose and show you the repair plan" },
  { number: "4", title: "Approve & pay", description: "You approve the quote and pay securely" },
  { number: "5", title: "Repair + updates", description: "We repair and keep you informed" },
  { number: "6", title: "QA + return", description: "Quality check, then return to you" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">A managed journey</p><h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">How Fixxir works</h2><p className="mt-5 text-lg leading-8 text-[#61708a]">One clear process from “something’s wrong” to “back in your hands.”</p></div>
        <div className="relative mt-14 grid gap-8 md:grid-cols-3 lg:grid-cols-6">{steps.map((step, index) => <div key={step.number} className="relative"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1769e0] text-sm font-black text-white">{step.number}</span>{index < steps.length - 1 && <span className="hidden h-px flex-1 bg-[#bcd0e8] lg:block" />}</div><h3 className="mt-5 font-bold text-[#10213f]">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#61708a]">{step.description}</p></div>)}</div>
      </div>
    </section>
  );
}

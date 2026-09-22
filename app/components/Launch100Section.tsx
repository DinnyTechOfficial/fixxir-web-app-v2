export default function Launch100Section() {
  return (
    <section id="launch-100" className="bg-[#1769e0] px-5 py-20 text-white sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b9d6ff]">For our first customers</p><h2 className="max-w-xl text-4xl font-black tracking-tighter sm:text-5xl">Be one of the Launch 100.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-[#dbeaff]">The first 100 qualifying customers get the complete managed Fixxir repair experience plus ₦5,000 Care Credit toward a future qualifying repair.</p><a href="/repair/request" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-6 font-bold text-[#1769e0] transition hover:bg-[#eef4fc]">Start a repair →</a></div><div className="grid gap-3 sm:grid-cols-2">{["Diagnosis before approval", "Selected-area pickup & return", "Repair updates", "QA before return", "₦5,000 Care Credit"].map((item) => <div key={item} className="rounded-xl border border-white/20 bg-white/10 p-4 text-sm font-bold text-white">✓ <span className="ml-2">{item}</span></div>)}<p className="text-xs text-[#b9d6ff] sm:col-span-2">Terms apply. Eligibility is subject to the Launch 100 criteria.</p></div>
      </div>
    </section>
  );
}

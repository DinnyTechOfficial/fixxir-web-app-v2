export default function FinalCTA() {
  return (
    <section className="bg-[#f7f9fc] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl rounded-4xl bg-[#1769e0] px-6 py-14 text-center text-white shadow-[0_20px_50px_rgba(23,105,224,0.2)] sm:px-12"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b9d6ff]">Phone & laptop repair • Lagos</p><h2 className="text-4xl font-black tracking-tighter sm:text-5xl">
          Ready to get your device working again?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#dbeaff]">
          No account needed. Just tell us what happened and we&apos;ll take care of the rest.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/repair/request"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-bold text-[#1769e0] transition hover:bg-[#eef4fc]"
          >
            Start a repair
          </a>
          <a
            href="https://wa.me/2349000000000?text=Hi%20Fixxir%2C%20I%20need%20device%20repair%20help"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-6 font-bold text-white transition hover:border-white"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, Laptop, Smartphone, type LucideIcon } from "lucide-react";

const services: [LucideIcon, string, string[]][] = [
  [Smartphone, "Phone repair", ["Screen", "Battery", "Charging", "Camera / Audio", "Won’t power on"]],
  [Laptop, "Laptop repair", ["Screen", "Battery", "Keyboard", "SSD / RAM", "Power / Charging"]],
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#eef4fc] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1769e0]">Start with the device</p><h2 className="text-4xl font-black tracking-tighter text-[#10213f] sm:text-5xl">What do you need fixed?</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {services.map(([Icon, title, items]) => (
            <div key={title as string} className="group relative overflow-hidden rounded-3xl border border-[#d4e0ef] bg-white p-7 shadow-[0_12px_30px_rgba(16,33,63,0.05)] sm:p-9">
              <div className="absolute -right-8 -top-8 text-[#eef4fc] transition duration-500 group-hover:scale-110"><Icon size={190} strokeWidth={1} /></div><div className="relative"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f0ff] text-[#1769e0]"><Icon size={28} /></div><h3 className="mt-7 text-2xl font-black text-[#10213f]">{title}</h3><div className="mt-5 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full bg-[#f3f7fc] px-3 py-2 text-sm font-medium text-[#61708a]">{item}</span>)}</div><a href="/repair/request" className="mt-8 inline-flex items-center gap-2 font-bold text-[#1769e0]">Start {title} <ArrowRight size={17} /></a></div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[#61708a]"><strong className="text-[#10213f]">Complex repair?</strong> Liquid damage or board-level issues are diagnosed first, so your repair plan is based on what we find.</p>
      </div>
    </section>
  );
}

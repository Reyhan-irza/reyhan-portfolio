import { useScrollAnim } from "../hooks/useScrollAnim";
import { Trophy } from "lucide-react";

export default function AwardSection() {
  const ref = useScrollAnim({ threshold: 0.2 });
  return (
    <section id="achievement" className="relative px-6 py-20 md:py-28">
      <div ref={ref} className="fade-up mx-auto max-w-6xl border border-[rgba(27,28,24,.2)] bg-[#e8e4d8] p-7 md:p-10">
        <div className="grid gap-8 md:grid-cols-[.7fr_1fr_auto] md:items-end">
          <div><p className="section-kicker">03 / Achievement</p><Trophy className="mt-8 h-7 w-7 text-[#e8836b]" aria-hidden="true" /></div>
          <div><h2 className="text-3xl font-semibold tracking-[-.06em] md:text-5xl">LKS IT Software Solution For Business</h2><p className="mt-4 text-sm leading-relaxed text-[#65675f]">Juara I tingkat Kabupaten Agam · 2025</p></div>
          <div className="font-mono text-[10px] uppercase leading-loose tracking-[.12em] text-[#65675f] md:text-right">SMK Negeri 2 Lubuk Basung<br />Cabang Dinas Pendidikan Wilayah I<br />issued July 2025</div>
        </div>
      </div>
    </section>
  );
}
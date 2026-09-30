import { useScrollAnim } from "../hooks/useScrollAnim";
import { Award, MapPin } from "lucide-react";

export default function AwardSection() {
  const ref = useScrollAnim({ threshold: 0.2 });

  return (
    <section
      id="achievement"
      aria-labelledby="award-title"
      className="relative px-6 py-16 md:py-24"
    >
      <div
        ref={ref}
        className="fade-up award-record mx-auto grid max-w-6xl gap-9 p-7 md:grid-cols-[minmax(10rem,.58fr)_1.42fr] md:gap-16 md:p-11"
      >
        <div className="flex flex-col justify-between gap-10">
          <p className="section-kicker">Recognition / 2025</p>
           <div className="flex items-center gap-3 text-[#a43f2d]">
            <Award className="h-7 w-7" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[.16em]">Juara I</span>
          </div>
        </div>

        <div>
          <h2
            id="award-title"
            className="max-w-3xl text-3xl font-semibold leading-[1.02] tracking-[-.055em] md:text-5xl"
          >
            LKS IT Software Solution For Business
          </h2>
          <p className="mt-5 flex items-center gap-2 text-base text-[#51534c] md:text-lg">
             <MapPin className="h-4 w-4 shrink-0 text-[#a43f2d]" aria-hidden="true" />
            Tingkat Kabupaten Agam
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-[rgba(27,28,24,.18)] pt-6 sm:grid-cols-2">
            <div>
              <dt className="award-detail-label">Recipient</dt>
              <dd className="mt-1 text-sm font-medium">Reyhan Irza Alwano</dd>
            </div>
            <div>
              <dt className="award-detail-label">School</dt>
              <dd className="mt-1 text-sm font-medium">SMK Negeri 2 Lubuk Basung</dd>
            </div>
            <div>
              <dt className="award-detail-label">Issued</dt>
              <dd className="mt-1 text-sm font-medium">Agam, July 2025</dd>
            </div>
            <div>
              <dt className="award-detail-label">Issuing office</dt>
              <dd className="mt-1 text-sm font-medium">Cabang Dinas Pendidikan Wilayah I</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
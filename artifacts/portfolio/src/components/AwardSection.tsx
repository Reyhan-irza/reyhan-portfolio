import { useLayoutEffect, useRef } from "react";
import { Award, Download, ExternalLink, MapPin } from "lucide-react";
import { gsap } from "../lib/motion";

const certificateUrl = `${import.meta.env.BASE_URL}sertifikat-lks-it-software-solution-2025.pdf`;
const certificatePreviewUrl = `${import.meta.env.BASE_URL}lks-certificate-preview.webp`;
const digitalLibraryCertificateUrl = `${import.meta.env.BASE_URL}sertifikat-apresiasi-inovasi-digital-2026.webp`;

export default function AwardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const previews = gsap.utils.toArray<HTMLElement>(".certificate-preview", section);
    if (previews.length === 0) return;
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        compact: "(max-width: 767px)",
        wide: "(min-width: 768px)",
      },
      (context) => {
        if (context.conditions?.reduced) return;
        const compact = Boolean(context.conditions?.compact);
        const scope = gsap.context(() => {
          if (compact) {
            previews.forEach((preview) => {
              gsap.fromTo(preview, {
                autoAlpha: 0,
                y: 14,
                scale: 0.985,
              }, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.62,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: preview,
                  start: "top 88%",
                  once: true,
                  toggleActions: "play none none none",
                  invalidateOnRefresh: true,
                },
              });
            });
          } else {
            const preview = previewRef.current;
            if (!preview) return;
            gsap.fromTo(preview, {
              clipPath: "inset(9% 7% 9% 7%)",
              scale: 0.965,
              yPercent: 7,
            }, {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              yPercent: -3,
              ease: "none",
              scrollTrigger: {
                trigger: preview,
                start: "top 94%",
                end: "bottom 28%",
                scrub: 0.62,
                invalidateOnRefresh: true,
              },
            });
          }
        }, section);
        return () => scope.revert();
      },
    );
    return () => media.revert();
  }, []);

  return (
      <section ref={sectionRef} id="achievement" aria-labelledby="award-title" className="relative px-6 py-16 md:py-24">
      <div
        className="fade-up award-record mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10"
      >
        <div className="flex flex-col justify-between gap-8" data-motion-item>
          <div>
            <p className="section-kicker">Achievement / 2025</p>
            <p className="mt-2 text-xs text-white/45">Competition result</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">Juara I</p>
              <p className="mt-1 text-xs text-white/55">Kabupaten Agam · 2025</p>
            </div>
          </div>
          <div>
            <h2 id="award-title" className="text-[clamp(1.65rem,3.2vw,2.8rem)] font-semibold leading-[1.06] tracking-[-.055em] text-white">
              LKS IT Software Solution For Business
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#c9d0dc]">
              <MapPin className="h-4 w-4 shrink-0 text-[#8491ff]" aria-hidden="true" />
              Kabupaten Agam
            </p>
          </div>
          <p className="text-xs leading-relaxed text-white/45">Certificate from the 2025 LKS IT Software Solution For Business competition.</p>
        </div>

        <div data-motion-item className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Certificate / 2025</p>
              <p className="mt-2 text-sm font-medium text-white">LKS IT Software Solution For Business · 2025</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">PDF document</span>
          </div>
          <a
            ref={previewRef}
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-certificate-preview"
            aria-label="Open the full 2025 LKS certificate PDF in a new tab"
          >
            <img
              src={certificatePreviewUrl}
              alt="Certificate showing Reyhan Irza Alvano as Juara I in IT Software Solution For Business at Kabupaten Agam in 2025."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-[11px] text-white/45">Open the certificate to view the original PDF.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-view-certificate"
              aria-label="View the 2025 certificate PDF in a new tab"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#667cff] px-4 py-3 text-xs font-semibold text-[#05070b] transition-colors sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View certificate
            </a>
            <a
              href={certificateUrl}
              download="sertifikat-lks-it-software-solution-2025.pdf"
              data-testid="link-download-certificate"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/15 px-4 py-3 text-xs font-medium text-[#c9d0dc] transition-colors hover:border-[#667cff] hover:text-white sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <div className="fade-up award-record mx-auto mt-8 grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10">
        <div className="flex flex-col justify-between gap-8" data-motion-item>
          <div>
            <p className="section-kicker">Achievement / 2026</p>
            <p className="mt-2 text-xs text-white/45">Apresiasi inovasi digital</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">Sertifikat penghargaan</p>
              <p className="mt-1 text-xs text-white/55">Agustus 2026 · Kelas XII TKJ4</p>
            </div>
          </div>
          <div>
            <h2 className="text-[clamp(1.65rem,3.2vw,2.8rem)] font-semibold leading-[1.06] tracking-[-.055em] text-white">
              Aplikasi Pustaka Digital
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#c9d0dc]">
              <MapPin className="h-4 w-4 shrink-0 text-[#8491ff]" aria-hidden="true" />
              SMK Negeri 2 Lubuk Basung
            </p>
          </div>
          <p className="text-xs leading-relaxed text-white/45">
            Sertifikat penghargaan atas pengembangan Aplikasi Pustaka Digital.
          </p>
        </div>

        <div data-motion-item className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Sertifikat / Agustus 2026</p>
              <p className="mt-2 text-sm font-medium text-white">Apresiasi Inovasi Digital · Aplikasi Pustaka Digital</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">WebP image</span>
          </div>
          <a
            href={digitalLibraryCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-pustaka-certificate-preview"
            aria-label="Open the August 2026 Pustaka Digital award certificate image in a new tab"
          >
            <img
              src={digitalLibraryCertificateUrl}
              alt="Sertifikat penghargaan SMK Negeri 2 Lubuk Basung kepada Reyhan Irza Alvano atas pengembangan Aplikasi Pustaka Digital, Agustus 2026."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-[11px] text-white/45">Buka gambar untuk melihat sertifikat ukuran penuh.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={digitalLibraryCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-view-pustaka-certificate"
              aria-label="View the August 2026 Pustaka Digital award certificate image in a new tab"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#667cff] px-4 py-3 text-xs font-semibold text-[#05070b] transition-colors sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Lihat sertifikat
            </a>
            <a
              href={digitalLibraryCertificateUrl}
              download="sertifikat-apresiasi-inovasi-digital-2026.webp"
              data-testid="link-download-pustaka-certificate"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/15 px-4 py-3 text-xs font-medium text-[#c9d0dc] transition-colors hover:border-[#667cff] hover:text-white sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh sertifikat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
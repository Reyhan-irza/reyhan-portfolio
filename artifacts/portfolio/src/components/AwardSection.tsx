import { useLayoutEffect, useRef } from "react";
import { Award, Download, ExternalLink, MapPin } from "lucide-react";
import { gsap } from "../lib/motion";

const certificateUrl = `${import.meta.env.BASE_URL}sertifikat-lks-it-software-solution-2025.pdf`;
const certificatePreviewUrl = `${import.meta.env.BASE_URL}lks-certificate-preview.webp`;
const digitalLibraryCertificateUrl = `${import.meta.env.BASE_URL}sertifikat-apresiasi-inovasi-digital-2026.webp`;
const otherEvidence = [
  {
    index: "01",
    category: "Hasil kompetisi",
    title: "Posisi kedua",
    source: "CTF Competition",
  },
  {
    index: "02",
    category: "Proyek perpustakaan digital",
    title: "VIREON Library",
    source: "A digital library system for managing books, members, loans, and reports.",
  },
] as const;

export default function AwardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const previews = gsap.utils.toArray<HTMLElement>(".certificate-preview", section);
    const evidenceLines = gsap.utils.toArray<HTMLElement>("[data-award-evidence-line]", section);
    if (previews.length === 0 && evidenceLines.length === 0) return;
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
          const evidenceList = section.querySelector<HTMLElement>("[data-award-evidence-list]");
          if (evidenceLines.length && evidenceList) {
            gsap.fromTo(evidenceLines, {
              scaleX: 0,
            }, {
              scaleX: 1,
              duration: 0.48,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: evidenceList,
                start: "top 82%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            });
          }
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
            <p className="section-kicker">Pencapaian / 2025</p>
            <p className="mt-2 text-xs text-white/45">Hasil kompetisi</p>
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
          <p className="text-xs leading-relaxed text-white/45">Gue jadi satu-satunya perwakilan sekolah di LKS IT Software Solution For Business 2025 dan meraih Juara I tingkat Kabupaten Agam.</p>
        </div>

        <div data-motion-item className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Sertifikat / 2025</p>
              <p className="mt-2 text-sm font-medium text-white">LKS IT Software Solution For Business · 2025</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">Dokumen PDF</span>
          </div>
          <a
            ref={previewRef}
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-certificate-preview"
            aria-label="Buka PDF sertifikat LKS 2025 lengkap di tab baru"
          >
            <img
              src={certificatePreviewUrl}
              alt="Sertifikat Juara I Reyhan Irza Alvano di IT Software Solution For Business tingkat Kabupaten Agam tahun 2025."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-[11px] text-white/45">Buka sertifikat untuk melihat PDF aslinya.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-view-certificate"
              aria-label="Lihat PDF sertifikat 2025 di tab baru"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#667cff] px-4 py-3 text-xs font-semibold text-[#05070b] transition-colors sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Lihat sertifikat
            </a>
            <a
              href={certificateUrl}
              download="sertifikat-lks-it-software-solution-2025.pdf"
              data-testid="link-download-certificate"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/15 px-4 py-3 text-xs font-medium text-[#c9d0dc] transition-colors hover:border-[#667cff] hover:text-white sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh PDF
            </a>
          </div>
        </div>
      </div>

      <div className="fade-up award-record mx-auto mt-8 grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10">
        <div className="flex flex-col justify-between gap-8" data-motion-item>
          <div>
            <p className="section-kicker">Pencapaian / 2026</p>
            <p className="mt-2 text-xs text-white/45">Apresiasi inovasi digital</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">Sertifikat penghargaan</p>
              <p className="mt-1 text-xs text-white/55">Kelas XII TKJ14 · Agustus 2026</p>
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
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">Gambar WebP</span>
          </div>
          <a
            href={digitalLibraryCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-pustaka-certificate-preview"
            aria-label="Buka gambar sertifikat penghargaan Pustaka Digital Agustus 2026 di tab baru"
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
              aria-label="Lihat gambar sertifikat penghargaan Pustaka Digital Agustus 2026 di tab baru"
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

      <section
        className="mx-auto mt-8 max-w-6xl"
        aria-labelledby="award-evidence-title"
      >
        <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Pencapaian lainnya</p>
            <h3 id="award-evidence-title" className="mt-2 text-xl font-semibold tracking-[-.04em] text-white md:text-2xl">
              Competition &amp; project evidence
            </h3>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2" data-award-evidence-list>
          {otherEvidence.map(({ index, category, title, source }) => (
            <article key={index} className="award-record award-evidence-card p-5 md:p-7">
              <span className="award-evidence-line" data-award-evidence-line aria-hidden="true" />
              <p className="award-detail-label">{index} / {category}</p>
              <h4 className="mt-5 text-xl font-semibold tracking-[-.04em] text-white md:text-2xl">
                {title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{source}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
import { Award, Download, ExternalLink, MapPin } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollSmoother, ScrollTrigger } from "../lib/motion";
import Reveal from "./Reveal";

const certificateUrl = `${import.meta.env.BASE_URL}sertifikat-lks-it-software-solution-2025.pdf`;
const certificatePreviewUrl = `${import.meta.env.BASE_URL}lks-certificate-preview.webp`;
const digitalLibraryCertificateUrl = `${import.meta.env.BASE_URL}sertifikat-apresiasi-inovasi-digital-2026.webp`;
const cadiakCertificateUrl = `${import.meta.env.BASE_URL}sertifikat-cadiak-ctf-2026.pdf`;
const cadiakCertificatePreviewUrl = `${import.meta.env.BASE_URL}cadiak-certificate-preview.webp`;
const dicodingCertificateUrl = `${import.meta.env.BASE_URL}sertifikat-dicoding-microsoft-fabric-2026.jpeg`;
const otherEvidence = [
  {
    index: "01",
    category: "Proyek perpustakaan digital",
    title: "VIREON Library",
    source: "A digital library system for managing books, members, loans, and reports.",
  },
] as const;

export default function AwardSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const panels = Array.from(stage.querySelectorAll<HTMLElement>("[data-award-record]"));
    const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>("nav button"));
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (min-height: 540px)", () => {
      stage.dataset.gallery = "";
      let activeIndex = -1;
      const select = (index: number) => {
        if (index === activeIndex) return;
        activeIndex = index;
        panels.forEach((panel, i) => { panel.inert = i !== index; });
        buttons.forEach((button, i) => button.setAttribute("aria-current", String(i === index)));
      };
      select(0);
      const track = stage.querySelector(".award-track")!;
      const tween = gsap.to(track, { xPercent: -100 * (panels.length - 1), ease: "none",
        onUpdate() { select(Math.round(this.progress() * (panels.length - 1))); },
        scrollTrigger: { trigger: stage, pin: true, pinType: ScrollTrigger.isTouch === 1 ? "fixed" : "transform", start: () => "top " + Math.min(72, innerHeight - stage.offsetHeight) + "px",
          end: () => "+=" + (panels.length - 1) * stage.clientWidth, scrub: true, invalidateOnRefresh: true },
      });
      const jump = (event: MouseEvent) => {
        const trigger = tween.scrollTrigger!;
        const index = buttons.indexOf(event.currentTarget as HTMLButtonElement);
        const y = trigger.start + (trigger.end - trigger.start) * index / (buttons.length - 1);
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(y, true);
        else window.scrollTo({ top: y, behavior: "smooth" });
      };
      buttons.forEach(button => button.addEventListener("click", jump));
      return () => {
        buttons.forEach(button => button.removeEventListener("click", jump));
        panels.forEach(panel => { panel.inert = false; });
        delete stage.dataset.gallery;
      };
    });
    return () => media.revert();
  }, []);
  return (
      <section id="achievement" aria-labelledby="award-title" className="relative px-6 py-16 md:py-24">
      <div ref={stageRef} className="award-stage"><div className="award-track">
      <article data-award-record
        className="award-record mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10"

      >
        <div data-award-copy className="flex flex-col justify-between gap-8">
          <div>
            <p className="section-kicker">Award / 2025</p>
            <p className="mt-2 text-sm text-white/55">Competition result</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">1st place</p>
              <p className="mt-1 text-sm text-white/65">Kabupaten Agam · 2025</p>
            </div>
          </div>
          <div>
            <h2 id="award-title" className="portfolio-award-heading font-semibold tracking-[-.055em] text-white">
              LKS IT Software Solution For Business
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#c9d0dc]">
              <MapPin className="h-4 w-4 shrink-0 text-[#8491ff]" aria-hidden="true" />
              Kabupaten Agam
            </p>
          </div>
          <p className="max-w-[42ch] text-base leading-relaxed text-white/65">Saya menjadi satu-satunya perwakilan sekolah di LKS IT Software Solution For Business 2025 dan meraih Juara I tingkat Kabupaten Agam.</p>
        </div>

        <div data-award-media className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Certificate / 2025</p>
              <p className="mt-2 text-sm font-medium text-white">LKS IT Software Solution For Business · 2025</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">PDF document</span>
          </div>
          <a
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-award-plane className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-certificate-preview"
            aria-label="Open the full 2025 LKS certificate PDF in a new tab"
          >
            <img
              sizes="(max-width: 767px) 88vw, 60vw"
              srcSet={`${import.meta.env.BASE_URL}lks-mobile.webp 864w, ${certificatePreviewUrl} 1680w`}
              src={certificatePreviewUrl}
              alt="Sertifikat Juara I Reyhan Irza Alvano di IT Software Solution For Business tingkat Kabupaten Agam tahun 2025."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-xs text-white/55">Open the certificate to view the original PDF.</p>
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
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--rule)] px-4 py-3 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[#667cff] hover:text-[#334da7] sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh PDF
            </a>
          </div>
        </div>
      </article>

      <article data-award-record className="award-record mx-auto mt-8 grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10">
        <div data-award-copy className="flex flex-col justify-between gap-8">
          <div>
            <p className="section-kicker">Award / 2026</p>
            <p className="mt-2 text-sm text-white/55">Apresiasi inovasi digital</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">Award certificate</p>
              <p className="mt-1 text-sm text-white/65">Kelas XII TKJ14 · Agustus 2026</p>
            </div>
          </div>
          <div>
            <h2 className="portfolio-award-heading font-semibold tracking-[-.055em] text-white">
              Aplikasi Pustaka Digital
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#c9d0dc]">
              <MapPin className="h-4 w-4 shrink-0 text-[#8491ff]" aria-hidden="true" />
              SMK Negeri 2 Lubuk Basung
            </p>
          </div>
          <p className="max-w-[42ch] text-base leading-relaxed text-white/65">
            Sertifikat penghargaan atas pengembangan Aplikasi Pustaka Digital.
          </p>
        </div>

        <div data-award-media className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Certificate / August 2026</p>
              <p className="mt-2 text-sm font-medium text-white">Apresiasi Inovasi Digital · Aplikasi Pustaka Digital</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">WebP image</span>
          </div>
          <a
            href={digitalLibraryCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-award-plane className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-pustaka-certificate-preview"
            aria-label="Open the August 2026 Pustaka Digital award certificate image in a new tab"
          >
            <img
              sizes="(max-width: 767px) 88vw, 60vw"
              srcSet={`${import.meta.env.BASE_URL}pustaka-mobile.webp 864w, ${digitalLibraryCertificateUrl} 1491w`}
              src={digitalLibraryCertificateUrl}
              alt="Sertifikat penghargaan SMK Negeri 2 Lubuk Basung kepada Reyhan Irza Alvano atas pengembangan Aplikasi Pustaka Digital, Agustus 2026."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-xs text-white/55">Open the image to view the full-size certificate.</p>
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
              View certificate
            </a>
            <a
              href={digitalLibraryCertificateUrl}
              download="sertifikat-apresiasi-inovasi-digital-2026.webp"
              data-testid="link-download-pustaka-certificate"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--rule)] px-4 py-3 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[#667cff] hover:text-[#334da7] sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh sertifikat
            </a>
          </div>
        </div>
      </article>

      <article data-award-record className="award-record mx-auto mt-8 grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10">
        <div data-award-copy className="flex flex-col justify-between gap-8">
          <div>
            <p className="section-kicker">Award / 2026</p>
            <p className="mt-2 text-sm text-white/55">Hasil kompetisi keamanan siber</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">2nd place</p>
              <p className="mt-1 text-sm text-white/65">Sumatra Barat · 30 September 2026</p>
            </div>
          </div>
          <div>
            <h2 className="portfolio-award-heading font-semibold tracking-[-.055em] text-white">
              CADIAK CTF 2026
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#c9d0dc]">
              <MapPin className="h-4 w-4 shrink-0 text-[#8491ff]" aria-hidden="true" />
              Padang, Sumatra Barat
            </p>
          </div>
          <p className="max-w-[42ch] text-base leading-relaxed text-white/65">
            Meraih Juara 2 CADIAK 2026 CTF Competition sebagai peserta dari SMKN 2 Lubuk Basung. Sertifikat diterbitkan oleh Dinas Komunikasi, Informatika, dan Statistik Provinsi Sumatera Barat.
          </p>
        </div>

        <div data-award-media className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Certificate / September 2026</p>
              <p className="mt-2 text-sm font-medium text-white">CADIAK CTF Competition · Juara 2</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">PDF document</span>
          </div>
          <a
            href={cadiakCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-award-plane className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-cadiak-certificate-preview"
            aria-label="Buka PDF asli sertifikat Juara 2 CADIAK CTF 2026 di tab baru"
          >
            <img
              sizes="(max-width: 767px) 88vw, 60vw"
              srcSet={`${import.meta.env.BASE_URL}cadiak-mobile.webp 864w, ${cadiakCertificatePreviewUrl} 1800w`}
              src={cadiakCertificatePreviewUrl}
              alt="Sertifikat Juara 2 CADIAK CTF Competition 2026 untuk Reyhan Irza Alvano dari SMKN 2 Lubuk Basung, Padang, 30 September 2026."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-xs text-white/55">Buka sertifikat untuk membaca dokumen PDF asli.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={cadiakCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-view-cadiak-certificate"
              aria-label="Lihat PDF sertifikat Juara 2 CADIAK CTF 2026 di tab baru"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#667cff] px-4 py-3 text-xs font-semibold text-[#05070b] transition-colors sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Lihat sertifikat
            </a>
            <a
              href={cadiakCertificateUrl}
              download="sertifikat-cadiak-ctf-2026.pdf"
              data-testid="link-download-cadiak-certificate"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--rule)] px-4 py-3 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[#667cff] hover:text-[#334da7] sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh PDF
            </a>
          </div>
        </div>
      </article>

      <article data-award-record className="award-record mx-auto mt-8 grid max-w-6xl gap-8 p-6 md:grid-cols-[.82fr_1.18fr] md:gap-12 md:p-10">
        <div data-award-copy className="flex flex-col justify-between gap-8">
          <div>
            <p className="section-kicker">Course / 2026</p>
            <p className="mt-2 text-sm text-white/55">Data Science · Microsoft Fabric</p>
          </div>
          <div className="flex items-center gap-4 border-y border-white/10 py-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#667cff]/35 bg-[#667cff]/10 text-[#aab4ff]">
              <Award className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#aab4ff]">Course completed</p>
              <p className="mt-1 text-sm text-white/65">28 September 2026</p>
            </div>
          </div>
          <div>
            <h2 className="portfolio-award-heading font-semibold tracking-[-.055em] text-white">
              Microsoft Fabric
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#c9d0dc]">
              <MapPin className="h-4 w-4 shrink-0 text-[#8491ff]" aria-hidden="true" />
              Dicoding Indonesia
            </p>
          </div>
          <p className="max-w-[42ch] text-base leading-relaxed text-white/65">
            Menyelesaikan kelas Belajar Penerapan Data Science dengan Microsoft Fabric dari Dicoding pada 28 September 2026.
          </p>
        </div>

        <div data-award-media className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Certificate / September 2026</p>
              <p className="mt-2 text-sm font-medium text-white">Belajar Penerapan Data Science dengan Microsoft Fabric</p>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-white/35 sm:block">JPEG certificate</span>
          </div>
          <a
            href={dicodingCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-award-plane className="certificate-preview group relative block aspect-[7/5] overflow-hidden border border-white/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b9aff]"
            data-testid="link-dicoding-certificate-preview"
            aria-label="Buka sertifikat Dicoding Microsoft Fabric di tab baru"
          >
            <img
              src={dicodingCertificateUrl}
              alt="Sertifikat Dicoding untuk Reyhan Irza Alvano atas kelulusan kelas Belajar Penerapan Data Science dengan Microsoft Fabric, 28 September 2026."
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </a>
          <p className="mt-2 text-xs text-white/55">Buka sertifikat untuk melihat gambar yang diberikan.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={dicodingCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-view-dicoding-certificate"
              aria-label="Lihat sertifikat Dicoding Microsoft Fabric di tab baru"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#667cff] px-4 py-3 text-xs font-semibold text-[#05070b] transition-colors sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Lihat sertifikat
            </a>
            <a
              href={dicodingCertificateUrl}
              download="sertifikat-dicoding-microsoft-fabric-2026.jpeg"
              data-testid="link-download-dicoding-certificate"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--rule)] px-4 py-3 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[#667cff] hover:text-[#334da7] sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh sertifikat
            </a>
          </div>
        </div>
      </article>

      </div>
      <nav aria-label="Pilih sertifikat">{["LKS", "Apresiasi inovasi digital", "Cadiak CTF", "Dicoding"].map((name, i) =>
        <button type="button" key={name} aria-label={name}>{String(i + 1).padStart(2, "0")}</button>
      )}</nav></div>
      <section
        className="mx-auto mt-8 max-w-6xl"
        aria-labelledby="award-evidence-title"
      >
        <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">More achievements</p>
            <h3 id="award-evidence-title" className="mt-2 text-xl font-semibold tracking-[-.04em] text-white md:text-2xl">
              Competition &amp; project evidence
            </h3>
          </div>
        </div>
        <Reveal className="grid gap-3 md:grid-cols-2" tall>
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
        </Reveal>
      </section>
    </section>
  );
}

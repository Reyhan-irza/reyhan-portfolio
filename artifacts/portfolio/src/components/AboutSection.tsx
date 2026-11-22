import { useLayoutEffect, useRef } from "react";
import { afterLineSplit, gsap, prepareNearby, SplitText } from "../lib/motion";

export default function AboutSection() {
  const copy = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const paragraph = copy.current;
    if (!paragraph) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => prepareNearby(paragraph, () => {
      SplitText.create(paragraph, {
        type: "lines",
        mask: "lines",
        linesClass: "about-copy-line",
        autoSplit: true,
        onSplit: ({ lines }) => afterLineSplit(gsap.from(lines, {
          yPercent: 105,
          opacity: 0,
          stagger: .12,
          ease: "power2.out",
          scrollTrigger: { trigger: paragraph, start: "clamp(top 95%)", end: "clamp(bottom 60%)", scrub: .35 },
        })),
      });
    }));
    return () => media.revert();
  }, []);

  return (
    <section id="about" className="relative px-6 py-16 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[.8fr_1fr] md:gap-16">
        <figure className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-current/15">
          <img
            src={`${import.meta.env.BASE_URL}drum-portrait.jpg`}
            alt="Reyhan sedang bermain drum di studio"
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-[center_47%]"
          />
        </figure>
        <div>
          <p className="section-kicker">01 / About</p>
          <h2 className="portfolio-section-heading mt-5 font-semibold tracking-[-.07em] text-[#1b1c18]">Belajar lewat karya.</h2>
          <p ref={copy} className="story-lead mt-6 max-w-2xl">
      Halo semua nya! perkenalkan saya Reyhan, pelajar TJKT di SMK Negeri 2 Lubuk Basung saat ini. Rasa penasaran saya pada komputer berawal dari warnet semenjak 2014, lalu berkembang lewat eksperimen dengan Python dan bot WhatsApp. Pada 2025, saya meraih Juara I LKS IT Software Solution for Business tingkat Kabupaten Agam, pada 2026 saya meraih juara II CADiaK CTF Cybersecurity. Sekarang saya membangun proyek web dengan TypeScript dan Tailwind sambil mendalami AI dan keamanan siber.
          </p>
        </div>
      </div>
    </section>
  );
}

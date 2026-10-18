import { Settings } from "lucide-react";
import { useLocation } from "wouter";
import { useScrollAnim } from "../hooks/useScrollAnim";
import VisitorCounter from "./VisitorCounter";
import GuessMyAge from "./GuessMyAge";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const footerRef = useScrollAnim<HTMLElement>({
    threshold: 0.12,
    stagger: 0.06,
    distance: 12,
    scale: 0.995,
    reversibleOnCompact: true,
  });
  const year = new Date().getFullYear();
  const [, navigate] = useLocation();

  const links = [
    { label: "Beranda",  href: "#home"     },
    { label: "Tentang",  href: "#about"    },
    { label: "Proyek",   href: "#projects" },
    { label: "Perjalanan", href: "#journey" },
    { label: "Pencapaian", href: "#achievement" },
    { label: "Kontak",   href: "#contact"  },
  ];

  const scroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <footer ref={footerRef} className="portfolio-closing-footer relative overflow-hidden border-t border-neutral-800/60 px-6 pb-8 pt-10 md:pt-12">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top row */}
        <div data-motion-item className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <button
              onClick={() => scroll("#home")}
              className="mb-3 flex items-center gap-3 text-lg font-bold tracking-tight text-[#f5f7fa] transition-opacity hover:opacity-80"
              aria-label="Kembali ke bagian beranda"
            >
              <BrandLogo size="md" alt="" />
              <span>Reyhan Irza Alvano</span>
            </button>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
               Gue pelajar yang terus membangun proyek dengan React, TypeScript, dan teknologi yang sedang gue pelajari.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => scroll(l.href)}
                className="text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Visitor stats */}
        <div data-motion-item className="mb-5 text-neutral-400">
          <VisitorCounter />
        </div>

        {/* Divider */}
        <div data-motion-item className="mb-5 border-t border-neutral-800/60" />

        {/* Bottom row */}
        <div data-motion-item className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs text-neutral-500 sm:text-left">
            &copy; {year}{" "}
              <span className="font-medium text-neutral-200">Reyhan Irza Alvano</span>.
            Hak cipta dilindungi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <span className="font-mono text-[10px] tracking-wide text-neutral-500">
              Teknologi: React · TypeScript · Tailwind
            </span>
            <div className="flex items-center gap-3">
              <GuessMyAge />
              <span className="text-[10px] text-neutral-700" aria-hidden="true">·</span>
              <button
                onClick={() => navigate("/admin")}
                className="group flex items-center gap-1 text-xs text-neutral-400 transition-colors duration-300 hover:text-white"
                title="Akses pengembang"
              >
                <Settings className="h-3 w-3 transition-transform duration-300 group-hover:rotate-90" />
                <span>Akses pengembang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

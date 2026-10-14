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
  });
  const year = new Date().getFullYear();
  const [, navigate] = useLocation();

  const links = [
    { label: "Home",     href: "#home"     },
    { label: "About",    href: "#about"    },
    { label: "Work",     href: "#projects" },
    { label: "Journey",  href: "#journey"  },
    { label: "Award",    href: "#achievement" },
    { label: "Contact",  href: "#contact"  },
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
              aria-label="Return to the home section"
            >
              <BrandLogo size="md" alt="" />
              <span>Reyhan Irza Alvano</span>
            </button>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
               Student developer building with React, TypeScript, and whatever I’m currently learning.
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
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <span className="font-mono text-[10px] tracking-wide text-neutral-500">
              Stack: React · TypeScript · Tailwind
            </span>
            <div className="flex items-center gap-3">
              <GuessMyAge />
              <span className="text-[10px] text-neutral-700" aria-hidden="true">·</span>
              <button
                onClick={() => navigate("/admin")}
                className="group flex items-center gap-1 text-xs text-neutral-400 transition-colors duration-300 hover:text-white"
                title="Developer Access"
              >
                <Settings className="h-3 w-3 transition-transform duration-300 group-hover:rotate-90" />
                <span>Developer Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Heart, Settings } from "lucide-react";
import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
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
    <footer ref={footerRef} className="relative pt-12 pb-8 px-6 border-t border-[rgba(33,31,27,.16)] overflow-hidden">
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
            <p className="max-w-xs text-sm leading-relaxed text-[#8b93a3]">
               React / TypeScript builder documenting shipped education, library and portfolio work.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => scroll(l.href)}
                className="text-sm text-[#8b93a3] transition-colors duration-200 hover:text-[#667cff]"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Visitor stats */}
        <div data-motion-item className="mb-5">
          <VisitorCounter />
        </div>

        {/* Divider */}
        <div data-motion-item className="rgb-divider mb-5" />

        {/* Bottom row */}
        <div data-motion-item className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center text-xs text-[#8b93a3] sm:text-left">
            &copy; {year}{" "}
              <span className="font-medium text-[#f5f7fa]">Reyhan Irza Alvano</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-xs text-[#8b93a3]">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-[#667cff] fill-[#667cff]/20" />
              <span>using</span>
              <SiReact className="h-3 w-3 text-[#8b93a3]" />
              <SiTypescript className="h-3 w-3 text-[#8b93a3]" />
              <SiTailwindcss className="h-3 w-3 text-[#8b93a3]" />
            </div>

             <span className="text-[10px] text-[#8b93a3]">·</span>
            <GuessMyAge />
            <span className="text-[10px] text-[#8b93a3]">·</span>

            <button
              onClick={() => navigate("/admin")}
              className="group flex items-center gap-1 text-[10px] text-[#8b93a3] transition-colors duration-300 hover:text-[#667cff]"
              title="Developer Access"
            >
              <Settings className="w-2.5 h-2.5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Developer Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

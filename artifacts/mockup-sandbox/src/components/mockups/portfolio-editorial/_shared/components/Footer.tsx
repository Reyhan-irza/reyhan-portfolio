import { Braces, Heart, Settings, Wind } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";
import VisitorCounter from "./VisitorCounter";
import GuessMyAge from "./GuessMyAge";

export default function Footer() {
  const footerRef = useScrollAnim<HTMLElement>({
    threshold: 0.12,
    stagger: 0.06,
    distance: 12,
    scale: 0.995,
  });
  const year = new Date().getFullYear();

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
              className="text-2xl font-bold text-[#a43f2d] mb-2 block hover:opacity-80 transition-opacity tracking-tight"
            >
              Reyhan.
            </button>
            <p className="text-[#6d6a62] text-sm max-w-xs leading-relaxed">
               React / TypeScript builder documenting shipped education, library and portfolio work.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => scroll(l.href)}
                className="text-[#6d6a62] text-sm hover:text-[#a43f2d] transition-colors duration-200"
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
          <p className="text-[#6d6a62] text-xs text-center sm:text-left">
            &copy; {year}{" "}
             <span className="text-[#211f1b] font-medium">Reyhan Irza Alwano</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-[#6d6a62] text-xs">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-[#a43f2d] fill-[#a43f2d]/20" />
              <span>using</span>
              <Braces className="w-3 h-3 text-[#6d6a62]" />
              <span className="font-mono text-[9px] text-[#6d6a62]">TS</span>
              <Wind className="w-3 h-3 text-[#6d6a62]" />
            </div>

             <span className="text-[#6d6a62] text-[10px]">·</span>
            <GuessMyAge />
            <span className="text-[#6d6a62] text-[10px]">·</span>

            <button
              onClick={() => {}}
              className="flex items-center gap-1 text-[#6d6a62] text-[10px] hover:text-[#a43f2d] transition-colors duration-300 group"
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

import { Heart, Settings } from "lucide-react";
import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { useLocation } from "wouter";
import VisitorCounter from "./VisitorCounter";
import GuessMyAge from "./GuessMyAge";

export default function Footer() {
  const year = new Date().getFullYear();
  const [, navigate] = useLocation();

  const links = [
    { label: "Home",     href: "#home"     },
    { label: "About",    href: "#about"    },
    { label: "Journey",  href: "#journey"  },
    { label: "News",     href: "#news"     },
    { label: "Projects", href: "#projects" },
    { label: "Contact",  href: "#contact"  },
  ];

  const scroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative pt-12 pb-8 px-6 border-t border-[rgba(33,31,27,.16)] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <button
              onClick={() => scroll("#home")}
              className="text-2xl font-bold text-[#a43f2d] mb-2 block hover:opacity-80 transition-opacity tracking-tight"
            >
              Reyhan.
            </button>
            <p className="text-[#6d6a62] text-sm max-w-xs leading-relaxed">
              Full-Stack Developer building modern, premium digital products.
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
        <div className="mb-5">
          <VisitorCounter />
        </div>

        {/* Divider */}
        <div className="rgb-divider mb-5" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6d6a62] text-xs text-center sm:text-left">
            &copy; {year}{" "}
            <span className="text-[#211f1b] font-medium">Reyhan Irza Alvano</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-[#6d6a62] text-xs">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-[#a43f2d] fill-[#a43f2d]/20" />
              <span>using</span>
              <SiReact className="w-3 h-3 text-[#6d6a62]" />
              <SiTypescript className="w-3 h-3 text-[#6d6a62]" />
              <SiTailwindcss className="w-3 h-3 text-[#6d6a62]" />
            </div>

            <span className="text-[#6d6a62] text-[10px]">·</span>
            <GuessMyAge />
            <span className="text-[#6d6a62] text-[10px]">·</span>

            <button
              onClick={() => navigate("/admin")}
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

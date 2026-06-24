import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home",     href: "#home"     },
  { label: "About",    href: "#about"    },
  { label: "Journey",  href: "#journey"  },
  { label: "News",     href: "#news"     },
  { label: "Projects", href: "#projects" },
  { label: "GitHub",   href: "#github"   },
  { label: "Contact",  href: "#contact"  },
  { label: "Comments", href: "#comments" },
];

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    } else {
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
    }
  }, [isOpen]);

  const handleNav = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "nav-blur py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => handleNav("#home")}
          className="group relative flex items-center gap-2 active:scale-95 transition-transform duration-150"
        >
          <div className="relative">
            <img
              src="/logo.png"
              alt="Reyhan"
              className="h-10 w-10 object-cover rounded-full transition-all duration-300 group-hover:scale-110"
              style={{
                filter: "drop-shadow(0 0 8px rgba(139,92,246,0.5))",
              }}
            />
            <div className="absolute inset-0 rounded-full bg-violet-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 pointer-events-none" />
          </div>
          <span className="text-sm font-semibold tracking-widest text-white/80 group-hover:text-violet-300 transition-colors duration-200 uppercase">
            Reyhan
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-sm text-white/55 hover:text-violet-300 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/10 text-white/70 hover:text-white hover:border-violet-500/40 transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setIsOpen((p) => !p)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <Menu className={`w-5 h-5 absolute transition-all duration-300 ${isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
            <X    className={`w-5 h-5 absolute transition-all duration-300 ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div ref={menuRef} className="md:hidden overflow-hidden transition-all duration-400 ease-in-out" style={{ maxHeight: "0px", opacity: "0" }}>
        <div className="glass border-t border-white/8 px-6 pt-3 pb-5 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-left text-sm text-white/65 hover:text-violet-300 transition-all duration-200 py-2.5 px-3 rounded-lg hover:bg-white/5 flex items-center gap-3 group"
              style={{
                transform: isOpen ? "translateX(0)" : "translateX(-8px)",
                opacity: isOpen ? 1 : 0,
                transition: `color 200ms, background 200ms, transform 300ms ${i * 40}ms, opacity 300ms ${i * 40}ms`,
              }}
            >
              <span className="w-1 h-1 rounded-full bg-violet-500/50 group-hover:bg-violet-400 transition-colors" />
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

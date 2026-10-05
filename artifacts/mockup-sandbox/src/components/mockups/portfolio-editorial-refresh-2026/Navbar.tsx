import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "../portfolio-editorial/_shared/lib/motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Recognition", href: "#achievement" },
  { label: "Activity", href: "#github" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const focusables = () => panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuTriggerRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items?.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", keydown);
    window.setTimeout(() => focusables()?.[0]?.focus(), 80);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", keydown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const context = gsap.context(() => {
      navLinks.forEach(({ href }) => {
        const section = document.querySelector<HTMLElement>(href);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 56%",
          end: "bottom 44%",
          onEnter: () => setActiveHref(href),
          onEnterBack: () => setActiveHref(href),
        });
      });
    }, nav);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.from("[data-nav-enter]", {
        y: -8,
        autoAlpha: 0,
        duration: 0.48,
        stagger: 0.055,
        ease: "power2.out",
        clearProps: "all",
      });
      return () => intro.kill();
    });
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = panel.querySelectorAll<HTMLElement>("[data-menu-item]");
    gsap.to(panel, {
      xPercent: isOpen ? 0 : 105,
      autoAlpha: isOpen ? 1 : 0,
      duration: reduced ? 0.01 : isOpen ? 0.56 : 0.42,
      ease: "power3.inOut",
      overwrite: true,
    });
    gsap.to(targets, {
      x: isOpen ? 0 : 14,
      autoAlpha: isOpen ? 1 : 0,
      duration: reduced ? 0.01 : 0.38,
      stagger: isOpen ? 0.045 : 0.025,
      delay: isOpen ? 0.12 : 0,
      ease: "power2.out",
      overwrite: true,
    });
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className={`editorial-nav fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "nav-blur py-3" : "bg-transparent py-5"}`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#home" data-nav-enter aria-label="Reyhan Irza Alvano, home" className="group flex items-center gap-3">
            <img src="/__mockup/images/rv-mark.png" alt="" className="h-10 w-10 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold uppercase tracking-[.15em] text-white">Reyhan Irza Alvano</span>
              <span className="mt-1 text-[9px] uppercase tracking-[.2em] text-white/45">Student Developer</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex" aria-label="Page sections">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-nav-enter
                aria-current={activeHref === link.href ? "location" : undefined}
                className={`editorial-nav-link relative py-2 text-[11px] uppercase tracking-[.12em] transition-colors ${activeHref === link.href ? "text-white" : "text-white/55 hover:text-white"}`}
              >
                {link.label}
                {activeHref === link.href && <span className="absolute -bottom-1 left-0 h-px w-full bg-[#8290ff]" />}
              </a>
            ))}
            <a href="https://github.com/Reyhan-irza" target="_blank" rel="noopener noreferrer" data-nav-enter className="flex items-center gap-1.5 border border-white/15 px-3 py-2 text-[10px] uppercase tracking-[.12em] text-white/75 transition-colors hover:border-[#667cff]/60 hover:text-white">
              GitHub <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          <button
            ref={menuTriggerRef}
            type="button"
            className={`mobile-menu-trigger lg:hidden ${isOpen ? "is-open" : ""}`}
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            data-testid="button-mobile-menu"
          >
            <span className="mobile-menu-glyph" aria-hidden="true">
              <span className="mobile-menu-line mobile-menu-line-top" />
              <span className="mobile-menu-line mobile-menu-line-middle" />
              <span className="mobile-menu-line mobile-menu-line-bottom" />
            </span>
          </button>
        </div>
      </nav>

      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeMenu}
        className={`nav-scrim fixed inset-0 z-[48] bg-[#02040a]/75 backdrop-blur-sm transition-opacity ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        ref={panelRef}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className="mobile-nav-panel fixed inset-y-0 right-0 z-[49] flex w-[min(88vw,410px)] flex-col border-l border-white/10 bg-[#090d14] px-7 pb-8 pt-28 shadow-2xl"
        style={{ transform: "translateX(105%)", visibility: "hidden" } as CSSProperties}
        inert={!isOpen}
      >
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[.22em] text-[#8190ff]">Navigate / portfolio</p>
        <div className="h-px bg-white/10" />
        <nav className="mt-5 flex flex-col">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              tabIndex={isOpen ? 0 : -1}
              aria-current={activeHref === link.href ? "location" : undefined}
              data-menu-item
              className="flex min-h-[62px] items-center gap-5 border-b border-white/[.07] text-[15px] font-semibold text-white/75 transition-colors hover:text-white"
              style={{ "--menu-index": index } as CSSProperties}
            >
              <span className="font-mono text-[10px] text-[#7887fa]">0{index + 1}</span>
              {link.label}
              {activeHref === link.href && <span className="ml-auto h-1.5 w-1.5 bg-[#8290ff]" />}
            </a>
          ))}
        </nav>
        <div data-menu-item className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-white/70">Reyhan Irza Alvano</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[.17em] text-white/35">Vierlykirk / Indonesia</p>
          </div>
          <img src="/__mockup/images/rv-mark.png" alt="" className="h-12 w-12 object-contain opacity-80" />
        </div>
      </aside>
    </>
  );
}

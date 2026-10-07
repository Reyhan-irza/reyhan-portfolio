import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import BrandLogo from "./BrandLogo";

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
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTimelineRef = useRef<{ play: () => unknown; reverse: () => unknown } | null>(null);
  const previouslyOpen = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const desktopLayout = window.matchMedia("(min-width: 1024px)");
    const closeMobileMenu = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    desktopLayout.addEventListener("change", closeMobileMenu);
    return () => desktopLayout.removeEventListener("change", closeMobileMenu);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const focusables = () => {
      const inPanel = Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
      return [...inPanel, ...(menuTriggerRef.current ? [menuTriggerRef.current] : [])];
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuTriggerRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = focusables();
        if (!items.length) return;
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
    window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: true }));
    window.addEventListener("keydown", keydown);
    let focusFrame = 0;
    const focusFirstAvailable = () => {
      const first = focusables()[0];
      if (!first) return;
      first.focus();
      if (document.activeElement !== first) {
        focusFrame = window.requestAnimationFrame(focusFirstAvailable);
      }
    };
    focusFrame = window.requestAnimationFrame(focusFirstAvailable);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: false }));
      window.removeEventListener("keydown", keydown);
      window.cancelAnimationFrame(focusFrame);
    };
  }, [isOpen]);

  useEffect(() => {
    if (previouslyOpen.current && !isOpen) {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        navRef.current?.querySelector<HTMLElement>(".editorial-nav-link")?.focus();
      } else {
        menuTriggerRef.current?.focus();
      }
    }
    previouslyOpen.current = isOpen;
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
    const targets = panel.querySelectorAll<HTMLElement>("[data-menu-item]");
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        const scope = gsap.context(() => {
          gsap.set(panel, { xPercent: 105, autoAlpha: 0 });
          gsap.set(targets, { x: 14, autoAlpha: 0 });
          const timeline = gsap.timeline({ paused: true })
            .to(panel, {
              xPercent: 0,
              autoAlpha: 1,
              duration: reduced ? 0.01 : 0.54,
              ease: "power3.inOut",
            })
            .to(targets, {
              x: 0,
              autoAlpha: 1,
              duration: reduced ? 0.01 : 0.34,
              stagger: reduced ? 0 : 0.045,
              ease: "power2.out",
            }, reduced ? 0 : 0.15);
          menuTimelineRef.current = timeline;
          if (isOpenRef.current) timeline.progress(1);
        }, panel);
        return () => {
          menuTimelineRef.current = null;
          scope.revert();
        };
      },
    );
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (isOpen) menuTimelineRef.current?.play();
    else menuTimelineRef.current?.reverse();
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className={`editorial-nav fixed inset-x-0 top-0 ${isOpen ? "z-[51]" : "z-40"} transition-all duration-500 ${scrolled ? "nav-blur py-3" : "bg-transparent py-5"}`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#home" data-nav-enter aria-label="Reyhan Irza Alvano, home" className="group flex items-center gap-3">
            <BrandLogo size="sm" alt="" />
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
            aria-haspopup="dialog"
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className="mobile-nav-panel fixed inset-y-0 right-0 z-[49] flex w-[min(88vw,410px)] flex-col border-l border-white/10 bg-[#090d14] px-7 pb-8 pt-28 shadow-2xl"
        style={{ visibility: "hidden" } as CSSProperties}
        inert={!isOpen}
      >
        <p id="mobile-navigation-title" className="mb-4 font-mono text-[10px] uppercase tracking-[.22em] text-[#8190ff]">Navigate / portfolio</p>
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
          <BrandLogo size="md" alt="" className="opacity-80" />
        </div>
      </aside>
    </>
  );
}

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";
import BrandLogo from "./BrandLogo";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Awards", href: "#achievement" },
  { label: "Activity", href: "#github" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const hashActiveHref = useRef<string | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
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
      return Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuTriggerRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      if (!panel?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? items[items.length - 1] : items[0]).focus();
        return;
      }
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
    const sections = ["#home", ...navLinks.map(({ href }) => href)].flatMap((href) => {
      const section = document.querySelector<HTMLElement>(href);
      return section ? [{ href, section }] : [];
    });
    const updateActiveFromScroll = () => {
      if (hashActiveHref.current && window.location.hash === hashActiveHref.current) {
        setActiveHref(hashActiveHref.current);
        return;
      }
      hashActiveHref.current = null;
      const activationLine = window.innerHeight * 0.56;
      let nextHref = "";
      for (const { href, section } of sections) {
        if (section.getBoundingClientRect().top > activationLine) break;
        nextHref = href;
      }
      setActiveHref(nextHref);
    };
    const clearHashSelection = () => {
      if (isOpenRef.current || !hashActiveHref.current) return;
      hashActiveHref.current = null;
      updateActiveFromScroll();
    };
    const handleScrollKey = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) return;
      if (event.target instanceof HTMLElement && (
        event.target.isContentEditable || event.target.matches("input, textarea, select, button, [role='button']")
      )) return;
      clearHashSelection();
    };
    const syncNavigationState = () => {
      const target = sections.find(({ href }) => href === window.location.hash);
      if (target) {
        hashActiveHref.current = target.href;
        setActiveHref(target.href);
      } else {
        hashActiveHref.current = null;
        updateActiveFromScroll();
      }
    };
    const context = gsap.context(() => {
      ScrollTrigger.create({
        id: "portfolio-active-navigation",
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: updateActiveFromScroll,
        onRefresh: updateActiveFromScroll,
      });
    }, nav);
    window.addEventListener("wheel", clearHashSelection, { passive: true });
    window.addEventListener("touchmove", clearHashSelection, { passive: true });
    window.addEventListener("keydown", handleScrollKey);
    window.addEventListener("hashchange", syncNavigationState);
    window.addEventListener("popstate", syncNavigationState);
    updateActiveFromScroll();
    syncNavigationState();
    return () => {
      window.removeEventListener("wheel", clearHashSelection);
      window.removeEventListener("touchmove", clearHashSelection);
      window.removeEventListener("keydown", handleScrollKey);
      window.removeEventListener("hashchange", syncNavigationState);
      window.removeEventListener("popstate", syncNavigationState);
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const trigger = menuTriggerRef.current;
    if (!panel || !trigger) return;
    const targets = panel.querySelectorAll<HTMLElement>("[data-menu-item]");
    const glyphLines = trigger.querySelectorAll<HTMLElement>(".mobile-menu-line");
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
          gsap.set(targets, { x: 18, y: 3, autoAlpha: 0 });
          gsap.set(glyphLines, { transformOrigin: "center center" });
          const timeline = gsap.timeline({ paused: true })
            .to(panel, {
              xPercent: 0,
              autoAlpha: 1,
              duration: reduced ? 0.01 : 0.62,
              ease: "power4.out",
            })
            .to(targets, {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: reduced ? 0.01 : 0.42,
              stagger: reduced ? 0 : 0.052,
              ease: "power3.out",
            }, reduced ? 0 : 0.18)
            .to(glyphLines[0], {
              y: 5,
              rotation: 45,
              duration: reduced ? 0.01 : 0.32,
              ease: "power3.inOut",
            }, 0)
            .to(glyphLines[1], {
              scaleX: 0,
              autoAlpha: 0,
              duration: reduced ? 0.01 : 0.2,
              ease: "power2.in",
            }, 0)
            .to(glyphLines[2], {
              y: -5,
              rotation: -45,
              duration: reduced ? 0.01 : 0.32,
              ease: "power3.inOut",
            }, 0);
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
        aria-label="Main navigation"
        className={`editorial-nav fixed inset-x-0 top-0 ${isOpen ? "z-[51]" : "z-40"} transition-all duration-500 ${scrolled ? "nav-blur py-3" : "bg-transparent py-5"}`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#home" aria-current={activeHref === "#home" ? "location" : undefined} aria-label="Reyhan Irza Alvano, home" className="group flex items-center gap-3">
            <BrandLogo size="sm" alt="" />
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-bold uppercase tracking-[.13em] text-white">Reyhan Irza Alvano</span>
              <span className="mt-1 text-[10px] uppercase tracking-[.16em] text-white/50">Student · Web Developer</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex" aria-label="Page sections">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={activeHref === link.href ? "location" : undefined}
                className={`editorial-nav-link relative py-2 text-xs uppercase tracking-[.11em] transition-colors ${activeHref === link.href ? "text-white" : "text-white/65 hover:text-white"}`}
              >
                {link.label}
                {activeHref === link.href && <span className="absolute -bottom-1 left-0 h-px w-full bg-[#8290ff]" />}
              </a>
            ))}
            <a href="https://github.com/Reyhan-irza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-white/15 px-3 py-2 text-[11px] uppercase tracking-[.1em] text-white/80 transition-colors hover:border-[#667cff]/60 hover:text-white">
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
        className={`nav-scrim fixed inset-0 z-[48] bg-[#02040a]/75 transition-opacity ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className="mobile-nav-panel fixed inset-0 z-[49] flex w-full flex-col border-white/10 bg-[#090d14] px-7 pb-8 pt-28 shadow-2xl"
        style={{ visibility: "hidden" } as CSSProperties}
        inert={!isOpen}
      >
        <p id="mobile-navigation-title" className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-[#8190ff]">Explore / portfolio</p>
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

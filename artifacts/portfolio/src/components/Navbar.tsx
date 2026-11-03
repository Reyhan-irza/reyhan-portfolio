import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, SCENE } from "../lib/motion";
import { scrollToSection } from "../lib/scroll";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

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
  const pendingTarget = useRef<string | null>(null);
  const reducedRef = useRef(false);
  const staticMenuRef = useRef<((open: boolean) => void) | null>(null);
  const previouslyOpen = useRef(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({ start: 32, end: "max",
      onToggle: (self) => setScrolled(self.isActive),
      onRefresh: () => setScrolled(window.scrollY > 32),
    });
    setScrolled(window.scrollY > 32);
    return () => trigger.kill();
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
    sections.sort((a, b) => (a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
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
    const targets = panel.querySelectorAll<HTMLElement>("[data-menu-line]");
    const footer = panel.querySelector<HTMLElement>("[data-menu-footer]");
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
          reducedRef.current = reduced;
          staticMenuRef.current = null;
          if (reduced) {
            // Static mode avoids a cached translation after a live preference change.
            const apply = (open: boolean) => {
              gsap.set(panel, { display: open ? "flex" : "none", x: 0, y: 0, xPercent: 0, yPercent: 0 });
              gsap.set(targets, { x: 0, y: 0, yPercent: 0, rotation: 0, opacity: 1, visibility: "visible" });
              gsap.set(footer, { opacity: 1, y: 0 });
              gsap.set(glyphLines[0], { y: open ? 5 : 0, rotation: open ? 45 : 0 });
              gsap.set(glyphLines[1], { scaleX: open ? 0 : 1, opacity: open ? 0 : 1 });
              gsap.set(glyphLines[2], { y: open ? -5 : 0, rotation: open ? -45 : 0 });
            };
            staticMenuRef.current = apply;
            apply(isOpenRef.current);
            return;
          }
          const finishClose = () => {
            gsap.set(panel, { display: "none" });
            const target = pendingTarget.current;
            pendingTarget.current = null;
            if (target) scrollToSection(target);
          };
          gsap.set(panel, { display: "none", x: 0, y: 0, xPercent: 100, yPercent: 0 });
          gsap.set(glyphLines, { transformOrigin: "center center" });
          const timeline = gsap.timeline({ paused: true, onReverseComplete: finishClose })
            .set(panel, { display: "flex" })
            .fromTo(panel, { xPercent: 100, yPercent: 0 }, {
              xPercent: 0, duration: SCENE.menu, ease: SCENE.curtainEase,
            })
            .fromTo(targets, { yPercent: 110, rotation: 3, transformOrigin: "0% 100%" }, {
              yPercent: 0, rotation: 0, duration: SCENE.detail, stagger: SCENE.menuStagger, ease: SCENE.ease,
            }, .24)
            .fromTo(footer, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: SCENE.detail }, .4)
            .to(glyphLines[0], { y: 5, rotation: 45, duration: reduced ? 0 : SCENE.menu, ease: SCENE.curtainEase }, 0)
            .to(glyphLines[1], { scaleX: 0, opacity: 0, duration: reduced ? 0 : SCENE.menu, ease: SCENE.curtainEase }, 0)
            .to(glyphLines[2], { y: -5, rotation: -45, duration: reduced ? 0 : SCENE.menu, ease: SCENE.curtainEase }, 0);
          menuTimelineRef.current = timeline;
          if (isOpenRef.current) timeline.progress(1);
        }, panel);
        return () => {
          menuTimelineRef.current = null;
          staticMenuRef.current = null;
          scope.revert();
        };
      },
    );
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (reducedRef.current) {
      staticMenuRef.current?.(isOpen);
      if (!isOpen) {
        const target = pendingTarget.current;
        pendingTarget.current = null;
        if (target) scrollToSection(target);
      }
      return;
    }
    const timeline = menuTimelineRef.current;
    if (!timeline) return;
    if (isOpen) { pendingTarget.current = null; timeline.timeScale(1).play(); }
    else timeline.timeScale(1.4).reverse();
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        data-menu-open={isOpen}
        onClick={(event) => {
          const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
          if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault(); scrollToSection(link.hash);
          }
        }}
        aria-label="Main navigation"
        className={`editorial-nav fixed inset-x-0 top-0 ${isOpen ? "z-[51]" : "z-40"} transition-opacity duration-700 ${scrolled ? "nav-blur py-3" : "bg-transparent py-5"}`}
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

          <div className="flex items-center gap-2">
          <ThemeToggle />
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
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className="mobile-nav-panel fixed inset-0 z-[49] flex w-full flex-col border-white/10 bg-[#090d14] px-7 pb-8 pt-28 shadow-2xl"
        style={{ display: "none" } as CSSProperties}
        inert={!isOpen}
      >
        <p id="mobile-navigation-title" className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-[#8190ff]">Explore / portfolio</p>
        <div className="h-px bg-white/10" />
        <nav className="mt-5 flex flex-col">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => {
                event.preventDefault(); pendingTarget.current = link.href; closeMenu();
              }}
              tabIndex={isOpen ? 0 : -1}
              aria-current={activeHref === link.href ? "location" : undefined}
              data-menu-item
              className="flex min-h-[62px] items-center gap-5 border-b border-white/[.07] text-[15px] font-semibold text-white/75 transition-colors hover:text-white"
              style={{ "--menu-index": index } as CSSProperties}
            >
              <span data-menu-line className="menu-line-inner"><span className="font-mono text-[10px] text-[#7887fa]">0{index + 1}</span>
              {link.label}
              {activeHref === link.href && <span data-menu-active className="ml-auto h-1.5 w-1.5 bg-[#8290ff]" />}
              </span>
            </a>
          ))}
        </nav>
        <div data-menu-footer className="mt-auto flex items-end justify-between">
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

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";

const navLinks = [
  { label: "About",    href: "#about" },
  { label: "Work",     href: "#projects" },
  { label: "Journey",  href: "#journey" },
  { label: "Award",    href: "#achievement" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveHref(href),
          onEnterBack: () => setActiveHref(href),
        });
      });
    }, nav);

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.from("[data-nav-enter]", {
        y: -9,
        autoAlpha: 0,
        duration: 0.42,
        stagger: 0.045,
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

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      className={`editorial-nav fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${scrolled ? "nav-blur py-3" : "bg-transparent py-5"}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#home"
          data-nav-enter
          aria-label="Reyhan, home"
          className="group flex items-center gap-2 transition-opacity hover:opacity-75"
        >
          <div className="relative">
            <img
              src="/logo.png"
              alt=""
              className="h-9 w-9 rounded-full border border-[rgba(27,28,24,.2)] object-cover"
            />
          </div>
          <span className="editorial-nav-brand text-xs font-semibold tracking-[.16em] uppercase">
            Reyhan
          </span>
        </a>

        <div className="hidden items-center gap-5 lg:flex" aria-label="Page sections">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-nav-enter
              aria-current={activeHref === link.href ? "location" : undefined}
              className="editorial-nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center lg:hidden">
          <button
            ref={menuTriggerRef}
            type="button"
            className={`mobile-menu-trigger ${isOpen ? "is-open" : ""}`}
            onClick={() => setIsOpen((p) => !p)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            data-nav-enter
          >
            <span className="mobile-menu-glyph" aria-hidden="true">
              <span className="mobile-menu-line mobile-menu-line-top" />
              <span className="mobile-menu-line mobile-menu-line-middle" />
              <span className="mobile-menu-line mobile-menu-line-bottom" />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={`mobile-menu-shell lg:hidden overflow-hidden ${isOpen ? "is-open" : ""}`}
        style={{ maxHeight: "0px", opacity: "0" }}
      >
        <div className="mobile-menu-surface glass px-5 pt-5 pb-5 flex flex-col gap-1">
          <div className="mobile-menu-heading">
            <span className="mobile-menu-heading-label">On this page</span>
            <span className="mobile-menu-heading-meta">Navigate</span>
          </div>
          <div className="mobile-menu-rule" aria-hidden="true" />
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
              aria-current={activeHref === link.href ? "location" : undefined}
              className={`mobile-menu-link text-left text-sm py-3 px-3 rounded-xl flex items-center gap-3 group ${isOpen ? "is-open" : ""}`}
              style={{
                "--menu-index": i,
              } as CSSProperties}
            >
              <span className="mobile-menu-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

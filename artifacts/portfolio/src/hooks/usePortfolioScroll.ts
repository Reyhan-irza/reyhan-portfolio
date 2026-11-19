import { useLayoutEffect } from "react";
import { gsap, ScrollSmoother, ScrollTrigger } from "../lib/motion";
import { shouldAutoScrollFocus, syncScrollLock } from "../lib/scroll";

// Mount before scene components so ScrollSmoother installs its scroller once,
// before child ScrollTriggers measure the portfolio.
export function PortfolioScrollController() {
  useLayoutEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    if (!wrapper || !content) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const smooth = 0.95;
    const touchOnly = ScrollTrigger.isTouch === 1;
    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth,
      smoothTouch: 0,
      autoResize: false,
      onFocusIn: (_smoother, event) => shouldAutoScrollFocus(content, event),
    });
    const pointerMedia = gsap.matchMedia();
    pointerMedia.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const dots = Array.from({ length: 4 }, () => {
        const dot = document.createElement("i");
        dot.className = "rv-pointer-dot";
        dot.setAttribute("aria-hidden", "true");
        document.body.append(dot);
        return dot;
      });
      const followers = dots.map((dot, index) => ({
        x: gsap.quickTo(dot, "x", { duration: .07 + index * .05, ease: "power2.out" }),
        y: gsap.quickTo(dot, "y", { duration: .07 + index * .05, ease: "power2.out" }),
      }));
      const fade = gsap.to(dots, { opacity: 0, duration: .25, paused: true });
      let tracking = false;
      const clear = () => { tracking = false; fade.invalidate().restart(); };
      const idle = gsap.delayedCall(.09, clear).pause();
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || !(event.target instanceof Element)
          || !event.target.closest("#home, #projects")) {
          if (tracking) clear();
          return;
        }
        fade.pause();
        if (!tracking) {
          gsap.set(dots, { x: event.clientX, y: event.clientY, opacity: i => .58 - i * .1 });
          tracking = true;
        }
        followers.forEach(dot => { dot.x(event.clientX); dot.y(event.clientY); });
        idle.restart(true);
      };
      document.addEventListener("pointermove", move, { passive: true });
      return () => { document.removeEventListener("pointermove", move); dots.forEach(dot => dot.remove()); };
    });
    let frame = 0, disposed = false, pending = false, geometryChanged = false;
    let touching = false;
    const refresh = () => {
      pending = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || touching || (ScrollTrigger.isScrolling() && (ScrollTrigger.isTouch === 1 || !geometryChanged))) return;
        pending = false; geometryChanged = false;
        // The frame and scrollEnd already defer measurement until idle. A second
        // resize debounce can measure the transient lines before SplitText reflows.
        ScrollTrigger.refresh();
      });
    };
    const syncHash = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target && content.contains(target)) smoother.scrollTo(target, false, "top 96px");
    };
    const onHashChange = (event: HashChangeEvent) => {
      if (event.isTrusted) syncHash();
    };
    const afterScroll = () => { if (pending) refresh(); };
    const touchStart = () => { touching = true; };
    const touchEnd = (event: TouchEvent) => {
      touching = event.touches.length > 0;
      if (!touching && pending) refresh();
    };
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchend", touchEnd, { passive: true });
    window.addEventListener("touchcancel", touchEnd, { passive: true });
    const linesChanged = () => { geometryChanged = true; refresh(); };
    const sync = () => {
      const scroll = window.scrollY;
      const nativeScroll = reduced.matches || touchOnly;
      // Retain the same scroller proxy so existing scene triggers remain attached.
      smoother.smooth(nativeScroll ? 0 : smooth);
      wrapper.toggleAttribute("data-scroll-native", nativeScroll);
      if (nativeScroll) gsap.set(content, { clearProps: "transform" });
      else gsap.set(content, { y: -scroll });
      smoother.scrollTop(scroll);
      syncScrollLock();
      geometryChanged = true;
      refresh();
    };
    // Observe existing intro/menu/modal locks, not every body color tween.
    let overflow = document.body.style.overflow;
    const lockObserver = new MutationObserver(() => {
      if (overflow === document.body.style.overflow) return;
      overflow = document.body.style.overflow;
      syncScrollLock();
    });
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    let width = content.offsetWidth, height = content.offsetHeight;
    let viewportHeight = window.innerHeight;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      const nextWidth = Math.round(box?.inlineSize ?? entry.contentRect.width);
      const nextHeight = Math.round(box?.blockSize ?? entry.contentRect.height);
      const viewportChange = Math.abs(window.innerHeight - viewportHeight);
      const bodyChange = Math.abs(nextHeight - height);
      // A short change in mobile chrome also resizes svh-based hero content.
      const browserChrome = nextWidth === width && ScrollTrigger.isTouch === 1
        && viewportChange > 0 && viewportChange < viewportHeight * .25
        && bodyChange <= viewportChange * 2 + 2;
      if (nextWidth !== width) geometryChanged = true;
      if ((nextWidth !== width || nextHeight !== height) && !browserChrome) refresh();
      width = nextWidth; height = nextHeight; viewportHeight = window.innerHeight;
    });
    resizeObserver.observe(content, { box: "border-box" });
    window.addEventListener("portfolio:lines-changed", linesChanged);
    window.addEventListener("load", refresh);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("portfolio:scroll-lock", syncScrollLock);
    ScrollTrigger.addEventListener("scrollEnd", afterScroll);
    reduced.addEventListener("change", sync);
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    sync();
    const initialHashFrame = requestAnimationFrame(syncHash);
    return () => {
      disposed = true; cancelAnimationFrame(frame); cancelAnimationFrame(initialHashFrame);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
      lockObserver.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("portfolio:lines-changed", linesChanged);
      window.removeEventListener("load", refresh);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("portfolio:scroll-lock", syncScrollLock);
      ScrollTrigger.removeEventListener("scrollEnd", afterScroll);
      reduced.removeEventListener("change", sync);
      pointerMedia.revert();
      smoother.kill();
      wrapper.removeAttribute("data-scroll-native");
      // Each component reverts its own ScrollTriggers, including on route changes.
    };
  }, []);
  return null;
}

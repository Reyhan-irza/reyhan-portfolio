import { useEffect } from "react";
import { ScrollTrigger } from "../lib/motion";
import { startSmoothScroll, stopSmoothScroll, syncScrollLock } from "../lib/scroll";

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, disposed = false, pending = false;
    const refresh = () => {
      pending = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || ScrollTrigger.isScrolling()) return;
        pending = false;
        ScrollTrigger.refresh(true);
      });
    };
    const afterScroll = () => { if (pending) refresh(); };
    const sync = () => {
      if (reduced.matches) stopSmoothScroll(); else startSmoothScroll();
      syncScrollLock(); refresh();
    };
    // Observe existing intro/menu/modal locks, not every body color tween.
    let overflow = document.body.style.overflow;
    const lockObserver = new MutationObserver(() => {
      if (overflow === document.body.style.overflow) return;
      overflow = document.body.style.overflow;
      syncScrollLock();
    });
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    let width = document.body.offsetWidth, height = document.body.offsetHeight;
    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = document.body.offsetWidth, nextHeight = document.body.offsetHeight;
      if (width !== nextWidth || height !== nextHeight) {
        width = nextWidth; height = nextHeight; refresh();
      }
    });
    resizeObserver.observe(document.body);
    const imageLoaded = (event: Event) => { if (event.target instanceof HTMLImageElement) refresh(); };
    document.addEventListener("load", imageLoaded, true);
    window.addEventListener("load", refresh);
    window.addEventListener("portfolio:scroll-lock", syncScrollLock);
    ScrollTrigger.addEventListener("scrollEnd", afterScroll);
    reduced.addEventListener("change", sync);
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    sync();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      lockObserver.disconnect(); resizeObserver.disconnect();
      document.removeEventListener("load", imageLoaded, true);
      window.removeEventListener("load", refresh);
      window.removeEventListener("portfolio:scroll-lock", syncScrollLock);
      ScrollTrigger.removeEventListener("scrollEnd", afterScroll);
      reduced.removeEventListener("change", sync);
      stopSmoothScroll();
      // Each component reverts its own ScrollTriggers, including on route changes.
    };
  }, [enabled]);
}

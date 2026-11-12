import { useEffect } from "react";
import { ScrollTrigger } from "../lib/motion";
import { startSmoothScroll, stopSmoothScroll, syncScrollLock } from "../lib/scroll";

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, disposed = false, pending = false, widthChanged = false;
    const refresh = () => {
      pending = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || (ScrollTrigger.isScrolling() && !widthChanged)) return;
        pending = false; widthChanged = false;
        // The frame and scrollEnd already defer measurement until idle. A second
        // resize debounce can measure the transient lines before SplitText reflows.
        ScrollTrigger.refresh();
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
      if (nextWidth !== width) widthChanged = true;
      if ((nextWidth !== width || nextHeight !== height) && !browserChrome) refresh();
      width = nextWidth; height = nextHeight; viewportHeight = window.innerHeight;
    });
    resizeObserver.observe(document.body, { box: "border-box" });
    window.addEventListener("load", refresh);
    window.addEventListener("portfolio:scroll-lock", syncScrollLock);
    ScrollTrigger.addEventListener("scrollEnd", afterScroll);
    reduced.addEventListener("change", sync);
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    sync();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      lockObserver.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("load", refresh);
      window.removeEventListener("portfolio:scroll-lock", syncScrollLock);
      ScrollTrigger.removeEventListener("scrollEnd", afterScroll);
      reduced.removeEventListener("change", sync);
      stopSmoothScroll();
      // Each component reverts its own ScrollTriggers, including on route changes.
    };
  }, [enabled]);
}

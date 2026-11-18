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
    const smoothTouch = 0.32;
    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth,
      smoothTouch,
      autoResize: false,
      onFocusIn: (_smoother, event) => shouldAutoScrollFocus(content, event),
    });
    let frame = 0, disposed = false, pending = false, geometryChanged = false;
    const refresh = () => {
      pending = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || (ScrollTrigger.isScrolling() && !geometryChanged)) return;
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
    const linesChanged = () => { geometryChanged = true; refresh(); };
    const sync = () => {
      const scroll = window.scrollY;
      const duration = ScrollTrigger.isTouch === 1 ? smoothTouch : smooth;
      // Retain the same scroller proxy so existing scene triggers remain attached.
      smoother.smooth(reduced.matches ? 0 : duration);
      wrapper.toggleAttribute("data-scroll-native", reduced.matches);
      if (reduced.matches) gsap.set(content, { clearProps: "transform" });
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
      lockObserver.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("portfolio:lines-changed", linesChanged);
      window.removeEventListener("load", refresh);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("portfolio:scroll-lock", syncScrollLock);
      ScrollTrigger.removeEventListener("scrollEnd", afterScroll);
      reduced.removeEventListener("change", sync);
      smoother.kill();
      wrapper.removeAttribute("data-scroll-native");
      // Each component reverts its own ScrollTriggers, including on route changes.
    };
  }, []);
  return null;
}

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/motion";

/**
 * Adds a restrained desktop-only scroll interpolation layer.
 * Touch devices retain native scrolling so momentum and accessibility stay intact.
 */
export function useLenis() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 769px) and (pointer: fine)");
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let refreshFrame = 0;
    let scrollLocked = false;

    const handleScrollLock = (event: Event) => {
      scrollLocked = (event as CustomEvent<boolean>).detail;
      if (scrollLocked) lenis?.stop();
      else lenis?.start();
    };

    const scheduleRefresh = () => {
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        ScrollTrigger.refresh();
      });
    };

    const updateScrollTriggers = () => ScrollTrigger.update();

    const stop = (refresh = true) => {
      if (!lenis) return;
      lenis.off("scroll", updateScrollTriggers);
      if (ticker) gsap.ticker.remove(ticker);
      ticker = null;
      lenis.destroy();
      lenis = null;
      gsap.ticker.lagSmoothing(500, 33);
      if (refresh) scheduleRefresh();
    };

    const start = () => {
      if (lenis || reducedMotion.matches || !desktop.matches) return;

      const instance = new Lenis({
        duration: 0.82,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis = instance;
      if (scrollLocked) instance.stop();
      ticker = (time) => instance.raf(time * 1000);

      instance.on("scroll", updateScrollTriggers);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(ticker);
      scheduleRefresh();
    };

    const syncMotionMode = () => {
      if (reducedMotion.matches || !desktop.matches) {
        stop();
        return;
      }
      start();
    };

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(scheduleRefresh);
    resizeObserver?.observe(document.body);

    desktop.addEventListener("change", syncMotionMode);
    reducedMotion.addEventListener("change", syncMotionMode);
    window.addEventListener("portfolio:scroll-lock", handleScrollLock);
    syncMotionMode();

    return () => {
      desktop.removeEventListener("change", syncMotionMode);
      reducedMotion.removeEventListener("change", syncMotionMode);
      window.removeEventListener("portfolio:scroll-lock", handleScrollLock);
      resizeObserver?.disconnect();
      stop(false);
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    };
  }, []);
}
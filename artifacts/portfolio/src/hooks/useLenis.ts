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
    syncMotionMode();

    return () => {
      desktop.removeEventListener("change", syncMotionMode);
      reducedMotion.removeEventListener("change", syncMotionMode);
      resizeObserver?.disconnect();
      stop(false);
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    };
  }, []);
}
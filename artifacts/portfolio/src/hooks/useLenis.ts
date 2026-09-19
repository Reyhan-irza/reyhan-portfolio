import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Adds a restrained desktop-only scroll interpolation layer.
 * Touch devices retain native scrolling so momentum and accessibility stay intact.
 */
export function useLenis() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 769px) and (pointer: fine)");

    if (reducedMotion.matches || !desktop.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
    });
    const updateScrollTriggers = () => ScrollTrigger.update();
    lenis.on("scroll", updateScrollTriggers);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    const handleViewportChange = () => {
      if (!desktop.matches || reducedMotion.matches) {
        window.cancelAnimationFrame(frame);
        lenis.destroy();
      }
    };

    desktop.addEventListener("change", handleViewportChange);
    reducedMotion.addEventListener("change", handleViewportChange);

    return () => {
      window.cancelAnimationFrame(frame);
      desktop.removeEventListener("change", handleViewportChange);
      reducedMotion.removeEventListener("change", handleViewportChange);
      lenis.off("scroll", updateScrollTriggers);
      lenis.destroy();
    };
  }, []);
}
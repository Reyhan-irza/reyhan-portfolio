import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, MOTION } from "./motion";

// Home owns the lifecycle. Imports do not create an instance or a second RAF.
export let lenis: Lenis | null = null;
function tick(time: number) { lenis?.raf(time * 1000); }
export function startSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ lerp: MOTION.lerp, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
}
export function stopSmoothScroll() {
  gsap.ticker.remove(tick);
  lenis?.off("scroll", ScrollTrigger.update);
  lenis?.destroy();
  lenis = null;
}
export function syncScrollLock() {
  if (document.body.style.overflow === "hidden") lenis?.stop();
  else lenis?.start();
}
export function scrollToSection(hash: string) {
  const target = document.getElementById(hash.replace(/^#/, ""));
  if (!target) return;
  if (location.hash !== hash) {
    history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  const focus = () => {
    const previous = target.getAttribute("tabindex");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (previous === null) target.removeAttribute("tabindex");
    else target.setAttribute("tabindex", previous);
  };
  syncScrollLock();
  if (lenis) lenis.scrollTo(target, { offset: -96, onComplete: focus });
  else { window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 96, behavior: "instant" }); focus(); }
}

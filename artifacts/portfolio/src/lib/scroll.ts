import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { ScrollSmoother } from "./motion";

let anchorFocus: HTMLElement | null = null;

export function focusWithoutScroll(target: HTMLElement | null) {
  anchorFocus = target;
  try { target?.focus({ preventScroll: true }); }
  finally { anchorFocus = null; }
}

export function shouldAutoScrollFocus(content: HTMLElement, event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !content.contains(target) || target === anchorFocus) return false;
  const bounds = target.getBoundingClientRect();
  return bounds.top < 72 || bounds.bottom > innerHeight;
}

export function getPageScroll() {
  return ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
}

export function syncScrollLock() {
  const smoother = ScrollSmoother.get();
  if (!smoother) return;
  const lock = document.body.style.overflow === "hidden";
  if (lock && !smoother.paused() && Math.abs(smoother.scrollTop() - window.scrollY) < 2) {
    smoother.scrollTop(window.scrollY);
  }
  smoother.paused(lock);
}

export function viewportPortal(children: ReactNode) {
  const host = document.getElementById("portfolio-overlays");
  return host ? createPortal(children, host) : children;
}

export function scrollElementIntoView(target: HTMLElement) {
  const bounds = target.getBoundingClientRect();
  if (bounds.top >= 96 && bounds.bottom <= window.innerHeight) return;
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(target, smoother.smooth() > 0, "top 96px");
  else target.scrollIntoView({ behavior: "instant", block: "nearest" });
}

export function scrollToSection(hash: string) {
  const target = document.getElementById(hash.replace(/^#/, ""));
  if (!target) return;
  if (location.hash !== hash) {
    history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  const previous = target.getAttribute("tabindex");
  target.setAttribute("tabindex", "-1");
  focusWithoutScroll(target);
  if (previous === null) target.removeAttribute("tabindex");
  else target.setAttribute("tabindex", previous);

  syncScrollLock();
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(target, smoother.smooth() > 0, "top 96px");
  else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 96, behavior: "instant" });
}

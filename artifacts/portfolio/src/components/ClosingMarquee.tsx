import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";

const rows = [
  ["Reyhan Irza Alvano", "Creative Developer"],
  ["Web Development", "Cybersecurity", "Always Learning"],
];

export default function ClosingMarquee() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const strip = root.current;
    if (!strip) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const loops = Array.from(strip.querySelectorAll<HTMLElement>("[data-closing-track]"))
        .map((track, index) => gsap.fromTo(track,
          { xPercent: index === 0 ? 0 : -50 },
          { xPercent: index === 0 ? -50 : 0, duration: 28 + index * 4,
            ease: "none", repeat: -1, paused: true }));
      let hovered = false;
      let visible = false;
      const sync = () => {
        const focused = strip.contains(document.activeElement);
        loops.forEach(loop => loop.paused(!visible || document.hidden || hovered || focused));
      };
      const rates = loops.map(loop => gsap.quickTo(loop, "timeScale", { duration: .8, ease: "sine.out" }));
      const settle = gsap.delayedCall(.3, () => rates.forEach(rate => rate(1))).pause();
      const scene = ScrollTrigger.create({
        trigger: strip, start: "top bottom", end: "bottom top",
        onToggle: self => { visible = self.isActive; sync(); },
        onUpdate: self => {
          const speed = 1 + Math.min(Math.abs(self.getVelocity()) / 2400, .6);
          rates.forEach(rate => rate(speed));
          settle.restart(true);
        },
      });
      const enter = (event: PointerEvent) => { hovered = event.pointerType === "mouse"; sync(); };
      const leave = () => { hovered = false; sync(); };
      strip.addEventListener("pointerenter", enter);
      strip.addEventListener("pointerleave", leave);
      strip.addEventListener("focusin", sync);
      strip.addEventListener("focusout", sync);
      document.addEventListener("visibilitychange", sync);
      visible = scene.isActive;
      sync();
      return () => {
        strip.removeEventListener("pointerenter", enter);
        strip.removeEventListener("pointerleave", leave);
        strip.removeEventListener("focusin", sync);
        strip.removeEventListener("focusout", sync);
        document.removeEventListener("visibilitychange", sync);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="closing-type" className="closing-marquee" data-closing-marquee
      tabIndex={0} aria-label="Reyhan Irza Alvano — Creative Developer"
      aria-description="Gerak berhenti saat area ini mendapat fokus atau penunjuk mouse.">
      {rows.map((words, index) => (
        <div className="closing-marquee__window" key={words[0]} aria-hidden="true">
          <div className="closing-marquee__track" data-closing-track data-direction={index === 0 ? "left" : "right"}>
            {[0, 1].map(copy => (
              <div className="closing-marquee__cycle" key={copy}>
                {words.map(word => <span className="closing-marquee__word" key={word}>{word}<i /></span>)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

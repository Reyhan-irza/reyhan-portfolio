import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

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
      const tracks = Array.from(strip.querySelectorAll<HTMLElement>("[data-closing-track]"));
      // Constant pixel speed, independent of the width of each sentence.
      const loops = tracks.map((track, index) => gsap.fromTo(track,
        { xPercent: index === 0 ? 0 : -50, force3D: true },
        { xPercent: index === 0 ? -50 : 0,
          duration: Math.max(1, track.scrollWidth / 2 / (index === 0 ? 65 : 55)),
          ease: "none", repeat: -1, paused: true }));
      let visible = false;
      const sync = () => {
        const keyboardFocus = strip.matches(":focus-visible");
        loops.forEach(loop => loop.paused(!visible || document.hidden || keyboardFocus));
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting; sync();
      });
      observer.observe(strip);
      const resize = new ResizeObserver(() => {
        tracks.forEach((track, index) => {
          const progress = loops[index].totalProgress();
          loops[index].duration(Math.max(1, track.scrollWidth / 2 / (index === 0 ? 65 : 55)));
          loops[index].totalProgress(progress);
        });
      });
      tracks.forEach(track => resize.observe(track));
      strip.addEventListener("focusin", sync);
      strip.addEventListener("focusout", sync);
      document.addEventListener("visibilitychange", sync);
      sync();
      return () => {
        observer.disconnect();
        resize.disconnect();
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
      aria-description="Gerak berhenti saat area ini mendapat fokus melalui keyboard.">
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

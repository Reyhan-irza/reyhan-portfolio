import { useLayoutEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion";

export default function ClosingMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pausedByReader = useRef(false);
  const syncPlayback = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    if (!root.current || !track.current) return;
    const strip = root.current, words = track.current;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // Both groups have identical width. Percentage translation retains the seam after resize.
      const loop = gsap.fromTo(words, { xPercent: 0 }, {
        xPercent: -50, duration: 26, repeat: -1, ease: "none", paused: true,
        onReverseComplete(this: gsap.core.Tween) { this.totalTime(this.duration() * 50); },
      });
      let direction = 1;
      const rate = gsap.quickTo(loop, "timeScale", { duration: .65, ease: "sine.out" });
      const settle = gsap.delayedCall(.23, () => rate(direction)).pause();
      const sync = (visible: boolean) => loop.paused(!visible || document.hidden || pausedByReader.current);
      const scene = ScrollTrigger.create({
        trigger: strip, start: "clamp(top bottom)", end: "bottom top",
        onToggle: self => sync(self.isActive),
        onUpdate: self => {
          direction = self.direction;
          rate(direction * (1 + Math.min(Math.abs(self.getVelocity()) / 1700, .85)));
          settle.restart(true);
        },
      });
      const update = () => { sync(scene.isActive); };
      syncPlayback.current = update;
      document.addEventListener("visibilitychange", update);
      update();
      return () => {
        document.removeEventListener("visibilitychange", update);
        syncPlayback.current = () => {};
      };
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={root} className="closing-marquee" data-closing-marquee>
      <div className="closing-marquee__window" aria-hidden="true">
        <div ref={track} className="closing-marquee__track" data-closing-track>
          {[0, 1].map(copy => (
            <div className="closing-marquee__cycle" key={copy}>
              <span>Reyhan Irza Alvano</span><i /><span>Creative Developer</span><i />
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="closing-marquee__control"
        aria-label="Jeda teks berjalan" aria-pressed={paused}
        onClick={() => {
          pausedByReader.current = !pausedByReader.current;
          setPaused(pausedByReader.current);
          syncPlayback.current();
        }}>
        {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
      </button>
    </div>
  );
}

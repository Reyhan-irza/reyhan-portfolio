import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

export default function SectionMarquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const track = root.firstElementChild as HTMLElement;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, {
        xPercent: reverse ? 0 : -50, duration: 1, repeat: -1, ease: "none", paused: true,
      });
      const resize = new ResizeObserver(() => tween.timeScale(52 / Math.max(1, track.offsetWidth / 2)));
      resize.observe(track);
      const observer = new IntersectionObserver(([entry]) => tween.paused(!entry.isIntersecting));
      observer.observe(root);
      return () => { resize.disconnect(); observer.disconnect(); };
    });
    return () => media.revert();
  }, [reverse]);
  return <div ref={ref} className="section-marquee" aria-hidden="true"><div>{[0,1].map(i =>
    <span key={i}>{[0,1].map(j => <b key={j}>{text}<i>·</i></b>)}</span>
  )}</div></div>;
}

import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION } from "../lib/motion";
const phrases = ["web development", "TypeScript & Tailwind", "AI-assisted projects"];
export default function HeroTypingLoop({ ready }: { ready: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element || !ready) return;
    const media = gsap.matchMedia();
    media.add({ reduced: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (match) => {
      if (match.conditions?.reduced) { element.textContent = "web, TypeScript, Tailwind, dan AI"; return; }
      const timeline = gsap.timeline({ repeat: -1, paused: true });
      phrases.forEach((phrase) => {
        const progress = { count: 0 };
        const update = () => {
          const text = phrase.slice(0, Math.round(progress.count));
          if (element.textContent !== text) element.textContent = text;
        };
        timeline.fromTo(progress, { count: 0 }, { count: phrase.length, duration: MOTION.text, ease: "none", onUpdate: update })
          .to(progress, { count: 0, duration: MOTION.text, ease: "none", onUpdate: update }, `+=${MOTION.reveal}`);
      });
      let visible = false;
      const visibility = () => { timeline.paused(document.hidden || !visible); };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        visibility();
      });
      observer.observe(element.parentElement ?? element);
      document.addEventListener("visibilitychange", visibility);
      return () => { observer.disconnect(); timeline.kill(); document.removeEventListener("visibilitychange", visibility); };
    });
    return () => media.revert();
  }, [ready]);
  return <span className="hero-typing-loop" aria-hidden="true"><span ref={textRef}>web development</span><span className="typing-cursor" /></span>;
}

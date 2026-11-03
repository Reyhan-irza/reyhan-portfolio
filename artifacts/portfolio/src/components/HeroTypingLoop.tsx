import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION } from "../lib/motion";
const phrases = ["web development", "TypeScript & Tailwind", "AI-assisted projects"];
export default function HeroTypingLoop() {
  const textRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add({ reduced: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (match) => {
      if (match.conditions?.reduced) { element.textContent = "web, TypeScript, Tailwind, dan AI"; return; }
      const timeline = gsap.timeline({ repeat: -1 });
      phrases.forEach((phrase) => {
        const progress = { count: 0 };
        const update = () => { element.textContent = phrase.slice(0, Math.round(progress.count)); };
        timeline.fromTo(progress, { count: 0 }, { count: phrase.length, duration: MOTION.text, ease: "none", onUpdate: update })
          .to(progress, { count: 0, duration: MOTION.text, ease: "none", onUpdate: update }, `+=${MOTION.reveal}`);
      });
      const visibility = () => { timeline.paused(document.hidden); };
      document.addEventListener("visibilitychange", visibility);
      return () => { timeline.kill(); document.removeEventListener("visibilitychange", visibility); };
    });
    return () => media.revert();
  }, []);
  return <span className="hero-typing-loop" aria-hidden="true"><span ref={textRef}>web development</span><span className="typing-cursor" /></span>;
}

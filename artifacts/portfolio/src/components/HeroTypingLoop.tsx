import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const phrases = ["web development", "TypeScript & Tailwind", "AI-assisted projects"];
const staticSummary = "web, TypeScript, Tailwind, dan AI";

export default function HeroTypingLoop() {
  const reducedMotion = useReducedMotion();
  const [text, setText] = useState("");

  useEffect(() => {
    if (reducedMotion) {
      setText(staticSummary);
      return;
    }

    let phraseIndex = 0;
    let characterCount = 0;
    let deleting = false;
    let disposed = false;
    let timeout: number;

    const tick = () => {
      if (disposed) return;
      if (document.hidden) {
        timeout = window.setTimeout(tick, 300);
        return;
      }

      const phrase = phrases[phraseIndex];
      if (!deleting) {
        characterCount = Math.min(characterCount + 1, phrase.length);
        setText(phrase.slice(0, characterCount));
        if (characterCount === phrase.length) {
          deleting = true;
          timeout = window.setTimeout(tick, 1900);
          return;
        }
        timeout = window.setTimeout(tick, 72);
        return;
      }

      characterCount = Math.max(0, characterCount - 1);
      setText(phrase.slice(0, characterCount));
      if (characterCount === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeout = window.setTimeout(tick, 360);
        return;
      }
      timeout = window.setTimeout(tick, 34);
    };

    timeout = window.setTimeout(tick, 650);
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
    };
  }, [reducedMotion]);

  return (
    <span className="hero-typing-loop" aria-hidden="true">
      {text}
      {!reducedMotion && <span className="typing-cursor" />}
    </span>
  );
}

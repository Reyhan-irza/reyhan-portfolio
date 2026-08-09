import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down" | null;

export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const [scrollY, setScrollY] = useState(0);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const nextY = Math.max(window.scrollY, 0);
      if (Math.abs(nextY - lastY.current) >= threshold) {
        setDirection(nextY > lastY.current ? "down" : "up");
        lastY.current = nextY;
      }
      setScrollY(nextY);
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    lastY.current = window.scrollY;
    setScrollY(lastY.current);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { direction, scrollY };
}
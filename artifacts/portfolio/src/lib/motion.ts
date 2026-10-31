import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function cubicBezierEase(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (progress: number) => number {
  const sample = (t: number, first: number, second: number) =>
    3 * (1 - t) ** 2 * t * first + 3 * (1 - t) * t ** 2 * second + t ** 3;

  return (progress) => {
    let low = 0;
    let high = 1;
    let t = progress;
    for (let iteration = 0; iteration < 12; iteration += 1) {
      const x = sample(t, x1, x2);
      if (Math.abs(x - progress) < 0.00001) break;
      if (x < progress) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return sample(t, y1, y2);
  };
}

export { gsap, ScrollTrigger };
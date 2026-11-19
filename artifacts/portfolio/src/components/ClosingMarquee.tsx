import { useEffect, useRef } from "react";

const words = ["Creative Developer", "Reyhan Irza Alvano", "Always Learning", "Web Developer", "Cybersecurity"];

export default function ClosingMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = root.current;
    if (!strip) return;
    const observer = new IntersectionObserver(([entry]) => {
      strip.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} id="closing-type" className="closing-marquee" data-closing-marquee aria-hidden="true">
      <div className="closing-marquee__track" data-closing-track>
        {[0, 1].map(copy => (
          <div className="closing-marquee__cycle" key={copy}>
            {words.map(word => <span className="closing-marquee__word" key={word}>{word}<i /></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

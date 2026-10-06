import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Network, ScrollText, Waves } from "lucide-react";
import {
  SiCss,
  SiGithub,
  SiGsap,
  SiHtml5,
  SiJavascript,
  SiReact,
  SiReplit,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { gsap } from "../lib/motion";
import "./TechnologyBands.css";

type Technology = {
  name: string;
  detail?: string;
  mark: ReactNode;
  color: string;
};

type Band = {
  id: string;
  label: string;
  note: string;
  direction: "forward" | "reverse";
  technologies: Technology[];
};

const bands: Band[] = [
  {
    id: "build",
    label: "Build",
    note: "Interfaces & web",
    direction: "forward",
    technologies: [
      { name: "React", mark: <SiReact />, color: "#61DAFB" },
      { name: "TypeScript", mark: <SiTypescript />, color: "#3178C6" },
      { name: "JavaScript", mark: <SiJavascript />, color: "#F7DF1E" },
      { name: "HTML", mark: <SiHtml5 />, color: "#E34F26" },
      { name: "CSS", mark: <SiCss />, color: "#1572B6" },
      { name: "Tailwind CSS", mark: <SiTailwindcss />, color: "#06B6D4" },
    ],
  },
  {
    id: "system",
    label: "System",
    note: "Motion & flow",
    direction: "reverse",
    technologies: [
      { name: "GSAP", mark: <SiGsap />, color: "#88CE02" },
      { name: "ScrollTrigger", mark: <ScrollText />, color: "#A99AFF" },
      { name: "Lenis", mark: <Waves />, color: "#83C8FF" },
    ],
  },
  {
    id: "network",
    label: "Network",
    note: "School context",
    direction: "forward",
    technologies: [
      { name: "TJKT", detail: "Networking context", mark: <Network />, color: "#8EA0FF" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    note: "Tools in the loop",
    direction: "reverse",
    technologies: [
      { name: "Supabase", mark: <SiSupabase />, color: "#3ECF8E" },
      { name: "GitHub", mark: <SiGithub />, color: "#F5F7FA" },
      { name: "Vercel", mark: <SiVercel />, color: "#F5F7FA" },
      { name: "Replit", mark: <SiReplit />, color: "#F26207" },
    ],
  },
];

export default function TechnologyBands() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<{ band: string; name: string } | null>(null);
  const selectedRef = useRef(selected);
  const bandTweens = useRef(new Map<string, gsap.core.Tween>());
  selectedRef.current = selected;

  const syncBandMotion = (bandId: string, element: HTMLElement) => {
    const shouldPause =
      selectedRef.current?.band === bandId ||
      element.matches(":hover") ||
      element.contains(document.activeElement);

    bandTweens.current.get(bandId)?.paused(shouldPause);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    media.add(
      {
        reducedMotion: "(prefers-reduced-motion: reduce)",
        standardMotion: "(prefers-reduced-motion: no-preference)",
        compact: "(max-width: 760px)",
        wide: "(min-width: 761px)",
      },
      (context) => {
        if (context.conditions?.reducedMotion) return;

        section.querySelectorAll<HTMLElement>(".technology-band__track").forEach((track, index) => {
          const band = track.closest<HTMLElement>(".technology-band");
          const bandId = band?.dataset.bandId;
          if (!band || !bandId) return;

          const duration =
            Number.parseFloat(getComputedStyle(band).getPropertyValue("--band-duration")) || 22;
          const reverse = band.dataset.direction === "reverse";
          const tween = gsap.fromTo(
            track,
            { xPercent: reverse ? -50 : 0 },
            {
              xPercent: reverse ? 0 : -50,
              duration,
              delay: -index * 1.6,
              ease: "none",
              repeat: -1,
            },
          );

          bandTweens.current.set(bandId, tween);
          syncBandMotion(bandId, band);
        });

        return () => bandTweens.current.clear();
      },
    );

    return () => {
      media.revert();
      bandTweens.current.clear();
    };
  }, []);

  useLayoutEffect(() => {
    sectionRef.current?.querySelectorAll<HTMLElement>(".technology-band").forEach((band) => {
      const bandId = band.dataset.bandId;
      if (bandId) syncBandMotion(bandId, band);
    });
  }, [selected]);

  return (
    <section
      ref={sectionRef}
      id="technology-bands"
      className="technology-bands"
      aria-labelledby="technology-bands-title"
    >
      <div className="technology-bands__header">
        <div className="technology-bands__heading">
          <p className="technology-bands__eyebrow">
            <span className="technology-bands__index" aria-hidden="true">02</span>
            The working set
          </p>
          <h2 id="technology-bands-title">
            Tools in motion<span aria-hidden="true">.</span>
          </h2>
        </div>
        <p className="technology-bands__intro">
          A snapshot of the languages, systems, and platforms behind the work.
          Not a scorecard—just the things currently in the mix.
        </p>
      </div>

      <div className="technology-bands__rows">
        {bands.map((band, index) => {
          const isSelectedBand = selected?.band === band.id;
          const repeatedTechnologies = Array.from({ length: 4 }, () => band.technologies).flat();

          return (
            <div
              className={`technology-band technology-band--${band.id} technology-band--${band.direction}${isSelectedBand ? " technology-band--selected" : ""}`}
              key={band.id}
              data-band-id={band.id}
              data-direction={band.direction}
              onMouseEnter={() => bandTweens.current.get(band.id)?.pause()}
              onMouseLeave={(event) => syncBandMotion(band.id, event.currentTarget)}
              onFocusCapture={() => bandTweens.current.get(band.id)?.pause()}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  syncBandMotion(band.id, event.currentTarget);
                }
              }}
            >
              <div className="technology-band__label">
                <span className="technology-band__number">0{index + 1}</span>
                <span className="technology-band__name">{band.label}</span>
                <span className="technology-band__note">{band.note}</span>
              </div>

              <div className="technology-band__viewport">
                <div className="technology-band__track" role="group" aria-label={`${band.label} technologies`}>
                  {repeatedTechnologies.map((technology, itemIndex) => {
                    const repeated = itemIndex >= band.technologies.length;
                    const isActive = !repeated && selected?.band === band.id && selected.name === technology.name;
                    return (
                      <button
                        className={`technology-band__item${isActive ? " is-active" : ""}`}
                        type="button"
                        aria-pressed={isActive}
                        aria-hidden={repeated}
                        aria-label={technology.detail ? `${technology.name}, ${technology.detail}` : technology.name}
                        data-testid={`technology-${band.id}-${technology.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`}
                        key={`${technology.name}-${itemIndex}`}
                        tabIndex={repeated ? -1 : 0}
                        onClick={() => {
                          if (repeated) return;
                          const current = selectedRef.current;
                          const next =
                            current?.band === band.id && current.name === technology.name
                              ? null
                              : { band: band.id, name: technology.name };
                          selectedRef.current = next;
                          setSelected(next);
                        }}
                      >
                        <span
                          className="technology-band__item-logo"
                          style={{ color: technology.color } as CSSProperties}
                          aria-hidden="true"
                        >
                          {technology.mark}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="technology-band__edge" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      <div className="technology-bands__footer">
        <span className="technology-bands__footer-mark" aria-hidden="true">
          <span />
          <span />
        </span>
        <p aria-live="polite">
          {selected
            ? <>Paused<span className="technology-bands__footer-divider">/</span>{bands.find((band) => band.id === selected.band)?.label}</>
            : <>Select a mark to pause its row<span className="technology-bands__footer-divider">·</span>Hover, tap, or use a keyboard</>}
        </p>
        <span className="technology-bands__footer-code">RV / TECH 04</span>
      </div>
    </section>
  );
}

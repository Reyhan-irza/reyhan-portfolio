import { useState, type CSSProperties } from "react";
import "./TechnologyBands.css";

type Technology = {
  name: string;
  detail?: string;
};

type Band = {
  id: string;
  label: string;
  note: string;
  direction: "forward" | "reverse";
  duration: string;
  technologies: Technology[];
};

type BandStyle = CSSProperties & {
  "--band-duration": string;
  "--band-index": number;
};

const bands: Band[] = [
  {
    id: "build",
    label: "Build",
    note: "Interfaces & web",
    direction: "forward",
    duration: "36s",
    technologies: [
      { name: "React" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    id: "system",
    label: "System",
    note: "Motion & flow",
    direction: "reverse",
    duration: "42s",
    technologies: [
      { name: "GSAP" },
      { name: "ScrollTrigger" },
      { name: "Lenis" },
    ],
  },
  {
    id: "network",
    label: "Network",
    note: "School context",
    direction: "forward",
    duration: "46s",
    technologies: [
      { name: "TJKT", detail: "Networking context" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    note: "Tools in the loop",
    direction: "reverse",
    duration: "38s",
    technologies: [
      { name: "Supabase" },
      { name: "GitHub" },
      { name: "Vercel" },
      { name: "Replit" },
    ],
  },
];

export default function TechnologyBands() {
  const [selected, setSelected] = useState<{ band: string; name: string } | null>(null);

  return (
    <section id="technology-bands" className="technology-bands" aria-labelledby="technology-bands-title">
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
          const repeatedTechnologies = [...band.technologies, ...band.technologies];

          return (
            <div
              className={`technology-band technology-band--${band.id} technology-band--${band.direction}${isSelectedBand ? " technology-band--selected" : ""}`}
              key={band.id}
              style={{ "--band-duration": band.duration, "--band-index": index } as BandStyle}
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
                          setSelected((current) =>
                            current?.band === band.id && current.name === technology.name
                              ? null
                              : { band: band.id, name: technology.name },
                          );
                        }}
                      >
                        <span className="technology-band__item-mark" aria-hidden="true" />
                        <span className="technology-band__item-copy">
                          <span className="technology-band__item-name">{technology.name}</span>
                          {technology.detail && (
                            <span className="technology-band__item-detail">{technology.detail}</span>
                          )}
                        </span>
                        <span className="technology-band__item-arrow" aria-hidden="true">↗</span>
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
            ? <>Selected <strong>{selected.name}</strong><span className="technology-bands__footer-divider">/</span>{bands.find((band) => band.id === selected.band)?.label}</>
            : <>Select a name to pause on a detail<span className="technology-bands__footer-divider">·</span>Hover, tap, or use a keyboard</>}
        </p>
        <span className="technology-bands__footer-code">RV / TECH 04</span>
      </div>
    </section>
  );
}

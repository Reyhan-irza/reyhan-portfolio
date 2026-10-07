import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import "./TechnologyBands.css";

type TechnologyBand = {
  id: string;
  number: string;
  label: string;
  direction: "left" | "right";
  duration: number;
  mobileDuration: number;
  technologies: readonly string[];
};

const bands: readonly TechnologyBand[] = [
  {
    id: "build",
    number: "01",
    label: "BUILD",
    direction: "left",
    duration: 30,
    mobileDuration: 36,
    technologies: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "C#", "Node.js", "Git", "GitHub"],
  },
  {
    id: "system",
    number: "02",
    label: "SYSTEM",
    direction: "right",
    duration: 36,
    mobileDuration: 42,
    technologies: ["Windows", "Linux", "Android", "Visual Studio", "VS Code", "Termux"],
  },
  {
    id: "network",
    number: "03",
    label: "NETWORK",
    direction: "left",
    duration: 42,
    mobileDuration: 48,
    technologies: ["MikroTik", "Cisco", "Router", "Switch", "VLAN", "TCP/IP", "Network Infrastructure"],
  },
];

type AnimatedTrack = {
  tween: gsap.core.Tween;
  setSpeed: (value: number) => void;
};

export default function TechnologyBands() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pressedTechnology, setPressedTechnology] = useState<{ bandId: string; name: string } | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add(
        {
          reducedMotion: "(prefers-reduced-motion: reduce)",
          standardMotion: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 760px)",
          wide: "(min-width: 761px)",
        },
        (match) => {
          if (match.conditions?.reducedMotion) return;

          const compact = Boolean(match.conditions?.compact);
          const animatedTracks: AnimatedTrack[] = [];
          let resetSpeed: gsap.core.Tween | undefined;

          section.querySelectorAll<HTMLElement>("[data-band-track]").forEach((track) => {
            const bandElement = track.closest<HTMLElement>("[data-band-id]");
            const band = bands.find((item) => item.id === bandElement?.dataset.bandId);
            if (!band) return;

            const speed = { value: 1 };
            const reverse = band.direction === "right";
            const tween = gsap.fromTo(
              track,
              { xPercent: reverse ? -50 : 0 },
              {
                xPercent: reverse ? 0 : -50,
                duration: compact ? band.mobileDuration : band.duration,
                ease: "none",
                repeat: -1,
                paused: true,
              },
            );
            const setSpeed = gsap.quickTo(speed, "value", {
              duration: 0.42,
              ease: "power2.out",
              onUpdate: () => tween.timeScale(speed.value),
            });

            animatedTracks.push({ tween, setSpeed });
          });

          const header = section.querySelector<HTMLElement>("[data-section-header]");
          const title = section.querySelector<HTMLElement>("[data-section-title]");
          if (header) {
            gsap.fromTo(
              header,
              { x: -24, autoAlpha: 0 },
              {
                x: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 86%",
                  end: "top 34%",
                  scrub: 0.65,
                },
              },
            );
          }
          if (title) {
            gsap.fromTo(
              title,
              { letterSpacing: "-.08em" },
              {
                letterSpacing: "-.055em",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  end: "top 36%",
                  scrub: 0.65,
                },
              },
            );
          }

          section.querySelectorAll<HTMLElement>("[data-band-entry]").forEach((entry) => {
            const band = entry.closest<HTMLElement>("[data-band-id]");
            if (!band) return;
            const offset = band.dataset.direction === "right" ? 42 : -42;
            gsap.fromTo(
              entry,
              { x: offset, autoAlpha: 0 },
              {
                x: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: band,
                  start: "top 92%",
                  end: "top 48%",
                  scrub: 0.7,
                },
              },
            );
          });

          const velocityTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              animatedTracks.forEach(({ tween, setSpeed }) => {
                tween.paused(!self.isActive);
                if (!self.isActive) setSpeed(1);
              });
            },
            onUpdate: (self) => {
              const velocity = Math.abs(self.getVelocity());
              const multiplier = gsap.utils.clamp(1, 1.78, 1 + (velocity / 3000) * 0.78);
              animatedTracks.forEach(({ setSpeed }) => setSpeed(multiplier));
              resetSpeed?.kill();
              resetSpeed = gsap.delayedCall(0.16, () => {
                animatedTracks.forEach(({ setSpeed }) => setSpeed(1));
              });
            },
          });

          animatedTracks.forEach(({ tween }) => tween.paused(!velocityTrigger.isActive));

          return () => {
            resetSpeed?.kill();
            velocityTrigger.kill();
            animatedTracks.forEach(({ tween }) => tween.kill());
          };
        },
      );

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="technology-bands"
      className="technology-bands"
      aria-labelledby="technology-bands-title"
    >
      <header className="technology-bands__header" data-section-header>
        <div className="technology-bands__heading">
          <p className="technology-bands__eyebrow">
            <span>01</span>
            <span aria-hidden="true">/</span>
            <span>SYSTEM</span>
          </p>
          <h2 id="technology-bands-title" data-section-title>
            TOOLS IN MOTION<span aria-hidden="true">.</span>
          </h2>
        </div>
        <p className="technology-bands__intro">
          Languages, systems and networks behind the work.
        </p>
      </header>

      <div className="technology-bands__rows">
        {bands.map((band) => (
          <div
            className={`technology-band technology-band--${band.id}`}
            key={band.id}
            data-band-id={band.id}
            data-direction={band.direction}
          >
            <div className="technology-band__label" id={`technology-band-${band.id}`}>
              <span className="technology-band__number">{band.number}</span>
              <span className="technology-band__slash" aria-hidden="true">/</span>
              <span className="technology-band__name">{band.label}</span>
            </div>

            <div className="technology-band__entry" data-band-entry>
              <div
                className="technology-band__viewport"
                role="group"
                aria-labelledby={`technology-band-${band.id}`}
              >
                <div className="technology-band__track" data-band-track>
                  {[0, 1].map((copy) => (
                    <ul
                      className="technology-band__sequence"
                      aria-label={copy === 0 ? `${band.label} technologies` : undefined}
                      aria-hidden={copy === 1}
                      key={copy}
                    >
                      {band.technologies.map((technology) => {
                        const isPressed =
                          copy === 0 &&
                          pressedTechnology?.bandId === band.id &&
                          pressedTechnology.name === technology;

                        return (
                        <li
                          className={`technology-band__item${isPressed ? " is-touch-active" : ""}`}
                          key={`${copy}-${technology}`}
                          onPointerDown={(event) => {
                            if (event.pointerType === "touch" && copy === 0) {
                              setPressedTechnology({ bandId: band.id, name: technology });
                            }
                          }}
                          onPointerUp={() => setPressedTechnology(null)}
                          onPointerCancel={() => setPressedTechnology(null)}
                          onPointerLeave={() => setPressedTechnology(null)}
                        >
                          {technology}
                        </li>
                        );
                      })}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

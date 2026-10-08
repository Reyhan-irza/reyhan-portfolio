import { useLayoutEffect, useRef, useState } from "react";
import { Cable, Layers3, Network, Router, Terminal, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DiVisualstudio } from "react-icons/di";
import { FaWindows } from "react-icons/fa6";
import {
  SiAndroid,
  SiCisco,
  SiCss,
  SiDebian,
  SiDotnet,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiKalilinux,
  SiLinux,
  SiMikrotik,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { VscVscode } from "react-icons/vsc";
import { gsap, ScrollTrigger } from "../lib/motion";
import "./TechnologyBands.css";

type BrandLogo = { Icon: IconType; color: string };
type ConceptIcon = { Icon: LucideIcon; color: string };

const brandLogos: Record<string, BrandLogo> = {
  React: { Icon: SiReact, color: "#61DAFB" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  HTML: { Icon: SiHtml5, color: "#E34F26" },
  CSS: { Icon: SiCss, color: "#1572B6" },
  "C#": { Icon: SiDotnet, color: "#512BD4" },
  "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  Git: { Icon: SiGit, color: "#F05032" },
  GitHub: { Icon: SiGithub, color: "#F5F7FA" },
  Tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  Windows: { Icon: FaWindows, color: "#0078D4" },
  Linux: { Icon: SiLinux, color: "#FCC624" },
  Android: { Icon: SiAndroid, color: "#3DDC84" },
  "Visual Studio": { Icon: DiVisualstudio, color: "#5C2D91" },
  "VS Code": { Icon: VscVscode, color: "#007ACC" },
  "Kali Linux": { Icon: SiKalilinux, color: "#557C94" },
  Debian: { Icon: SiDebian, color: "#A81D33" },
  MikroTik: { Icon: SiMikrotik, color: "#E8EDF4" },
  Cisco: { Icon: SiCisco, color: "#049FD9" },
};

const conceptIcons: Record<string, ConceptIcon> = {
  Termux: { Icon: Terminal, color: "#C9D0DC" },
  Router: { Icon: Router, color: "#D2D8E2" },
  Switch: { Icon: Network, color: "#D2D8E2" },
  VLAN: { Icon: Layers3, color: "#C4B5FD" },
  "TCP/IP": { Icon: Cable, color: "#D2D8E2" },
  "Network Infrastructure": { Icon: Waypoints, color: "#D2D8E2" },
};

function TechnologyLogo({ name }: { name: string }) {
  const brand = brandLogos[name];
  if (brand) {
    const Icon = brand.Icon;
    return (
      <span className="technology-band__mark" role="img" aria-label={name} style={{ color: brand.color }}>
        <Icon aria-hidden="true" focusable="false" />
      </span>
    );
  }

  const concept = conceptIcons[name];
  if (concept) {
    const Icon = concept.Icon;
    return (
      <span className="technology-band__mark" role="img" aria-label={name} style={{ color: concept.color }}>
        <Icon aria-hidden="true" focusable="false" strokeWidth={1.8} />
      </span>
    );
  }

  throw new Error(`Missing technology logo for ${name}`);
}

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
    technologies: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "C#", "Node.js", "Git", "GitHub", "Tailwind"],
  },
  {
    id: "system",
    number: "02",
    label: "SYSTEM",
    direction: "right",
    duration: 36,
    mobileDuration: 42,
    technologies: ["Windows", "Linux", "Android", "Visual Studio", "VS Code", "Termux", "Kali Linux", "Debian"],
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
          const revealDistance = () => gsap.utils.clamp(16, 42, section.clientWidth * 0.035);
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
          if (header) {
            gsap.fromTo(
              header,
              { x: () => -gsap.utils.clamp(16, 24, section.clientWidth * 0.02), autoAlpha: 0 },
              {
                x: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 86%",
                  end: "top 34%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          section.querySelectorAll<HTMLElement>("[data-band-entry]").forEach((entry) => {
            const band = entry.closest<HTMLElement>("[data-band-id]");
            if (!band) return;
            const direction = band.dataset.direction === "right" ? 1 : -1;
            gsap.fromTo(
              entry,
              { x: () => direction * revealDistance(), autoAlpha: 0 },
              {
                x: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: band,
                  start: "top 92%",
                  end: "top 48%",
                  scrub: 0.7,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          const velocityTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (!self.isActive) {
                resetSpeed?.kill();
                resetSpeed = undefined;
              }
              animatedTracks.forEach(({ tween, setSpeed }) => {
                tween.paused(!self.isActive);
                if (!self.isActive) setSpeed(1);
              });
            },
            onUpdate: (self) => {
              const velocity = Math.abs(self.getVelocity());
              if (velocity < 24) return;
              const multiplier = gsap.utils.clamp(1, 1.78, 1 + (velocity / 3000) * 0.78);
              animatedTracks.forEach(({ setSpeed }) => setSpeed(multiplier));
              resetSpeed?.kill();
              resetSpeed = gsap.delayedCall(0.18, () => {
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
      <h2 className="technology-bands__accessible-title" id="technology-bands-title">
        Technology logos by category
      </h2>
      <header className="technology-bands__header" data-section-header>
        <div className="technology-bands__heading">
          <p className="technology-bands__eyebrow">
            <span>01</span>
            <span aria-hidden="true">/</span>
            <span>SYSTEM</span>
          </p>
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
                          pressedTechnology?.bandId === band.id &&
                          pressedTechnology.name === technology;

                        return (
                          <li
                            className={`technology-band__item${isPressed ? " is-touch-active" : ""}`}
                            key={`${copy}-${technology}`}
                            onPointerDown={(event) => {
                              if (event.pointerType === "touch") {
                                setPressedTechnology({ bandId: band.id, name: technology });
                              }
                            }}
                            onPointerUp={() => setPressedTechnology(null)}
                            onPointerCancel={() => setPressedTechnology(null)}
                            onPointerLeave={() => setPressedTechnology(null)}
                          >
                            <TechnologyLogo name={technology} />
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

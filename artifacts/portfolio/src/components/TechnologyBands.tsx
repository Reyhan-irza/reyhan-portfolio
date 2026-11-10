import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import { scrubBelt } from "./ScrollBelt";
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
import Reveal from "./Reveal";
import "./TechnologyBands.css";

type BrandLogo = { Icon: IconType };
type ConceptIcon = { Icon: LucideIcon };

const brandLogos: Record<string, BrandLogo> = {
  React: { Icon: SiReact },
  TypeScript: { Icon: SiTypescript },
  JavaScript: { Icon: SiJavascript },
  HTML: { Icon: SiHtml5 },
  CSS: { Icon: SiCss },
  "C#": { Icon: SiDotnet },
  "Node.js": { Icon: SiNodedotjs },
  Git: { Icon: SiGit },
  GitHub: { Icon: SiGithub },
  Tailwind: { Icon: SiTailwindcss },
  Windows: { Icon: FaWindows },
  Linux: { Icon: SiLinux },
  Android: { Icon: SiAndroid },
  "Visual Studio": { Icon: DiVisualstudio },
  "VS Code": { Icon: VscVscode },
  "Kali Linux": { Icon: SiKalilinux },
  Debian: { Icon: SiDebian },
  MikroTik: { Icon: SiMikrotik },
  Cisco: { Icon: SiCisco },
};

const conceptIcons: Record<string, ConceptIcon> = {
  Termux: { Icon: Terminal },
  Router: { Icon: Router },
  Switch: { Icon: Network },
  VLAN: { Icon: Layers3 },
  "TCP/IP": { Icon: Cable },
  "Network Infrastructure": { Icon: Waypoints },
};

function TechnologyLogo({ name }: { name: string }) {
  const brand = brandLogos[name];
  if (brand) {
    const Icon = brand.Icon;
    return (
      <span className="technology-band__mark" aria-hidden="true">
        <Icon aria-hidden="true" focusable="false" />
      </span>
    );
  }

  const concept = conceptIcons[name];
  if (concept) {
    const Icon = concept.Icon;
    return (
      <span className="technology-band__mark" aria-hidden="true">
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
  technologies: readonly string[];
};

const bands: readonly TechnologyBand[] = [
  {
    id: "build",
    number: "01",
    label: "PENGEMBANGAN",
    direction: "left",
    technologies: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "C#", "Node.js", "Git", "GitHub", "Tailwind"],
  },
  {
    id: "system",
    number: "02",
    label: "SISTEM",
    direction: "right",
    technologies: ["Windows", "Linux", "Android", "Visual Studio", "VS Code", "Termux", "Kali Linux", "Debian"],
  },
  {
    id: "network",
    number: "03",
    label: "JARINGAN",
    direction: "left",
    technologies: ["MikroTik", "Cisco", "Router", "Switch", "VLAN", "TCP/IP", "Network Infrastructure"],
  },
];

export default function TechnologyBands() {
  const [pressedTechnology, setPressedTechnology] = useState<{ bandId: string; name: string } | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      section.querySelectorAll<HTMLElement>("[data-band-track]").forEach(track => {
        const row = track.closest<HTMLElement>("[data-direction]");
        if (row) scrubBelt(track, section, row.dataset.direction === "right");
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef}
      id="technology-bands"
      className="technology-bands"
      aria-labelledby="technology-bands-title"
    >
      <h2 className="technology-bands__accessible-title" id="technology-bands-title">
        Technologies I use
      </h2>
      <Reveal mount as="header" className="technology-bands__header">
        <div className="technology-bands__heading">
          <p className="technology-bands__eyebrow">
            <span>01</span>
            <span aria-hidden="true">/</span>
            <span>TEKNOLOGI YANG DIGUNAKAN</span>
          </p>
        </div>
        <p className="technology-bands__intro">
          Languages, systems, and networks behind my projects.
        </p>
      </Reveal>

      <div className="technology-bands__rows">
        {bands.map((band) => (
          <Reveal mount
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

            <div className="technology-band__entry">
              <div
                className="technology-band__viewport"
                role="group"
                aria-labelledby={`technology-band-${band.id}`}
              >
                <div className="technology-band__track" data-band-track>
                  {[0, 1].map((copy) => (
                    <ul
                      className="technology-band__sequence"
                      aria-label={copy === 0 ? `Teknologi ${band.label.toLowerCase()}` : undefined}
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
                            <span className="technology-band__technology-name">{technology}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

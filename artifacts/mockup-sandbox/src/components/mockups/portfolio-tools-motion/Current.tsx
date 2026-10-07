import type { CSSProperties } from "react";
import { Cable, Layers3, Network, Router, Terminal, Waypoints, type LucideIcon } from "lucide-react";
import { FaMicrosoft, FaWindows } from "react-icons/fa6";
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
import "./_group.css";

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
  "Visual Studio": { Icon: FaMicrosoft, color: "#7A4BC2" },
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

type Band = {
  id: string;
  number: string;
  label: string;
  direction: "left" | "right";
  duration: number;
  mobileDuration: number;
  technologies: string[];
};

const bands: Band[] = [
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

export default function Current() {
  return (
    <section className="technology-bands" aria-labelledby="technology-bands-title">
      <h2 className="technology-bands__accessible-title" id="technology-bands-title">
        Technology logos by category
      </h2>
      <header className="technology-bands__header">
        <div>
          <p className="technology-bands__eyebrow">
            <span>01</span><span aria-hidden="true">/</span><span>SYSTEM</span>
          </p>
        </div>
        <p className="technology-bands__intro">
          Languages, systems and networks behind the work.
        </p>
      </header>

      <div className="technology-bands__rows">
        {bands.map((band) => (
          <div
            className={`technology-band technology-band--${band.id} technology-band--${band.direction}`}
            key={band.id}
            style={{
              "--band-duration": `${band.duration}s`,
              "--band-mobile-duration": `${band.mobileDuration}s`,
            } as CSSProperties}
          >
            <div className="technology-band__label">
              <span className="technology-band__number">{band.number}</span>
              <span className="technology-band__slash" aria-hidden="true">/</span>
              <span className="technology-band__name">{band.label}</span>
            </div>
            <div className="technology-band__viewport" role="group" aria-label={`${band.label} technologies`}>
              <div className="technology-band__track">
                {[0, 1].map((copy) => (
                  <ul className="technology-band__sequence" aria-hidden={copy === 1} key={copy}>
                    {band.technologies.map((technology) => (
                      <li className="technology-band__item" key={`${copy}-${technology}`}>
                        <TechnologyLogo name={technology} />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

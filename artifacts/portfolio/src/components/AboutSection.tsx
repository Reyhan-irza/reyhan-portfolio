import { Code2, Palette, Zap, Wrench } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiPostgresql,
  SiFigma, SiGit, SiDocker,
} from "react-icons/si";
import { useScrollAnim } from "../hooks/useScrollAnim";

const skills = [
  {
    icon: Code2, label: "Frontend Development",
    desc: "Building modern, responsive user interfaces with clean code and great DX.",
    techs: [
      { Icon: SiReact,       name: "React",      color: "text-cyan-400"   },
      { Icon: SiNextdotjs,   name: "Next.js",    color: "text-white/70"   },
      { Icon: SiTypescript,  name: "TypeScript", color: "text-blue-400"   },
      { Icon: SiTailwindcss, name: "Tailwind",   color: "text-sky-400"    },
    ],
  },
  {
    icon: Zap, label: "Backend Development",
    desc: "Designing scalable server architectures and robust REST APIs.",
    techs: [
      { Icon: SiNodedotjs,  name: "Node.js",    color: "text-green-400"  },
      { Icon: SiExpress,    name: "Express",    color: "text-white/70"   },
      { Icon: SiPostgresql, name: "PostgreSQL", color: "text-sky-300"    },
    ],
  },
  {
    icon: Palette, label: "UI / UX Design",
    desc: "Crafting intuitive interfaces that balance aesthetics with usability.",
    techs: [
      { Icon: SiFigma, name: "Figma",        color: "text-pink-400"   },
      { Icon: SiReact, name: "Framer Motion", color: "text-violet-400" },
    ],
  },
  {
    icon: Wrench, label: "DevOps & Tooling",
    desc: "Streamlining development workflows and deployment pipelines.",
    techs: [
      { Icon: SiGit,    name: "Git",    color: "text-orange-400" },
      { Icon: SiDocker, name: "Docker", color: "text-blue-300"   },
    ],
  },
];

export default function AboutSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });

  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="fade-up text-center mb-16">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-4">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Who Am <span className="gradient-text">I?</span>
          </h2>
          <div className="rgb-divider w-20 mx-auto mb-6" />
          <p className="text-[#9CA3AF] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            A <span className="text-white font-medium">Full-Stack Developer</span> passionate about
            building innovative digital products. I thrive on technical challenges and always aim
            to write clean, efficient, and scalable code.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, i) => (
            <SkillCard key={skill.label} skill={skill} direction={i % 2 === 0 ? "left" : "right"} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({
  skill, direction, delay,
}: {
  skill: (typeof skills)[0];
  direction: "left" | "right";
  delay: number;
}) {
  const ref = useScrollAnim<HTMLDivElement>({ threshold: 0.2, delay });
  const Icon = skill.icon;

  return (
    <div
      ref={ref}
      className={`${direction === "left" ? "fade-left" : "fade-right"} group rounded-2xl p-5 flex flex-col gap-4 border border-white/7 hover:border-violet-500/20 transition-all duration-300 hover:-translate-y-1`}
      style={{ background: "#111827" }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-violet-500/15 bg-violet-500/8">
          <Icon className="w-4.5 h-4.5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm mb-1">{skill.label}</h3>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">{skill.desc}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {skill.techs.map(({ Icon: TechIcon, name, color }) => (
          <div
            key={name}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/7 bg-white/3 hover:border-white/15 transition-all duration-200 group/tech cursor-default"
          >
            <TechIcon className={`w-3.5 h-3.5 ${color} group-hover/tech:scale-110 transition-transform duration-200`} />
            <span className="text-white/50 text-[11px] font-medium group-hover/tech:text-white/75 transition-colors duration-200">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

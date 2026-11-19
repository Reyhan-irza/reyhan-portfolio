import { Linkedin } from "lucide-react";
import { contacts } from "../lib/socialLinks";

const socials = [
  ...contacts.filter(({ id }) => id !== "whatsapp"),
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/vierlykirk", icon: Linkedin },
];

export default function SocialDock() {
  return (
    <div className="hero-social-dock" role="group" aria-label="Media sosial"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        for (const slot of event.currentTarget.querySelectorAll<HTMLElement>(".social-dock-slot")) {
          const box = slot.getBoundingClientRect();
          const distance = Math.abs(event.clientX - box.left - box.width / 2);
          slot.style.setProperty("--dock-proximity", String(Math.max(0, 1 - distance / 82) ** 2));
        }
      }}
      onPointerLeave={(event) => {
        for (const slot of event.currentTarget.querySelectorAll<HTMLElement>(".social-dock-slot")) {
          slot.style.removeProperty("--dock-proximity");
        }
      }}>
      {socials.map(({ id, label, href, icon: Icon }) => (
        <span className="social-dock-slot" key={id}>
          <a href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer">
            <Icon aria-hidden="true" size={21} />
          </a>
        </span>
      ))}
    </div>
  );
}

export function WhatsAppShortcut() {
  const whatsapp = contacts.find(({ id }) => id === "whatsapp")!;
  const Icon = whatsapp.icon;
  return (
    <a className="portfolio-whatsapp" href={whatsapp.href} aria-label="Hubungi Reyhan di WhatsApp"
      target="_blank" rel="noopener noreferrer">
      <Icon aria-hidden="true" size={24} />
    </a>
  );
}

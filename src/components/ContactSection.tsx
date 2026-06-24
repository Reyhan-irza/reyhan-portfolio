import { SiWhatsapp, SiInstagram, SiTiktok, SiGmail } from "react-icons/si";
import { ArrowUpRight } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const contacts = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "ReyhanWhatsap",
    desc: "Drop me a message anytime",
    icon: SiWhatsapp,
    color: "text-emerald-400",
    borderHover: "hover:border-emerald-500/30",
    href: "https://wa.me/62881385242876",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@irzalvano_",
    desc: "See my daily updates",
    icon: SiInstagram,
    color: "text-pink-400",
    borderHover: "hover:border-pink-500/30",
    href: "https://www.instagram.com/irzalvano_?igsh=ZXRqM2lvY3EyY2Nj",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@rehanwatsav",
    desc: "Watch my short-form content",
    icon: SiTiktok,
    color: "text-sky-400",
    borderHover: "hover:border-sky-500/30",
    href: "https://www.tiktok.com/@rehanwatsav?_r=1&_t=ZS-95Kk0Lxdw5B",
  },
  {
    id: "email",
    label: "Email",
    handle: "irzanour@gmail.com",
    desc: "For professional inquiries",
    icon: SiGmail,
    color: "text-red-400",
    borderHover: "hover:border-red-500/30",
    href: "mailto:irzanour@gmail.com",
  },
];

export default function ContactSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-16">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-4">Get In Touch</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <div className="rgb-divider w-20 mx-auto mb-6" />
          <p className="text-[#9CA3AF] max-w-md mx-auto text-base leading-relaxed">
            Interested in collaborating? Reach out through any of the platforms below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contacts.map((c, i) => (
            <ContactCard key={c.id} contact={c} delay={i * 70} />
          ))}
        </div>

        {/* Availability badge */}
        <div className="mt-10 flex justify-center">
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-full border border-emerald-500/15"
            style={{ background: "rgba(16, 185, 129, 0.04)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-sm font-medium">
              Available for freelance &amp; collaboration
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ contact, delay }: { contact: (typeof contacts)[0]; delay: number }) {
  const ref = useScrollAnim<HTMLAnchorElement>({ threshold: 0.1, delay });
  const Icon = contact.icon;

  return (
    <a
      ref={ref}
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`fade-up flex items-center gap-4 p-5 rounded-2xl border border-white/7 ${contact.borderHover} hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-300 cursor-pointer group`}
      style={{ background: "#111827" }}
      data-testid={`link-contact-${contact.id}`}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/7 group-hover:scale-105 transition-transform duration-300"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        <Icon className={`w-5 h-5 ${contact.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white/35 text-[10px] font-medium uppercase tracking-wide mb-0.5">{contact.label}</p>
        <p className="text-white font-semibold text-sm truncate">{contact.handle}</p>
        <p className="text-[#9CA3AF] text-xs mt-0.5">{contact.desc}</p>
      </div>
      <ArrowUpRight className={`w-4 h-4 flex-shrink-0 ${contact.color} opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200`} />
    </a>
  );
}

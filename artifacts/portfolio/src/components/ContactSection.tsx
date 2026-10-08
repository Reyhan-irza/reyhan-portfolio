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
    color: "text-[#a43f2d]",
    borderHover: "hover:border-[#a43f2d]",
    href: "https://wa.me/62881385242876",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@irzalvano_",
    desc: "See what I’m working on",
    icon: SiInstagram,
    color: "text-[#a43f2d]",
    borderHover: "hover:border-[#a43f2d]",
    href: "https://www.instagram.com/irzalvano_?igsh=ZXRqM2lvY3EyY2Nj",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@rehanwatsav",
    desc: "Short videos and experiments",
    icon: SiTiktok,
    color: "text-[#a43f2d]",
    borderHover: "hover:border-[#a43f2d]",
    href: "https://www.tiktok.com/@rehanwatsav?_r=1&_t=ZS-95Kk0Lxdw5B",
  },
  {
    id: "email",
    label: "Email",
    handle: "irzanour@gmail.com",
    desc: "For professional inquiries",
    icon: SiGmail,
    color: "text-[#a43f2d]",
    borderHover: "hover:border-[#a43f2d]",
    href: "mailto:irzanour@gmail.com",
  },
];

export default function ContactSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-16">
           <p data-motion-item className="section-kicker mb-4">06 / Contact</p>
           <h2 data-motion-item className="text-3xl font-semibold tracking-[-.06em] text-[#211f1b] md:text-6xl">
             Let’s <span className="text-[#a43f2d]">talk.</span>
          </h2>
           <div data-motion-item className="rgb-divider mx-auto mb-6 w-20" />
           <p data-motion-item className="mx-auto max-w-md text-base leading-relaxed text-[#6d6a62]">
              For a project, a collaboration, or a question about something I built, you can reach me here.
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
             className="flex items-center gap-3 px-5 py-3 rounded-full border border-[rgba(33,31,27,.18)]"
             style={{ background: "rgba(164, 63, 45, 0.05)" }}
          >
             <span className="w-2 h-2 rounded-full bg-[#a43f2d] animate-pulse" />
             <span className="text-[#6d6a62] text-sm font-medium">
               Open to freelance work &amp; collaborations
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
       className={`fade-up flex items-center gap-4 p-5 rounded-2xl border border-[rgba(33,31,27,.16)] ${contact.borderHover} hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
      data-testid={`link-contact-${contact.id}`}
    >
       <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-[rgba(33,31,27,.16)] group-hover:scale-105 transition-transform duration-300"
         style={{ background: "rgba(33,31,27,0.04)" }}>
        <Icon className={`w-5 h-5 ${contact.color}`} />
      </div>
      <div className="min-w-0 flex-1">
         <p className="text-[#6d6a62] text-[10px] font-medium uppercase tracking-wide mb-0.5">{contact.label}</p>
         <p className="text-[#211f1b] font-semibold text-sm truncate">{contact.handle}</p>
         <p className="text-[#6d6a62] text-xs mt-0.5">{contact.desc}</p>
      </div>
      <ArrowUpRight className={`w-4 h-4 flex-shrink-0 ${contact.color} opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200`} />
    </a>
  );
}

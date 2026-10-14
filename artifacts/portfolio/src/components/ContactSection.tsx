import { ArrowUpRight } from "lucide-react";
import { SiGmail, SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import { useScrollAnim } from "../hooks/useScrollAnim";

const contacts = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "ReyhanWhatsap",
    icon: SiWhatsapp,
    href: "https://wa.me/62881385242876",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@irzalvano_",
    icon: SiInstagram,
    href: "https://www.instagram.com/irzalvano_?igsh=ZXRqM2lvY3EyY2Nj",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@rehanwatsav",
    icon: SiTiktok,
    href: "https://www.tiktok.com/@rehanwatsav?_r=1&_t=ZS-95Kk0Lxdw5B",
  },
  {
    id: "email",
    label: "Email",
    handle: "irzanour@gmail.com",
    icon: SiGmail,
    href: "mailto:irzanour@gmail.com",
  },
];

export default function ContactSection() {
  const headerRef = useScrollAnim({ threshold: 0.2 });

  return (
    <section id="contact" className="relative px-6 pb-10 pt-20 md:pb-14 md:pt-28">
      <div className="mx-auto max-w-5xl">
        <div ref={headerRef} className="fade-up mb-10 max-w-2xl">
          <p data-motion-item className="section-kicker mb-4">06 / Contact</p>
          <h2 data-motion-item className="text-4xl font-semibold tracking-[-.06em] text-white md:text-6xl">
            Let’s talk.
          </h2>
          <p data-motion-item className="mt-5 max-w-xl text-base leading-relaxed text-neutral-400">
            For a project, a collaboration, or a question about something I built, you can reach me here.
          </p>
        </div>

        <div
          role="status"
          className="mb-5 flex items-center gap-3 text-xs text-neutral-400"
          data-testid="availability-status"
        >
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Open to freelance work &amp; collaborations</span>
        </div>

        <ul aria-label="Contact links" className="border-t border-neutral-800/60">
          {contacts.map((contact, i) => (
            <ContactRow key={contact.id} contact={contact} delay={i * 70} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ContactRow({ contact, delay }: { contact: (typeof contacts)[0]; delay: number }) {
  const ref = useScrollAnim<HTMLAnchorElement>({ threshold: 0.1, delay });
  const Icon = contact.icon;

  return (
    <li className="border-b border-neutral-800/60">
      <a
        ref={ref}
        href={contact.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group fade-up grid min-h-20 grid-cols-[2.25rem_minmax(4.5rem,.75fr)_minmax(0,1.25fr)_1rem] items-center gap-3 py-6 transition-colors hover:text-white focus-visible:text-white sm:min-h-24 sm:grid-cols-[2.75rem_minmax(7rem,.75fr)_minmax(0,1.25fr)_1.25rem] sm:gap-5 sm:py-7"
        data-testid={`link-contact-${contact.id}`}
      >
        <Icon
          className="h-5 w-5 justify-self-start text-neutral-400 transition-colors group-hover:text-white sm:h-[1.35rem] sm:w-[1.35rem]"
          aria-hidden="true"
        />
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[.16em] text-neutral-500">
          {contact.label}
        </span>
        <span className="min-w-0 text-right">
          <span className="block truncate text-sm font-semibold text-neutral-100 sm:text-base">
            {contact.handle}
          </span>
        </span>
        <ArrowUpRight
          className="h-4 w-4 justify-self-end text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-200"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}

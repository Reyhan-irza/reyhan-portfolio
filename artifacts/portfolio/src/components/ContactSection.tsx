import { ArrowUpRight } from "lucide-react";
import { useScrollAnim } from "../hooks/useScrollAnim";

const contacts = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "ReyhanWhatsap",
    href: "https://wa.me/62881385242876",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@irzalvano_",
    href: "https://www.instagram.com/irzalvano_?igsh=ZXRqM2lvY3EyY2Nj",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@rehanwatsav",
    href: "https://www.tiktok.com/@rehanwatsav?_r=1&_t=ZS-95Kk0Lxdw5B",
  },
  {
    id: "email",
    label: "Email",
    handle: "irzanour@gmail.com",
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

  return (
    <li className="border-b border-neutral-800/60">
      <a
        ref={ref}
        href={contact.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group fade-up flex min-h-16 items-center justify-between gap-5 py-4 transition-colors hover:text-white focus-visible:text-white"
        data-testid={`link-contact-${contact.id}`}
      >
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[.16em] text-neutral-500">
          {contact.label}
        </span>
        <span className="flex min-w-0 items-center gap-3">
          <span className="truncate text-right text-sm font-semibold text-neutral-100 sm:text-base">
            {contact.handle}
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-200"
            aria-hidden="true"
          />
        </span>
      </a>
    </li>
  );
}

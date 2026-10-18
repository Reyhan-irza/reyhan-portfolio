import { ArrowUpRight } from "lucide-react";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
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
];

export default function ContactSection() {
  const headerRef = useScrollAnim({ threshold: 0.2, reversibleOnCompact: true });

  return (
    <section id="contact" className="contact-section relative px-4 py-20 sm:px-6 md:py-28">
      <div className="contact-layout mx-auto max-w-6xl">
        <header ref={headerRef} className="contact-intro fade-up">
          <p data-motion-item className="section-kicker contact-kicker mb-4">06 / Contact</p>
          <h2 data-motion-item className="contact-title text-4xl font-semibold tracking-[-.06em] text-white md:text-6xl">
            Let's talk.
          </h2>
          <p data-motion-item className="contact-description mt-5 max-w-xl text-base leading-relaxed text-neutral-400">
            Untuk proyek, kolaborasi, atau pertanyaan seputar karya saya, silakan hubungi saya.
          </p>
        </header>

        <div className="contact-actions">
          <ul aria-label="Contact links" className="contact-list">
            {contacts.map((contact, i) => (
              <ContactRow key={contact.id} contact={contact} delay={i * 70} />
            ))}
          </ul>
          <a
            className="contact-primary-cta"
            href="mailto:irzanour@gmail.com"
            data-testid="link-contact-email"
            aria-label="Send an email to Reyhan Irza Alvano"
          >
            <span className="contact-cta-copy">
              <span className="contact-cta-eyebrow">Ada proyek atau pertanyaan?</span>
              <span className="contact-cta-title">Send me an email</span>
            </span>
            <span className="contact-cta-arrow" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ contact, delay }: { contact: (typeof contacts)[0]; delay: number }) {
  const ref = useScrollAnim<HTMLAnchorElement>({ threshold: 0.1, delay, reversibleOnCompact: true });
  const Icon = contact.icon;

  return (
    <li className="contact-item">
      <a
        ref={ref}
        href={contact.href}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-link group fade-up"
        data-testid={`link-contact-${contact.id}`}
      >
        <span className="contact-icon">
          <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
        </span>
        <span className="contact-label">
          {contact.label}
        </span>
        <span className="contact-handle">
          {contact.handle}
        </span>
        <span className="contact-arrow">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </a>
    </li>
  );
}

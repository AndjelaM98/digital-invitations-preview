import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import "./ContactsLounge.css";

type FormStatus = "idle" | "sending" | "success" | "error";

const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1];

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6L16 12h-3v-2c0-.6.4-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.5 4c.4 2.4 1.9 4 4.5 4.3v2.6c-1.6 0-3-.5-4.2-1.3v5.5c0 3.3-2.6 5.9-5.9 5.9S3 18.4 3 15.1s2.6-5.9 5.9-5.9c.3 0 .7 0 1 .1v2.8c-.3-.1-.6-.2-1-.2-1.7 0-3.1 1.4-3.1 3.1S7.2 18 8.9 18s3.1-1.4 3.1-3.1V4h2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7.5 12 13l8-5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: <IconInstagram />,
  },
  {
    label: "Facebook",
    href: "https://www.instagram.com",
    icon: <IconFacebook />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@klikdovencanja",
    icon: <IconTikTok />,
  },
  {
    label: "Email",
    href: "mailto:dovencanjaklik@gmail.com",
    icon: <IconEmail />,
  },
];

function ContactsLounge() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/xwvgrvvw", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Slanje poruke nije uspelo.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const initial = reduceMotion ? false : { opacity: 0, y: 18 };

  return (
    <section
      className="contacts-lounge"
      id="contacts-lounge"
      aria-labelledby="contacts-lounge-title"
    >
      <div className="contacts-lounge__inner">
        <motion.div
          className="contacts-lounge__rail"
          aria-hidden="true"
          initial={initial}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: easePremium }}
        >
          <span>K</span>
          <span>O</span>
          <span>N</span>
          <span>T</span>
          <span>A</span>
          <span>K</span>
          <span>T</span>
        </motion.div>

        <div className="contacts-lounge__main">
          <motion.header
            className="contacts-lounge__header"
            initial={initial}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: easePremium }}
          >
            <p className="contacts-lounge__eyebrow">Alternativa C</p>
            <h2 id="contacts-lounge-title">
              Otvorena vrata
              <em> vašeg ateljea</em>
            </h2>
            <p className="contacts-lounge__lede">
              Pišite nam kad ste spremni, tu smo da usmerimo prvi korak ka
              vašoj digitalnoj pozivnici.
            </p>
          </motion.header>

          <motion.div
            className="contacts-lounge__desk"
            initial={initial}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: easePremium, delay: 0.06 }}
          >
            <form className="contacts-lounge__form" onSubmit={handleSubmit}>
              <div className="contacts-lounge__row">
                <label className="contacts-lounge__chip">
                  <span>Ime</span>
                  <input
                    name="ime"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="Ana"
                  />
                </label>
                <label className="contacts-lounge__chip">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="ana@email.com"
                  />
                </label>
              </div>

              <label className="contacts-lounge__chip contacts-lounge__chip--wide">
                <span>Poruka</span>
                <textarea
                  name="poruka"
                  rows={4}
                  required
                  placeholder="Recite nam šta planirate…"
                />
              </label>

              <input
                type="hidden"
                name="_subject"
                value="Nova poruka sa sajta Klik do venčanja"
              />

              <button
                type="submit"
                className="contacts-lounge__submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Šaljem…" : "Pošalji"}
              </button>

              <div className="contacts-lounge__status" aria-live="polite">
                {status === "success" ? (
                  <p className="is-success">Poruka je poslata. Hvala!</p>
                ) : null}
                {status === "error" ? (
                  <p className="is-error">
                    Greška pri slanju. Pokušajte ponovo.
                  </p>
                ) : null}
              </div>
            </form>

            <div className="contacts-lounge__orbit" aria-label="Društvene mreže">
              <p className="contacts-lounge__orbit-label">Pratite nas</p>
              <ul className="contacts-lounge__orbit-list">
                {socials.map((item) => (
                  <li key={item.label}>
                    <a
                      className="contacts-lounge__orb"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactsLounge;

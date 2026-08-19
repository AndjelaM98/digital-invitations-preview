import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Olives from "../../assets/icons/olives.png";
import "./ContactsAtelier.css";

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

const channels: {
  label: string;
  href: string;
  handle: string;
  icon: ReactNode;
}[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    handle: "@klikdovencanja",
    icon: <IconInstagram />,
  },
  {
    label: "Facebook",
    href: "https://www.instagram.com",
    handle: "@klikdovencanja",
    icon: <IconFacebook />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@klikdovencanja",
    handle: "@klikdovencanja",
    icon: <IconTikTok />,
  },
  {
    label: "Email",
    href: "mailto:dovencanjaklik@gmail.com",
    handle: "dovencanjaklik@gmail.com",
    icon: <IconEmail />,
  },
];

function ContactsAtelier() {
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

  const initial = reduceMotion ? false : { opacity: 0, y: 22 };

  return (
    <section
      className="contacts-atelier"
      id="contacts-atelier"
      aria-labelledby="contacts-atelier-title"
    >
      <div className="contacts-atelier__wash" aria-hidden="true" />
      <img
        src={Olives}
        alt=""
        className="contacts-atelier__olives"
        aria-hidden="true"
      />

      <div className="contacts-atelier__inner">
        <motion.header
          className="contacts-atelier__intro"
          initial={initial}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: easePremium }}
        >
          <h2 className="contacts-atelier__title" id="contacts-atelier-title">
            Hajde da
            <em> počnemo razgovor</em>
          </h2>
          <p className="contacts-atelier__lede">
            Jedna poruka je dovoljna. Odgovaramo lično, u ritmu vaše pripreme.
          </p>
        </motion.header>

        <div className="contacts-atelier__stage">
          <motion.form
            className="contacts-atelier__letter"
            onSubmit={handleSubmit}
            initial={initial}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: easePremium, delay: 0.08 }}
          >
            <label className="contacts-atelier__field">
              <span>Ime</span>
              <input
                name="ime"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Vaše ime"
              />
            </label>

            <label className="contacts-atelier__field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="vas@email.com"
              />
            </label>

            <label className="contacts-atelier__field contacts-atelier__field--tall">
              <span>Poruka</span>
              <textarea
                name="poruka"
                rows={5}
                required
                placeholder="Kako možemo da pomognemo?"
              />
            </label>

            <input
              type="hidden"
              name="_subject"
              value="Nova poruka sa sajta Klik do venčanja"
            />

            <div className="contacts-atelier__actions">
              <button
                type="submit"
                className="contacts-atelier__send"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Šaljem…" : "Pošalji poruku"}
              </button>
              <p className="contacts-atelier__promise">
                Odgovaramo u roku od jednog radnog dana.
              </p>
            </div>

            <div className="contacts-atelier__status" aria-live="polite">
              {status === "success" ? (
                <p className="is-success">Hvala, vaša poruka je stigla.</p>
              ) : null}
              {status === "error" ? (
                <p className="is-error">
                  Došlo je do greške. Pokušajte ponovo malo kasnije.
                </p>
              ) : null}
            </div>
          </motion.form>

          <motion.aside
            className="contacts-atelier__salon"
            aria-label="Kanali"
            initial={initial}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: easePremium, delay: 0.16 }}
          >
            <p className="contacts-atelier__salon-label">Ili nas pronađite</p>
            <ul className="contacts-atelier__channels">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    className="contacts-atelier__channel"
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={channel.label}
                  >
                    <span className="contacts-atelier__channel-icon">
                      {channel.icon}
                    </span>
                    <span className="contacts-atelier__channel-handle">
                      {channel.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="contacts-atelier__closing">
              Klik do venčanja
              <em>, digitalni atelier</em>
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

export default ContactsAtelier;

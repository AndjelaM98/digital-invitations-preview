import { useState, type FormEvent } from "react";

import ScrollReveal from "../shared/ScrollReveal";
import type { InvitationContent } from "../shared/types";
import { doodles } from "./doodles";

const RSVP_FORMSPREE = "https://formspree.io/f/xwvgrvvw";

type LetoRsvpProps = {
  content: InvitationContent;
};

function LetoRsvp({ content }: LetoRsvpProps) {
  const rsvp = content.rsvp;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  if (!rsvp) return null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set(
      "_subject",
      `RSVP: ${content.couple.partnerOne} ${content.couple.joiner ?? "&"} ${content.couple.partnerTwo}`,
    );
    data.set("pozivnica", "Leto ljubavi");

    setStatus("sending");
    try {
      const response = await fetch(RSVP_FORMSPREE, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("RSVP failed");
      form.reset();
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  return (
    <ScrollReveal className="ll__block ll-rsvp" as="section" amount={0.2}>
      <doodles.Heart className="ll__heart" />
      <h2 className="ll__serif ll-rsvp__title">{rsvp.title}</h2>
      <p className="ll__script ll-rsvp__intro">{rsvp.deadlineLabel}</p>

      {status === "ok" ? (
        <p className="ll__script ll-rsvp__thanks">Hvala, primili smo potvrdu!</p>
      ) : (
        <form className="ll-rsvp__form" onSubmit={onSubmit}>
          <label className="ll-rsvp__line">
            <span className="ll-rsvp__label">Ime i prezime</span>
            <input
              className="ll-rsvp__input"
              name="ime"
              type="text"
              required
              autoComplete="name"
            />
          </label>

          <label className="ll-rsvp__line">
            <span className="ll-rsvp__label">Email</span>
            <input
              className="ll-rsvp__input"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label className="ll-rsvp__line ll-rsvp__line--short">
            <span className="ll-rsvp__label">Broj gostiju</span>
            <input
              className="ll-rsvp__input"
              name="gosti"
              type="number"
              min={1}
              max={20}
              defaultValue={1}
              required
            />
          </label>

          <fieldset className="ll-rsvp__attend">
            <legend className="ll-rsvp__label">Dolazite li?</legend>
            <label className="ll-rsvp__tick">
              <input
                type="radio"
                name="dolazak"
                value="Da"
                defaultChecked
                required
              />
              <span className="ll-rsvp__tick-box" aria-hidden="true" />
              <span>Da</span>
            </label>
            <label className="ll-rsvp__tick">
              <input type="radio" name="dolazak" value="Ne" />
              <span className="ll-rsvp__tick-box" aria-hidden="true" />
              <span>Ne</span>
            </label>
          </fieldset>

          <label className="ll-rsvp__line">
            <span className="ll-rsvp__label">Poruka (opciono)</span>
            <textarea className="ll-rsvp__input" name="poruka" rows={2} />
          </label>

          <button
            type="submit"
            className="ll-btn ll-rsvp__submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Šaljem…" : rsvp.ctaLabel}
          </button>

          {status === "error" ? (
            <p className="ll-rsvp__error">Nešto nije uspelo. Pokušajte ponovo.</p>
          ) : null}
        </form>
      )}
    </ScrollReveal>
  );
}

export default LetoRsvp;

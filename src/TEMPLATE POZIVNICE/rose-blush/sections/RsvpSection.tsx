import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { blushArt } from "../art";
import LineArt from "../components/LineArt";

type RsvpSectionProps = {
  content: InvitationContent;
};

type Attendance = "yes" | "no" | "";

function RsvpSection({ content }: RsvpSectionProps) {
  const { rsvp } = content;
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("");
  const [plusGuests, setPlusGuests] = useState(0);
  const [status, setStatus] = useState<"idle" | "open" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!rsvp) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!guestName.trim()) {
      setError("Unesite ime i prezime.");
      return;
    }
    if (!attendance) {
      setError("Izaberite da li dolazite.");
      return;
    }
    setError(null);
    setStatus("done");
  };

  return (
    <ScrollReveal as="section" className="qb-section" variants={revealFade} amount={0.08} once>
      <article className="qb-card qb-card--detail" data-section="rsvp">
        <h3 className="qb-script qb-script--card">{rsvp.title}</h3>
        <LineArt src={blushArt.envelopeTulips} className="qb-detail-icon qb-detail-icon--lg" />
        <p className="qb-rsvp-note">{rsvp.deadlineLabel}</p>

        {status === "idle" ? (
          <motion.button
            type="button"
            className="qb-btn"
            onClick={() => setStatus("open")}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: invitationEase }}
          >
            {rsvp.ctaLabel}
          </motion.button>
        ) : null}

        {status === "open" ? (
          <form className="qb-rsvp-form" onSubmit={handleSubmit} noValidate>
            <label>
              Ime i prezime
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                autoComplete="name"
              />
            </label>
            <fieldset>
              <legend>Da li dolazite?</legend>
              <label>
                <input
                  type="radio"
                  name="qb-attendance"
                  checked={attendance === "yes"}
                  onChange={() => setAttendance("yes")}
                />
                Da
              </label>
              <label>
                <input
                  type="radio"
                  name="qb-attendance"
                  checked={attendance === "no"}
                  onChange={() => {
                    setAttendance("no");
                    setPlusGuests(0);
                  }}
                />
                Ne
              </label>
            </fieldset>
            {attendance === "yes" ? (
              <label>
                Plus 1 ili više (dodatni gosti)
                <input
                  type="number"
                  min={0}
                  max={10}
                  inputMode="numeric"
                  value={plusGuests}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setPlusGuests(Number.isNaN(next) ? 0 : Math.max(0, Math.min(10, next)));
                  }}
                />
              </label>
            ) : null}
            {error ? <p className="qb-rsvp-error">{error}</p> : null}
            <button type="submit" className="qb-btn">
              {rsvp.ctaLabel}
            </button>
          </form>
        ) : null}

        {status === "done" ? (
          <p className="qb-rsvp-thanks">Hvala — vaš odgovor je zabeležen.</p>
        ) : null}
      </article>
    </ScrollReveal>
  );
}

export default RsvpSection;

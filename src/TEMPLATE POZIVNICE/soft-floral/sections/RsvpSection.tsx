import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import SectionScrollShadow from "../components/SectionScrollShadow";

type RsvpSectionProps = {
  content: InvitationContent;
};

type Attendance = "yes" | "no" | "";

function RsvpSection({ content }: RsvpSectionProps) {
  const { rsvp } = content;
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("");
  const [partySize, setPartySize] = useState(1);
  const [companions, setCompanions] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");
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
    <ScrollReveal as="section" className="sf-section" variants={revealFade}>
      <article className="sf-rsvp" data-section="rsvp" aria-label="Potvrda dolaska">
        <SectionScrollShadow>
          <motion.div
            className="sf-card sf-card--bordered sf-card--rsvp"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease: invitationEase }}
          >
            <h2 className="sf-heading sf-heading--large">{rsvp.title}</h2>
            <p className="sf-rsvp__deadline">{rsvp.deadlineLabel}</p>

            {status === "done" ? (
              <div className="sf-rsvp-form sf-rsvp-form--done">
                <p className="sf-rsvp-form__thanks">
                  Hvala — vaš odgovor je zabeležen.
                </p>
                <button
                  type="button"
                  className="sf-rsvp-form__again"
                  onClick={() => {
                    setStatus("idle");
                    setGuestName("");
                    setAttendance("");
                    setPartySize(1);
                    setCompanions("");
                  }}
                >
                  Pošalji još jedan odgovor
                </button>
              </div>
            ) : (
              <form className="sf-rsvp-form" onSubmit={handleSubmit} noValidate>
                <label className="sf-rsvp-form__field">
                  <span>Ime i prezime</span>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder="Vaše ime"
                    autoComplete="name"
                  />
                </label>

                <fieldset className="sf-rsvp-form__attendance">
                  <legend>Da li dolazite?</legend>
                  <label>
                    <input
                      type="radio"
                      name="sf-attendance"
                      checked={attendance === "yes"}
                      onChange={() => setAttendance("yes")}
                    />
                    Da
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sf-attendance"
                      checked={attendance === "no"}
                      onChange={() => {
                        setAttendance("no");
                        setPartySize(1);
                        setCompanions("");
                      }}
                    />
                    Ne
                  </label>
                </fieldset>

                {attendance === "yes" ? (
                  <>
                    <label className="sf-rsvp-form__field">
                      <span>Koliko vas dolazi?</span>
                      <select
                        value={partySize}
                        onChange={(event) =>
                          setPartySize(Number(event.target.value))
                        }
                      >
                        {Array.from({ length: 8 }, (_, index) => index + 1).map(
                          (size) => (
                            <option key={size} value={size}>
                              {size === 1
                                ? "Samo ja"
                                : `+${size - 1} (ukupno ${size})`}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    {partySize > 1 ? (
                      <label className="sf-rsvp-form__field">
                        <span>Ko dolazi sa vama?</span>
                        <input
                          type="text"
                          value={companions}
                          onChange={(event) => setCompanions(event.target.value)}
                          placeholder="Imena pratnje"
                        />
                      </label>
                    ) : null}
                  </>
                ) : null}

                {error ? <p className="sf-rsvp-form__error">{error}</p> : null}

                <button type="submit" className="sf-rsvp-form__submit">
                  {rsvp.ctaLabel}
                </button>
              </form>
            )}
          </motion.div>
        </SectionScrollShadow>
      </article>
    </ScrollReveal>
  );
}

export default RsvpSection;

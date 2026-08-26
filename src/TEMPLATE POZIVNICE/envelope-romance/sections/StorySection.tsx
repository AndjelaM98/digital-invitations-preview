import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { invitationEase } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import ErReveal from "../ErReveal";

type StorySectionProps = {
  content: InvitationContent;
  /** Wait until the opener dismisses before revealing the date stack. */
  inviteReady?: boolean;
};

function parseEventParts(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { day: "12", month: "09", year: "2026" };
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear());
  return { day, month, year };
}

function StorySection({ content, inviteReady = true }: StorySectionProps) {
  const reduceMotion = useReducedMotion();
  const dateAnchorRef = useRef<HTMLDivElement>(null);
  const dateInView = useInView(dateAnchorRef, {
    amount: 0.3,
    once: true,
    margin: "0px 0px -8% 0px",
  });
  const [dateRevealed, setDateRevealed] = useState(false);
  const { day, month, year } = parseEventParts(content.eventDateIso);
  const parts = [
    { value: day, delay: 0.1 },
    { value: month, delay: 0.28 },
    { value: year, delay: 0.46 },
  ];
  const inviteText =
    content.quote ??
    "Sa velikom radošću vas pozivamo da budete deo našeg najlepšeg dana i proslavite sa nama trenutak kada naše dve priče postaju jedna.";

  useEffect(() => {
    if (dateRevealed) return;
    if (reduceMotion || (inviteReady && dateInView)) {
      setDateRevealed(true);
    }
  }, [dateInView, dateRevealed, inviteReady, reduceMotion]);

  return (
    <section className="er-story" data-section="story" aria-label="Poziv">
      <div className="er-story__paper">
        <div className="er-story__inner">
          <ErReveal kind="float">
            <p className="er-story__invite">{inviteText}</p>
          </ErReveal>

          <div ref={dateAnchorRef} className="er-story__date-anchor">
            <time
              className="er-story__date"
              dateTime={content.eventDateIso}
              aria-label={content.eventDateLabel}
            >
              {parts.map((part, index) => (
                <motion.span
                  key={`${part.value}-${index}`}
                  className="er-story__date-num"
                  initial={false}
                  animate={
                    dateRevealed
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 28, scale: 0.96 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.95,
                    delay: reduceMotion || !dateRevealed ? 0 : part.delay,
                    ease: invitationEase,
                  }}
                >
                  {part.value}
                </motion.span>
              ))}
            </time>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StorySection;

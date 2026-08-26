import { motion, useReducedMotion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import SectionScrollShadow from "../components/SectionScrollShadow";

type MainEventSectionProps = {
  content: InvitationContent;
};

function MainEventSection({ content }: MainEventSectionProps) {
  const { venue, eventDateLabel } = content;
  const reduceMotion = useReducedMotion();

  return (
    <ScrollReveal as="section" className="sf-section" variants={revealFade}>
      <SectionScrollShadow>
        <motion.article
          className="sf-card sf-card--soft sf-card--event"
          data-section="main-event"
          aria-label="Kada i gde"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: invitationEase }}
        >
          <h2 className="sf-heading sf-heading--event">Kada i gde</h2>
          <span className="sf-ornament" aria-hidden="true">
            <span className="sf-ornament__line" />
            <span className="sf-ornament__diamond" />
            <span className="sf-ornament__line" />
          </span>

          <div className="sf-event__meta">
            <p className="sf-event__date">{eventDateLabel}</p>
            {venue ? (
              <>
                <p className="sf-event__time">{venue.timeLabel}</p>
                <p className="sf-event__place">{venue.placeName}</p>
                {venue.address ? (
                  <p className="sf-event__address">{venue.address}</p>
                ) : null}
              </>
            ) : null}
          </div>
        </motion.article>
      </SectionScrollShadow>
    </ScrollReveal>
  );
}

export default MainEventSection;

import { motion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealScale } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import SectionScrollShadow from "../components/SectionScrollShadow";
type MainEventSectionProps = {
  content: InvitationContent;
};

function MainEventSection({ content }: MainEventSectionProps) {
  const { venue, eventDateLabel } = content;

  return (
    <ScrollReveal
      as="section"
      className="sf-section"
      variants={revealScale}
    >
      <SectionScrollShadow>
      <motion.article
        className="sf-card sf-card--bordered"
        data-section="main-event"
        aria-label="Glavni događaj"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3, ease: invitationEase }}
      >
        <motion.h2
          className="sf-heading"
          initial={{ opacity: 0, letterSpacing: "0.32em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.18em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: invitationEase }}
        >
          Glavni događaj
        </motion.h2>
        <div className="sf-main-event__body">
          <p className="sf-main-event__line">{eventDateLabel}</p>
          {venue && (
            <>
              <p className="sf-main-event__line">{venue.timeLabel}</p>
              <p className="sf-main-event__line sf-main-event__line--venue">
                {venue.placeName}
              </p>
              {venue.address && (
                <p className="sf-main-event__line">{venue.address}</p>
              )}
            </>
          )}
        </div>
      </motion.article>
      </SectionScrollShadow>
    </ScrollReveal>
  );
}

export default MainEventSection;

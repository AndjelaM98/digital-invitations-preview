import { motion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { blushArt } from "../art";
import CardOrnaments from "../components/CardOrnaments";
import LineArt from "../components/LineArt";

type ReceptionSectionProps = {
  content: InvitationContent;
};

function ReceptionSection({ content }: ReceptionSectionProps) {
  const { venue } = content;
  if (!venue) return null;

  return (
    <ScrollReveal as="section" className="qb-section" variants={revealFade} amount={0.08} once>
      <h2 className="qb-gold-title">Detalji</h2>
      <article className="qb-card qb-card--detail" data-section="reception">
        <CardOrnaments set="reception" />
        <h3 className="qb-script qb-script--card">{venue.title}</h3>
        <LineArt src={blushArt.cocktails} className="qb-detail-icon qb-detail-icon--lg" />
        <p className="qb-detail-time">{venue.timeLabel}</p>
        <p className="qb-detail-place">{venue.placeName}</p>
        {venue.mapUrl ? (
          <motion.a
            className="qb-btn"
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: invitationEase }}
          >
            {venue.mapCtaLabel ?? "Pogledaj lokaciju"}
          </motion.a>
        ) : null}
      </article>
    </ScrollReveal>
  );
}

export default ReceptionSection;

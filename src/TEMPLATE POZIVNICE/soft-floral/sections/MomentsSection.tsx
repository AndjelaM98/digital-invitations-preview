import { motion, useReducedMotion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { softFloralMoments } from "../content";
import momentPhoto1 from "../assets/moments/photo-1.jpg";

type MomentsSectionProps = {
  content: InvitationContent;
};

function MomentsSection({ content }: MomentsSectionProps) {
  const { couple } = content;
  const reduceMotion = useReducedMotion();
  const joiner = couple.joiner ?? "i";

  return (
    <ScrollReveal as="section" className="sf-section" variants={revealFade}>
      <motion.article
        className="sf-moments-float"
        data-section="moments"
        aria-label="Naša priča"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: invitationEase }}
      >
        <figure className="sf-moments-float__photo">
          <img
            src={momentPhoto1}
            alt=""
            draggable={false}
            style={{ objectPosition: softFloralMoments.frames[0].position }}
          />
        </figure>

        <p className="sf-moments-float__quote">{softFloralMoments.quote}</p>
        <p className="sf-moments-float__names">
          {couple.partnerOne} {joiner} {couple.partnerTwo}
        </p>
      </motion.article>
    </ScrollReveal>
  );
}

export default MomentsSection;

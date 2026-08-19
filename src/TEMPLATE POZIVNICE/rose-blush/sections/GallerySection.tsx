import { motion, useReducedMotion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFromRight, revealUp } from "../../shared/motion";
import { useIsDesktopInvitation } from "../../shared/useIsDesktopInvitation";
import type { InvitationContent } from "../../shared/types";
import { invitationBreakpoints } from "../../shared/viewport";
import CardOrnaments from "../components/CardOrnaments";
import { blushPhotos } from "../content";

type GallerySectionProps = {
  content: InvitationContent;
};

function GallerySection({ content }: GallerySectionProps) {
  const isDesktop = useIsDesktopInvitation(invitationBreakpoints.md);
  const reduceMotion = useReducedMotion();

  return (
    <ScrollReveal
      as="section"
      className="qb-section qb-section--gallery"
      variants={isDesktop ? revealFromRight : revealUp}
      amount={isDesktop ? 0.08 : 0.18}
      once
    >
      <div className="qb-gallery" data-section="gallery">
        <div className="qb-polaroids">
          {blushPhotos.map((src, index) => (
            <motion.figure
              key={src}
              className={`qb-polaroid qb-polaroid--${index + 1}`}
              initial={
                reduceMotion
                  ? false
                  : isDesktop
                    ? { opacity: 0, y: -86, scale: 1.08 }
                    : { opacity: 0, y: 28, scale: 0.96 }
              }
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: isDesktop ? 0.25 : 0.12 }}
              transition={
                isDesktop
                  ? {
                      type: "spring",
                      stiffness: 118,
                      damping: 13,
                      delay: 0.12 + index * 0.18,
                    }
                  : {
                      duration: 0.85,
                      delay: index * 0.12,
                      ease: invitationEase,
                    }
              }
            >
              <img src={src} alt="" draggable={false} loading="eager" />
            </motion.figure>
          ))}
        </div>

        <article className="qb-card qb-card--quote">
          <CardOrnaments set="quote" />
          <span className="qb-quote-mark" aria-hidden="true">
            “
          </span>
          <p className="qb-quote-text">{content.quote}</p>
          <span className="qb-quote-rule" aria-hidden="true" />
        </article>
      </div>
    </ScrollReveal>
  );
}

export default GallerySection;

import { motion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { revealFromRight } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import CardOrnaments from "../components/CardOrnaments";
import { blushPhotos } from "../content";

type GallerySectionProps = {
  content: InvitationContent;
};

function GallerySection({ content }: GallerySectionProps) {
  return (
    <ScrollReveal
      as="section"
      className="qb-section"
      variants={revealFromRight}
      amount={0.08}
      once
    >
      <div className="qb-gallery" data-section="gallery">
        <div className="qb-polaroids">
          {blushPhotos.map((src, index) => (
            <motion.figure
              key={src}
              className={`qb-polaroid qb-polaroid--${index + 1}`}
              initial={{ opacity: 0, y: -86, scale: 1.08 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                type: "spring",
                stiffness: 118,
                damping: 13,
                delay: 0.12 + index * 0.18,
              }}
            >
              <img src={src} alt="" draggable={false} />
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

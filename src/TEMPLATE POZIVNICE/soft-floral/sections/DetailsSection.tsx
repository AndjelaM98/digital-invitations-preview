import { motion, useReducedMotion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { softFloralDetails } from "../content";
import SectionScrollShadow from "../components/SectionScrollShadow";

type DetailsSectionProps = {
  content: InvitationContent;
};

const blocks = [
  { key: "dressCode", subheading: "Dress code" },
  { key: "children", subheading: "Deca" },
  { key: "directions", subheading: "Uputstva" },
  { key: "publicTransport", subheading: "Javni prevoz" },
] as const;

function DetailsSection({ content }: DetailsSectionProps) {
  const { dressCode } = content;
  const reduceMotion = useReducedMotion();

  const blockContent: Record<string, string | undefined> = {
    dressCode: dressCode
      ? [dressCode.label, dressCode.note].filter(Boolean).join(" ")
      : undefined,
    children: softFloralDetails.children,
    directions: softFloralDetails.directions,
    publicTransport: softFloralDetails.publicTransport,
  };

  const visibleBlocks = blocks.filter((block) => blockContent[block.key]);

  return (
    <ScrollReveal as="section" className="sf-section" variants={revealFade}>
      <SectionScrollShadow>
        <motion.article
          className="sf-card sf-card--bordered sf-card--details"
          data-section="details"
          aria-label="Ostali detalji"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: invitationEase }}
        >
          <h2 className="sf-heading sf-heading--details">Ostali detalji</h2>
          <span className="sf-ornament" aria-hidden="true">
            <span className="sf-ornament__line" />
            <span className="sf-ornament__diamond" />
            <span className="sf-ornament__line" />
          </span>

          <div className="sf-details">
            {visibleBlocks.map((block, index) => {
              const text = blockContent[block.key];
              if (!text) return null;

              return (
                <motion.div
                  key={block.key}
                  className="sf-details__block"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.7,
                    ease: invitationEase,
                    delay: reduceMotion ? 0 : index * 0.07,
                  }}
                >
                  <h3 className="sf-details__subheading">{block.subheading}</h3>
                  <p className="sf-details__text">{text}</p>
                  {index < visibleBlocks.length - 1 ? (
                    <span className="sf-details__divider" aria-hidden="true">
                      ◆
                    </span>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </motion.article>
      </SectionScrollShadow>
    </ScrollReveal>
  );
}

export default DetailsSection;

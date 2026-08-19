import { motion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, revealScale } from "../../shared/motion";
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

  const blockContent: Record<string, string | undefined> = {
    dressCode: dressCode
      ? [dressCode.label, dressCode.note].filter(Boolean).join(" ")
      : undefined,
    children: softFloralDetails.children,
    directions: softFloralDetails.directions,
    publicTransport: softFloralDetails.publicTransport,
  };

  return (
    <ScrollReveal as="section" className="sf-section" variants={revealScale}>
      <SectionScrollShadow>
      <article
        className="sf-card sf-card--bordered sf-card--details"
        data-section="details"
        aria-label="Ostali detalji"
      >        <h2 className="sf-heading">Ostali detalji</h2>

        {blocks.map((block, index) => {
          const text = blockContent[block.key];
          if (!text) return null;

          return (
            <motion.div
              key={block.key}
              className="sf-details__block"
              initial={{ opacity: 0, x: index % 2 === 0 ? -12 : 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.75,
                ease: invitationEase,
                delay: index * 0.08,
              }}
            >
              <h3 className="sf-details__subheading">{block.subheading}</h3>
              <p className="sf-details__text">{text}</p>
            </motion.div>
          );
        })}
      </article>
      </SectionScrollShadow>
    </ScrollReveal>  );
}

export default DetailsSection;

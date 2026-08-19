import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { invitationEase } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import SectionScrollShadow from "../components/SectionScrollShadow";
import heroFloralImage from "../assets/hero-floral.png";
type ClosingSectionProps = {
  content: InvitationContent;
};

function ClosingSection({ content }: ClosingSectionProps) {
  const { couple, closingMessage, closingImage } = content;
  const joiner = couple.joiner ?? "&";
  const imageSrc = closingImage?.src ?? heroFloralImage;
  const imageAlt =
    closingImage?.alt ?? `${couple.partnerOne} i ${couple.partnerTwo}`;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.98]);
  const imageY = useTransform(scrollYProgress, [0, 1], [20, -10]);

  return (
    <footer className="sf-closing" data-section="closing" ref={ref}>
      <SectionScrollShadow>
      <motion.div
        className="sf-closing__image-wrap"
        style={{ scale: imageScale, y: imageY }}        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.1, ease: invitationEase }}
      >
        <motion.img
          className="sf-closing__image"
          src={imageSrc}
          alt={imageAlt}
          draggable={false}
          initial={{ filter: "blur(6px)" }}
          whileInView={{ filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: invitationEase }}
        />
      </motion.div>
      </SectionScrollShadow>

      <motion.div        className="sf-closing__footer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: invitationEase, delay: 0.1 }}
      >
        <motion.p
          className="sf-closing__message"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {closingMessage ?? "Radujemo se što ćemo proslavu provesti sa vama"}
        </motion.p>
        <motion.p
          className="sf-closing__names"
          initial={{ opacity: 0, letterSpacing: "0.32em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          {couple.partnerOne} {joiner} {couple.partnerTwo}
        </motion.p>
      </motion.div>
    </footer>
  );
}

export default ClosingSection;

import { motion, useReducedMotion } from "framer-motion";

import { invitationEase } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import SectionScrollShadow from "../components/SectionScrollShadow";
import heroFloralImage from "../assets/hero-floral.png";
import { useCountdown } from "../useCountdown";

type HeroSectionProps = {
  content: InvitationContent;
};

const nameVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      ease: invitationEase,
      delay: 1.05 + i * 0.16,
    },
  }),
};

function HeroSection({ content }: HeroSectionProps) {
  const { couple, heroImage, eventDateIso } = content;
  const joiner = couple.joiner ?? "i";
  const photoSrc = heroImage?.src ?? heroFloralImage;
  const photoAlt =
    heroImage?.alt ?? `${couple.partnerOne} i ${couple.partnerTwo}`;
  const { days, hours, minutes, seconds, done } = useCountdown(eventDateIso);
  const reduceMotion = useReducedMotion();

  const units = [
    { label: "dana", value: days },
    { label: "sati", value: hours },
    { label: "min", value: minutes },
    { label: "sek", value: seconds },
  ];

  return (
    <section className="sf-hero" data-section="hero" aria-label="Naslovnica">
      <SectionScrollShadow>
        <motion.div
          className="sf-hero__frame"
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 1.08, filter: "blur(14px)" }
          }
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.1, ease: invitationEase, delay: 0.15 }}
        >
        <motion.img
          className="sf-hero__image"
          src={photoSrc}
          alt={photoAlt}
          draggable={false}
          initial={reduceMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: invitationEase }}
        />
        <div className="sf-hero__overlay" aria-hidden="true" />

        <div className="sf-hero__content">
          <motion.span
            className="sf-hero__name"
            custom={0}
            variants={nameVariants}
            initial="hidden"
            animate="visible"
          >
            {couple.partnerOne}
          </motion.span>

          <motion.span
            className="sf-hero__joiner"
            custom={1}
            variants={nameVariants}
            initial="hidden"
            animate="visible"
          >
            {joiner}
          </motion.span>

          <motion.span
            className="sf-hero__name"
            custom={2}
            variants={nameVariants}
            initial="hidden"
            animate="visible"
          >
            {couple.partnerTwo}
          </motion.span>

          <motion.div
            className="sf-hero__countdown"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 1, y: [0, -12, 0, 8, 0], filter: "blur(0px)" }
            }
            transition={
              reduceMotion
                ? { duration: 0.9, ease: invitationEase, delay: 1.7 }
                : {
                    opacity: {
                      duration: 0.95,
                      ease: invitationEase,
                      delay: 1.7,
                    },
                    filter: {
                      duration: 0.95,
                      ease: invitationEase,
                      delay: 1.7,
                    },
                    y: {
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.7,
                    },
                  }
            }
            aria-live="polite"
            aria-label="Odbrojavanje do venčanja"
          >
            {done ? (
              <p className="sf-hero__countdown-done">Danas je taj dan!</p>
            ) : (
              <ul className="sf-hero__countdown-grid">
                {units.map((unit, index) => (
                  <motion.li
                    key={unit.label}
                    className="sf-hero__countdown-item"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={
                      reduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            y: [0, -5, 0, 4, 0],
                          }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0.5, delay: 1.8 + index * 0.08 }
                        : {
                            opacity: {
                              duration: 0.5,
                              delay: 1.8 + index * 0.08,
                            },
                            y: {
                              duration: 4 + index * 0.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1.8 + index * 0.15,
                            },
                          }
                    }
                  >
                    <motion.span
                      key={unit.value}
                      className="sf-hero__countdown-value"
                      initial={reduceMotion ? false : { opacity: 0.4 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, ease: invitationEase }}
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.span>
                    <span className="sf-hero__countdown-label">{unit.label}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </motion.div>
      </SectionScrollShadow>
    </section>
  );
}

export default HeroSection;

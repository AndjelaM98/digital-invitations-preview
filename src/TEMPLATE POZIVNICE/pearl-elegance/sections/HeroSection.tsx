import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import heroFloral from "../../envelope-romance/assets/deco-floral-watercolor.png";
import type { PearlEleganceContent } from "../content";
import { usePearlReveal } from "../reveal";
import HeroCountdown from "./hero/HeroCountdown";
import {
  HERO_BACKDROP_DURATION,
  HERO_BASE_DELAY,
  HERO_CARD_DELAY,
  HERO_CARD_DURATION,
  HERO_EASE,
  HERO_FLOAT_DELAY_MS,
  HERO_IMAGE_DURATION,
  HERO_NAME_DELAYS,
  HERO_NAME_DURATION,
  heroT,
} from "./hero/heroMotion";
import { useHeroCountdown } from "./hero/useHeroCountdown";

type HeroSectionProps = {
  content: PearlEleganceContent;
};

const nameHidden = { opacity: 0, y: 18, filter: "blur(8px)" };
const nameVisible = { opacity: 1, y: 0, filter: "blur(0px)" };

/**
 * Cinematic mobile-first hero card: blur-to-focus reveal, Ken Burns photo,
 * staggered names, and a live countdown — all gated until the opener finishes.
 */
function HeroSection({ content }: HeroSectionProps) {
  const { couple, heroImage, eventDateIso, countdown } = content;
  const reduceMotion = useReducedMotion();
  const revealed = usePearlReveal();
  const active = revealed;
  const sequence = HERO_BASE_DELAY;
  const [afloat, setAfloat] = useState(false);

  useEffect(() => {
    if (!active || reduceMotion) {
      setAfloat(false);
      return;
    }
    const id = window.setTimeout(() => setAfloat(true), HERO_FLOAT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [active, reduceMotion]);

  const countdownState = useHeroCountdown(eventDateIso);
  const photoAlt =
    heroImage?.alt ?? `${couple.partnerOne} & ${couple.partnerTwo}`;
  const joiner = couple.joiner ?? "i";

  const nameTransition = (delay: number) => ({
    duration: reduceMotion ? 0.35 : HERO_NAME_DURATION,
    delay: active ? heroT(sequence, delay) : 0,
    ease: HERO_EASE,
  });

  return (
    <section className="pe-hero" data-section="hero" aria-label="Naslovnica">
      <div className="pe-hero__stage">
        <motion.div
          className="pe-hero__backdrop"
          aria-hidden="true"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0.45, scale: 1.06, filter: "blur(28px)" }
          }
          animate={
            active
              ? reduceMotion
                ? { opacity: 0.28, scale: 1 }
                : { opacity: 0.28, scale: 1, filter: "blur(5px)" }
              : reduceMotion
                ? { opacity: 0 }
                : { opacity: 0.2, scale: 1.06, filter: "blur(28px)" }
          }
          transition={{
            duration: reduceMotion ? 0.4 : HERO_BACKDROP_DURATION,
            delay: active ? heroT(sequence, HERO_CARD_DELAY) : 0,
            ease: HERO_EASE,
          }}
        >
          <img src={heroFloral} alt="" draggable={false} />
        </motion.div>

        <motion.div
          className="pe-hero__ground-shadow"
          aria-hidden="true"
          initial={{ opacity: 0, scaleX: 0.72 }}
          animate={
            active
              ? afloat && !reduceMotion
                ? { opacity: [0.9, 0.55, 0.9], scaleX: [1, 0.88, 1] }
                : { opacity: 0.9, scaleX: 1 }
              : { opacity: 0, scaleX: 0.72 }
          }
          transition={
            afloat && !reduceMotion
              ? { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
              : {
                  duration: reduceMotion ? 0.4 : HERO_CARD_DURATION,
                  delay: active ? heroT(sequence, HERO_CARD_DELAY) : 0,
                  ease: HERO_EASE,
                }
          }
        />

        <motion.div
          className="pe-hero__lift"
          initial={reduceMotion ? { y: 0, scale: 1 } : { y: -22, scale: 1.07 }}
          animate={
            active
              ? afloat && !reduceMotion
                ? { y: [0, -10, 0], scale: 1 }
                : { y: 0, scale: 1 }
              : reduceMotion
                ? { y: 0, scale: 1 }
                : { y: -22, scale: 1.07 }
          }
          transition={
            afloat && !reduceMotion
              ? { y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.01 } }
              : {
                  duration: reduceMotion ? 0.4 : HERO_CARD_DURATION,
                  delay: active ? heroT(sequence, HERO_CARD_DELAY) : 0,
                  ease: HERO_EASE,
                }
          }
        >
        <motion.article
          className="pe-hero__card"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, filter: "blur(10px)" }
          }
          animate={
            active
              ? { opacity: 1, filter: "blur(0px)" }
              : reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: "blur(10px)" }
          }
          transition={{
            duration: reduceMotion ? 0.4 : HERO_CARD_DURATION,
            delay: active ? heroT(sequence, HERO_CARD_DELAY) : 0,
            ease: HERO_EASE,
          }}
        >
          <div className="pe-hero__media">
            {heroImage ? (
              <motion.img
                className="pe-hero__photo"
                src={heroImage.src}
                alt={photoAlt}
                draggable={false}
                initial={{ scale: reduceMotion ? 1 : 1.12 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: reduceMotion ? 0.4 : HERO_IMAGE_DURATION,
                  delay: active ? heroT(sequence, HERO_CARD_DELAY) : 0,
                  ease: HERO_EASE,
                }}
              />
            ) : null}
          </div>

          <div className="pe-hero__veil" aria-hidden="true" />

          <div className="pe-hero__content">
            <h1 className="pe-hero__names">
              <motion.span
                className="pe-hero__name"
                initial={reduceMotion ? { opacity: 0 } : nameHidden}
                animate={active ? nameVisible : reduceMotion ? { opacity: 0 } : nameHidden}
                transition={nameTransition(HERO_NAME_DELAYS[0])}
              >
                {couple.partnerOne}
              </motion.span>
              <motion.span
                className="pe-hero__joiner"
                initial={reduceMotion ? { opacity: 0 } : nameHidden}
                animate={active ? nameVisible : reduceMotion ? { opacity: 0 } : nameHidden}
                transition={nameTransition(HERO_NAME_DELAYS[1])}
              >
                {joiner}
              </motion.span>
              <motion.span
                className="pe-hero__name"
                initial={reduceMotion ? { opacity: 0 } : nameHidden}
                animate={active ? nameVisible : reduceMotion ? { opacity: 0 } : nameHidden}
                transition={nameTransition(HERO_NAME_DELAYS[2])}
              >
                {couple.partnerTwo}
              </motion.span>
            </h1>

            <HeroCountdown
              parts={countdownState}
              arrived={countdownState.arrived}
              arrivedNote={countdown?.arrivedNote ?? "Danas je taj dan!"}
              active={active}
              sequenceDelay={sequence}
            />
          </div>
        </motion.article>
        </motion.div>
      </div>

      <motion.div
        className="pe-hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: active ? heroT(sequence, 2.4) : 0 }}
      >
        <motion.span
          className="pe-hero__scroll-chevron"
          animate={active && !reduceMotion ? { y: [0, 6, 0] } : { y: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;

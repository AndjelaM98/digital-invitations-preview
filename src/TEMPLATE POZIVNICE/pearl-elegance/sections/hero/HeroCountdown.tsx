import { motion, useReducedMotion } from "framer-motion";

import type { CountdownParts } from "./useHeroCountdown";
import {
  HERO_BASE_DELAY,
  HERO_COL_BASE,
  HERO_COL_STAGGER,
  HERO_COUNTDOWN_DELAY,
  HERO_COUNTDOWN_DURATION,
  HERO_EASE,
} from "./heroMotion";

type HeroCountdownProps = {
  parts: CountdownParts;
  arrived: boolean;
  arrivedNote?: string;
  active: boolean;
  sequenceDelay?: number;
};

const LABELS = ["dana", "sati", "min", "sek"] as const;

function CountdownValue({
  value,
  label,
  index,
  active,
  reduceMotion,
  sequenceDelay,
}: {
  value: number;
  label: string;
  index: number;
  active: boolean;
  reduceMotion: boolean;
  sequenceDelay: number;
}) {
  const pad = String(value).padStart(2, "0");
  const enterDelay =
    sequenceDelay + HERO_COL_BASE + index * HERO_COL_STAGGER;
  const floatDuration = 4 + index * 0.4;
  const floatDelay = index * 0.35;

  return (
    <motion.div
      className="pe-hero__cd-col"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: "blur(6px)" }
      }
      animate={
        active
          ? reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, filter: "blur(0px)" }
          : reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, filter: "blur(6px)" }
      }
      transition={{
        duration: reduceMotion ? 0.35 : HERO_COUNTDOWN_DURATION,
        delay: active ? enterDelay : 0,
        ease: HERO_EASE,
      }}
    >
      <motion.div
        className="pe-hero__cd-value-wrap"
        animate={
          active && !reduceMotion
            ? { y: [0, -5, 0, 4, 0] }
            : { y: 0 }
        }
        transition={{
          duration: floatDuration,
          repeat: active && !reduceMotion ? Infinity : 0,
          ease: "easeInOut",
          delay: floatDelay,
        }}
      >
        <motion.span
          key={pad}
          className="pe-hero__cd-value"
          initial={reduceMotion ? false : { opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {pad}
        </motion.span>
      </motion.div>
      <span className="pe-hero__cd-label">{label}</span>
    </motion.div>
  );
}

function HeroCountdown({
  parts,
  arrived,
  arrivedNote = "Danas je taj dan!",
  active,
  sequenceDelay = HERO_BASE_DELAY,
}: HeroCountdownProps) {
  const reduceMotion = useReducedMotion();
  const values = [parts.days, parts.hours, parts.minutes, parts.seconds];

  if (arrived) {
    return (
      <p className="pe-hero__cd-arrived" aria-live="polite">
        {arrivedNote}
      </p>
    );
  }

  return (
    <motion.div
      className="pe-hero__cd"
      aria-live="polite"
      aria-label="Odbrojavanje do venčanja"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: "blur(6px)" }
      }
      animate={
        active
          ? reduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 1, filter: "blur(0px)", y: 0 }
          : reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, filter: "blur(6px)", y: 0 }
      }
      transition={{
        duration: reduceMotion ? 0.35 : HERO_COUNTDOWN_DURATION,
        delay: active ? sequenceDelay + HERO_COUNTDOWN_DELAY : 0,
        ease: HERO_EASE,
      }}
    >
      <motion.div
        className="pe-hero__cd-grid"
        animate={
          active && !reduceMotion ? { y: [0, -12, 0, 8, 0] } : { y: 0 }
        }
        transition={{
          duration: 5.5,
          repeat: active && !reduceMotion ? Infinity : 0,
          ease: "easeInOut",
          delay: sequenceDelay + HERO_COUNTDOWN_DELAY + 0.2,
        }}
      >
        {values.map((value, index) => (
          <CountdownValue
            key={LABELS[index]}
            value={value}
            label={LABELS[index]}
            index={index}
            active={active}
            reduceMotion={Boolean(reduceMotion)}
            sequenceDelay={sequenceDelay}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default HeroCountdown;

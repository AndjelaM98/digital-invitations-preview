import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { invitationEase } from "../shared/motion";

export type ErRevealKind =
  | "rise"
  | "fade"
  | "page"
  | "leaf"
  | "tremble"
  | "bounce"
  | "zoomSoft"
  | "curtain"
  | "float";

type ErRevealProps = {
  children: ReactNode;
  kind?: ErRevealKind;
  className?: string;
  delay?: number;
  /** Keep a quiet float after enter (default on for most kinds) */
  drift?: boolean;
};

const enter = {
  rise: {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  },
  page: {
    hidden: { opacity: 0, y: 56, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  leaf: {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 },
  },
  tremble: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  bounce: {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  zoomSoft: {
    hidden: { opacity: 0, scale: 1.1, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  curtain: {
    hidden: { opacity: 0, scale: 1.08, y: 32 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  float: {
    hidden: { opacity: 0, y: 44 },
    visible: { opacity: 1, y: 0 },
  },
} as const;

const driftMotion = {
  soft: { y: [0, -10, 0] },
  softAlt: { y: [0, -7, 0] },
  bounce: { y: [0, -12, 0] },
  tremble: { y: [0, -6, 0], rotate: [-0.6, 0.6, -0.6] },
} as const;

const durationFor: Record<ErRevealKind, number> = {
  rise: 1.05,
  fade: 0.95,
  page: 1.2,
  leaf: 1.05,
  tremble: 1,
  bounce: 1.1,
  zoomSoft: 1.3,
  curtain: 1.25,
  float: 1.15,
};

function shouldDrift(kind: ErRevealKind, drift?: boolean) {
  if (drift === false) return false;
  if (drift === true) return true;
  // Default: almost everything gently floats after it lands
  return kind !== "fade";
}

function ErReveal({
  children,
  kind = "float",
  className,
  delay = 0,
  drift,
}: ErRevealProps) {
  const reduceMotion = useReducedMotion();
  const classes = className ? `er-reveal ${className}` : "er-reveal";
  const enableDrift = shouldDrift(kind, drift);

  if (reduceMotion) {
    return <div className={classes}>{children}</div>;
  }

  const idle =
    kind === "tremble"
      ? driftMotion.tremble
      : kind === "bounce"
        ? driftMotion.bounce
        : delay > 0.12
          ? driftMotion.softAlt
          : driftMotion.soft;

  return (
    <motion.div
      className={classes}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -5% 0px" }}
      variants={enter[kind]}
      transition={{
        duration: durationFor[kind],
        ease: invitationEase,
        delay,
      }}
    >
      {enableDrift ? (
        <motion.div
          className="er-reveal__idle"
          animate={idle}
          transition={{
            duration: kind === "bounce" ? 3.1 : kind === "tremble" ? 3.6 : 4.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + durationFor[kind] * 0.55,
          }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
}

export default ErReveal;

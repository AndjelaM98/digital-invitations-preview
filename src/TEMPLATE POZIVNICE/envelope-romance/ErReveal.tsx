import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { invitationEase } from "../shared/motion";

export type ErRevealKind =
  | "rise"
  | "fade"
  | "slideLeft"
  | "slideRight"
  | "tremble"
  | "bounce";

type ErRevealProps = {
  children: ReactNode;
  kind?: ErRevealKind;
  className?: string;
  delay?: number;
};

const enter = {
  rise: { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: "-18vw" }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: "18vw" }, visible: { opacity: 1, x: 0 } },
  tremble: { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } },
  bounce: { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } },
} as const;

const idleMotion = {
  tremble: { rotate: [-0.7, 0.7, -0.7], x: [-1.4, 1.4, -1.4] },
  bounce: { y: [0, -8, 0] },
};

/**
 * Invitation motion: enter on scroll, then a quiet idle on bounce/tremble.
 * Distances stay short so copy stays readable.
 */
function ErReveal({
  children,
  kind = "rise",
  className,
  delay = 0,
}: ErRevealProps) {
  const reduceMotion = useReducedMotion();
  const classes = className ? `er-reveal ${className}` : "er-reveal";

  if (reduceMotion) {
    return <div className={classes}>{children}</div>;
  }

  const idle = kind === "tremble" || kind === "bounce" ? idleMotion[kind] : undefined;

  return (
    <motion.div
      className={classes}
      variants={enter[kind]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.28, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.95, ease: invitationEase, delay }}
    >
      {idle ? (
        <motion.div
          className="er-reveal__idle"
          animate={idle}
          transition={{
            duration: kind === "bounce" ? 2.8 : 3.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.85,
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

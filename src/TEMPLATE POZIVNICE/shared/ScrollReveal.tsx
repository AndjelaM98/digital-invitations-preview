import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { invitationTransition, revealUp } from "./motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  amount?: number;
  delay?: number;
  once?: boolean;
  as?: "div" | "section" | "header" | "footer" | "article";
};

/** Scroll enter/exit wrapper for invitation beats. */
function ScrollReveal({
  children,
  className,
  variants = revealUp,
  amount = 0.35,
  delay = 0,
  once = false,
  as = "div",
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ amount, once, margin: "0px 0px -8% 0px" }}
      transition={{ ...invitationTransition, delay }}
    >
      {children}
    </MotionTag>
  );
}

export default ScrollReveal;

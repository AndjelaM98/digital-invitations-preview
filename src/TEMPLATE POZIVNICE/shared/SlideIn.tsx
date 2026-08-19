import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { slideInTransition, slideVariants } from "./motion";
import "./SlideIn.css";

type SlideInProps = {
  children: ReactNode;
  /** First block should be "right", then alternate "left", "right", … */
  from: "left" | "right";
  className?: string;
  delay?: number;
  amount?: number;
  /** Re-animate when scrolling back into view (Leto-style). */
  once?: boolean;
  /** When false, blocks entrance until the opener has finished. */
  active?: boolean;
};

/**
 * Dramatic horizontal entrance from fully off-screen.
 *
 * Intersection is measured on a static wrapper so a large `x` transform
 * cannot keep the element forever out of view (which would leave the page blank).
 */
function SlideIn({
  children,
  from,
  className = "",
  delay = 0,
  amount = 0.22,
  once = true,
  active = true,
}: SlideInProps) {
  const reduceMotion = useReducedMotion();
  const anchorRef = useRef<HTMLDivElement>(null);
  const inView = useInView(anchorRef, { amount, once, margin: "0px 0px -6% 0px" });
  const classes = className
    ? `invitation-slide-in__motion ${className}`
    : "invitation-slide-in__motion";

  if (reduceMotion) {
    return (
      <div className={`invitation-slide-in ${className}`.trim()}>{children}</div>
    );
  }

  return (
    <div ref={anchorRef} className="invitation-slide-in">
      <motion.div
        className={classes}
        variants={slideVariants(from)}
        initial="hidden"
        animate={active && inView ? "visible" : "hidden"}
        transition={{ ...slideInTransition, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default SlideIn;

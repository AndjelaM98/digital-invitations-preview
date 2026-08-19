import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type SectionScrollShadowProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Scroll-linked shadow — peaks when section is centered in viewport.
 * Keeps content sharp and readable.
 */
function SectionScrollShadow({
  children,
  className = "",
}: SectionScrollShadowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "center 0.55", "end 0.05"],
  });

  const boxShadow = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "0 2px 14px rgba(31, 27, 25, 0.05)",
      "0 10px 36px rgba(31, 27, 25, 0.13)",
      "0 2px 14px rgba(31, 27, 25, 0.05)",
    ],
  );

  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.16, 0],
  );

  if (reduceMotion) {
    return (
      <div ref={ref} className={`sf-scroll-shadow ${className}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`sf-scroll-shadow ${className}`.trim()}
      style={{ boxShadow }}
    >
      <motion.div
        className="sf-scroll-shadow__veil"
        style={{ opacity: veilOpacity }}
        aria-hidden="true"
      />
      <div className="sf-scroll-shadow__content">{children}</div>
    </motion.div>
  );
}

export default SectionScrollShadow;

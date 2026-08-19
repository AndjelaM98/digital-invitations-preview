import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

import { invitationEase } from "../../shared/motion";
import peoniesImage from "../assets/peonies.png";

const EXIT_DURATION = 2.75;
const FADE_DURATION = 2;
const BREATHE_DURATION = 5.2;
const gateExitEase: [number, number, number, number] = [0.33, 0.86, 0.25, 1];
const flowerWidths = ["50%", "64%", "43%", "50%"];
const creamWidths = ["50%", "36%", "57%", "50%"];
const breatheTimes = [0, 0.38, 0.72, 1];

type FlowerGateOpenerProps = {
  partnerOne: string;
  partnerTwo: string;
  joiner?: string;
  onOpen: () => void;
  onComplete: () => void;
  leaving: boolean;
};

function FlowerGateOpener({
  partnerOne,
  partnerTwo,
  joiner = "i",
  onOpen,
  onComplete,
  leaving,
}: FlowerGateOpenerProps) {
  const reduceMotion = useReducedMotion();
  const exitDuration = reduceMotion ? 0.2 : EXIT_DURATION;
  const fadeDuration = reduceMotion ? 0.15 : FADE_DURATION;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (reduceMotion && leaving) {
      onComplete();
    }
  }, [leaving, onComplete, reduceMotion]);

  return (
    <motion.button
      type="button"
      className="sf-gate"
      onClick={() => {
        if (!leaving) onOpen();
      }}
      aria-label="Otvorite pozivnicu"
    >
      <motion.div
        className="sf-gate__panel sf-gate__panel--flowers"
        aria-hidden="true"
        initial={false}
        animate={
          leaving
            ? { x: "-100%" }
            : reduceMotion
              ? { x: "0%", width: "50%" }
              : { x: "0%", width: flowerWidths }
        }
        transition={
          leaving
            ? { duration: exitDuration, ease: gateExitEase }
            : {
                duration: BREATHE_DURATION,
                times: breatheTimes,
                ease: invitationEase,
              }
        }
        onAnimationComplete={() => {
          if (leaving) onComplete();
        }}
      >
        <img
          className="sf-gate__image"
          src={peoniesImage}
          alt=""
          draggable={false}
        />
      </motion.div>

      <motion.div
        className="sf-gate__panel sf-gate__panel--plain"
        aria-hidden="true"
        initial={false}
        animate={
          leaving
            ? { x: "100%" }
            : reduceMotion
              ? { x: "0%", width: "50%" }
              : { x: "0%", width: creamWidths }
        }
        transition={
          leaving
            ? { duration: exitDuration, ease: gateExitEase }
            : {
                duration: BREATHE_DURATION,
                times: breatheTimes,
                ease: invitationEase,
              }
        }
      />

      <motion.span
        className="sf-gate__copy"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? 0 : 0 }}
        transition={{
          opacity: {
            duration: leaving ? fadeDuration : 0.8,
            ease: leaving ? gateExitEase : invitationEase,
            delay: leaving ? 0 : 0.25,
          },
          y: {
            duration: 0.8,
            ease: invitationEase,
            delay: leaving ? 0 : 0.25,
          },
        }}
      >
        <span className="sf-gate__names">
          <span className="sf-gate__name">{partnerOne}</span>
          <span className="sf-gate__joiner">{joiner}</span>
          <span className="sf-gate__name">{partnerTwo}</span>
        </span>
        <span className="sf-gate__hint">Dodirnite da otvorite pozivnicu</span>
      </motion.span>
    </motion.button>
  );
}

export default FlowerGateOpener;

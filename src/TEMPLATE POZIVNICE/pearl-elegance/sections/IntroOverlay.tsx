import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { invitationEase } from "../../shared/motion";
import envelopeEmboss from "../assets/envelope-emboss.png";
import type { PearlEleganceContent } from "../content";

type IntroOverlayProps = {
  content: PearlEleganceContent;
  onDone: () => void;
};

/**
 * Opening sequence:
 *  1. "sealed"  — a sage, floral-embossed envelope rests closed.
 *  2. "opening" — its four triangular flaps peel back in an X, revealing the
 *                 couple's monogram card resting inside.
 *  3. "through" — the camera glides through the opening (scale + fade) and
 *                 hands off to the live invitation underneath.
 * Honors prefers-reduced-motion with a short, plain cross-fade.
 */
type Phase = "sealed" | "opening" | "through";

const flapStyle = { backgroundImage: `url(${envelopeEmboss})` };

function IntroOverlay({ content, onDone }: IntroOverlayProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("sealed");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const finish = () => setVisible(false);

    if (reduceMotion) {
      const t = window.setTimeout(finish, 450);
      return () => window.clearTimeout(t);
    }

    const timers = [
      window.setTimeout(() => setPhase("opening"), 950),
      window.setTimeout(() => setPhase("through"), 2250),
      window.setTimeout(finish, 3150),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduceMotion]);

  const { couple, monogram, heroScript } = content;
  const open = phase !== "sealed";

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible ? (
        <motion.div
          className="pe-intro"
          role="dialog"
          aria-label="Otvaranje pozivnice"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: invitationEase }}
          onClick={() => setVisible(false)}
        >
          <motion.div
            className="pe-intro__stage"
            initial={{ scale: reduceMotion ? 1 : 0.92, opacity: 0 }}
            animate={
              phase === "through"
                ? { scale: reduceMotion ? 1 : 3.1, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{
              duration: phase === "through" ? 0.95 : 0.8,
              ease: invitationEase,
            }}
          >
            <div className="pe-intro__envelope">
              <div className="pe-intro__interior">
                <motion.div
                  className="pe-intro__card"
                  initial={{ y: 26, opacity: 0 }}
                  animate={open ? { y: 0, opacity: 1 } : { y: 26, opacity: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: invitationEase,
                    delay: open ? 0.25 : 0,
                  }}
                >
                  {monogram ? (
                    <span className="pe-intro__monogram">{monogram}</span>
                  ) : null}
                  <span className="pe-intro__names">
                    {couple.partnerOne}
                    {couple.joiner ? ` ${couple.joiner} ` : " "}
                    {couple.partnerTwo}
                  </span>
                  {heroScript ? (
                    <span className="pe-intro__hint">{heroScript}</span>
                  ) : null}
                </motion.div>
              </div>

              <motion.div
                className="pe-intro__flap pe-intro__flap--top"
                style={flapStyle}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: open ? -174 : 0 }}
                transition={{ duration: 1.15, ease: invitationEase }}
              />
              <motion.div
                className="pe-intro__flap pe-intro__flap--bottom"
                style={flapStyle}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: open ? 174 : 0 }}
                transition={{ duration: 1.15, ease: invitationEase }}
              />
              <motion.div
                className="pe-intro__flap pe-intro__flap--left"
                style={flapStyle}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: open ? 174 : 0 }}
                transition={{ duration: 1.15, ease: invitationEase }}
              />
              <motion.div
                className="pe-intro__flap pe-intro__flap--right"
                style={flapStyle}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: open ? -174 : 0 }}
                transition={{ duration: 1.15, ease: invitationEase }}
              />
            </div>
          </motion.div>

          <motion.button
            type="button"
            className="pe-intro__skip"
            onClick={() => setVisible(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Preskoči
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default IntroOverlay;

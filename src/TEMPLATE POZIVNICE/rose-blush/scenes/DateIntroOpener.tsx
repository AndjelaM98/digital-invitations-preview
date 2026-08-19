import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { invitationEase } from "../../shared/motion";
import { useIsDesktopInvitation } from "../../shared/useIsDesktopInvitation";
import { invitationBreakpoints } from "../../shared/viewport";

const EMPTY_HOLD = 1.2;
const DATE_STEP = 0.48;
const INITIAL_STEP = 0.32;
const LETTER_STEP = 0.055;
const LINE_PAUSE = 0.28;
const HOLD_AFTER = 1.35;
const EXIT_DURATION = 1.1;

const INVITE_LINES = [
  "s veseljem vas pozivamo",
  "da budete uz nas na",
  "dan našeg venčanja",
] as const;

type DateIntroOpenerProps = {
  eventDateIso: string;
  initialOne: string;
  initialTwo: string;
  onComplete: () => void;
};

function stackFromIso(iso: string) {
  const date = new Date(iso);
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getFullYear()).slice(-2),
  ] as const;
}

function DateIntroOpener({
  eventDateIso,
  initialOne,
  initialTwo,
  onComplete,
}: DateIntroOpenerProps) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktopInvitation(invitationBreakpoints.md);
  const [leaving, setLeaving] = useState(false);
  const stack = useMemo(() => stackFromIso(eventDateIso), [eventDateIso]);
  const initials = [initialOne, "|", initialTwo] as const;

  const dateStart = EMPTY_HOLD;
  const initialsStart = dateStart + stack.length * DATE_STEP + 0.15;
  const writingStart = initialsStart + initials.length * INITIAL_STEP + 0.25;

  const writingDuration = INVITE_LINES.reduce((total, line, index) => {
    return total + line.length * LETTER_STEP + (index > 0 ? LINE_PAUSE : 0);
  }, 0);

  const totalHold = writingStart + writingDuration + HOLD_AFTER;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }

    const id = window.setTimeout(() => setLeaving(true), totalHold * 1000);
    return () => window.clearTimeout(id);
  }, [onComplete, reduceMotion, totalHold]);

  let letterOffset = 0;

  return (
    <motion.button
      type="button"
      className="qb-intro"
      onClick={() => setLeaving(true)}
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: leaving ? EXIT_DURATION : 0.4, ease: invitationEase }}
      onAnimationComplete={() => {
        if (leaving) onComplete();
      }}
      aria-label="Otvorite pozivnicu"
    >
      <div className="qb-intro__grid">
        <div className="qb-intro__date" aria-hidden="true">
          {stack.map((part, index) => (
            <motion.span
              key={`${part}-${index}`}
              className={`qb-intro__num qb-intro__num--${index}`}
              initial={
                isDesktop
                  ? { opacity: 0, y: 18 }
                  : { opacity: 0, x: -28 }
              }
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: 0.7,
                delay: dateStart + index * DATE_STEP,
                ease: invitationEase,
              }}
            >
              {part}
            </motion.span>
          ))}
        </div>

        <p className="qb-intro__script">
          {INVITE_LINES.map((line, lineIndex) => {
            const lineDelay =
              writingStart +
              letterOffset * LETTER_STEP +
              lineIndex * LINE_PAUSE;
            const chars = Array.from(line);
            letterOffset += chars.length;

            return (
              <span key={line} className="qb-intro__line">
                {chars.map((char, charIndex) => (
                  <motion.span
                    key={`${line}-${charIndex}`}
                    className="qb-intro__char"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.12,
                      delay: lineDelay + charIndex * LETTER_STEP,
                      ease: "linear",
                    }}
                  >
                    {char === " " ? "\u00a0" : char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </p>

        <p className="qb-intro__initials" aria-hidden="true">
          {initials.map((token, index) => (
            <motion.span
              key={`${token}-${index}`}
              className={
                token === "|"
                  ? "qb-intro__pipe"
                  : "qb-intro__letter"
              }
              initial={
                isDesktop
                  ? { opacity: 0, y: 8 }
                  : { opacity: 0, y: 16 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: initialsStart + index * INITIAL_STEP,
                ease: invitationEase,
              }}
            >
              {token}
            </motion.span>
          ))}
        </p>
      </div>
    </motion.button>
  );
}

export default DateIntroOpener;

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { InvitationContent } from "../shared/types";
import { envelopeGateFrames, envelopeGatePaper } from "./gateMedia";
import "./InviteGate.css";

type InviteGateProps = {
  content: InvitationContent;
  onOpen: () => void;
  onFinished: () => void;
};

type Phase = "idle" | "opening" | "emerge" | "zoom";

const openEase: [number, number, number, number] = [0.45, 0.05, 0.55, 0.95];
const emergeEase: [number, number, number, number] = [0.22, 0.04, 0.14, 1];
const zoomEase: [number, number, number, number] = [0.18, 0.22, 0.12, 1];

const OPEN_S = 1.35;
const EMERGE_MS = 2000;
const ZOOM_MS = 2200;
const TOTAL_MS = OPEN_S * 1000 + EMERGE_MS + ZOOM_MS;

function frameOpacity(index: number, progress: number) {
  const dist = Math.abs(index - progress);
  if (dist >= 1) return 0;
  const t = 1 - dist;
  return t * t * (3 - 2 * t);
}

function GateFrame({
  src,
  index,
  progress,
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => frameOpacity(index, p));

  return (
    <motion.img
      className="er-gate__frame"
      src={src}
      alt=""
      style={{ opacity }}
      draggable={false}
    />
  );
}

function InviteGate({ onOpen, onFinished }: InviteGateProps) {
  const reduce = useReducedMotion();
  const timers = useRef<number[]>([]);
  const progress = useMotionValue(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const leaving = phase !== "idle";

  useEffect(() => {
    envelopeGateFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const paper = new Image();
    paper.src = envelopeGatePaper;
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
  };

  const open = () => {
    if (leaving) return;
    if (reduce) {
      onOpen();
      onFinished();
      return;
    }

    setPhase("opening");
    progress.set(0);

    void animate(progress, envelopeGateFrames.length - 1, {
      duration: OPEN_S,
      ease: openEase,
    }).then(() => {
      setPhase("emerge");
    });

    schedule(() => {
      setPhase("zoom");
      onOpen();
    }, OPEN_S * 1000 + EMERGE_MS);

    schedule(() => onFinished(), TOTAL_MS);
  };

  const showEnvelope = phase !== "zoom";

  return (
    <motion.section
      className={`er-gate${leaving ? " is-leaving" : ""}${phase === "zoom" ? " is-revealing" : ""}`}
      data-section="gate"
      aria-label="Ulaz u pozivnicu"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: zoomEase }}
    >
      <div className="er-gate__stage">
        <motion.div
          className="er-gate__frame-stack"
          animate={{ opacity: showEnvelope ? 1 : 0 }}
          transition={{ duration: 0.7, ease: openEase }}
          aria-hidden={!showEnvelope}
        >
          {envelopeGateFrames.map((src, index) => (
            <GateFrame key={src} src={src} index={index} progress={progress} />
          ))}
        </motion.div>

        <motion.div
          className={`er-gate__slot${phase === "emerge" || phase === "zoom" ? " is-active" : ""}${phase === "zoom" ? " is-free" : ""}`}
          initial={false}
          animate={
            phase === "zoom"
              ? { opacity: 1, scale: 3.1, y: "-4%" }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={
            phase === "zoom"
              ? { duration: ZOOM_MS / 1000, ease: zoomEase }
              : { duration: 0.5, ease: emergeEase }
          }
        >
          <motion.div
            className="er-gate__paper-lift"
            initial={false}
            animate={
              phase === "zoom"
                ? { y: "0%" }
                : phase === "emerge"
                  ? { y: "-2%" }
                  : { y: "72%" }
            }
            transition={
              phase === "zoom"
                ? { duration: ZOOM_MS / 1000, ease: zoomEase }
                : phase === "emerge"
                  ? { duration: EMERGE_MS / 1000, ease: emergeEase }
                  : { duration: 0.4, ease: emergeEase }
            }
          >
            <motion.img
              className="er-gate__paper-img"
              src={envelopeGatePaper}
              alt=""
              initial={false}
              animate={{
                opacity: phase === "emerge" || phase === "zoom" ? 1 : 0,
              }}
              transition={{ duration: 0.85, ease: emergeEase }}
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {!leaving ? (
          <button
            type="button"
            className="er-gate__hit"
            onClick={open}
            aria-label="Otvori pozivnicu"
          />
        ) : null}
      </div>

      {!leaving ? <p className="er-gate__hint">Dodirni kovertu</p> : null}
    </motion.section>
  );
}

export default InviteGate;

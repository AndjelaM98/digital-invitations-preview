import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import type { PearlEleganceContent } from "./content";
import openerVideo from "./assets/opener.mp4";
import "./InviteOpener.css";

type InviteOpenerProps = {
  content: PearlEleganceContent;
  onFinished: () => void;
};

type Phase = "hold" | "video" | "letters" | "zoom";

const LETTER_WAIT_MS = 180;
const LETTER_IN_S = 0.95;
const DATE_FIRST_DELAY_S = 1.12;
const DATE_STAGGER_S = 0.28;
const DATE_IN_S = LETTER_IN_S * 0.85;
const YEAR_INDEX = 2;
/** Brief beat once the year has landed, then the slow zoom into the invitation */
const YEAR_SETTLE_MS = 350;
const ZOOM_START_MS =
  LETTER_WAIT_MS +
  (DATE_FIRST_DELAY_S + YEAR_INDEX * DATE_STAGGER_S + DATE_IN_S) * 1000 +
  YEAR_SETTLE_MS;
/** Slow, cinematic push into the invitation */
const ZOOM_S = 4;
const CTA_FADE_S = 0.75;
const silk: [number, number, number, number] = [0.22, 0.08, 0.2, 1];
const letterFly: [number, number, number, number] = [0.16, 0.84, 0.32, 1];

function parseEventParts(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { day: "12", month: "09", year: "2026" };
  }
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    year: String(d.getFullYear()),
  };
}

function InviteOpener({ content, onFinished }: InviteOpenerProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const holding = useRef(true);
  const zoomingRef = useRef(false);

  const [phase, setPhase] = useState<Phase>(reduceMotion ? "zoom" : "hold");
  const [lettersIn, setLettersIn] = useState(reduceMotion);
  const [zooming, setZooming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const { couple, eventDateIso, openerInvite, quote, invite } = content;
  const joiner = couple.joiner ?? "i";
  const inviteLine =
    openerInvite ??
    quote ??
    invite?.body ??
    "Sa velikom radošću vas pozivamo da budete deo našeg najlepšeg dana.";
  const { day, month, year } = parseEventParts(eventDateIso);
  const dateParts = [day, month, year];

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const beginZoom = useCallback(() => {
    if (zoomingRef.current) return;
    zoomingRef.current = true;
    started.current = true;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    videoRef.current?.pause();
    setPhase("zoom");
    setZooming(true);
    setLeaving(true);
    later(onFinished, ZOOM_S * 1000);
  }, [onFinished]);

  const freezeLastFrame = useCallback(() => {
    if (started.current) return;
    started.current = true;
    videoRef.current?.pause();
    setPhase("letters");

    later(() => setLettersIn(true), LETTER_WAIT_MS);

    later(() => {
      beginZoom();
    }, ZOOM_START_MS);
  }, [beginZoom]);

  const skipToZoom = useCallback(() => {
    if (holding.current || zoomingRef.current) return;
    beginZoom();
  }, [beginZoom]);

  const playVideo = useCallback(() => {
    if (!holding.current) return;
    holding.current = false;

    const video = videoRef.current;
    if (!video) return;

    setPhase("video");

    const begin = () => {
      void video.play().catch(() => {
        video.load();
        void video.play().catch(() => undefined);
      });
    };

    if (video.readyState >= 2) {
      video.currentTime = 0;
      begin();
      return;
    }

    const onReady = () => {
      video.removeEventListener("canplay", onReady);
      video.currentTime = 0;
      begin();
    };
    video.addEventListener("canplay", onReady);
    video.load();
  }, []);

  useEffect(() => {
    if (!reduceMotion) return;
    started.current = true;
    setLettersIn(true);
    later(onFinished, 400);
  }, [onFinished, reduceMotion]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  useEffect(() => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const freeze = () => {
      if (!holding.current) return;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek race */
      }
    };

    if (video.readyState >= 1) freeze();
    else video.addEventListener("loadeddata", freeze, { once: true });

    return () => video.removeEventListener("loadeddata", freeze);
  }, [reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== "video") return;

    const onEnded = () => freezeLastFrame();
    const onTime = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (video.duration - video.currentTime <= 0.08) freezeLastFrame();
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTime);
    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTime);
    };
  }, [freezeLastFrame, phase]);

  return (
    <section
      className={`pe-opener${leaving ? " is-leaving" : ""}`}
      aria-label="Otvaranje pozivnice"
      style={{ "--pe-opener-zoom-s": `${ZOOM_S}s` } as CSSProperties}
      onClick={phase === "hold" ? undefined : skipToZoom}
    >
      <div className="pe-opener__stage">
        <div className={`pe-opener__stack${zooming ? " is-zoom" : ""}`}>
          <div className="pe-opener__crop">
            <video
              ref={videoRef}
              className="pe-opener__video"
              src={openerVideo}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          </div>
          <motion.div
            className="pe-opener__letters"
            aria-hidden="true"
            initial="hidden"
            animate={lettersIn ? "visible" : "hidden"}
          >
            <p className="pe-opener__names">
              <motion.span
                variants={{
                  hidden: { opacity: 0, x: -78, y: 18, scale: 0.78 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: { duration: LETTER_IN_S, ease: letterFly, delay: 0 },
                  },
                }}
                initial="hidden"
                animate={lettersIn ? "visible" : "hidden"}
              >
                {couple.partnerOne}
              </motion.span>
              <motion.span
                className="pe-opener__join"
                variants={{
                  hidden: { opacity: 0, y: 36, scale: 0.6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: LETTER_IN_S * 0.88,
                      ease: letterFly,
                      delay: 0.26,
                    },
                  },
                }}
                initial="hidden"
                animate={lettersIn ? "visible" : "hidden"}
              >
                {joiner}
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, x: 78, y: 18, scale: 0.78 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: LETTER_IN_S,
                      ease: letterFly,
                      delay: 0.52,
                    },
                  },
                }}
                initial="hidden"
                animate={lettersIn ? "visible" : "hidden"}
              >
                {couple.partnerTwo}
              </motion.span>
            </p>
            <motion.p
              className="pe-opener__invite"
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.92 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: LETTER_IN_S * 0.9,
                    ease: letterFly,
                    delay: 0.82,
                  },
                },
              }}
              initial="hidden"
              animate={lettersIn ? "visible" : "hidden"}
            >
              {inviteLine}
            </motion.p>
            <div
              className="pe-opener__date-stack"
              aria-label={content.eventDateLabel}
            >
              {dateParts.map((part, index) => (
                <motion.span
                  key={`${part}-${index}`}
                  className={`pe-opener__date-num${index === 2 ? " is-year" : ""}`}
                  variants={{
                    hidden: { opacity: 0, y: 62, scale: 0.78 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: DATE_IN_S,
                        ease: letterFly,
                        delay: DATE_FIRST_DELAY_S + index * DATE_STAGGER_S,
                      },
                    },
                  }}
                  initial="hidden"
                  animate={lettersIn ? "visible" : "hidden"}
                >
                  {part}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {phase === "hold" ? (
            <motion.button
              type="button"
              className="pe-opener__cta"
              aria-label="Otvori kovertu"
              onClick={playVideo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: CTA_FADE_S, ease: silk }}
            >
              <span className="pe-opener__cta-script">Otvori</span>
              <span className="pe-opener__cta-label">kovertu</span>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default InviteOpener;

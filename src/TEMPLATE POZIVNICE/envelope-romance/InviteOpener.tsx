import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { InvitationContent } from "../shared/types";
import openerSeal from "./assets/opener-seal.png";
import openerVideo from "./assets/opener.mp4";
import "./InviteOpener.css";

type InviteOpenerProps = {
  content: InvitationContent;
  onFinished: () => void;
  onMusicUnlock?: () => void;
};

type Phase = "hold" | "video" | "letters" | "zoom";

const LETTER_WAIT_MS = 180;
const LETTER_IN_S = 1.15;
const DATE_FIRST_DELAY_S = 1.2;
const DATE_STAGGER_S = 0.3;
const DATE_IN_S = LETTER_IN_S * 0.85;
const YEAR_INDEX = 2;
const YEAR_SETTLE_MS = 400;
const ZOOM_START_MS =
  LETTER_WAIT_MS +
  (DATE_FIRST_DELAY_S + YEAR_INDEX * DATE_STAGGER_S + DATE_IN_S) * 1000 +
  YEAR_SETTLE_MS;
const ZOOM_S = 2.2;
const SEAL_FADE_S = 0.85;
const silk: [number, number, number, number] = [0.22, 0.08, 0.2, 1];
const letterFly: [number, number, number, number] = [0.16, 0.84, 0.32, 1];

function initialOf(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

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

function InviteOpener({ content, onFinished, onMusicUnlock }: InviteOpenerProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const holding = useRef(true);
  const zoomingRef = useRef(false);
  const sealLoaded = useRef(false);
  const videoLoaded = useRef(false);

  const [mediaReady, setMediaReady] = useState(false);
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "zoom" : "hold");
  const [lettersIn, setLettersIn] = useState(reduceMotion);
  const [zooming, setZooming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const left = initialOf(content.couple.partnerOne) || "T";
  const right = initialOf(content.couple.partnerTwo) || "S";
  const joiner = content.couple.joiner ?? "&";
  const { day, month, year } = parseEventParts(content.eventDateIso);
  const dateParts = [day, month, year];

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const tryRevealMedia = useCallback(() => {
    if (sealLoaded.current && videoLoaded.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMediaReady(true);
        });
      });
    }
  }, []);

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

  const playVideo = useCallback(async () => {
    if (phase !== "hold") return;
    onMusicUnlock?.();
    holding.current = false;
    setPhase("video");
    try {
      await videoRef.current?.play();
    } catch {
      /* click unlocks playback */
    }
  }, [onMusicUnlock, phase]);

  useEffect(() => {
    if (!reduceMotion) return;
    started.current = true;
    setLettersIn(true);
    setMediaReady(true);
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

    const markVideoReady = () => {
      videoLoaded.current = true;
      tryRevealMedia();
    };

    const finalizeReady = () => {
      if ("requestVideoFrameCallback" in video) {
        const videoWithFrame = video as HTMLVideoElement & {
          requestVideoFrameCallback?: (callback: () => void) => number;
        };
        videoWithFrame.requestVideoFrameCallback?.(() => {
          markVideoReady();
        });
        return;
      }
      markVideoReady();
    };

    const freeze = () => {
      if (!holding.current) return;
      video.pause();
      if (video.currentTime !== 0) video.currentTime = 0;
      finalizeReady();
    };

    video.load();

    if (video.readyState >= 2) {
      freeze();
    } else {
      video.addEventListener("loadeddata", freeze, { once: true });
    }

    return () => video.removeEventListener("loadeddata", freeze);
  }, [reduceMotion, tryRevealMedia]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== "video") return;
    video.addEventListener("ended", freezeLastFrame);
    return () => video.removeEventListener("ended", freezeLastFrame);
  }, [freezeLastFrame, phase]);

  return (
    <section
      className={`er-opener${leaving ? " is-leaving" : ""}${mediaReady ? " is-ready" : ""}`}
      aria-label="Otvaranje pozivnice"
      aria-busy={!mediaReady}
      onClick={phase === "hold" ? undefined : skipToZoom}
    >
      <div className="er-opener__stage">
        <div className={`er-opener__stack${zooming ? " is-zoom" : ""}`}>
          <video
            ref={videoRef}
            className="er-opener__video"
            src={openerVideo}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <motion.div
            className="er-opener__letters"
            aria-hidden="true"
            initial="hidden"
            animate={lettersIn ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.14, delayChildren: 0.05 },
              },
            }}
          >
            <motion.p
              className="er-opener__mono"
              variants={{
                hidden: {},
                visible: {},
              }}
            >
              <motion.span
                className="er-opener__glyph"
                variants={{
                  hidden: { opacity: 0, x: -52, y: 18, scale: 0.7 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: { duration: LETTER_IN_S, ease: letterFly },
                  },
                }}
              >
                {left}
              </motion.span>
              <motion.span
                className="er-opener__join"
                variants={{
                  hidden: { opacity: 0, y: 36, scale: 0.5 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: LETTER_IN_S * 0.92, ease: letterFly },
                  },
                }}
              >
                {joiner}
              </motion.span>
              <motion.span
                className="er-opener__glyph"
                variants={{
                  hidden: { opacity: 0, x: 52, y: 18, scale: 0.7 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: { duration: LETTER_IN_S, ease: letterFly },
                  },
                }}
              >
                {right}
              </motion.span>
            </motion.p>
            <div
              className="er-opener__date-stack"
              aria-label={content.eventDateLabel}
            >
              {dateParts.map((part, index) => (
                <motion.span
                  key={`${part}-${index}`}
                  className={`er-opener__date-num${index === 2 ? " is-year" : ""}`}
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

        <div className="er-opener__fit" aria-hidden={phase !== "hold"}>
          <AnimatePresence>
            {phase === "hold" ? (
              <motion.div
                className="er-opener__seal-wrap"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: SEAL_FADE_S, ease: silk }}
              >
                <button
                  type="button"
                  className="er-opener__seal"
                  aria-label="Otvori pečat"
                  onClick={(event) => {
                    event.stopPropagation();
                    void playVideo();
                  }}
                >
                  <img
                    src={openerSeal}
                    alt=""
                    draggable={false}
                    ref={(node) => {
                      if (!node || sealLoaded.current) return;
                      if (node.complete && node.naturalWidth > 0) {
                        sealLoaded.current = true;
                        tryRevealMedia();
                      }
                    }}
                    onLoad={() => {
                      sealLoaded.current = true;
                      tryRevealMedia();
                    }}
                    onError={() => {
                      sealLoaded.current = true;
                      tryRevealMedia();
                    }}
                  />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default InviteOpener;

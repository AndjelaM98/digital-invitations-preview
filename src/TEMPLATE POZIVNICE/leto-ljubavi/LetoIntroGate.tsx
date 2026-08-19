import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import AmMonogram from "./AmMonogram";
import { letoAssets } from "./media";
import "./LetoIntroGate.css";

type LetoIntroGateProps = {
  onOpen: () => void;
  onFinished: () => void;
};

type Phase = "idle" | "zoom" | "reveal";

const ZOOM_MS = 2000;
const REVEAL_MS = 800;
const OPEN_MS = ZOOM_MS + REVEAL_MS;

const DANCE_Y = "55.5vh";
// traveler has translate(-50% -50%) in CSS so x/y is the center point
// keep the sway symmetric, but bias the whole motion a bit to the left
const PATH_X_START = "47vw";
const PATH_X = ["41vw", "53vw"];
const PATH_DURATION = 14;

const slowEase: [number, number, number, number] = [0.22, 0.03, 0.12, 1];
const zoomEase: [number, number, number, number] = [0.16, 0.62, 0.22, 1];

function LetoIntroGate({ onOpen, onFinished }: LetoIntroGateProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [videoSrc, setVideoSrc] = useState(letoAssets.introDanceWebm);
  const [useBlend, setUseBlend] = useState(false);
  const leaving = phase !== "idle";

  const x = useMotionValue(PATH_X[0]);
  const y = useMotionValue(DANCE_Y);

  useEffect(() => {
    const probe = document.createElement("video");
    probe.preload = "auto";
    probe.muted = true;
    probe.src = letoAssets.introDanceWebm;

    const useMp4 = () => {
      setVideoSrc(letoAssets.introDance);
      setUseBlend(true);
    };

    probe.onloadeddata = () => {
      setVideoSrc(letoAssets.introDanceWebm);
      setUseBlend(false);
    };
    probe.onerror = useMp4;

    if (
      probe.canPlayType('video/webm; codecs="vp9"') === "" &&
      probe.canPlayType('video/webm; codecs="vp8"') === ""
    ) {
      useMp4();
      return;
    }

    probe.load();

    const fallbackTimer = window.setTimeout(() => {
      if (probe.readyState < 2) useMp4();
    }, 2500);

    return () => {
      window.clearTimeout(fallbackTimer);
      probe.onloadeddata = null;
      probe.onerror = null;
      probe.removeAttribute("src");
      probe.load();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    void video.play().catch(() => {});
  }, [reduce, videoSrc]);

  useEffect(() => {
    y.set(DANCE_Y);
    if (reduce) {
      x.set("50vw");
      return;
    }
    if (leaving) return;

    x.set(PATH_X_START);

    const controlsX = animate(x, PATH_X, {
      duration: PATH_DURATION,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });

    return () => {
      controlsX.stop();
    };
  }, [leaving, reduce, x, y]);

  const open = () => {
    if (leaving) return;
    if (reduce) {
      onOpen();
      onFinished();
      return;
    }

    setPhase("zoom");
    onOpen();
    window.setTimeout(() => setPhase("reveal"), ZOOM_MS);
    window.setTimeout(() => onFinished(), OPEN_MS);
  };

  const handleVideoError = () => {
    setVideoSrc(letoAssets.introDance);
    setUseBlend(true);
  };

  return (
    <motion.section
      className={`ll-gate${leaving ? " is-leaving" : ""}${phase === "reveal" ? " is-revealing" : ""}`}
      data-section="gate"
      aria-label="Ulaz u pozivnicu"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: slowEase }}
    >
      <div className="ll-gate__stage">
        {!leaving ? (
          <motion.div
            className="ll-gate__monogram-wrap"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: reduce ? 0 : 0.2, ease: slowEase }}
          >
            <AmMonogram className="ll-gate__monogram" />
          </motion.div>
        ) : null}

        <motion.div className="ll-gate__motion" style={{ x, y }}>
          <div className="ll-gate__traveler">
            <motion.div
              className="ll-gate__figure"
              animate={
                phase === "zoom" || phase === "reveal"
                  ? { scale: 5.5, opacity: phase === "reveal" ? 0 : 1 }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                phase === "zoom" || phase === "reveal"
                  ? {
                      duration:
                        phase === "reveal" ? REVEAL_MS / 1000 : ZOOM_MS / 1000,
                      ease: zoomEase,
                    }
                  : { duration: 0.4, ease: slowEase }
              }
            >
              <video
                ref={videoRef}
                className={`ll-gate__video${useBlend ? " ll-gate__video--blend" : " ll-gate__video--alpha"}`}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onError={handleVideoError}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {!leaving ? (
        <motion.button
          type="button"
          className="ll-gate__cta"
          onClick={open}
          aria-label="Otvori pozivnicu"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.4, ease: slowEase }}
          whileHover={reduce ? undefined : { scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          Klikni i uđi u ples
        </motion.button>
      ) : null}
    </motion.section>
  );
}

export default LetoIntroGate;

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

const ZOOM_MS = 1550;
const REVEAL_MS = 580;
const OPEN_MS = ZOOM_MS + REVEAL_MS;

const SWAY_DURATION = 14;

const slowEase: [number, number, number, number] = [0.22, 0.03, 0.12, 1];
const zoomEase: [number, number, number, number] = [0.22, 0.08, 0.18, 1];

function isMobileGate() {
  return window.matchMedia("(max-width: 719px)").matches;
}

function getZoomPlan() {
  if (isMobileGate()) {
    return {
      scale: 4.1,
      // Optical center of the couple after object-position shift
      origin: "50% 28%",
    };
  }
  return {
    scale: 5.4,
    origin: "52% 24%",
  };
}

function LetoIntroGate({ onOpen, onFinished }: LetoIntroGateProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [videoSrc, setVideoSrc] = useState(letoAssets.introDanceWebm);
  const [useBlend, setUseBlend] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 28%");
  const [zoomScale, setZoomScale] = useState(4.1);
  const leaving = phase !== "idle";

  const swayX = useMotionValue(0);

  useEffect(() => {
    const useMp4 = () => {
      setVideoSrc(letoAssets.introDance);
      setUseBlend(true);
    };

    const prefersMp4 =
      window.matchMedia("(max-width: 719px)").matches ||
      /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);

    if (prefersMp4) {
      useMp4();
      return;
    }

    const probe = document.createElement("video");
    probe.preload = "auto";
    probe.muted = true;
    probe.src = letoAssets.introDanceWebm;

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
    if (reduce || leaving) {
      swayX.set(0);
      return;
    }

    // No horizontal sway on phones — keeps dancers optically centered
    if (isMobileGate()) {
      swayX.set(0);
      return;
    }

    const controls = animate(swayX, [-18, 18], {
      duration: SWAY_DURATION,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });

    return () => {
      controls.stop();
    };
  }, [leaving, reduce, swayX]);

  const open = () => {
    if (leaving) return;
    if (reduce) {
      onOpen();
      onFinished();
      return;
    }

    const plan = getZoomPlan();
    setZoomOrigin(plan.origin);
    setZoomScale(plan.scale);
    setPhase("zoom");
    onOpen();

    animate(swayX, 0, { duration: ZOOM_MS / 1000, ease: zoomEase });

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

        <div className="ll-gate__anchor">
          <motion.div className="ll-gate__sway" style={{ x: swayX }}>
            <motion.div
              className="ll-gate__figure"
              style={{ transformOrigin: zoomOrigin }}
              animate={
                phase === "zoom" || phase === "reveal"
                  ? { scale: zoomScale, opacity: phase === "reveal" ? 0 : 1 }
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
              <div
                className={`ll-gate__video-shell${useBlend ? " ll-gate__video-shell--blend" : " ll-gate__video-shell--alpha"}`}
              >
                <video
                  ref={videoRef}
                  className="ll-gate__video"
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={handleVideoError}
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
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

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { InvitationMusic } from "../shared/types";
import "./InviteAmbientMusic.css";

type InviteAmbientMusicProps = {
  music?: InvitationMusic;
  /** Legacy prop — prefer unlockFromGesture on first user tap. */
  unlocked?: boolean;
};

export type InviteAmbientMusicHandle = {
  unlockFromGesture: () => void;
};

function isMobileAudioContext() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

function buildYoutubeEmbed(
  youtubeId: string,
  opts: { startSeconds: number; autoplay: boolean; mute: boolean },
) {
  const startParam = opts.startSeconds > 0 ? `&start=${opts.startSeconds}` : "";
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${opts.autoplay ? 1 : 0}&mute=${opts.mute ? 1 : 0}&controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1${startParam}`;
}

/**
 * Background music for the invite.
 * Must start inside the opener click handler on mobile (unlockFromGesture).
 */
const InviteAmbientMusic = forwardRef<
  InviteAmbientMusicHandle,
  InviteAmbientMusicProps
>(function InviteAmbientMusic({ music, unlocked: unlockedProp = false }, ref) {
  const youtubeId = music?.youtubeId;
  const audioSrc = music?.src;
  const title = music?.title ?? "Naša pesma";
  const startSeconds = Math.max(0, music?.startSeconds ?? 0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mobileRef = useRef(isMobileAudioContext());
  const unlockedRef = useRef(false);

  const [unlocked, setUnlocked] = useState(unlockedProp);
  const [playing, setPlaying] = useState(false);
  const [audible, setAudible] = useState(false);

  const startAudio = useCallback(() => {
    const el = audioRef.current;
    if (!el || !audioSrc) return false;

    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    if (startSeconds > 0 && el.currentTime < startSeconds) {
      el.currentTime = startSeconds;
    }

    const attempt = el.play();
    if (attempt) {
      void attempt.catch(() => setPlaying(false));
    }
    return true;
  }, [audioSrc, startSeconds]);

  const startYoutube = useCallback(
    (mute: boolean) => {
      if (!youtubeId || !iframeRef.current) return false;
      iframeRef.current.src = buildYoutubeEmbed(youtubeId, {
        startSeconds,
        autoplay: true,
        mute,
      });
      return true;
    },
    [startSeconds, youtubeId],
  );

  const unlockFromGesture = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    setUnlocked(true);
    setPlaying(true);

    const mobile = mobileRef.current;

    if (audioSrc) {
      setAudible(true);
      startAudio();
      return;
    }

    if (youtubeId) {
      const startMuted = mobile;
      setAudible(!startMuted);
      startYoutube(startMuted);
    }
  }, [audioSrc, startAudio, startYoutube, youtubeId]);

  useImperativeHandle(ref, () => ({ unlockFromGesture }), [unlockFromGesture]);

  useEffect(() => {
    if (unlockedProp) {
      unlockFromGesture();
    }
  }, [unlockFromGesture, unlockedProp]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioSrc || !unlocked || !playing) return;
    startAudio();
  }, [audioSrc, playing, startAudio, unlocked]);

  if (!youtubeId && !audioSrc) return null;

  const stopPlayback = () => {
    setPlaying(false);
    audioRef.current?.pause();
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
  };

  const resumePlayback = () => {
    setPlaying(true);
    if (audioSrc) {
      startAudio();
      return;
    }
    if (youtubeId) {
      startYoutube(!audible && mobileRef.current);
    }
  };

  const unmuteYoutube = () => {
    setAudible(true);
    startYoutube(false);
  };

  const toggle = () => {
    if (!unlocked) {
      unlockFromGesture();
      return;
    }

    if (playing && youtubeId && !audible && mobileRef.current) {
      unmuteYoutube();
      return;
    }

    if (playing) {
      stopPlayback();
    } else {
      resumePlayback();
    }
  };

  const isAudible = playing && unlocked && (audible || Boolean(audioSrc));

  return (
    <div className="er-ambient">
      {youtubeId ? (
        <iframe
          ref={iframeRef}
          className="er-ambient__frame"
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      ) : null}

      {audioSrc ? (
        <audio ref={audioRef} src={audioSrc} loop preload="auto" playsInline />
      ) : null}

      <button
        type="button"
        className={`er-ambient__btn${isAudible ? " is-on" : ""}`}
        onClick={toggle}
        aria-pressed={isAudible}
        aria-label={isAudible ? "Isključi muziku" : "Uključi muziku"}
      >
        <span className="er-ambient__icon" aria-hidden="true">
          {isAudible ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.3-3.9v7.8A4.5 4.5 0 0 0 16.5 12z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16.5 12a4.5 4.5 0 0 0-2.3-3.9v2.2l2.3 2.3V12zm3.4-7.3-1.4 1.4A7.96 7.96 0 0 1 20.5 12a8 8 0 0 1-2 5.3l1.4 1.4A9.9 9.9 0 0 0 22.5 12c0-2.6-1-5-2.6-6.8zM4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.7 4.7c-.7.5-1.5.8-2.4 1v2.1a7.9 7.9 0 0 0 3.8-1.5L19.7 21 21 19.7 4.3 3zM14 3.2v2.1a5 5 0 0 1 2 1l1.5-1.5A7.4 7.4 0 0 0 14 3.2zM12 6.2 9.9 8.3 12 10.4V6.2z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
});

export default InviteAmbientMusic;

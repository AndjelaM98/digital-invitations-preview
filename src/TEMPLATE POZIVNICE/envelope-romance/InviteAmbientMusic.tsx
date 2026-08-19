import { useEffect, useRef, useState } from "react";

import type { InvitationMusic } from "../shared/types";
import "./InviteAmbientMusic.css";

type InviteAmbientMusicProps = {
  music?: InvitationMusic;
  /** When true, start playback (pass from gate open click). */
  unlocked?: boolean;
};

/**
 * Background music for the invite.
 * Starts when `unlocked` becomes true (gate click / user gesture).
 */
function InviteAmbientMusic({
  music,
  unlocked: unlockedProp = false,
}: InviteAmbientMusicProps) {
  const youtubeId = music?.youtubeId;
  const audioSrc = music?.src;
  const title = music?.title ?? "Naša pesma";
  const startSeconds = Math.max(0, music?.startSeconds ?? 0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [unlocked, setUnlocked] = useState(unlockedProp);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (unlockedProp) {
      setUnlocked(true);
      setPlaying(true);
    }
  }, [unlockedProp]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioSrc || !unlocked) return;
    if (playing) {
      if (startSeconds > 0 && el.currentTime < startSeconds) {
        el.currentTime = startSeconds;
      }
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [unlocked, playing, audioSrc, startSeconds]);

  if (!youtubeId && !audioSrc) return null;

  const toggle = () => {
    setUnlocked(true);
    setPlaying((prev) => !prev);
  };

  const startParam = startSeconds > 0 ? `&start=${startSeconds}` : "";
  const embedSrc = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&modestbranding=1${startParam}`
    : null;

  return (
    <div className="er-ambient">
      {unlocked && playing && embedSrc ? (
        <iframe
          className="er-ambient__frame"
          src={embedSrc}
          title={title}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      ) : null}

      {audioSrc ? (
        <audio ref={audioRef} src={audioSrc} loop preload="metadata" />
      ) : null}

      <button
        type="button"
        className={`er-ambient__btn${playing && unlocked ? " is-on" : ""}`}
        onClick={toggle}
        aria-pressed={playing && unlocked}
        aria-label={
          playing && unlocked ? "Isključi muziku" : "Uključi muziku"
        }
      >
        <span className="er-ambient__icon" aria-hidden="true">
          {playing && unlocked ? (
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
}

export default InviteAmbientMusic;

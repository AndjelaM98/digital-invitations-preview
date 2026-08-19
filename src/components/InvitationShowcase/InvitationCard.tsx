import { memo, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

import { invitationCategoryLabels } from "../../data/invitationLabels";
import type { InvitationTemplate } from "../../types/invitation";

type InvitationCardProps = {
  template: InvitationTemplate;
  mediaEnabled: boolean;
  onSelectTemplate?: (template: InvitationTemplate) => void;
};

function canHoverPlay() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Poster by default. On desktop hover, play this card's video only.
 * Video source is detached on leave so the marquee stays light.
 * Click opens the preview modal (CTA lives there).
 */
function InvitationCardComponent({
  template,
  mediaEnabled,
  onSelectTemplate,
}: InvitationCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detachTimerRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const { media, title, category, accentColor } = template;
  const label = invitationCategoryLabels[category];
  const isVideo = media.type === "video";

  const stillSrc = isVideo
    ? media.poster
    : mediaEnabled
      ? media.src
      : undefined;

  useEffect(() => {
    return () => {
      if (detachTimerRef.current !== null) {
        window.clearTimeout(detachTimerRef.current);
      }
    };
  }, []);

  const clearDetachTimer = () => {
    if (detachTimerRef.current !== null) {
      window.clearTimeout(detachTimerRef.current);
      detachTimerRef.current = null;
    }
  };

  const playOnHover = () => {
    if (!canHoverPlay() || !mediaEnabled || !isVideo) return;

    clearDetachTimer();
    hoveringRef.current = true;

    const video = videoRef.current;
    if (!video) return;

    if (!video.getAttribute("src")) {
      video.src = media.src;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      void playPromise
        .then(() => {
          if (hoveringRef.current) setPlaying(true);
        })
        .catch(() => {
          // Ignore transient autoplay / load races.
        });
    }
  };

  const pauseOnLeave = () => {
    hoveringRef.current = false;
    setPlaying(false);

    const video = videoRef.current;
    if (!video || !isVideo) return;

    video.pause();

    clearDetachTimer();
    detachTimerRef.current = window.setTimeout(() => {
      const current = videoRef.current;
      if (!current || hoveringRef.current) return;
      current.removeAttribute("src");
      current.load();
      detachTimerRef.current = null;
    }, 450);
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    playOnHover();
  };

  return (
    <article
      className={`invitation-card${onSelectTemplate ? " invitation-card--interactive" : ""}${playing ? " is-playing" : ""}`}
      style={
        accentColor
          ? ({ "--invitation-accent": accentColor } as CSSProperties)
          : undefined
      }
      onPointerEnter={handlePointerEnter}
      onPointerLeave={pauseOnLeave}
    >
      <button
        type="button"
        className="invitation-card__hit"
        onClick={() => onSelectTemplate?.(template)}
        aria-label={`Otvori pregled: ${title}`}
      >
        <div className="invitation-card__frame">
          {stillSrc ? (
            <img
              className="invitation-card__media invitation-card__media--poster"
              src={stillSrc}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            <div
              className="invitation-card__media invitation-card__media--placeholder"
              aria-hidden="true"
            />
          )}

          {isVideo && mediaEnabled ? (
            <video
              ref={videoRef}
              className="invitation-card__media invitation-card__media--video"
              muted
              loop
              playsInline
              preload="none"
              poster={media.poster}
              aria-hidden="true"
            />
          ) : null}
        </div>
        <p className="invitation-card__label">{label}</p>
      </button>
    </article>
  );
}

const InvitationCard = memo(
  InvitationCardComponent,
  (prev, next) =>
    prev.template.id === next.template.id &&
    prev.mediaEnabled === next.mediaEnabled &&
    prev.onSelectTemplate === next.onSelectTemplate,
);

export default InvitationCard;

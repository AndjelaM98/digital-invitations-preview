import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useReducedMotion } from "framer-motion";

import type { InvitationTemplate } from "../../types/invitation";
import InvitationCard from "./InvitationCard";

export type InvitationMarqueeHandle = {
  step: (direction: -1 | 1) => void;
  setPaused: (paused: boolean) => void;
};

type InvitationMarqueeProps = {
  templates: InvitationTemplate[];
  mediaEnabled: boolean;
  /** When false, animation loop is fully stopped (no rAF). */
  isActive?: boolean;
  onSelectTemplate?: (template: InvitationTemplate) => void;
};

type StepAnimation = {
  to: number;
};

const STAGGER_OFFSETS = [12, 56, 100, 36, 80, 24];
const CRUISE_SPEED = 48;
const SPEED_LERP = 0.0045;
const STEP_SMOOTH = 3.2;
const STEP_SETTLE_PX = 0.35;

function buildSequence(templates: InvitationTemplate[]): InvitationTemplate[] {
  if (templates.length === 0) return [];

  // Keep the loop short — posters are cheap, but DOM + compositing still costs.
  const density = Math.max(3, templates.length);
  const sequence: InvitationTemplate[] = [];

  for (let i = 0; i < density; i += 1) {
    sequence.push(templates[i % templates.length]);
  }

  return sequence;
}

function normalizeLoop(
  position: number,
  target: number,
  loopWidth: number,
): { position: number; target: number } {
  if (loopWidth <= 0) {
    return { position, target };
  }

  let nextPosition = position;
  let nextTarget = target;

  while (nextPosition <= -loopWidth) {
    nextPosition += loopWidth;
    nextTarget += loopWidth;
  }

  while (nextPosition > 0) {
    nextPosition -= loopWidth;
    nextTarget -= loopWidth;
  }

  return { position: nextPosition, target: nextTarget };
}

const InvitationMarquee = forwardRef<
  InvitationMarqueeHandle,
  InvitationMarqueeProps
>(function InvitationMarquee(
  { templates, mediaEnabled, isActive = true, onSelectTemplate },
  ref,
) {
  const prefersReducedMotion = useReducedMotion();
  const sequence = useMemo(() => buildSequence(templates), [templates]);

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const stepWidthRef = useRef(0);
  const positionRef = useRef(0);
  const targetXRef = useRef(0);
  const speedRef = useRef(CRUISE_SPEED);
  const pausedRef = useRef(false);
  const stepAnimRef = useRef<StepAnimation | null>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const runningRef = useRef(false);

  const handleSelect = useCallback(
    (template: InvitationTemplate) => {
      onSelectTemplate?.(template);
    },
    [onSelectTemplate],
  );

  const applyTransform = (position: number) => {
    positionRef.current = position;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${position}px, 0, 0)`;
    }
  };

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    runningRef.current = false;
    lastTsRef.current = 0;
    if (trackRef.current) {
      trackRef.current.classList.remove("is-cruising");
    }
  }, []);

  const tick = useCallback(
    (ts: number) => {
      rafRef.current = 0;

      if (prefersReducedMotion) {
        stopLoop();
        return;
      }

      const loopWidth = loopWidthRef.current;
      const track = trackRef.current;
      if (loopWidth <= 0 || !track) {
        runningRef.current = false;
        return;
      }

      const last = lastTsRef.current || ts;
      lastTsRef.current = ts;
      const dt = Math.min(ts - last, 32);
      const stepAnim = stepAnimRef.current;

      if (stepAnim) {
        let position = positionRef.current;
        const remaining = stepAnim.to - position;
        const alpha = 1 - Math.exp(-(dt / 1000) * STEP_SMOOTH);
        position += remaining * alpha;

        if (Math.abs(stepAnim.to - position) <= STEP_SETTLE_PX) {
          const settled = normalizeLoop(stepAnim.to, stepAnim.to, loopWidth);
          targetXRef.current = settled.position;
          stepAnimRef.current = null;
          applyTransform(settled.position);
        } else {
          applyTransform(position);
        }
      } else if (pausedRef.current) {
        if (Math.abs(speedRef.current) < 0.15) {
          speedRef.current = 0;
          stopLoop();
          return;
        }
        const blend = Math.min(1, dt * SPEED_LERP);
        speedRef.current += (0 - speedRef.current) * blend;
        let position = positionRef.current;
        position -= (speedRef.current * dt) / 1000;
        ({ position } = normalizeLoop(position, position, loopWidth));
        targetXRef.current = position;
        applyTransform(position);
      } else {
        let position = positionRef.current;
        ({ position } = normalizeLoop(position, position, loopWidth));
        const blend = Math.min(1, dt * SPEED_LERP);
        speedRef.current += (CRUISE_SPEED - speedRef.current) * blend;
        position -= (speedRef.current * dt) / 1000;
        ({ position } = normalizeLoop(position, position, loopWidth));
        targetXRef.current = position;
        applyTransform(position);
      }

      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    },
    [prefersReducedMotion, stopLoop],
  );

  const ensureLoop = useCallback(() => {
    if (prefersReducedMotion || !isActive) return;
    if (runningRef.current) return;
    if (trackRef.current) {
      trackRef.current.classList.add("is-cruising");
    }
    runningRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [isActive, prefersReducedMotion, tick]);

  useEffect(() => {
    const track = trackRef.current;
    const firstSequence = sequenceRef.current;
    if (!track || !firstSequence) return;

    const measure = () => {
      const trackStyles = getComputedStyle(track);
      const trackGap =
        Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0;
      loopWidthRef.current = firstSequence.offsetWidth + trackGap;

      const item = itemRef.current;
      if (item) {
        const sequenceStyles = getComputedStyle(firstSequence);
        const itemGap =
          Number.parseFloat(
            sequenceStyles.columnGap || sequenceStyles.gap || "0",
          ) || 0;
        stepWidthRef.current = item.offsetWidth + itemGap;
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(firstSequence);
    observer.observe(track);
    return () => observer.disconnect();
  }, [sequence]);

  useEffect(() => {
    positionRef.current = 0;
    targetXRef.current = 0;
    speedRef.current = CRUISE_SPEED;
    stepAnimRef.current = null;
    applyTransform(0);
  }, [sequence]);

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      stopLoop();
      return;
    }
    if (!pausedRef.current) {
      ensureLoop();
    }
    return () => stopLoop();
  }, [ensureLoop, isActive, prefersReducedMotion, stopLoop]);

  useImperativeHandle(
    ref,
    () => ({
      step: (direction: -1 | 1) => {
        if (prefersReducedMotion) return;

        const step = stepWidthRef.current;
        const loopWidth = loopWidthRef.current;
        if (step <= 0 || loopWidth <= 0) return;

        const liveFrom = positionRef.current;
        let nextTarget = liveFrom - direction * step;

        const normalized = normalizeLoop(liveFrom, nextTarget, loopWidth);
        positionRef.current = normalized.position;
        targetXRef.current = normalized.target;

        applyTransform(normalized.position);
        stepAnimRef.current = { to: normalized.target };
        speedRef.current = 0;
        ensureLoop();
      },
      setPaused: (paused: boolean) => {
        pausedRef.current = paused;
        if (!paused && isActive) {
          ensureLoop();
        }
      },
    }),
    [ensureLoop, isActive, prefersReducedMotion],
  );

  if (templates.length === 0) {
    return null;
  }

  const renderSequence = (
    keyPrefix: string,
    sequenceDomRef?: typeof sequenceRef,
    attachItemRef = false,
  ) => (
    <div ref={sequenceDomRef} className="invitation-marquee__sequence">
      {sequence.map((template, index) => (
        <div
          key={`${keyPrefix}-${template.id}-${index}`}
          ref={attachItemRef && index === 0 ? itemRef : undefined}
          className="invitation-marquee__item"
          style={{
            marginTop: `calc(var(--marquee-stagger-scale, 1) * ${STAGGER_OFFSETS[index % STAGGER_OFFSETS.length]}px)`,
          }}
        >
          <InvitationCard
            template={template}
            mediaEnabled={mediaEnabled}
            onSelectTemplate={handleSelect}
          />
        </div>
      ))}
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <div className="invitation-marquee invitation-marquee--static">
        {templates.map((template) => (
          <div key={template.id} className="invitation-marquee__item">
            <InvitationCard
              template={template}
              mediaEnabled={mediaEnabled}
              onSelectTemplate={handleSelect}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="invitation-marquee">
      <div ref={trackRef} className="invitation-marquee__track">
        {renderSequence("a", sequenceRef, true)}
        {renderSequence("clone")}
      </div>
    </div>
  );
});

export default InvitationMarquee;

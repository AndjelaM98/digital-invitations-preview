import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type TextMarqueeProps = {
  text: string;
};

const CRUISE_SPEED = 44;
const SPEED_LERP = 0.0045;

function normalizeLoop(position: number, loopWidth: number): number {
  if (loopWidth <= 0) return position;
  let next = position;
  while (next <= -loopWidth) next += loopWidth;
  while (next > 0) next -= loopWidth;
  return next;
}

/** Horizontalni ticker — isti princip kao invitation marquee na sajtu. */
function TextMarquee({ text }: TextMarqueeProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const positionRef = useRef(0);
  const speedRef = useRef(CRUISE_SPEED);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const runningRef = useRef(false);

  const phrase = `${text}     `;

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
    trackRef.current?.classList.remove("is-cruising");
  }, []);

  const tick = useCallback(
    (ts: number) => {
      rafRef.current = 0;
      const loopWidth = loopWidthRef.current;
      if (loopWidth <= 0 || !trackRef.current) {
        runningRef.current = false;
        return;
      }

      const last = lastTsRef.current || ts;
      lastTsRef.current = ts;
      const dt = Math.min(ts - last, 32);

      let position = normalizeLoop(positionRef.current, loopWidth);
      const blend = Math.min(1, dt * SPEED_LERP);
      speedRef.current += (CRUISE_SPEED - speedRef.current) * blend;
      position -= (speedRef.current * dt) / 1000;
      position = normalizeLoop(position, loopWidth);
      applyTransform(position);

      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  const startLoop = useCallback(() => {
    if (reduce || runningRef.current) return;
    trackRef.current?.classList.add("is-cruising");
    runningRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [reduce, tick]);

  useEffect(() => {
    const track = trackRef.current;
    const sequence = sequenceRef.current;
    if (!track || !sequence) return;

    const measure = () => {
      const styles = getComputedStyle(track);
      const gap =
        Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      loopWidthRef.current = sequence.offsetWidth + gap;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sequence);
    observer.observe(track);
    return () => observer.disconnect();
  }, [phrase]);

  useEffect(() => {
    positionRef.current = 0;
    speedRef.current = CRUISE_SPEED;
    applyTransform(0);
  }, [phrase]);

  useEffect(() => {
    if (reduce) {
      stopLoop();
      return;
    }
    startLoop();
    return () => stopLoop();
  }, [reduce, startLoop, stopLoop]);

  const renderSequence = (
    keyPrefix: string,
    domRef?: typeof sequenceRef,
  ) => (
    <div ref={domRef} className="ll-text-marquee__sequence">
      {Array.from({ length: 6 }, (_, index) => (
        <span key={`${keyPrefix}-${index}`} className="ll-text-marquee__item">
          {phrase}
        </span>
      ))}
    </div>
  );

  if (reduce) {
    return (
      <div className="ll-text-marquee ll-text-marquee--static" aria-hidden="true">
        <span className="ll-text-marquee__item">{text}</span>
      </div>
    );
  }

  return (
    <div className="ll-text-marquee" aria-hidden="true">
      <div ref={trackRef} className="ll-text-marquee__track">
        {renderSequence("a", sequenceRef)}
        {renderSequence("b")}
      </div>
    </div>
  );
}

export default TextMarquee;

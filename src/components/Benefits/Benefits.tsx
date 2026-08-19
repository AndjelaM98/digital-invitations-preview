import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";

import { benefitBlocks } from "../../data/benefits";
import "./Benefits.css";

const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1];

const titleGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const titleLine: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easePremium },
  },
};

/** Desktop title travel — ends clearly above the bottom laptop */
const TITLE_TRAVEL_DESKTOP = 125;
const TITLE_TRAVEL_TABLET = 48;
const COMPACT_MQ = "(max-width: 1099px)";
const MOBILE_MQ = "(max-width: 700px)";

function getTitleTravelPx() {
  if (typeof window === "undefined") return TITLE_TRAVEL_DESKTOP;
  if (window.matchMedia(MOBILE_MQ).matches) return 0;
  if (window.matchMedia(COMPACT_MQ).matches) return TITLE_TRAVEL_TABLET;
  return TITLE_TRAVEL_DESKTOP;
}

type BenefitsTitleProps = {
  titleY: MotionValue<number>;
  reduceMotion: boolean | null;
};

/** Isolated so scroll updates never re-render the collage. */
function BenefitsTitle({ titleY, reduceMotion }: BenefitsTitleProps) {
  const initial = reduceMotion ? "visible" : "hidden";

  return (
    <div className="benefits__title-wrap">
      <motion.div className="benefits__title-motion" style={{ y: titleY }}>
        <motion.h2
          className="benefits__title"
          id="benefits-title"
          variants={titleGroup}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.span variants={titleLine}>Osmišljene</motion.span>
          <motion.span variants={titleLine}>
            oko <em>vašeg</em>
          </motion.span>
          <motion.span variants={titleLine}>događaja</motion.span>
        </motion.h2>
      </motion.div>
    </div>
  );
}

/** Same wording — stacked like the center title, with a script accent. */
const noteTitleMarkup: Record<string, ReactNode> = {
  modern: (
    <>
      <span>Moderan i</span>
      <span>
        <em>sofisticiran</em>
      </span>
      <span>izbor</span>
    </>
  ),
  simple: (
    <>
      <span>
        <em>Jednostavno</em>
      </span>
      <span>i bez stresa</span>
    </>
  ),
  "all-in-one": (
    <>
      <span>Sve na</span>
      <span>
        <em>jednom</em> mestu
      </span>
    </>
  ),
  communication: (
    <>
      <span>Laka</span>
      <span>
        <em>komunikacija</em>
      </span>
      <span className="benefits__note-nowrap">sa gostima</span>
    </>
  ),
  rsvp: (
    <>
      <span>
        Jednostavan <span className="benefits__note-rsvp">RSVP</span>
      </span>
    </>
  ),
};

function Benefits() {
  const compositionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Direct scrub — same travel mapping, no spring chase during scroll.
  const titleY = useMotionValue(0);

  useEffect(() => {
    const el = compositionRef.current;
    if (!el) return;

    if (reduceMotion) {
      titleY.set(0);
      return;
    }

    let travel = getTitleTravelPx();
    let viewH = window.innerHeight;
    let start = viewH * 0.9;
    let end = viewH * 0.2;
    let range = start - end;
    /** Document Y of composition top — refreshed on resize, not every scroll. */
    let docTop = 0;
    let rafId = 0;
    let lastApplied = Number.NaN;

    const cacheDocTop = () => {
      docTop = el.getBoundingClientRect().top + window.scrollY;
    };

    const refreshMetrics = () => {
      travel = getTitleTravelPx();
      viewH = window.innerHeight;
      start = viewH * 0.9;
      end = viewH * 0.2;
      range = start - end;
      cacheDocTop();
    };

    const applyProgress = () => {
      rafId = 0;

      if (travel <= 0 || range === 0) {
        if (lastApplied !== 0) {
          lastApplied = 0;
          titleY.set(0);
        }
        return;
      }

      // Same mapping as before: rect.top ≈ docTop - scrollY
      const rectTop = docTop - window.scrollY;
      const progress = (start - rectTop) / range;
      const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      const next = clamped * travel;

      if (lastApplied === next) return;
      lastApplied = next;
      titleY.set(next);
    };

    const scheduleUpdate = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(applyProgress);
    };

    const onResize = () => {
      refreshMetrics();
      lastApplied = Number.NaN;
      scheduleUpdate();
    };

    refreshMetrics();
    applyProgress();

    let listening = false;
    const startListening = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
    };
    const stopListening = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", scheduleUpdate);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cacheDocTop();
          startListening();
          scheduleUpdate();
        } else {
          stopListening();
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      stopListening();
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [reduceMotion, titleY]);

  return (
    <section className="benefits" id="benefits" aria-labelledby="benefits-title">
      <div className="benefits__inner">
        <div ref={compositionRef} className="benefits__composition">
          <BenefitsTitle titleY={titleY} reduceMotion={reduceMotion} />

          <div className="benefits__gallery">
            {benefitBlocks.map((block) => (
              <div
                key={block.id}
                className={`benefits__block ${block.blockClass}`}
              >
                <figure className={`benefits__shot ${block.shot.shotClass}`}>
                  <img
                    src={block.shot.src}
                    alt={block.shot.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </figure>

                <article className={`benefits__note ${block.note.noteClass}`}>
                  <h3 className="benefits__note-title">
                    {noteTitleMarkup[block.note.id] ?? block.note.title}
                  </h3>
                  <p className="benefits__note-body">{block.note.body}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Benefits;

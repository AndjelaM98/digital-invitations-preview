import { motion, useReducedMotion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import {
  invitationEase,
  invitationTransition,
  revealFade,
} from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { TimelineIcon } from "../components/TimelineIcons";
import SectionScrollShadow from "../components/SectionScrollShadow";

type TimelineSectionProps = {
  content: InvitationContent;
};

function TimelineSection({ content }: TimelineSectionProps) {
  const { timeline } = content;
  const reduceMotion = useReducedMotion();

  if (!timeline?.length) return null;

  return (
    <ScrollReveal as="section" className="sf-section" variants={revealFade}>
      <article
        className="sf-timeline-section"
        data-section="timeline"
        aria-label="Dan venčanja"
      >
        <SectionScrollShadow>
          <motion.div
            className="sf-striped-frame"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease: invitationEase }}
          >
            <div className="sf-striped-frame__inner sf-striped-frame__inner--timeline">
              <h2 className="sf-heading sf-heading--timeline">Dan venčanja</h2>
              <span className="sf-ornament" aria-hidden="true">
                <span className="sf-ornament__line" />
                <span className="sf-ornament__diamond" />
                <span className="sf-ornament__line" />
              </span>

              <ol className="sf-timeline">
                {timeline.map((item, index) => (
                  <motion.li
                    key={item.id}
                    className="sf-timeline__item"
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      ...invitationTransition,
                      delay: reduceMotion ? 0 : index * 0.08,
                      ease: invitationEase,
                    }}
                  >
                    <span className="sf-timeline__time">{item.time}</span>

                    <motion.span
                      className="sf-timeline__icon-wrap"
                      animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }}
                      transition={
                        reduceMotion
                          ? undefined
                          : {
                              duration: 2.6,
                              repeat: Infinity,
                              delay: index * 0.2,
                              ease: "easeInOut",
                            }
                      }
                    >
                      <TimelineIcon
                        name={item.icon}
                        className="sf-timeline__icon"
                      />
                    </motion.span>

                    {item.title ? (
                      <span className="sf-timeline__title">{item.title}</span>
                    ) : (
                      <span className="sf-timeline__title" aria-hidden="true" />
                    )}
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        </SectionScrollShadow>
      </article>
    </ScrollReveal>
  );
}

export default TimelineSection;

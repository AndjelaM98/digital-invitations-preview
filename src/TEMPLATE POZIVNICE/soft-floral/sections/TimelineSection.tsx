import { motion, useReducedMotion } from "framer-motion";

import ScrollReveal from "../../shared/ScrollReveal";
import { invitationEase, invitationTransition, revealScale } from "../../shared/motion";
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
    <ScrollReveal as="section" className="sf-section" variants={revealScale}>
      <article
        className="sf-timeline-section"
        data-section="timeline"
        aria-label="Dan venčanja"
      >
        <SectionScrollShadow>
          <motion.div
            className="sf-striped-frame"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: invitationEase }}
          >
            <div className="sf-striped-frame__inner sf-striped-frame__inner--timeline">
              <h2 className="sf-heading">Dan venčanja</h2>

              <ul className="sf-timeline">
                {timeline.map((item, index) => (
                  <motion.li
                    key={item.id}
                    className="sf-timeline__item"
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 18, scale: 0.9 }
                    }
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      ...invitationTransition,
                      delay: reduceMotion ? 0 : index * 0.1,
                      ease: invitationEase,
                    }}
                  >
                    <motion.span
                      className="sf-timeline__icon-wrap"
                      animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                      transition={
                        reduceMotion
                          ? undefined
                          : {
                              duration: 2.4,
                              repeat: Infinity,
                              delay: index * 0.25,
                              ease: "easeInOut",
                            }
                      }
                    >
                      <TimelineIcon
                        name={item.icon}
                        className="sf-timeline__icon"
                      />
                    </motion.span>
                    <span className="sf-timeline__time">{item.time}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </SectionScrollShadow>
      </article>
    </ScrollReveal>
  );
}

export default TimelineSection;

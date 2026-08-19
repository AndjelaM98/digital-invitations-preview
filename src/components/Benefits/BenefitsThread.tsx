import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { invitationProcessSteps } from "../../data/benefits";
import "./BenefitsThread.css";

const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePremium },
  },
};

const railGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const stationReveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easePremium },
  },
};

/**
 * Horizontal process ribbon — how a digital invitation comes to life.
 */
function BenefitsThread() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "visible" : "hidden";

  return (
    <section
      className="benefits-thread"
      id="benefits-thread"
      aria-labelledby="benefits-thread-title"
    >
      <div className="benefits-thread__inner">
        <motion.header
          className="benefits-thread__header"
          variants={headerGroup}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <motion.p className="benefits-thread__eyebrow" variants={fadeUp}>
            kako nastaje
          </motion.p>
          <motion.h2
            className="benefits-thread__title"
            id="benefits-thread-title"
            variants={fadeUp}
          >
            Od prve ideje do <em>vaše</em> pozivnice
          </motion.h2>
        </motion.header>

        <motion.div
          className="benefits-thread__ribbon"
          variants={railGroup}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="benefits-thread__hairline" aria-hidden="true">
            <span className="benefits-thread__hairline-fill" />
          </div>

          <ul className="benefits-thread__stations">
            {invitationProcessSteps.map((step, index) => {
              const numeral = String(index + 1).padStart(2, "0");

              return (
                <motion.li
                  key={step.id}
                  className="benefits-thread__station"
                  variants={stationReveal}
                >
                  <span className="benefits-thread__dot" aria-hidden="true" />
                  <span className="benefits-thread__numeral" aria-hidden="true">
                    {numeral}
                  </span>
                  <h3 className="benefits-thread__station-title">
                    <span>{step.titleLines[0]}</span>
                    <span>{step.titleLines[1]}</span>
                  </h3>
                  <p className="benefits-thread__station-body">{step.body}</p>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export default BenefitsThread;

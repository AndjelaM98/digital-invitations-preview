import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

import InvitationShell from "../shared/InvitationShell";
import { invitationEase } from "../shared/motion";
import type { InvitationContent } from "../shared/types";
import { SOFT_FLORAL_ID, softFloralConfig } from "./config";
import { backgroundImage, softFloralDemoContent } from "./content";
import FlowerGateOpener from "./scenes/FlowerGateOpener";
import {
  ClosingSection,
  DetailsSection,
  HeroSection,
  MainEventSection,
  RsvpSection,
  TimelineSection,
} from "./sections";
import "./SoftFloral.css";

export { SOFT_FLORAL_ID, softFloralConfig };

export const softFloralMeta = {
  id: softFloralConfig.id,
  title: softFloralConfig.title,
  sections: softFloralConfig.sections,
} as const;

type SoftFloralProps = {
  content?: InvitationContent;
};

function SoftFloral({ content = softFloralDemoContent }: SoftFloralProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"gate" | "opening" | "entered">("gate");
  const invitationReady = phase !== "gate";
  const { couple } = content;

  return (
    <InvitationShell templateId={SOFT_FLORAL_ID} className="soft-floral">
      <AnimatePresence>
        {phase !== "entered" ? (
          <FlowerGateOpener
            key="flower-gate"
            partnerOne={couple.partnerOne}
            partnerTwo={couple.partnerTwo}
            joiner={couple.joiner}
            leaving={phase === "opening"}
            onOpen={() => setPhase("opening")}
            onComplete={() => setPhase("entered")}
          />
        ) : null}
      </AnimatePresence>

      {invitationReady ? (
        <div className="sf-content" ref={containerRef}>
          <div className="sf-bg-column" aria-hidden="true">
            <motion.img
              className="sf-bg__image"
              src={backgroundImage}
              alt=""
              draggable={false}
              initial={
                reduceMotion
                  ? false
                  : {
                      filter: "blur(28px) saturate(1.08)",
                      opacity: 0.45,
                      scale: 1.16,
                    }
              }
              animate={{
                filter: "blur(5px) saturate(1.08)",
                opacity: 0.82,
                scale: 1.06,
              }}
              transition={{ duration: 2.4, ease: invitationEase }}
            />
          </div>

          <HeroSection content={content} />
          <MainEventSection content={content} />
          <TimelineSection content={content} />
          <DetailsSection content={content} />
          <RsvpSection content={content} />
          <ClosingSection content={content} />
        </div>
      ) : null}
    </InvitationShell>
  );
}

export default SoftFloral;

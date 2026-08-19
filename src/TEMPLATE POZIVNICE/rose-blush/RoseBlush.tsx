import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import InvitationShell from "../shared/InvitationShell";
import type { InvitationContent } from "../shared/types";
import FlyingButterflies from "./components/FlyingButterflies";
import { ROSE_BLUSH_ID, roseBlushConfig } from "./config";
import { roseBlushDemoContent } from "./content";
import DateIntroOpener from "./scenes/DateIntroOpener";
import {
  ClosingSection,
  CountdownSection,
  DressCodeSection,
  GallerySection,
  HeroSection,
  ReceptionSection,
  RsvpSection,
  TimelineSection,
} from "./sections";
import "./RoseBlush.css";

export { ROSE_BLUSH_ID, roseBlushConfig };

export const roseBlushMeta = {
  id: roseBlushConfig.id,
  title: roseBlushConfig.title,
  sections: roseBlushConfig.sections,
} as const;

type RoseBlushProps = {
  content?: InvitationContent;
};

function RoseBlush({ content = roseBlushDemoContent }: RoseBlushProps) {
  const [phase, setPhase] = useState<"intro" | "entered">("intro");
  const { couple } = content;

  return (
    <InvitationShell templateId={ROSE_BLUSH_ID} className="rose-blush">
      <AnimatePresence>
        {phase === "intro" ? (
          <DateIntroOpener
            key="date-intro"
            eventDateIso={content.eventDateIso}
            initialOne={couple.partnerOne.slice(0, 1).toUpperCase()}
            initialTwo={couple.partnerTwo.slice(0, 1).toUpperCase()}
            onComplete={() => setPhase("entered")}
          />
        ) : null}
      </AnimatePresence>

      {phase === "entered" ? (
        <div className="qb-page">
          <FlyingButterflies />
          <HeroSection content={content} />
          <GallerySection content={content} />
          <CountdownSection content={content} />
          <TimelineSection content={content} />
          <ReceptionSection content={content} />
          <DressCodeSection content={content} />
          <RsvpSection content={content} />
          <ClosingSection content={content} />
        </div>
      ) : null}
    </InvitationShell>
  );
}

export default RoseBlush;

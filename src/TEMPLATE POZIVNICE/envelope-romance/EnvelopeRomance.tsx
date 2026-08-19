import { useCallback, useEffect, useState } from "react";

import InvitationShell from "../shared/InvitationShell";
import type { InvitationContent } from "../shared/types";
import {
  ENVELOPE_ROMANCE_ID,
  envelopeRomanceConfig,
} from "./config";
import { envelopeRomanceDemoContent } from "./content";
import InviteAmbientMusic from "./InviteAmbientMusic";
import InviteOpener from "./InviteOpener";
import {
  ClosingSection,
  CountdownSection,
  DressCodeSection,
  HeroSection,
  HotelsSection,
  ParentsSection,
  RsvpSection,
  StorySection,
  TimelineSection,
  VenueSection,
} from "./sections";
import "./EnvelopeRomance.css";

export { ENVELOPE_ROMANCE_ID, envelopeRomanceConfig };

export const envelopeRomanceMeta = {
  id: envelopeRomanceConfig.id,
  title: envelopeRomanceConfig.title,
  sections: envelopeRomanceConfig.sections,
} as const;

type EnvelopeRomanceProps = {
  content?: InvitationContent;
};

function EnvelopeRomance({
  content = envelopeRomanceDemoContent,
}: EnvelopeRomanceProps) {
  const [showOpener, setShowOpener] = useState(true);

  const dismissOpener = useCallback(() => setShowOpener(false), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = showOpener ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showOpener]);

  return (
    <>
      <InvitationShell
        templateId={ENVELOPE_ROMANCE_ID}
        className="envelope-romance envelope-romance--invite"
        aria-hidden={showOpener}
      >
        <InviteAmbientMusic music={content.music} unlocked={!showOpener} />
        <HeroSection content={content} />
        <StorySection content={content} />
        <ParentsSection content={content} />
        <CountdownSection content={content} />
        <VenueSection content={content} />
        <TimelineSection content={content} />
        <DressCodeSection content={content} />
        <HotelsSection content={content} />
        <RsvpSection content={content} />
        <ClosingSection content={content} />
      </InvitationShell>

      {showOpener ? (
        <InviteOpener content={content} onFinished={dismissOpener} />
      ) : null}
    </>
  );
}

export default EnvelopeRomance;

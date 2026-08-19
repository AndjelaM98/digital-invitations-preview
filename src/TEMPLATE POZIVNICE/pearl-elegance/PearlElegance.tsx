import { useCallback, useEffect, useRef, useState } from "react";

import InvitationShell from "../shared/InvitationShell";
import type { InvitationContent } from "../shared/types";
import { PEARL_ELEGANCE_ID, pearlEleganceConfig } from "./config";
import { pearlEleganceDemoContent, type PearlEleganceContent } from "./content";
import InviteOpener from "./InviteOpener";
import InviteAmbientMusic, {
  type InviteAmbientMusicHandle,
} from "../envelope-romance/InviteAmbientMusic";
import { PearlRevealContext } from "./reveal";
import {
  CalendarSection,
  CinematicSection,
  ClosingSection,
  CountdownSection,
  DressCodeSection,
  HeroSection,
  InviteSection,
  ProgramSection,
  RsvpSection,
  VenueSection,
} from "./sections";
import "./PearlElegance.css";

export { PEARL_ELEGANCE_ID, pearlEleganceConfig };

export const pearlEleganceMeta = {
  id: pearlEleganceConfig.id,
  title: pearlEleganceConfig.title,
  sections: pearlEleganceConfig.sections,
} as const;

type PearlEleganceProps = {
  content?: InvitationContent;
};

function isPearlContent(
  content: InvitationContent,
): content is PearlEleganceContent {
  return "invite" in content || "dateDigits" in content;
}

/**
 * Pearl Elegance template.
 * Premium pearl-adorned wedding invitation with cream + taupe sections
 * and soft, scroll-triggered slide-in motion. Fully data-driven via content.
 */
function PearlElegance({ content }: PearlEleganceProps) {
  const data: PearlEleganceContent =
    content && isPearlContent(content)
      ? content
      : pearlEleganceDemoContent;
  const [showOpener, setShowOpener] = useState(true);
  const musicRef = useRef<InviteAmbientMusicHandle>(null);

  const dismissOpener = useCallback(() => {
    window.scrollTo(0, 0);
    setShowOpener(false);
  }, []);

  const unlockMusic = useCallback(() => {
    musicRef.current?.unlockFromGesture();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = showOpener ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showOpener]);

  return (
    <>
      <PearlRevealContext.Provider value={!showOpener}>
        <InvitationShell
          templateId={PEARL_ELEGANCE_ID}
          className="pearl-elegance"
          aria-hidden={showOpener}
        >
          <InviteAmbientMusic ref={musicRef} music={data.music} />
          <HeroSection content={data} />
          <InviteSection content={data} />
          <CalendarSection content={data} />
          <CountdownSection content={data} />
          <CinematicSection content={data} />
          <VenueSection content={data} />
          <ProgramSection content={data} />
          <DressCodeSection content={data} />
          <RsvpSection content={data} />
          <ClosingSection content={data} />
        </InvitationShell>
      </PearlRevealContext.Provider>

      {showOpener ? (
        <div className="pe-invite-cover" aria-hidden="true" />
      ) : null}

      {showOpener ? (
        <InviteOpener
          content={data}
          onFinished={dismissOpener}
          onMusicUnlock={unlockMusic}
        />
      ) : null}
    </>
  );
}

export default PearlElegance;

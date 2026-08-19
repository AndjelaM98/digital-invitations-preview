import { useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import showcaseAtmosphere from "../../assets/backgrounds/invitation-botanical-atmosphere-sm.jpg";
import { invitationTemplates } from "../../data/invitations";
import type { InvitationTemplate } from "../../types/invitation";
import Container from "../layout/Container";
import InvitationMarquee from "./InvitationMarquee";
import type { InvitationMarqueeHandle } from "./InvitationMarquee";
import InvitationPreviewModal from "./InvitationPreviewModal";
import "./InvitationShowcase.css";

type InvitationShowcaseProps = {
  templates?: InvitationTemplate[];
  className?: string;
};

function InvitationShowcase({
  templates = invitationTemplates,
  className = "",
}: InvitationShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<InvitationMarqueeHandle>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const hoverRef = useRef(false);
  const manualPauseRef = useRef(false);
  const modalOpenRef = useRef(false);

  const isInView = useInView(sectionRef, { amount: 0.15, once: false });
  const reduceMotion = useReducedMotion();
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<InvitationTemplate | null>(null);

  useEffect(() => {
    if (isInView) setMediaEnabled(true);
  }, [isInView]);

  const syncPaused = useCallback(() => {
    const paused =
      !isInView ||
      hoverRef.current ||
      manualPauseRef.current ||
      modalOpenRef.current;
    marqueeRef.current?.setPaused(paused);
  }, [isInView]);

  useEffect(() => {
    syncPaused();
  }, [syncPaused, selectedTemplate]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseForInteraction = useCallback(() => {
    clearResumeTimer();
    manualPauseRef.current = true;
    syncPaused();
  }, [clearResumeTimer, syncPaused]);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      manualPauseRef.current = false;
      resumeTimerRef.current = null;
      syncPaused();
    }, 800);
  }, [clearResumeTimer, syncPaused]);

  useEffect(() => {
    return () => clearResumeTimer();
  }, [clearResumeTimer]);

  const handleStep = (direction: -1 | 1) => {
    if (reduceMotion) return;
    pauseForInteraction();
    marqueeRef.current?.step(direction);
    scheduleResume();
  };

  const handleSelectTemplate = useCallback(
    (template: InvitationTemplate) => {
      clearResumeTimer();
      manualPauseRef.current = true;
      modalOpenRef.current = true;
      setSelectedTemplate(template);
      marqueeRef.current?.setPaused(true);
    },
    [clearResumeTimer],
  );

  const handleCloseModal = () => {
    modalOpenRef.current = false;
    setSelectedTemplate(null);
    scheduleResume();
  };

  return (
    <section
      ref={sectionRef}
      id="invitation-showcase"
      className={`invitation-showcase ${className}`.trim()}
      aria-label="Prikaz primera digitalnih pozivnica"
    >
      <div className="invitation-showcase__atmosphere" aria-hidden="true">
        {mediaEnabled ? (
          <img
            className="invitation-showcase__bg"
            src={showcaseAtmosphere}
            alt=""
            decoding="async"
            loading="lazy"
          />
        ) : null}
        <div className="invitation-showcase__wash" />
        <div className="invitation-showcase__ground" />
      </div>

      <Container className="invitation-showcase__container">
        <div
          className="col-12 invitation-showcase__stage"
          onMouseEnter={() => {
            hoverRef.current = true;
            syncPaused();
          }}
          onMouseLeave={() => {
            hoverRef.current = false;
            syncPaused();
          }}
        >
          <button
            type="button"
            className="invitation-showcase__arrow invitation-showcase__arrow--prev"
            aria-label="Prethodna pozivnica"
            onClick={() => handleStep(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <InvitationMarquee
            ref={marqueeRef}
            templates={templates}
            mediaEnabled={mediaEnabled}
            isActive={isInView && !reduceMotion}
            onSelectTemplate={handleSelectTemplate}
          />

          <button
            type="button"
            className="invitation-showcase__arrow invitation-showcase__arrow--next"
            aria-label="Sledeća pozivnica"
            onClick={() => handleStep(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </Container>

      <InvitationPreviewModal
        template={selectedTemplate}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default InvitationShowcase;

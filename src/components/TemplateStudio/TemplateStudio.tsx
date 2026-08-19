import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import {
  createTemplateShareSlug,
  initialTemplateStudioDraft,
} from "../../data/templateStudio";
import { invitationPlatform } from "../../platform/client";
import type { InvitationId } from "../../types/invitationPlatform";
import {
  TEMPLATE_STUDIO_STEPS,
  type TemplateStudioDraft,
  type TemplateStudioStepId,
} from "../../types/templateStudio";
import "../Rsvp/Rsvp.css";
import TemplatePreview from "./TemplatePreview";
import TemplateProgress from "./TemplateProgress";
import StepFill from "./steps/StepFill";
import StepGosti from "./steps/StepGosti";
import StepLink from "./steps/StepLink";
import StepPhotos from "./steps/StepPhotos";
import StepReview from "./steps/StepReview";
import StepTemplate from "./steps/StepTemplate";
import "./studio-shell.css";
import "./TemplateStudio.css";

const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1];

function TemplateStudio() {
  const reduceMotion = useReducedMotion();
  const [stepId, setStepId] = useState<TemplateStudioStepId>("template");
  const [draft, setDraft] = useState<TemplateStudioDraft>(
    initialTemplateStudioDraft,
  );
  const [viewMode, setViewMode] = useState<"compose" | "preview">("compose");
  const [invitationId, setInvitationId] = useState<InvitationId | null>(null);
  const [rsvpRefreshKey, setRsvpRefreshKey] = useState(0);
  const [publishing, setPublishing] = useState(false);

  const stepIndex = TEMPLATE_STUDIO_STEPS.findIndex(
    (step) => step.id === stepId,
  );
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= TEMPLATE_STUDIO_STEPS.length - 1;

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const slug =
        draft.shareSlug ??
        createTemplateShareSlug(
          draft.content.partnerOne,
          draft.content.partnerTwo,
        );
      const invitation = await invitationPlatform.publish({
        slug,
        templateId: draft.templateId,
        content: draft.content,
        expectedGuestCount: draft.content.expectedGuestCount,
      });
      setDraft((prev) => ({ ...prev, shareSlug: invitation.slug }));
      setInvitationId(invitation.id);
      setRsvpRefreshKey((key) => key + 1);
    } finally {
      setPublishing(false);
    }
  }, [draft.content, draft.shareSlug, draft.templateId]);

  const handleRsvpSubmitted = useCallback(() => {
    setRsvpRefreshKey((key) => key + 1);
  }, []);

  const stepPanel = useMemo(() => {
    switch (stepId) {
      case "template":
        return (
          <StepTemplate
            templateId={draft.templateId}
            onSelect={(templateId) =>
              setDraft((prev) => ({ ...prev, templateId }))
            }
          />
        );
      case "fill":
        return (
          <StepFill
            content={draft.content}
            onChange={(content) => setDraft((prev) => ({ ...prev, content }))}
          />
        );
      case "photos":
        return (
          <StepPhotos
            photos={draft.content.photos}
            onChange={(photos) =>
              setDraft((prev) => ({
                ...prev,
                content: { ...prev.content, photos },
              }))
            }
          />
        );
      case "review":
        return <StepReview draft={draft} />;
      case "link":
        return (
          <StepLink
            shareSlug={draft.shareSlug}
            publishing={publishing}
            onPublish={() => {
              void handlePublish();
            }}
          />
        );
      case "gosti":
        return (
          <StepGosti
            invitationId={invitationId}
            refreshKey={rsvpRefreshKey}
          />
        );
      default:
        return null;
    }
  }, [
    draft,
    handlePublish,
    invitationId,
    publishing,
    rsvpRefreshKey,
    stepId,
  ]);

  const goTo = (next: TemplateStudioStepId) => {
    setStepId(next);
    setViewMode("compose");
  };

  const goPrev = () => {
    if (isFirst) return;
    setStepId(TEMPLATE_STUDIO_STEPS[stepIndex - 1].id);
    setViewMode("compose");
  };

  const goNext = () => {
    if (isLast) return;
    setStepId(TEMPLATE_STUDIO_STEPS[stepIndex + 1].id);
    setViewMode("compose");
  };

  return (
    <section
      className="invitation-studio template-studio"
      id="template-studio"
      aria-labelledby="template-studio-title"
    >
      <div className="invitation-studio__inner">
        <header className="invitation-studio__intro">
          <p className="invitation-studio__eyebrow">Template atelier</p>
          <div className="invitation-studio__intro-row">
            <div>
              <h2
                className="invitation-studio__title"
                id="template-studio-title"
              >
                Izaberite šablon,
                <em> popunite podatke</em>
              </h2>
              <p className="invitation-studio__lede">
                Kompletna wedding stranica: šablon, podaci, galerija, objava,
                RSVP i dashboard, u jednom toku.
              </p>
            </div>

            <div
              className="invitation-studio__mode"
              role="group"
              aria-label="Prikaz"
            >
              <button
                type="button"
                className={viewMode === "compose" ? "is-active" : ""}
                onClick={() => setViewMode("compose")}
              >
                Kreiranje
              </button>
              <button
                type="button"
                className={viewMode === "preview" ? "is-active" : ""}
                onClick={() => setViewMode("preview")}
              >
                Pregled
              </button>
            </div>
          </div>
        </header>

        <TemplateProgress current={stepId} onSelect={goTo} />

        <div
          className={`invitation-studio__stage${viewMode === "preview" ? " is-preview" : ""}`}
        >
          <div className="invitation-studio__panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepId}
                className="invitation-studio__panel-motion"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: easePremium }}
              >
                {stepPanel}
              </motion.div>
            </AnimatePresence>

            <div className="invitation-studio__nav">
              <button
                type="button"
                className="studio-ghost"
                onClick={goPrev}
                disabled={isFirst}
              >
                Nazad
              </button>
              {!isLast ? (
                <button
                  type="button"
                  className="studio-primary"
                  onClick={goNext}
                >
                  Nastavi
                </button>
              ) : (
                <span className="invitation-studio__nav-note">
                  Platforma: pozivnica + RSVP + dashboard
                </span>
              )}
            </div>
          </div>

          <aside
            className="invitation-studio__preview-col"
            aria-label="Preview template pozivnice"
          >
            <p className="invitation-studio__preview-label">
              {stepId === "gosti"
                ? "Gostova pozivnica (testiraj RSVP)"
                : "Live template render"}
            </p>
            <TemplatePreview
              draft={draft}
              invitationId={invitationId}
              onRsvpSubmitted={handleRsvpSubmitted}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default TemplateStudio;

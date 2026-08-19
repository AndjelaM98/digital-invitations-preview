import { getPreparedTemplate } from "../../../data/templateStudio";
import type { TemplateStudioDraft } from "../../../types/templateStudio";

type StepReviewProps = {
  draft: TemplateStudioDraft;
};

function StepReview({ draft }: StepReviewProps) {
  const template = getPreparedTemplate(draft.templateId);
  const { content } = draft;
  const filledSchedule = content.schedule.filter(
    (item) => item.time.trim() || item.title.trim(),
  ).length;
  const filledContacts = content.contacts.filter(
    (item) => item.name.trim() || item.phone.trim(),
  ).length;
  const galleryCount = content.photos.galleryPreviewUrls.length;

  return (
    <div className="studio-step">
      <header className="studio-step__header">
        <p className="studio-step__eyebrow">Četvrti korak</p>
        <h3 className="studio-step__title">Pregled pre slanja</h3>
        <p className="studio-step__lede">
          Desno je live wedding stranica, cover, priča, raspored, galerija,
          lokacija i RSVP.
        </p>
      </header>

      <ul className="template-review">
        <li>
          <span>Šablon</span>
          <strong>
            {template.name} · {template.label}
          </strong>
        </li>
        <li>
          <span>Par</span>
          <strong>
            {(content.partnerOne.trim() || "...") +
              " & " +
              (content.partnerTwo.trim() || "...")}
          </strong>
        </li>
        <li>
          <span>Datum</span>
          <strong>{content.eventDate || "..."}</strong>
        </li>
        <li>
          <span>Lokacija</span>
          <strong>
            {[content.venue, content.city]
              .map((part) => part.trim())
              .filter(Boolean)
              .join(", ") || "..."}
          </strong>
        </li>
        <li>
          <span>Cover</span>
          <strong>{content.photos.coverPreviewUrl ? "Da" : "Ne"}</strong>
        </li>
        <li>
          <span>Galerija</span>
          <strong>{galleryCount}</strong>
        </li>
        <li>
          <span>Stavke rasporeda</span>
          <strong>{filledSchedule}</strong>
        </li>
        <li>
          <span>Kontakti</span>
          <strong>{filledContacts}</strong>
        </li>
        <li>
          <span>RSVP rok</span>
          <strong>{content.rsvpDeadline.trim() || "..."}</strong>
        </li>
      </ul>
    </div>
  );
}

export default StepReview;

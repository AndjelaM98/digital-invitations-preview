import ScrollReveal from "../../shared/ScrollReveal";
import type { InvitationContent } from "../../shared/types";
import heroFloralImage from "../assets/hero-floral.png";

type GiftsSectionProps = {
  content: InvitationContent;
};

function GiftsSection({ content }: GiftsSectionProps) {
  const { gifts } = content;
  if (!gifts) return null;

  return (
    <ScrollReveal
      as="section"
      className="sf-section sf-section--flush"
    >
      <div
        className="sf-gifts"
        data-section="gifts"
        style={{ backgroundImage: `url(${heroFloralImage})` }}
      >
        <article className="sf-gifts__card" aria-label="Pokloni">
          <h2 className="sf-gifts__title">{gifts.title}</h2>
          <p className="sf-gifts__body">{gifts.body}</p>
        </article>
      </div>
    </ScrollReveal>
  );
}

export default GiftsSection;

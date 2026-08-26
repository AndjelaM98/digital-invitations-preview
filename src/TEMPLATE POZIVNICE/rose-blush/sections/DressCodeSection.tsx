import ScrollReveal from "../../shared/ScrollReveal";
import { revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { blushArt } from "../art";
import CardOrnaments from "../components/CardOrnaments";
import LineArt from "../components/LineArt";

type DressCodeSectionProps = {
  content: InvitationContent;
};

function DressCodeSection({ content }: DressCodeSectionProps) {
  const { dressCode } = content;
  if (!dressCode) return null;

  return (
    <ScrollReveal as="section" className="qb-section" variants={revealFade} amount={0.08} once>
      <article className="qb-card qb-card--detail" data-section="dress-code">
        <CardOrnaments set="dress" />
        <LineArt src={blushArt.couple} className="qb-detail-icon qb-detail-icon--couple" />
        <p className="qb-caps">{dressCode.title}</p>
        <p className="qb-script qb-script--card">{dressCode.label}</p>
      </article>
    </ScrollReveal>
  );
}

export default DressCodeSection;

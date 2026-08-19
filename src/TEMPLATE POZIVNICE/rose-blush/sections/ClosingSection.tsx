import ScrollReveal from "../../shared/ScrollReveal";
import { revealFade } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { blushArt } from "../art";
import LineArt from "../components/LineArt";

type ClosingSectionProps = {
  content: InvitationContent;
};

function ClosingSection({ content }: ClosingSectionProps) {
  return (
    <ScrollReveal
      as="section"
      className="qb-section qb-section--closing"
      variants={revealFade}
      amount={0.08}
      once
    >
      <div className="qb-closing" data-section="closing">
        <span className="qb-closing__15" aria-hidden="true">
          {content.monogram ?? "JS"}
        </span>
        <p className="qb-script qb-script--hero qb-closing__name">
          <span className="qb-script--hero">{content.couple.partnerOne}</span>
          <span className="qb-names__joiner"> {content.couple.joiner ?? "i"} </span>
          <span className="qb-script--alt">{content.couple.partnerTwo}</span>
        </p>
        <LineArt src={blushArt.envelope} className="qb-closing__envelope" />
      </div>
    </ScrollReveal>
  );
}

export default ClosingSection;

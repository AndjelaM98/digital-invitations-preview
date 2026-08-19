import ScrollReveal from "../../shared/ScrollReveal";
import { revealScale } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { blushArt } from "../art";
import CardOrnaments from "../components/CardOrnaments";
import LineArt from "../components/LineArt";
import { roseBlushDateParts } from "../content";

type HeroSectionProps = {
  content: InvitationContent;
};

function HeroSection({ content }: HeroSectionProps) {
  const { couple } = content;
  const joiner = couple.joiner ?? "i";
  const date = roseBlushDateParts;

  return (
    <ScrollReveal
      as="section"
      className="qb-section"
      variants={revealScale}
      amount={0.08}
      once
    >
      <div className="qb-hero" data-section="hero">
        <article className="qb-card qb-card--hero">
          <CardOrnaments set="hero" />
          <LineArt src={blushArt.bow} className="qb-bow" />
          <p className="qb-arch">{content.announcement}</p>
          <span className="qb-heart-rule" aria-hidden="true">
            ♡
          </span>
          <h1 className="qb-names">
            <span className="qb-script qb-script--hero">{couple.partnerOne}</span>
            <span className="qb-names__joiner">{joiner}</span>
            <span className="qb-script qb-script--hero qb-script--alt">
              {couple.partnerTwo}
            </span>
          </h1>
          <p className="qb-invite-line">Pozivamo vas da proslavite naš dan</p>
          <div className="qb-date">
            <span className="qb-date__weekday">{date.weekday}</span>
            <span className="qb-date__day">{date.day}</span>
            <span className="qb-date__month">
              {date.month} {date.year}
            </span>
          </div>
          <LineArt src={blushArt.rings} className="qb-tiara" />
        </article>
      </div>
    </ScrollReveal>
  );
}

export default HeroSection;

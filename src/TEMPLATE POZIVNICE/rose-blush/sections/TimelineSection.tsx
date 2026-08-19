import ScrollReveal from "../../shared/ScrollReveal";
import { revealUp } from "../../shared/motion";
import type { InvitationContent } from "../../shared/types";
import { blushArt } from "../art";
import LineArt from "../components/LineArt";

type TimelineSectionProps = {
  content: InvitationContent;
};

const ICONS: Record<string, string> = {
  camera: blushArt.camera,
  car: blushArt.car,
  rings: blushArt.rings,
  dancing: blushArt.dancing,
  glasses: blushArt.glasses,
  cocktails: blushArt.cocktails,
  couple: blushArt.couple,
};

function TimelineSection({ content }: TimelineSectionProps) {
  const { timeline } = content;
  if (!timeline?.length) return null;

  return (
    <ScrollReveal as="section" className="qb-section" variants={revealUp} amount={0.06} once>
      <div className="qb-day" data-section="timeline">
        <h2 className="qb-gold-title">Dan venčanja</h2>
        <div className="qb-day__grid">
          {timeline.map((item) => {
            const icon = item.icon ? ICONS[item.icon] : undefined;

            return (
              <article key={item.id} className="qb-day__block">
                {icon ? (
                  <LineArt src={icon} className="qb-day__art" />
                ) : null}

                <h3 className="qb-day__title">{item.title}</h3>

                {item.description ? (
                  <p className="qb-day__place">{item.description}</p>
                ) : null}

                {item.time ? (
                  <>
                    <span className="qb-day__dots" aria-hidden="true" />
                    <p className="qb-day__time">{item.time}</p>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
        <article className="qb-day__block qb-day__block--kraj">
          <LineArt src={blushArt.glasses} className="qb-day__art" />
          <p className="qb-day__kraj">Kraj</p>
          <span className="qb-day__dots" aria-hidden="true" />
          <p className="qb-day__time">00.00</p>
        </article>
      </div>
    </ScrollReveal>
  );
}

export default TimelineSection;

import SlideIn from "../../shared/SlideIn";
import { PearlWinding } from "../decor";
import type { PearlEleganceContent } from "../content";
import { usePearlReveal } from "../reveal";

type ProgramSectionProps = {
  content: PearlEleganceContent;
};

/**
 * Program of the day: a vertical pearl chain threads through
 * the schedule entries.
 */
function ProgramSection({ content }: ProgramSectionProps) {
  const program = content.program;
  const revealed = usePearlReveal();
  if (!program) return null;

  return (
    <section
      className="pe-section pe-section--taupe pe-program"
      data-section="program"
      aria-label="Program dana"
    >
      <div className="pe-section__inner">
        <SlideIn from="right" className="pe-heading" active={revealed}>
          <h2 className="pe-title pe-title--light">{program.title}</h2>
          {program.script ? (
            <p className="pe-script pe-script--light">{program.script}</p>
          ) : null}
        </SlideIn>

        <div className="pe-program__body">
          <PearlWinding className="pe-program__winding" />
          <ol className="pe-program__list">
            {program.items.map((item, index) => (
              <li
                key={item.id}
                className={`pe-program__item pe-program__item--${
                  index % 2 === 0 ? "left" : "right"
                }`}
              >
                <SlideIn
                  from={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.08}
                  className="pe-program__slide"
                  active={revealed}
                >
                  <span className="pe-program__time">{item.time}</span>
                  <span className="pe-program__label">{item.label}</span>
                </SlideIn>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default ProgramSection;

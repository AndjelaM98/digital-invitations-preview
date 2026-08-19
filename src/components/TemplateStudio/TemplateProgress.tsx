import {
  TEMPLATE_STUDIO_STEPS,
  type TemplateStudioStepId,
} from "../../types/templateStudio";

type TemplateProgressProps = {
  current: TemplateStudioStepId;
  onSelect: (step: TemplateStudioStepId) => void;
};

function TemplateProgress({ current, onSelect }: TemplateProgressProps) {
  const currentIndex = TEMPLATE_STUDIO_STEPS.findIndex(
    (step) => step.id === current,
  );

  return (
    <nav className="studio-progress" aria-label="Koraci template studija">
      <ol className="studio-progress__list">
        {TEMPLATE_STUDIO_STEPS.map((step, index) => {
          const state =
            index < currentIndex
              ? "done"
              : index === currentIndex
                ? "current"
                : "upcoming";

          return (
            <li key={step.id} className={`studio-progress__item is-${state}`}>
              {index > 0 ? (
                <span className="studio-progress__bridge" aria-hidden="true" />
              ) : null}
              <button
                type="button"
                className="studio-progress__button"
                onClick={() => onSelect(step.id)}
                aria-current={state === "current" ? "step" : undefined}
              >
                <span className="studio-progress__dot" aria-hidden="true" />
                <span className="studio-progress__index">{step.index}</span>
                <span className="studio-progress__title">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default TemplateProgress;

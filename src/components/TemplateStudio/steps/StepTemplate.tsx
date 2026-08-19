import { preparedTemplates } from "../../../data/templateStudio";
import type { PreparedTemplateId } from "../../../types/templateStudio";

type StepTemplateProps = {
  templateId: PreparedTemplateId;
  onSelect: (id: PreparedTemplateId) => void;
};

function StepTemplate({ templateId, onSelect }: StepTemplateProps) {
  return (
    <div className="studio-step">
      <header className="studio-step__header">
        <p className="studio-step__eyebrow">Prvi korak</p>
        <h3 className="studio-step__title">Izaberite gotov šablon</h3>
        <p className="studio-step__lede">
          Ne birate atmosferu, birate pripremljen dizajn. Vaši podaci ulaze u
          njegove slotove; raspored i izgled ostaju kao u šablonu.
        </p>
      </header>

      <div className="template-pick">
        {preparedTemplates.map((template) => {
          const selected = template.id === templateId;
          return (
            <button
              key={template.id}
              type="button"
              className={`template-pick__card${selected ? " is-selected" : ""}`}
              onClick={() => onSelect(template.id)}
              aria-pressed={selected}
            >
              <span className="template-pick__thumb" aria-hidden="true">
                <span className="template-pick__thumb-date">17.10</span>
                <span className="template-pick__thumb-names">A & B</span>
                <span className="template-pick__thumb-line" />
                <span className="template-pick__thumb-line is-short" />
              </span>
              <span className="template-pick__meta">
                <span className="template-pick__name">{template.name}</span>
                <span className="template-pick__label">{template.label}</span>
                <span className="template-pick__desc">{template.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StepTemplate;

import { Link } from "react-router-dom";

import { listInvitationTemplates } from "../TEMPLATE POZIVNICE";
import "./PreviewIndexPage.css";

const templateNotes: Record<string, string> = {
  "envelope-romance":
    "Romantična koverta, pečat i otvaranje pre cele pozivnice.",
  "leto-ljubavi":
    "Letnji ritam, portal ulaz i svetle sekcije za baštansku proslavu.",
  "pearl-elegance":
    "Biseri, tipografija i miran, luksuzan tok inspirisan stationeryjem.",
};

function PreviewIndexPage() {
  const templates = listInvitationTemplates();

  return (
    <main className="preview-index">
      <div className="preview-index__shell">
        <p className="preview-index__eyebrow">preview</p>
        <h1 className="preview-index__title">Digitalne pozivnice</h1>
        <p className="preview-index__lede">
          Lista template strana. Otvori jednu po jednu i pregledaj celu
          pozivnicu.
        </p>

        <ul className="preview-index__list">
          {templates.map((template, index) => {
            const note = templateNotes[template.id];
            const number = String(index + 1).padStart(2, "0");

            return (
              <li key={template.id}>
                <Link
                  className="preview-index__card"
                  to={`/preview/${template.id}`}
                >
                  <span className="preview-index__number">{number}</span>
                  <div className="preview-index__copy">
                    <h2 className="preview-index__name">{template.title}</h2>
                    {note ? (
                      <p className="preview-index__note">{note}</p>
                    ) : null}
                    <p className="preview-index__meta">
                      {template.sections.length} sekcija
                    </p>
                  </div>
                  <span className="preview-index__cta">Otvori</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

export default PreviewIndexPage;

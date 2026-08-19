import type { ChangeEvent } from "react";

import { templateStudioId } from "../../../data/templateStudio";
import {
  TEMPLATE_MODULE_META,
  type TemplateContact,
  type TemplateContent,
  type TemplateModuleId,
  type TemplatePartyMember,
  type TemplatePracticalItem,
  type TemplateScheduleItem,
} from "../../../types/templateStudio";

type StepFillProps = {
  content: TemplateContent;
  onChange: (next: TemplateContent) => void;
};

function StepFill({ content, onChange }: StepFillProps) {
  const setField =
    (key: keyof TemplateContent) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...content, [key]: event.target.value });
    };

  const toggleModule = (id: TemplateModuleId) => {
    onChange({
      ...content,
      modules: { ...content.modules, [id]: !content.modules[id] },
    });
  };

  const updateSchedule = (id: string, patch: Partial<TemplateScheduleItem>) => {
    onChange({
      ...content,
      schedule: content.schedule.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  };

  const addSchedule = () => {
    onChange({
      ...content,
      schedule: [
        ...content.schedule,
        { id: templateStudioId("sch"), time: "", title: "", place: "" },
      ],
    });
  };

  const removeSchedule = (id: string) => {
    if (content.schedule.length <= 1) return;
    onChange({
      ...content,
      schedule: content.schedule.filter((item) => item.id !== id),
    });
  };

  const updateParty = (id: string, patch: Partial<TemplatePartyMember>) => {
    onChange({
      ...content,
      party: content.party.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  };

  const addParty = () => {
    onChange({
      ...content,
      party: [
        ...content.party,
        { id: templateStudioId("party"), role: "", name: "" },
      ],
    });
  };

  const removeParty = (id: string) => {
    if (content.party.length <= 1) return;
    onChange({
      ...content,
      party: content.party.filter((item) => item.id !== id),
    });
  };

  const updatePractical = (
    id: string,
    patch: Partial<TemplatePracticalItem>,
  ) => {
    onChange({
      ...content,
      practical: content.practical.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  };

  const addPractical = () => {
    onChange({
      ...content,
      practical: [
        ...content.practical,
        { id: templateStudioId("prac"), title: "", body: "" },
      ],
    });
  };

  const removePractical = (id: string) => {
    if (content.practical.length <= 1) return;
    onChange({
      ...content,
      practical: content.practical.filter((item) => item.id !== id),
    });
  };

  const updateContact = (id: string, patch: Partial<TemplateContact>) => {
    onChange({
      ...content,
      contacts: content.contacts.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  };

  return (
    <div className="studio-step">
      <header className="studio-step__header">
        <p className="studio-step__eyebrow">Drugi korak</p>
        <h3 className="studio-step__title">Sekcije i sadržaj stranice</h3>
        <p className="studio-step__lede">
          Uključite sekcije koje želite (odbrojavanje, kumovi, smeštaj…) pa
          popunite sadržaj, preview se ažurira uživo.
        </p>
      </header>

      <div className="studio-compose">
        <div className="studio-compose__block">
          <p className="studio-compose__label">Sekcije na stranici</p>
          <ul className="template-modules">
            {TEMPLATE_MODULE_META.map((module) => (
              <li key={module.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={content.modules[module.id]}
                    onChange={() => toggleModule(module.id)}
                  />
                  <span>
                    <strong>{module.title}</strong>
                    <em>{module.hint}</em>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="studio-compose__block">
          <p className="studio-compose__label">Par</p>
          <div className="studio-compose__pair">
            <label className="studio-field">
              <span className="visually-hidden">Prvo ime</span>
              <input
                type="text"
                value={content.partnerOne}
                onChange={setField("partnerOne")}
                placeholder="Teodora"
              />
            </label>
            <span className="studio-compose__amp" aria-hidden="true">
              &
            </span>
            <label className="studio-field">
              <span className="visually-hidden">Drugo ime</span>
              <input
                type="text"
                value={content.partnerTwo}
                onChange={setField("partnerTwo")}
                placeholder="Lazar"
              />
            </label>
          </div>
        </div>

        <div className="studio-compose__block">
          <p className="studio-compose__label">Trenutak</p>
          <div className="studio-compose__row">
            <label className="studio-field">
              <span>Datum</span>
              <input
                type="date"
                value={content.eventDate}
                onChange={setField("eventDate")}
              />
            </label>
            <label className="studio-field">
              <span>Vreme (za odbrojavanje)</span>
              <input
                type="time"
                value={content.eventTime}
                onChange={setField("eventTime")}
              />
            </label>
          </div>
        </div>

        {content.modules.intro ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Uvodna poruka</p>
            <label className="studio-field">
              <span className="visually-hidden">Uvod</span>
              <textarea
                rows={3}
                value={content.introMessage}
                onChange={setField("introMessage")}
                placeholder="Dragi naši, sa velikom radošću pozivamo vas…"
              />
            </label>
          </div>
        ) : null}

        {content.modules.story ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Naša priča</p>
            <label className="studio-field">
              <span className="visually-hidden">Priča</span>
              <textarea
                rows={3}
                value={content.story}
                onChange={setField("story")}
                placeholder="Kako ste stigli do ovog dana…"
              />
            </label>
          </div>
        ) : null}

        {content.modules.map ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Lokacija</p>
            <div className="studio-compose__stack">
              <label className="studio-field">
                <span>Mesto / salon</span>
                <input
                  type="text"
                  value={content.venue}
                  onChange={setField("venue")}
                  placeholder="Svadbeni salon Afrodita"
                />
              </label>
              <label className="studio-field">
                <span>Adresa</span>
                <input
                  type="text"
                  value={content.address}
                  onChange={setField("address")}
                  placeholder="Ulica i broj"
                />
              </label>
              <label className="studio-field">
                <span>Grad</span>
                <input
                  type="text"
                  value={content.city}
                  onChange={setField("city")}
                  placeholder="Banja Luka"
                />
              </label>
            </div>
          </div>
        ) : null}

        {content.modules.schedule ? (
          <div className="studio-compose__block">
            <div className="studio-compose__label-row">
              <p className="studio-compose__label">Raspored</p>
              <button
                type="button"
                className="studio-compose__mini"
                onClick={addSchedule}
              >
                + Stavka
              </button>
            </div>
            <div className="studio-compose__stack">
              {content.schedule.map((item) => (
                <div key={item.id} className="template-fill__schedule">
                  <label className="studio-field">
                    <span>Vreme</span>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(event) =>
                        updateSchedule(item.id, { time: event.target.value })
                      }
                      placeholder="17:00"
                    />
                  </label>
                  <label className="studio-field">
                    <span>Događaj</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        updateSchedule(item.id, { title: event.target.value })
                      }
                      placeholder="Ceremonija"
                    />
                  </label>
                  <label className="studio-field">
                    <span>Mesto (opciono)</span>
                    <input
                      type="text"
                      value={item.place}
                      onChange={(event) =>
                        updateSchedule(item.id, { place: event.target.value })
                      }
                      placeholder="Svadbeni salon"
                    />
                  </label>
                  <button
                    type="button"
                    className="studio-compose__mini is-danger"
                    onClick={() => removeSchedule(item.id)}
                    disabled={content.schedule.length <= 1}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {content.modules.party ? (
          <div className="studio-compose__block">
            <div className="studio-compose__label-row">
              <p className="studio-compose__label">Uz nas su</p>
              <button
                type="button"
                className="studio-compose__mini"
                onClick={addParty}
              >
                + Osoba
              </button>
            </div>
            <div className="studio-compose__stack">
              {content.party.map((item) => (
                <div key={item.id} className="template-fill__contact">
                  <label className="studio-field">
                    <span>Uloga</span>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(event) =>
                        updateParty(item.id, { role: event.target.value })
                      }
                      placeholder="Kuma"
                    />
                  </label>
                  <label className="studio-field">
                    <span>Ime</span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(event) =>
                        updateParty(item.id, { name: event.target.value })
                      }
                      placeholder="Ime"
                    />
                  </label>
                  <button
                    type="button"
                    className="studio-compose__mini is-danger"
                    onClick={() => removeParty(item.id)}
                    disabled={content.party.length <= 1}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {content.modules.dressCode ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Dress code</p>
            <label className="studio-field">
              <span className="visually-hidden">Dress code</span>
              <textarea
                rows={2}
                value={content.dressCode}
                onChange={setField("dressCode")}
                placeholder="Dobro raspoloženje i udobne cipele"
              />
            </label>
          </div>
        ) : null}

        {content.modules.practical ? (
          <div className="studio-compose__block">
            <div className="studio-compose__label-row">
              <p className="studio-compose__label">Dobro je znati</p>
              <button
                type="button"
                className="studio-compose__mini"
                onClick={addPractical}
              >
                + Napomena
              </button>
            </div>
            <div className="studio-compose__stack">
              {content.practical.map((item) => (
                <div key={item.id} className="template-fill__schedule">
                  <label className="studio-field">
                    <span>Naslov</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        updatePractical(item.id, { title: event.target.value })
                      }
                      placeholder="Parking"
                    />
                  </label>
                  <label className="studio-field">
                    <span>Tekst</span>
                    <textarea
                      rows={2}
                      value={item.body}
                      onChange={(event) =>
                        updatePractical(item.id, { body: event.target.value })
                      }
                      placeholder="Ispred salona ima parking…"
                    />
                  </label>
                  <button
                    type="button"
                    className="studio-compose__mini is-danger"
                    onClick={() => removePractical(item.id)}
                    disabled={content.practical.length <= 1}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {content.modules.accommodation ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Smeštaj</p>
            <label className="studio-field">
              <span className="visually-hidden">Smeštaj</span>
              <textarea
                rows={3}
                value={content.accommodation}
                onChange={setField("accommodation")}
                placeholder="Preporučeni hoteli u blizini…"
              />
            </label>
          </div>
        ) : null}

        {content.modules.wishes ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Knjiga želja</p>
            <label className="studio-field">
              <span className="visually-hidden">Prompt</span>
              <textarea
                rows={2}
                value={content.wishesPrompt}
                onChange={setField("wishesPrompt")}
                placeholder="Ostavite nam poruku ili želju…"
              />
            </label>
          </div>
        ) : null}

        {content.modules.closing ? (
          <div className="studio-compose__block">
            <p className="studio-compose__label">Završna poruka</p>
            <label className="studio-field">
              <span className="visually-hidden">Završna poruka</span>
              <input
                type="text"
                value={content.closingMessage}
                onChange={setField("closingMessage")}
                placeholder="Vidimo se!"
              />
            </label>
          </div>
        ) : null}

        {content.modules.rsvp ? (
          <>
            <div className="studio-compose__block">
              <p className="studio-compose__label">RSVP rok</p>
              <label className="studio-field">
                <span className="visually-hidden">Rok potvrde</span>
                <input
                  type="text"
                  value={content.rsvpDeadline}
                  onChange={setField("rsvpDeadline")}
                  placeholder="1. septembra"
                />
              </label>
            </div>

            <div className="studio-compose__block">
              <p className="studio-compose__label">Broj pozvanih (procena)</p>
              <label className="studio-field">
                <span className="visually-hidden">Broj pozvanih</span>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  value={content.expectedGuestCount}
                  onChange={(event) =>
                    onChange({
                      ...content,
                      expectedGuestCount: Number(event.target.value) || 0,
                    })
                  }
                  placeholder="80"
                />
              </label>
            </div>
          </>
        ) : null}

        <div className="studio-compose__block">
          <p className="studio-compose__label">Kontakti</p>
          <div className="studio-compose__stack">
            {content.contacts.map((item, index) => (
              <div key={item.id} className="template-fill__contact">
                <label className="studio-field">
                  <span>Ime {index + 1}</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) =>
                      updateContact(item.id, { name: event.target.value })
                    }
                    placeholder={index === 0 ? "Teodora" : "Lazar"}
                  />
                </label>
                <label className="studio-field">
                  <span>Telefon</span>
                  <input
                    type="text"
                    value={item.phone}
                    onChange={(event) =>
                      updateContact(item.id, { phone: event.target.value })
                    }
                    placeholder="+387…"
                  />
                </label>
                <label className="studio-field">
                  <span>Napomena</span>
                  <input
                    type="text"
                    value={item.note}
                    onChange={(event) =>
                      updateContact(item.id, { note: event.target.value })
                    }
                    placeholder="Viber"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepFill;

import {
  buildTemplateNames,
  formatCountdown,
  formatTemplateDateLong,
  getPreparedTemplate,
  mapsQuery,
} from "../../data/templateStudio";
import type { InvitationId } from "../../types/invitationPlatform";
import type { TemplateStudioDraft } from "../../types/templateStudio";
import RsvpGuestForm from "../Rsvp/RsvpGuestForm";
import "../Rsvp/Rsvp.css";

type TemplatePreviewProps = {
  draft: TemplateStudioDraft;
  invitationId: InvitationId | null;
  onRsvpSubmitted?: () => void;
};

function WeddingPagePreview({
  draft,
  invitationId,
  onRsvpSubmitted,
}: TemplatePreviewProps) {
  const { content } = draft;
  const { modules } = content;
  const names = buildTemplateNames(content.partnerOne, content.partnerTwo);
  const dateLabel = formatTemplateDateLong(content.eventDate);
  const countdown = formatCountdown(content.eventDate, content.eventTime);
  const intro =
    content.introMessage.trim() ||
    "Dragi naši, sa velikom radošću i zahvalnošću pozivamo vas da svojim prisustvom uljepšate početak novog poglavlja naše ljubavne priče.";
  const story =
    content.story.trim() ||
    "Naša priča počinje ovde, dodajte nekoliko rečenica o tome kako ste stigli do ovog dana.";
  const dress =
    content.dressCode.trim() || "Dobro raspoloženje i udobne cipele";
  const closing = content.closingMessage.trim() || "Vidimo se!";
  const wishes =
    content.wishesPrompt.trim() || "Ostavite nam poruku ili želju za novi početak.";
  const accommodation =
    content.accommodation.trim() ||
    "Preporuke za smeštaj dodajte ovde, hoteli u blizini, kontakt…";
  const rsvpDeadline = content.rsvpDeadline.trim() || "1. septembra";
  const rsvpLabel = `Molimo vas da svoje prisustvo potvrdite do ${rsvpDeadline}`;

  const venueLine = [content.venue, content.city]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" · ");
  const mapQ = mapsQuery(content.venue, content.address, content.city);

  const schedule = content.schedule.filter(
    (item) => item.time.trim() || item.title.trim(),
  );
  const displaySchedule =
    schedule.length > 0
      ? schedule
      : [
          { id: "p1", time: "15:00", title: "Skup svatova", place: "" },
          { id: "p2", time: "17:00", title: "Ulazak mladenaca", place: "" },
          { id: "p3", time: "18:45", title: "Ceremonija", place: "" },
          { id: "p4", time: "21:00", title: "Torta i prvi ples", place: "" },
        ];

  const party = content.party.filter(
    (item) => item.name.trim() || item.role.trim(),
  );
  const displayParty =
    party.length > 0
      ? party
      : [
          { id: "pt1", role: "Kuma", name: "Ime kume" },
          { id: "pt2", role: "Kum", name: "Ime kuma" },
        ];

  const practical = content.practical.filter(
    (item) => item.title.trim() || item.body.trim(),
  );
  const displayPractical =
    practical.length > 0
      ? practical
      : [{ id: "pr1", title: "Parking", body: "Detalji za goste…" }];

  const contacts = content.contacts.filter(
    (item) => item.name.trim() || item.phone.trim(),
  );
  const displayContacts =
    contacts.length > 0
      ? contacts
      : [
          {
            id: "c1",
            name: content.partnerOne.trim() || "Teodora",
            phone: "+387…",
            note: "Viber",
          },
          {
            id: "c2",
            name: content.partnerTwo.trim() || "Lazar",
            phone: "+387…",
            note: "Viber, WhatsApp",
          },
        ];

  const gallery = content.photos.galleryPreviewUrls;
  const cover = content.photos.coverPreviewUrl;

  return (
    <article className="studio-page">
      <header className="studio-page__hero">
        {cover ? (
          <img
            className="studio-page__hero-img"
            src={cover}
            alt={`Cover, ${names}`}
          />
        ) : (
          <div className="studio-page__hero-mono" aria-hidden="true">
            <span>&</span>
          </div>
        )}
        <div className="studio-page__hero-copy">
          <p className="studio-page__kicker">Digitalna pozivnica</p>
          <h3 className="studio-page__names">{names}</h3>
          <p className="studio-page__date">{dateLabel}</p>
          {content.eventTime.trim() ? (
            <p className="studio-page__meta">{content.eventTime}</p>
          ) : null}
          {venueLine ? <p className="studio-page__meta">{venueLine}</p> : null}
        </div>
      </header>

      {modules.intro ? (
        <section className="studio-page__block studio-page__block--center">
          <p className="studio-page__eyebrow">Poziv</p>
          <p className="studio-page__prose">{intro}</p>
        </section>
      ) : null}

      {modules.countdown ? (
        <section className="studio-page__block studio-page__block--center">
          <p className="studio-page__eyebrow">Odbrojavanje</p>
          <p className="studio-page__countdown">{countdown}</p>
        </section>
      ) : null}

      {modules.story ? (
        <section className="studio-page__block">
          <p className="studio-page__eyebrow">Naša priča</p>
          <p className="studio-page__prose">{story}</p>
        </section>
      ) : null}

      {modules.schedule ? (
        <section className="studio-page__block">
          <p className="studio-page__eyebrow">Raspored dana</p>
          <ol className="studio-page__schedule">
            {displaySchedule.map((item) => (
              <li key={item.id}>
                <strong>
                  {item.time.trim() || "..."} · {item.title.trim() || "Događaj"}
                </strong>
                {item.place.trim() ? <span>{item.place}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {modules.gallery ? (
        gallery.length > 0 ? (
          <section className="studio-page__block">
            <p className="studio-page__eyebrow">Galerija</p>
            <div className="studio-page__gallery">
              {gallery.map((url, index) => (
                <img
                  key={`${url.slice(0, 20)}-${index}`}
                  src={url}
                  alt={`Fotografija ${index + 1}`}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="studio-page__block studio-page__block--center">
            <p className="studio-page__eyebrow">Galerija</p>
            <p className="studio-page__prose">
              Dodajte fotografije u koraku Galerija.
            </p>
          </section>
        )
      ) : null}

      {modules.party ? (
        <section className="studio-page__block">
          <p className="studio-page__eyebrow">Uz nas su</p>
          <ul className="studio-page__party">
            {displayParty.map((item) => (
              <li key={item.id}>
                <em>{item.role.trim() || "Uloga"}</em>
                <strong>{item.name.trim() || "Ime"}</strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {modules.map ? (
        <section className="studio-page__block">
          <p className="studio-page__eyebrow">Lokacija</p>
          <p className="studio-page__prose">
            {content.venue.trim() || "Mesto događaja"}
            {content.address.trim() ? (
              <>
                <br />
                {content.address.trim()}
              </>
            ) : null}
            {content.city.trim() ? (
              <>
                <br />
                {content.city.trim()}
              </>
            ) : null}
          </p>
          {mapQ ? (
            <a
              className="studio-page__link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQ)}`}
              target="_blank"
              rel="noreferrer"
            >
              Otvori mapu
            </a>
          ) : null}
        </section>
      ) : null}

      {modules.dressCode ? (
        <section className="studio-page__block studio-page__block--center">
          <p className="studio-page__eyebrow">Dress code</p>
          <p className="studio-page__prose">{dress}</p>
        </section>
      ) : null}

      {modules.practical ? (
        <section className="studio-page__block">
          <p className="studio-page__eyebrow">Dobro je znati</p>
          <ul className="studio-page__notes">
            {displayPractical.map((item) => (
              <li key={item.id}>
                <strong>{item.title.trim() || "Napomena"}</strong>
                <span>{item.body.trim() || "..."}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {modules.accommodation ? (
        <section className="studio-page__block">
          <p className="studio-page__eyebrow">Smeštaj</p>
          <p className="studio-page__prose">{accommodation}</p>
        </section>
      ) : null}

      {modules.rsvp ? (
        <section className="studio-page__block studio-page__block--center">
          <p className="studio-page__eyebrow">Potvrda dolaska</p>
          {invitationId ? (
            <RsvpGuestForm
              invitationId={invitationId}
              deadlineLabel={rsvpLabel}
              onSubmitted={onRsvpSubmitted}
            />
          ) : (
            <>
              <p className="studio-page__prose">{rsvpLabel}</p>
              <p className="studio-page__prose">
                Generišite link da aktivirate RSVP formu.
              </p>
            </>
          )}
        </section>
      ) : null}

      {modules.wishes ? (
        <section className="studio-page__block studio-page__block--center">
          <p className="studio-page__eyebrow">Knjiga želja</p>
          <p className="studio-page__prose">{wishes}</p>
          <div className="studio-page__rsvp-ghost" aria-hidden="true">
            <span>Vaša poruka</span>
            <span>Pošalji želju</span>
          </div>
        </section>
      ) : null}

      {modules.closing ? (
        <section className="studio-page__block studio-page__block--center">
          <p className="studio-page__closing">{closing}</p>
        </section>
      ) : null}

      <section className="studio-page__block studio-page__block--center">
        <p className="studio-page__eyebrow">Kontakt</p>
        <ul className="studio-page__notes">
          {displayContacts.map((item) => (
            <li key={item.id}>
              <strong>{item.name.trim() || "Kontakt"}</strong>
              <span>
                {item.phone.trim() || "..."}
                {item.note.trim() ? ` · ${item.note}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function TemplatePreview({
  draft,
  invitationId,
  onRsvpSubmitted,
}: TemplatePreviewProps) {
  const template = getPreparedTemplate(draft.templateId);
  const onCount = Object.values(draft.content.modules).filter(Boolean).length;

  return (
    <div className="template-preview">
      <div className="template-preview__device">
        <div className="template-preview__scroll studio-preview__scroll">
          {draft.templateId === "simple-timeline" ? (
            <WeddingPagePreview
              draft={draft}
              invitationId={invitationId}
              onRsvpSubmitted={onRsvpSubmitted}
            />
          ) : null}
        </div>
      </div>
      <p className="template-preview__caption">
        Render: <em>{template.name}</em> · {onCount} sekcija
        {invitationId ? " · RSVP aktivan" : ""}
      </p>
    </div>
  );
}

export default TemplatePreview;

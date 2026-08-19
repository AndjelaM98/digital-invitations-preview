import { useState, type CSSProperties, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { getInvitationBySlug } from "../data/invitations";
import { invitationCategoryLabels } from "../data/invitationLabels";
import type { InvitationCategory } from "../types/invitation";
import "./OrderPage.css";

type FormStatus = "idle" | "sending" | "success" | "error";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvgrvvw";

const eventTypeOptions: InvitationCategory[] = [
  "wedding",
  "engagement",
  "baptism",
  "birthday",
  "baby-shower",
  "other",
];

function OrderPage() {
  const { slug } = useParams<{ slug: string }>();
  const template = getInvitationBySlug(slug);
  const [status, setStatus] = useState<FormStatus>("idle");

  if (!template) {
    return (
      <>
        <Header variant="page" />
        <main className="order-page order-page--empty">
          <div className="order-page__shell">
            <p className="order-page__eyebrow">porudžbina</p>
            <h1 className="order-page__title">Template nije pronađen</h1>
            <Link className="order-page__back" to="/#invitation-showcase">
              Nazad na primere
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { media, title, priceLabel, category, accentColor } = template;
  const poster = media.type === "video" ? media.poster : media.src;
  const categoryLabel = invitationCategoryLabels[category];
  const detailPath = `/pozivnice/${template.slug}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Slanje porudžbine nije uspelo.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      <Header variant="page" />
      <main
        className="order-page"
        style={
          accentColor
            ? ({ "--order-accent": accentColor } as CSSProperties)
            : undefined
        }
      >
        <div className="order-page__shell">
          <Link className="order-page__back" to={detailPath}>
            Nazad na detalje
          </Link>

          <div className="order-page__layout">
            <aside className="order-page__summary">
              <p className="order-page__eyebrow">{categoryLabel}</p>
              <h1 className="order-page__title">{title}</h1>
              <p className="order-page__price">{priceLabel}</p>
              <p className="order-page__lede">
                Popunite kratku prijavu. Javljamo se uskoro da dogovorimo
                detalje i personalizaciju.
              </p>

              <div className="order-page__preview">
                {media.type === "video" ? (
                  <video
                    className="order-page__preview-media"
                    src={media.src}
                    poster={media.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="auto"
                  />
                ) : poster ? (
                  <img
                    src={poster}
                    alt=""
                    className="order-page__preview-media"
                  />
                ) : null}
              </div>
            </aside>

            <section className="order-page__panel" aria-label="Forma porudžbine">
              {status === "success" ? (
                <div className="order-page__success">
                  <p className="order-page__eyebrow">primljeno</p>
                  <h2 className="order-page__success-title">
                    Hvala, porudžbina je stigla.
                  </h2>
                  <p className="order-page__success-text">
                    Javljamo se na email ili telefon u najkraćem roku.
                  </p>
                  <button
                    type="button"
                    className="order-page__submit order-page__submit--ghost"
                    onClick={() => setStatus("idle")}
                  >
                    Pošalji još jednu
                  </button>
                </div>
              ) : (
                <form className="order-page__form" onSubmit={handleSubmit}>
                  <input type="hidden" name="templateSlug" value={template.slug} />
                  <input type="hidden" name="templatePrice" value={priceLabel} />
                  <input
                    type="hidden"
                    name="_subject"
                    value={`Nova porudžbina: ${template.title}`}
                  />

                  <label className="order-page__field">
                    <span>Ime i prezime</span>
                    <input
                      type="text"
                      name="ime"
                      required
                      autoComplete="name"
                      placeholder="Ana i Marko"
                    />
                  </label>

                  <div className="order-page__row">
                    <label className="order-page__field">
                      <span>Email</span>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="vas@email.com"
                      />
                    </label>

                    <label className="order-page__field">
                      <span>Telefon</span>
                      <input
                        type="tel"
                        name="telefon"
                        required
                        autoComplete="tel"
                        placeholder="+381 …"
                      />
                    </label>
                  </div>

                  <label className="order-page__field">
                    <span>Datum događaja</span>
                    <input type="date" name="datumDogadjaja" required />
                  </label>

                  <div className="order-page__row">
                    <label className="order-page__field">
                      <span>Tip događaja</span>
                      <select name="tipDogadjaja" defaultValue={category}>
                        {eventTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {invitationCategoryLabels[option]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="order-page__field">
                      <span>Pozivnica</span>
                      <input
                        type="text"
                        name="pozivnica"
                        value={template.title}
                        readOnly
                        className="order-page__field-locked"
                        aria-readonly="true"
                      />
                    </label>
                  </div>

                  <label className="order-page__field">
                    <span>Grad / lokacija (opciono)</span>
                    <input
                      type="text"
                      name="lokacija"
                      autoComplete="address-level2"
                      placeholder="Beograd"
                    />
                  </label>

                  <label className="order-page__field order-page__field--tall">
                    <span>Napomena (opciono)</span>
                    <textarea
                      name="napomena"
                      rows={4}
                      placeholder="Ton, boje, posebni zahtevi…"
                    />
                  </label>

                  <div className="order-page__actions">
                    <button
                      type="submit"
                      className="order-page__submit"
                      disabled={status === "sending"}
                    >
                      {status === "sending"
                        ? "Šaljemo…"
                        : "Pošalji porudžbinu"}
                    </button>
                    <p className="order-page__hint">
                      Ne plaćate sada. Prvo dogovaramo detalje.
                    </p>
                  </div>

                  {status === "error" ? (
                    <p className="order-page__error" role="alert">
                      Slanje nije uspelo. Pokušajte ponovo ili nam pišite na
                      email.
                    </p>
                  ) : null}
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OrderPage;

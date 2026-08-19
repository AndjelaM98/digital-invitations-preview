import { Link, useParams } from "react-router-dom";
import type { CSSProperties } from "react";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { getInvitationBySlug } from "../data/invitations";
import { invitationCategoryLabels } from "../data/invitationLabels";
import "./TemplateDetailPage.css";

function TemplateDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const template = getInvitationBySlug(slug);

  if (!template) {
    return (
      <>
        <Header variant="page" />
        <main className="template-detail template-detail--empty">
          <div className="template-detail__shell">
            <p className="template-detail__eyebrow">pozivnice</p>
            <h1 className="template-detail__title">Template nije pronađen</h1>
            <Link className="template-detail__back" to="/#invitation-showcase">
              Nazad na primere
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { media, title, priceLabel, shortDescription, category, accentColor } =
    template;
  const poster = media.type === "video" ? media.poster : media.src;
  const categoryLabel = invitationCategoryLabels[category];
  const fullPath = `/pozivnice/${template.slug}/puna`;
  const orderPath = `/poruci/${template.slug}`;

  return (
    <>
      <Header variant="page" />
      <main
        className="template-detail"
        style={
          accentColor
            ? ({ "--template-accent": accentColor } as CSSProperties)
            : undefined
        }
      >
        <div className="template-detail__shell">
          <Link className="template-detail__back" to="/#invitation-showcase">
            Nazad na primere
          </Link>

          <div className="template-detail__stage">
            <div className="template-detail__copy">
              <p className="template-detail__eyebrow">{categoryLabel}</p>
              <h1 className="template-detail__title">{title}</h1>

              <div className="template-detail__price-block">
                <span className="template-detail__price-label">Cena</span>
                <p className="template-detail__price">{priceLabel}</p>
              </div>

              <p className="template-detail__lede">{shortDescription}</p>

              <p className="template-detail__note">
                Personalizacija teksta, boja i rasporeda, sve na jednom mestu,
                spremno za deljenje gostima.
              </p>

              <div className="template-detail__actions">
                {template.fullInvitationId ? (
                  <a
                    className="template-detail__cta"
                    href={fullPath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pogledaj celu pozivnicu
                  </a>
                ) : (
                  <p className="template-detail__soon">
                    Kompletna pozivnica za ovaj template stiže uskoro.
                  </p>
                )}

                <Link
                  className="template-detail__cta template-detail__cta--secondary"
                  to={orderPath}
                >
                  Poruci
                </Link>
              </div>
            </div>

            <div className="template-detail__preview">
              <div className="template-detail__preview-frame">
                {media.type === "video" ? (
                  <video
                    className="template-detail__media"
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
                    className="template-detail__media"
                    src={poster}
                    alt={title}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TemplateDetailPage;

import { Link, useParams } from "react-router-dom";

import { getFullInvitation } from "../data/fullInvitations";
import { getInvitationBySlug } from "../data/invitations";
import "./FullInvitationPage.css";

function FullInvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const template = getInvitationBySlug(slug);
  const full = getFullInvitation(template?.fullInvitationId);

  if (!template) {
    return (
      <main className="full-invitation full-invitation--empty">
        <p>Pozivnica nije pronađena.</p>
        <Link to="/">Nazad na početnu</Link>
      </main>
    );
  }

  if (!full) {
    return (
      <main className="full-invitation full-invitation--empty">
        <p className="full-invitation__eyebrow">uskoro</p>
        <h1>Kompletna pozivnica za „{template.title}“ još nije dostupna.</h1>
        <Link className="full-invitation__back" to={`/pozivnice/${template.slug}`}>
          Nazad na detalje
        </Link>
      </main>
    );
  }

  const { Component } = full;

  return (
    <div className="full-invitation">
      <div className="full-invitation__bar">
        <Link
          className="full-invitation__back"
          to={`/pozivnice/${template.slug}`}
        >
          Nazad
        </Link>
        <p className="full-invitation__bar-title">{full.title}</p>
      </div>
      <Component />
    </div>
  );
}

export default FullInvitationPage;

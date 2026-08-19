import { useCallback, useEffect, useState } from "react";

import { invitationPlatform } from "../../platform/client";
import type {
  InvitationId,
  RsvpDashboardStats,
} from "../../types/invitationPlatform";

type RsvpCoupleDashboardProps = {
  invitationId: InvitationId | null;
  /** Bump to force refresh after a guest submits. */
  refreshKey?: number;
};

function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function RsvpCoupleDashboard({
  invitationId,
  refreshKey = 0,
}: RsvpCoupleDashboardProps) {
  const [stats, setStats] = useState<RsvpDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!invitationId) {
      setStats(null);
      return;
    }
    setLoading(true);
    try {
      const next = await invitationPlatform.getDashboard(invitationId);
      setStats(next);
    } finally {
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  if (!invitationId) {
    return (
      <div className="rsvp-dashboard rsvp-dashboard--empty">
        <p>
          Prvo generišite link pozivnice, onda ovde stižu RSVP odgovori gostiju.
        </p>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="rsvp-dashboard rsvp-dashboard--empty">
        <p>Učitavam odgovore…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rsvp-dashboard rsvp-dashboard--empty">
        <p>Pozivnica nije pronađena.</p>
      </div>
    );
  }

  return (
    <div className="rsvp-dashboard">
      <header className="rsvp-dashboard__header">
        <p className="rsvp-dashboard__eyebrow">Dashboard mladenaca</p>
        <h3 className="rsvp-dashboard__title">RSVP pregled</h3>
        <p className="rsvp-dashboard__lede">
          Podaci se čuvaju preko platform servisa (za sada u memoriji). Kasnije
          isti ugovor ide na API i bazu.
        </p>
      </header>

      <ul className="rsvp-dashboard__stats">
        <li>
          <span>Pozvano (procena)</span>
          <strong>{stats.expectedGuestCount}</strong>
        </li>
        <li>
          <span>Odgovorilo</span>
          <strong>{stats.responseCount}</strong>
        </li>
        <li>
          <span>Dolazi</span>
          <strong>{stats.attendingPartyTotal}</strong>
        </li>
        <li>
          <span>Ne dolazi</span>
          <strong>{stats.decliningResponseCount}</strong>
        </li>
        <li>
          <span>Još bez odgovora*</span>
          <strong>{stats.pendingGuestEstimate}</strong>
        </li>
      </ul>
      <p className="rsvp-dashboard__note">
        *Procena: pozvani minus dolazeći i odbijajući odgovori.
      </p>

      <div className="rsvp-dashboard__list-head">
        <h4>Svi odgovori</h4>
        <button type="button" className="rsvp-dashboard__refresh" onClick={() => void load()}>
          Osveži
        </button>
      </div>

      {stats.responses.length === 0 ? (
        <p className="rsvp-dashboard__empty-list">Još nema odgovora.</p>
      ) : (
        <ul className="rsvp-dashboard__list">
          {stats.responses.map((response) => (
            <li key={response.id}>
              <div>
                <strong>{response.guestName}</strong>
                {response.companionNames ? (
                  <span className="rsvp-dashboard__companions">
                    + {response.companionNames}
                  </span>
                ) : null}
              </div>
              <div className="rsvp-dashboard__meta">
                <span
                  className={`rsvp-dashboard__badge is-${response.attendance}`}
                >
                  {response.attendance === "yes"
                    ? `Dolazi · ${response.partySize}`
                    : "Ne dolazi"}
                </span>
                <time dateTime={response.submittedAt}>
                  {formatSubmittedAt(response.submittedAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RsvpCoupleDashboard;

import "./AnaIMarkoInvitation.css";

/**
 * Example complete digital invitation.
 * Duplicate / adapt this file when adding new full templates,
 * then register it in data/fullInvitations.ts.
 */
function AnaIMarkoInvitation() {
  return (
    <article className="ami">
      <header className="ami__hero">
        <p className="ami__eyebrow">sa radošću vas pozivamo</p>
        <h1 className="ami__names">
          Ana <em>&</em> Marko
        </h1>
        <p className="ami__date">subota, 12. septembar 2026.</p>
      </header>

      <section className="ami__section">
        <h2 className="ami__heading">Naša priča</h2>
        <p className="ami__body">
          Od prvog susreta do ovog dana, put ispunjen smehom, putovanjima i
          tihim trenucima. Sa velikom radošću delimo sa vama početak novog
          poglavlja.
        </p>
      </section>

      <section className="ami__section ami__section--split">
        <div>
          <h2 className="ami__heading">Ceremonija</h2>
          <p className="ami__meta">17:00</p>
          <p className="ami__body">
            Crkva Svetog Marka
            <br />
            Beograd
          </p>
        </div>
        <div>
          <h2 className="ami__heading">Proslava</h2>
          <p className="ami__meta">19:00</p>
          <p className="ami__body">
            Vila Bella
            <br />
            Avala
          </p>
        </div>
      </section>

      <section className="ami__section">
        <h2 className="ami__heading">Raspored dana</h2>
        <ul className="ami__timeline">
          <li>
            <span>15:00</span> Skup svatova
          </li>
          <li>
            <span>17:00</span> Ceremonija
          </li>
          <li>
            <span>19:00</span> Večera i proslava
          </li>
          <li>
            <span>21:30</span> Torta i prvi ples
          </li>
        </ul>
      </section>

      <section className="ami__section ami__section--center">
        <h2 className="ami__heading">RSVP</h2>
        <p className="ami__body">
          Molimo vas da potvrdite dolazak do 1. avgusta 2026.
        </p>
        <p className="ami__closing">Radujemo se vašem prisustvu.</p>
      </section>
    </article>
  );
}

export default AnaIMarkoInvitation;

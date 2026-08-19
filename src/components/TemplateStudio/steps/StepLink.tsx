type StepLinkProps = {
  shareSlug: string | null;
  publishing?: boolean;
  onPublish: () => void;
};

function StepLink({ shareSlug, publishing = false, onPublish }: StepLinkProps) {
  const url = shareSlug
    ? `klikdovencanja.rs/i/${shareSlug}`
    : "klikdovencanja.rs/i/…";

  return (
    <div className="studio-step">
      <header className="studio-step__header">
        <p className="studio-step__eyebrow">Peti korak</p>
        <h3 className="studio-step__title">Objavite pozivnicu</h3>
        <p className="studio-step__lede">
          Link nije samo prikaz, aktivira RSVP sistem. Gosti šalju odgovore,
          vi ih pratite u sledećem koraku (dashboard).
        </p>
      </header>

      <div className="studio-compose">
        <div className="studio-compose__block">
          <p className="studio-compose__label">Link za goste</p>
          <p className="template-link__url">{url}</p>
          <button
            type="button"
            className="studio-primary"
            onClick={onPublish}
            disabled={publishing}
          >
            {publishing
              ? "Objavljujem…"
              : shareSlug
                ? "Ažuriraj objavu"
                : "Generiši link i objavi"}
          </button>
          {shareSlug ? (
            <p className="studio-compose__hint">
              Pozivnica je u platform store-u. RSVP forma u preview-u sada
              čuva odgovore.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StepLink;

import type { ChangeEvent } from "react";

import type { TemplatePhotos } from "../../../types/templateStudio";

type StepPhotosProps = {
  photos: TemplatePhotos;
  onChange: (next: TemplatePhotos) => void;
};

const MAX_GALLERY = 8;

function readFilesAsUrls(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return Promise.resolve([]);

  const images = Array.from(files).filter((file) =>
    file.type.startsWith("image/"),
  );

  return Promise.all(
    images.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

function StepPhotos({ photos, onChange }: StepPhotosProps) {
  const handleCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const [url] = await readFilesAsUrls(event.target.files);
    event.target.value = "";
    if (!url) return;
    onChange({ ...photos, coverPreviewUrl: url });
  };

  const handleGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const urls = await readFilesAsUrls(event.target.files);
    event.target.value = "";
    if (urls.length === 0) return;
    onChange({
      ...photos,
      galleryPreviewUrls: [...photos.galleryPreviewUrls, ...urls].slice(
        0,
        MAX_GALLERY,
      ),
    });
  };

  return (
    <div className="studio-step">
      <header className="studio-step__header">
        <p className="studio-step__eyebrow">Treći korak</p>
        <h3 className="studio-step__title">Cover i galerija</h3>
        <p className="studio-step__lede">
          Cover otvara stranicu; galerija dolazi posle rasporeda, isto kao na
          punoj wedding stranici.
        </p>
      </header>

      <div className="studio-photos">
        <div className="studio-compose__block">
          <p className="studio-compose__label">Cover fotografija</p>
          <label className="studio-drop">
            <input
              type="file"
              accept="image/*"
              className="visually-hidden"
              onChange={(event) => {
                void handleCover(event);
              }}
            />
            {photos.coverPreviewUrl ? (
              <img src={photos.coverPreviewUrl} alt="Cover pregled" />
            ) : (
              <span className="studio-drop__placeholder">
                <em>Cover</em>
                <span>Dodajte naslovnu fotografiju para</span>
              </span>
            )}
          </label>
          {photos.coverPreviewUrl ? (
            <div className="studio-photos__actions">
              <button
                type="button"
                className="studio-text-btn studio-text-btn--muted"
                onClick={() =>
                  onChange({ ...photos, coverPreviewUrl: null })
                }
              >
                Ukloni cover
              </button>
            </div>
          ) : null}
        </div>

        <div className="studio-compose__block">
          <p className="studio-compose__label">
            Galerija ({photos.galleryPreviewUrls.length}/{MAX_GALLERY})
          </p>
          <div className="studio-photos__actions">
            <label className="studio-text-btn">
              + Dodaj fotografije
              <input
                type="file"
                accept="image/*"
                multiple
                className="visually-hidden"
                onChange={(event) => {
                  void handleGallery(event);
                }}
              />
            </label>
            {photos.galleryPreviewUrls.length > 0 ? (
              <button
                type="button"
                className="studio-text-btn studio-text-btn--muted"
                onClick={() =>
                  onChange({ ...photos, galleryPreviewUrls: [] })
                }
              >
                Obriši sve
              </button>
            ) : null}
          </div>

          {photos.galleryPreviewUrls.length > 0 ? (
            <ul className="studio-gallery-thumbs">
              {photos.galleryPreviewUrls.map((url, index) => (
                <li key={`${url.slice(0, 24)}-${index}`}>
                  <img src={url} alt={`Galerija ${index + 1}`} />
                  <button
                    type="button"
                    className="studio-text-btn studio-text-btn--muted"
                    onClick={() =>
                      onChange({
                        ...photos,
                        galleryPreviewUrls: photos.galleryPreviewUrls.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  >
                    Ukloni
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="studio-compose__hint">
              Do {MAX_GALLERY} fotografija, prikazuju se u mreži na stranici.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StepPhotos;

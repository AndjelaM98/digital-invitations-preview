# Digital invitations preview

Javni preview template pozivnica za GitHub Pages.

## Javna adresa

Nakon deploy-a sajt je ovde:

**https://AndjelaM98.github.io/digital-invitations-preview/**

Početna stranica prikazuje listu pozivnica. Svaka kartica otvara punu template stranu:

- [Envelope Romance](https://AndjelaM98.github.io/digital-invitations-preview/preview/envelope-romance)
- [Leto ljubavi](https://AndjelaM98.github.io/digital-invitations-preview/preview/leto-ljubavi)
- [Pearl Elegance](https://AndjelaM98.github.io/digital-invitations-preview/preview/pearl-elegance)
- [Soft Floral](https://AndjelaM98.github.io/digital-invitations-preview/preview/soft-floral)
- [Blush Wedding](https://AndjelaM98.github.io/digital-invitations-preview/preview/rose-blush)

Marketing sajt ostaje na [/sajt](https://AndjelaM98.github.io/digital-invitations-preview/sajt).

## Lokalni rad

```powershell
npm install
npm run dev
```

Vite `base` je `/digital-invitations-preview/`, pa lokalni URL izgleda ovako:

http://localhost:5173/digital-invitations-preview/

## Deployment

Push na `main` pokreće GitHub Actions workflow `.github/workflows/deploy-pages.yml`.
Workflow gradi sajt i objavljuje ga na granu `gh-pages`.

Jednom, u GitHubu (vlasnik repoa **AndjelaM98**):

1. Otvori [Settings → Pages](https://github.com/AndjelaM98/digital-invitations-preview/settings/pages)
2. **Build and deployment → Source:** `Deploy from a branch`
3. **Branch:** `gh-pages` / folder `/(root)`
4. Sačuvaj
5. Sačekaj 1–2 minuta, pa otvori sajt

Ako workflow još nije kreirao granu `gh-pages`, prvo pokreni Actions workflow (push ili **Run workflow**), pa tek onda izaberi granu u Pages podešavanjima.

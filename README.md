# Digital invitations preview

Javni preview template pozivnica za GitHub Pages.

## Javna adresa

Nakon deploy-a sajt je ovde:

**https://AndjelaM98.github.io/digital-invitations-preview/**

Početna stranica prikazuje listu pozivnica. Svaka kartica otvara punu template stranu:

- [Envelope Romance](https://AndjelaM98.github.io/digital-invitations-preview/preview/envelope-romance)
- [Leto ljubavi](https://AndjelaM98.github.io/digital-invitations-preview/preview/leto-ljubavi)
- [Pearl Elegance](https://AndjelaM98.github.io/digital-invitations-preview/preview/pearl-elegance)

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

Jednom, u GitHubu (vlasnik repoa):

1. Otvori [Settings → Pages](https://github.com/AndjelaM98/digital-invitations-preview/settings/pages)
2. Source: **GitHub Actions**
3. Ponovo pokreni workflow u [Actions](https://github.com/AndjelaM98/digital-invitations-preview/actions)

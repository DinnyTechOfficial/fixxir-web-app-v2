# Fixxir Web App

## Local development

Install dependencies and start the development server:

```bash
npm ci
test -f .env.local || cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The local API origin defaults to `http://localhost:8080`; start the Go API locally or change `NEXT_PUBLIC_FIXXIR_API_URL` in `.env.local`.

## Checks

```bash
npm run lint
npm run build
```

The production build is a static export written to `dist/` for Cloudflare Pages.

## Deploy to Cloudflare Pages

- Framework preset: **Next.js (Static HTML Export)**
- Build command: `npm run build`
- Build output directory: `dist`
- Set the production branch and root directory to match the repository in Cloudflare Pages.

Follow [the Cloudflare deployment checklist](docs/cloudflare-deployment-checklist.md) for smoke tests and known limits.

## Current application limits

- Repair requests are submitted directly to the Go API. Customers can track repair progress, review quotes, and continue to payment from `/repair/track`.
- Photo uploads are not sent anywhere.
- The static export does not provide Next.js SSR, API routes, or server actions. Set the build-time `NEXT_PUBLIC_FIXXIR_API_URL` to the HTTPS Go API origin for each Cloudflare Pages environment. See [public repair tracking integration](docs/public-repair-tracking.md).

# Fixxir Web App

## Local development

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

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

- Repair requests are not persisted; the form only keeps entered data in browser memory and directs customers to contact Fixxir.
- Photo uploads are not sent anywhere.
- Static export does not provide Next.js SSR, API routes, or server actions. Add an external API or move to a server-capable Cloudflare Workers setup when backend behavior is implemented.

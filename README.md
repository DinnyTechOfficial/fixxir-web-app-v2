# Fixxir Web App

## Local development

Install dependencies and start the development server:

```bash
npm ci
test -f .env.local || cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The local API origin defaults to `http://localhost:8080`; start the Go API locally or change `NEXT_PUBLIC_FIXXIR_API_URL` in `.env.local`.

## Testing quote emails through a tunnel

Set `NEXT_DEV_ALLOWED_ORIGINS` in `.env.local` to your tunnel hostname (without `https://` or a port), then restart `npm run dev`:

```env
NEXT_DEV_ALLOWED_ORIGINS=your-tunnel.ngrok-free.app
```

Next.js checks the browser origin on development endpoints, including the WebSocket used during hydration. Without this setting, a tunneled page can show static HTML while its buttons and email-token detection remain inactive. Multiple hostnames can be separated by commas. Update this value when the tunnel hostname changes.

Set the API and email worker’s `REPAIR_QUOTE_ACCESS_URL` to `https://your-tunnel.ngrok-free.app/repair/quote` for testing. Quote links keep `#email_token=...` in the browser; the customer clicks **Continue to quote** to exchange it. API CORS must also allow the tunnel origin for subsequent API requests.

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

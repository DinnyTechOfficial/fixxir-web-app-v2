# Cloudflare Pages Deployment Checklist

This checklist is for deploying the current Next.js app as a static site on Cloudflare Pages. It matches the repository's current `next.config.ts`, which enables static export and writes the export to `dist`.

## Before deploying

- [x] `next.config.ts` sets `output: "export"`.
- [x] `next.config.ts` sets `distDir: "dist"` to match the Cloudflare output directory.
- [x] `public/_redirects` serves `/repair/track/<pickup-code>` from the exported tracking page so direct pickup links work with static hosting.
- [x] `npm run build` completes successfully and creates `dist`.
- [ ] Confirm the production branch and repository root directory in Cloudflare Pages.
- [ ] Select **Next.js (Static HTML Export)** as the framework preset. Do not select **React (Vite)** for this Next.js project.
- [ ] Set the build command to `npm run build`.
- [ ] Set the build output directory to `dist` to match `distDir` in `next.config.ts`.
- [ ] Save the Pages build settings and trigger a deployment from the intended branch.

## Verify the deployment

- [ ] Confirm the Cloudflare build completes and finds the `dist` output directory.
- [ ] Open the homepage on the deployed domain.
- [ ] Confirm `/robots.txt` allows search crawling and points to `/sitemap.xml`; confirm `/sitemap.xml` lists the canonical public pages.
- [ ] Confirm the homepage has the expected canonical URL and a crawlable `rel="icon"` pointing to the current Fixxir logo.
- [ ] In Google Search Console, submit the sitemap and request homepage indexing after a favicon change; Google may take time to refresh the search-result icon.
- [ ] Open `/repair/request` directly, refresh it, and complete the form steps.
- [ ] Open `/repair/request/success` directly and check that its assets load.
- [ ] Check the homepage and repair form on a mobile viewport.
- [ ] Check browser console and Cloudflare deployment logs for errors.

## Current functional limits

- The static export does not provide Next.js SSR, API routes, or server actions. Repair intake and tracking call the Go API from the browser.
- Photo upload is not implemented. The form directs customers to WhatsApp for photos.

## Public repair tracking API

Set the build-time variable `NEXT_PUBLIC_FIXXIR_API_URL` to `https://api.fixxir.com` for production, without `/api/v1`. Use the separate HTTPS API origin for staging. This is a public URL, not a secret; Cloudflare Pages must override the local `http://localhost:8080` value from `.env.example`. Configure the API CORS allowlist to include the deployed Fixxir website origin, and set Paystack's checkout callback URL to `https://fixxir.com/repair/track` so customers return to payment verification. See [public repair tracking integration](public-repair-tracking.md) for the request, quote, and payment sequence.

Remove the old repair-intake Pages Function bindings from Cloudflare Pages after deployment. They are no longer used by this static site. Keep API-side provider configuration in the Go backend environment.

## If changing to the default `out` directory

If Cloudflare Pages is configured to output `out`, remove `distDir: "dist"` from `next.config.ts`, keep `output: "export"`, and change the Pages output directory to `out`. The build command can remain `npm run build`.

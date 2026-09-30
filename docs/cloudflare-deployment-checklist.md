# Cloudflare Pages Deployment Checklist

This checklist is for deploying the current Next.js app as a static site on Cloudflare Pages. It matches the repository's current `next.config.ts`, which enables static export and writes the export to `dist`.

## Before deploying

- [x] `next.config.ts` sets `output: "export"`.
- [x] `next.config.ts` sets `distDir: "dist"` to match the Cloudflare output directory.
- [x] `npm run build` completes successfully and creates `dist`.
- [ ] Confirm the production branch and repository root directory in Cloudflare Pages.
- [ ] Select **Next.js (Static HTML Export)** as the framework preset. Do not select **React (Vite)** for this Next.js project.
- [ ] Set the build command to `npm run build`.
- [ ] Set the build output directory to `dist` to match `distDir` in `next.config.ts`.
- [ ] Save the Pages build settings and trigger a deployment from the intended branch.

## Verify the deployment

- [ ] Confirm the Cloudflare build completes and finds the `dist` output directory.
- [ ] Open the homepage on the deployed domain.
- [ ] Open `/repair/request` directly, refresh it, and complete the form steps.
- [ ] Open `/repair/request/success` directly and check that its assets load.
- [ ] Check the homepage and repair form on a mobile viewport.
- [ ] Check browser console and Cloudflare deployment logs for errors.

## Current functional limits

- The static export does not provide dynamic Next.js API routes. Repair submissions use the root-level Cloudflare Pages Function in `functions/api/repair-requests.ts`.
- Intake is fail-closed. It remains disabled unless the server-side bindings and `REPAIR_INTAKE_ENABLED=true` are configured; a published HTTPS privacy notice URL is also required.
- The Apps Script endpoint must return a persisted request ID and enforce idempotency for repeated `submissionId` values. See `repair-intake-integration.md` before deploying the script or enabling intake.
- Brevo sends the receipt after the Sheet write. If email delivery fails after persistence, the page still confirms the saved request and discloses the email failure. Slack alerts are best-effort.
- Photo upload is not implemented. The form directs customers to WhatsApp for photos until a signed Cloudinary or backend upload flow is ready.

## Pages Function configuration

Configure these as Cloudflare Pages server-side variables/secrets, not `NEXT_PUBLIC_*` values:

- `REPAIR_INTAKE_ENABLED` — keep `false` until integration and privacy checks are complete; set to `true` only for an intentional launch.
- `REPAIR_PRIVACY_NOTICE_URL` — published HTTPS privacy notice covering intake data and processors.
- `APPS_SCRIPT_URL` and `APPS_SCRIPT_TOKEN` — deployed Apps Script web app URL and shared secret.
- `BREVO_API_KEY` — server-side Brevo API key with transactional sending enabled.
- `SLACK_WEBHOOK_URL` — optional incoming webhook for minimal request alerts.

The sender and reply-to are currently `no-reply@fixxir.com` and `info@fixxir.com`. Verify the sender with Brevo and configure SPF, DKIM, and DMARC before enabling receipts. `next dev` alone does not execute this function; use the Cloudflare Pages local runtime to test it.

## If changing to the default `out` directory

If Cloudflare Pages is configured to output `out`, remove `distDir: "dist"` from `next.config.ts`, keep `output: "export"`, and change the Pages output directory to `out`. The build command can remain `npm run build`.
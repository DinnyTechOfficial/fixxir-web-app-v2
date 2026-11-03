# Public repair tracking integration

All browser requests to the Go API use the shared client in `app/repair/public-api.ts`. It reads `NEXT_PUBLIC_FIXXIR_API_URL`, adds `/api/v1`, and is used for catalog lookup, repair intake, repair sessions, tracking, quotes, and payment. Do not add endpoint-specific API origins or embed credentials in this public variable.

## Public web flow

1. The request form resolves the selected manufacturer and model against the Go API catalog.
2. It sends the intake payload to `POST /api/v1/public/repairs/summary`, then submits it to `POST /api/v1/public/repairs` with the short-lived submission token.
3. The customer enters the returned lookup code and the email address or phone number used for the request. The page sends these in the body of `POST /api/v1/public/repair-sessions`.
4. The page uses the returned one-hour bearer token and repair UUID to load `GET /api/v1/public/repairs/{repairID}` and to update quote selections or initialize/verify payments. The token stays in page memory and is never placed in browser storage or a URL.
5. `/repair/quote` is the dedicated quote-review and payment page; `/repair/track` retains repair progress. Both reuse the same session and payment integration. Quote email links carry a one-time `email_token` in the URL fragment. The page does not exchange it on load; the customer must click **Continue to quote**. The fragment is removed before `POST /api/v1/public/repair-sessions/exchange` is called.
6. The page redirects to the validated Paystack checkout origin. On return, it retains only the repair lookup code and payment reference in tab-scoped session storage; the customer re-verifies contact details to establish a new repair session. The API verifies payment status, and the browser does not infer success from the redirect.

Accepted, unpaid quotes keep a **Continue payment** action. Sent quotes initialize with `selected_optional_line_ids`; accepted quotes initialize with `{}` to preserve the confirmed selection. After an initialization error, the page reloads repair details because the API may have accepted the quote before payment setup failed. Paid or cancelled repairs do not show this action.

## API origin configuration

For local development, copy `.env.example` to `.env.local`. It points at the local Go API on port 8080:

```text
NEXT_PUBLIC_FIXXIR_API_URL=http://localhost:8080
```

Restart the Next.js dev server after changing `.env.local`. For Cloudflare Pages, set this build-time variable separately for each environment. Production uses `https://api.fixxir.com`; staging must use its own HTTPS API origin. Set only the origin, without `/api/v1`, path, query, credentials, or fragment. This URL is public and is not a secret.

When the Go API runs on another machine on the trusted local network, development may use its private LAN address over HTTP (for example, `http://192.168.1.20:8080`). Plain HTTP to private-network hosts is accepted only by `next dev`; production builds require HTTPS.

The Go API must allow browser CORS requests from the exact deployed website origin. CORS does not replace API authorization. Do not use a production API origin for development or smoke tests.

## Current contract limits

- Public repair access requires a matching lookup code plus email/phone, or a valid repair-session token. Lookup codes alone do not authorize tracking or payment actions.
- Repair sessions expire after one hour. After a page reload or payment redirect, the customer must re-establish access; bearer tokens are not persisted.
- The current public intake requires an existing catalog model ID. A custom model name or “I’m not sure” cannot be submitted yet; the form directs customers to WhatsApp.
- Photo upload is not implemented. The form directs customers to WhatsApp for photos.
- Public API rate limits and CORS must be configured by the API/deployment operators. Frontend checks are not an abuse-control boundary.

## Quote email deployment

- Deploy the website first and confirm `/repair/quote` loads directly.
- Configure `REPAIR_QUOTE_ACCESS_URL=https://fixxir.com/repair/quote` identically in the Go API and email worker. Keep JWT secrets consistent between those services.
- Set the website build-time `NEXT_PUBLIC_FIXXIR_API_URL` to the HTTPS API origin and allow the exact website origin in API CORS.
- Keep the Paystack callback at `https://fixxir.com/repair/track`; customers re-verify contact details there before payment verification.
- Smoke-test a fresh quote email: loading the page must not exchange the token. Click Continue to quote, review required and optional lines, initialize payment, and verify payment after returning.
- Test an expired/used email link with lookup/contact recovery, accepted-but-unpaid retry, and paid/cancelled repairs. Bank details include expiry when the API supplies it.

The quote page keeps its URL during review and does not show the service timeline. Sharing still produces a tracking link without a session token. Browser sessions stay in memory; refreshing requires fresh verification.

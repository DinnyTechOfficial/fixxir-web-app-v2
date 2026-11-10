# Public repair tracking integration

All browser requests to the Go API use the shared client in `app/repair/public-api.ts`. It reads `NEXT_PUBLIC_FIXXIR_API_URL`, adds `/api/v1`, and is used for catalog lookup, repair intake, repair sessions, tracking, quotes, and payment. Do not add endpoint-specific API origins or embed credentials in this public variable.

## Public web flow

1. The request form resolves the selected manufacturer and model against the Go API catalog.
2. It sends the intake payload to `POST /api/v1/public/repairs/summary`, then submits it to `POST /api/v1/public/repairs` with the short-lived submission token.
3. The customer enters the returned lookup code and the email address or phone number used for the request. The page sends these in the body of `POST /api/v1/public/repair-sessions`.
4. The page uses the returned one-hour bearer token and repair UUID to load `GET /api/v1/public/repairs/{repairID}` and to update quote selections or initialize/verify payments. The quote and payment-return routes keep the scoped session in tab-scoped `sessionStorage` until its API expiry so refresh can restore access; the tracking route can restore the same session too, provided it matches the repair link. Tokens are never included in page URLs or shared links.
5. `/repair/quote` is the dedicated quote-review and payment page; `/repair/track` retains repair progress. Both reuse the same session and payment integration. Quote email links carry a one-time `email_token` in the URL fragment. The page does not exchange it on load; the customer must click **Continue to quote**. The fragment is removed before `POST /api/v1/public/repair-sessions/exchange` is called.
6. The page redirects to the validated Paystack checkout origin. On return, the quote session is restored in the same tab when still valid; otherwise the customer re-verifies contact details. The lookup code and payment reference are also retained in tab-scoped session storage. The API verifies payment status, and the browser does not infer success from the redirect.

The main payment action initializes payment and immediately opens the validated Paystack checkout URL, saving the returned reference before redirecting. If hosted checkout is unavailable, show a retry/support error. Bank account details are never rendered by the website. Accepted, unpaid quotes keep a **Continue payment** action. Sent quotes initialize with `selected_optional_line_ids`; accepted quotes initialize with `{}` to preserve the confirmed selection. After an initialization error, the page reloads repair details because the API may have accepted the quote before payment setup failed. Paid or cancelled repairs do not show this action.

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
- Repair sessions expire after up to one hour. Quote sessions survive same-tab refreshes and payment redirects in `sessionStorage` until the original API expiry. An expired, invalid, or API-revoked session requires fresh verification.
- The current public intake requires an existing catalog model ID. A custom model name or “I’m not sure” cannot be submitted yet; the form directs customers to WhatsApp.
- Photo upload is not implemented. The form directs customers to WhatsApp for photos.
- Public API rate limits and CORS must be configured by the API/deployment operators. Frontend checks are not an abuse-control boundary.

## Quote email deployment

- Deploy the website first and confirm `/repair/quote` loads directly.
- Configure `REPAIR_QUOTE_ACCESS_URL=https://fixxir.com/repair/quote` identically in the Go API and email worker. Keep JWT secrets consistent between those services.
- Set the website build-time `NEXT_PUBLIC_FIXXIR_API_URL` to the HTTPS API origin and allow the exact website origin in API CORS.
- Set the Paystack callback to `https://fixxir.com/repair/payment/return`; customers restore their same-tab session or re-verify contact details there before payment verification.
- Smoke-test a fresh quote email: loading the page must not exchange the token. Click Continue to quote, review required and optional lines, initialize payment, and verify payment after returning.
- Test an expired/used email link with lookup/contact recovery, accepted-but-unpaid retry, and paid/cancelled repairs. No temporary or company transfer account details are displayed.

The quote page keeps its URL during review and does not show the service timeline. The quote page can initialize and share a Paystack checkout link for another person to pay. Tracking links remain available on the tracking page. Refreshing reloads fresh quote data using the unexpired session saved in that tab.

## Tracking display

The collapsed timeline shows the current stage, up to two preceding stages, and the next stage. It retains the latest-first display order. At the beginning or end, only available stages are shown. **See all steps** expands the complete timeline. The active display stage takes priority over the API’s grouped stage code so Testing is centered correctly.

Latest update shows only the newest public event by `occurred_at`. The website splits the API’s combined `in_repair` stage into Repair and Testing using the job status: `in_repair`/`rework_required` activates Repair; `qa_pending`/`qa_in_progress` activates Testing; dispatch-ready and later statuses complete both. Testing does not reuse the repair start timestamp. API-provided completion percentages are retained. If the API supplies an independent testing stage, its stages are used directly.

## Payment return page

`/repair/payment/return` accepts Paystack `reference` or `trxref` query parameters. After an unexpired tab session is restored, or lookup/contact verification establishes a fresh session, it calls payment verification and shows checking, confirmed, pending, unsuccessful, or verification-error states. Success requires an API-confirmed paid status, then the page redirects to `/repair/track/{lookup_code}` and restores the same valid tab session. Pending and error states allow another check; unsuccessful payments allow retry. If the reference is missing, the authenticated verification request sends an empty reference so the API resolves the repair’s latest payment. Pending references remain in the URL so reloading can resume verification.

Deploy this route before changing the API/Paystack checkout callback configuration to `https://fixxir.com/repair/payment/return`. The checkout URL and callback are created by the backend; this website change does not update backend environment settings. The legacy tracking callback continues to support verification.

The quote entry screen prioritizes **Continue to quote** when a valid email token is present. Lookup/contact fields are shown only after selecting **Use repair details instead** or after an exchange/load failure. A missing token shows a recovery explanation instead of silently presenting the tracking form.

## Quote review and paying for someone else

The quote screen renders a loading state until the browser has read the email fragment, then presents **Continue to quote** as its primary action. It exchanges the token only on click. Required repairs cannot be deselected; optional repairs can be changed while the quote is `sent`, with totals refreshed from the API before payment is enabled. Starting checkout or creating a payment link confirms the selection, after which the API locks optional changes.

**Share payment link** initializes checkout using the chosen optional repairs and shares only the validated HTTPS Paystack `authorization_url`. The recipient can pay without the customer’s repair credentials. No repair session token or email token is shared. Repeated sharing and paying reuse the same unexpired checkout so another initialization does not supersede an already-shared link. Checkout expiry is shown when supplied by the API. A share/copy failure leaves the link available for manual copying. A missing or invalid checkout destination results in a retry/support error; no account placeholders are shown.

This shares checkout access. A separately shareable quote-review page would require a restricted backend sharing endpoint; the current API exposes no such capability.

## Quote session restoration

The quote page saves only `repair_id`, `access_token`, and the original `expires_at` in `fixxir-quote-session-v1` in `sessionStorage`. A minimal initialized checkout record may also be saved so a refresh does not replace a shared checkout. Email tokens, contact details, and fetched repair data are not saved. Restoration loads the current repair from the API rather than displaying a cached quote. Saved checkout reuse requires matching the current API payment URL and amount, an accepted unpaid quote, and unexpired checkout access.

A new email token takes precedence over saved access. Switching email links or submitting contact verification clears the prior saved access. Expired/malformed sessions and API 401/403/404/410 responses clear saved access. Storage failures leave the current page usable but disable restoration. The initial loading screen stays visible until restoration completes.

Confirmed payments redirect from quote/payment-return views to the tracking page with `location.replace`, so Back does not reopen the callback. Pending, unsuccessful, or verification-error results stay on the callback. Tracking restoration checks that the saved repair matches the lookup code in the requested URL before displaying it.

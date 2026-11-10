# Web service requests

Implementation follows the API service-request contract. Update the five existing
repair pages. Keep static hosting and current styles. Store request sessions only;
never restore old job sessions. Device cards use stable client item IDs.

Send shared contact and logistics once, with device inputs under `jobs`. Summary
issues the submission token. Reuse that token for a matching creation retry.

Published quotes group services by device. Hide draft prices. Submit all active
job selections and publication/payable fingerprints for one full payment. Handle
202 with bounded retries. A stale or withdrawn offer must reload before payment.
Keep hosted checkout, generated accounts, and company bank transfer instructions.
Verify redirects through the API. Download receipts with request authorisation.

API routes remain under implementation. Live API and provider checks must be
reported separately from local tests and builds.

## Pages and ownership

No new page URLs were added. Request intake and success use their existing page
files. Tracking, quote, and payment return share `components/RepairAccess.tsx`.
The old job-scoped view, session helper, and progress helper were removed.

Keep the existing header, footer, brand colours, catalog selection, intake steps,
and static export. All devices use one collection choice and one return choice.
Each card keeps its client item ID through editing. A matching failed creation
retry keeps its submission token; a changed payload needs a new summary.

## Exact API contract used

The implementation was checked against the API's `servicerequests` routes and
DTOs, plus `service_request_read.go`, `service_request_quote.go`,
`service_request_access.go`, and `service_request_payments.go`.

All JSON responses use `{data, meta, error}`. Private calls use a bearer token,
omit cookies, disable cache, reject redirects, and set a 30-second network limit.

| Operation | Public path after `/api/v1` |
|---|---|
| Summary | `POST /public/service-requests/summary` |
| Create | `POST /public/service-requests` |
| Contact access | `POST /public/service-request-sessions` |
| Email exchange | `POST /public/service-request-sessions/exchange` |
| Logout | `POST /public/service-request-sessions/logout` |
| Tracking | `GET /public/service-requests/:id/tracking` |
| Published quote | `GET /public/service-requests/:id/quote` |
| Selection preview | `POST /public/service-requests/:id/quote/summary` |
| Reject combined offer | `POST /public/service-requests/:id/quote/reject` |
| Initialize full payment | `POST /public/service-requests/:id/payment/initialize` |
| Verify payment | `POST /public/service-requests/:id/payment/verify` |
| Documents | `GET /public/service-requests/:id/quote/pdf`, `/receipt/pdf`, `/receipt/image` |

Intake uses `first_name`, `last_name`, `email`, `phone`, `whatsapp_phone`, flat
shared logistics, and `jobs`. Jobs contain `client_item_id`, `model_id`,
`device_serial_number`, and `description`. Public intake never sends staff notes.
Collection values are `courier_pickup` and `customer_dropoff`; return values are
`courier_return` and `customer_pickup`. Summary returns `token`; create sends
`submission_token`.

Session creation sends `lookup_code` and either `email` or `phone`. Exchange sends
`email_token`. Responses contain `service_request_id`, `public_lookup_code`,
`access_token`, and `expires_at`. Tab storage keeps only request ID, token, and
original expiry. New email access clears prior access. No token enters a shared
link. Tracking checks the requested lookup code before restoring saved access.

Read responses use `payment_summary.state`, not `status`. Review appears as
`overall_status: quote_under_review` with no payable quote. Timeline events use
`id`, `code`, `repair_job_id`, `status`, and `occurred_at`; the browser does not
expect staff-written titles or notes.

Quote preview sends the publication fingerprint and a complete active-job
selection set. Required services cannot be removed. The API returns the payable
fingerprint and totals. Initialization sends both fingerprints and the final
selection. It does not send a frontend amount or idempotency key.

Payment results contain `state`, `payment_id`, a full quote `summary`,
`available_methods`, and `payment` with provider/reference/amount/currency/status
and method instructions. Display hosted checkout, generated transfer accounts,
and company-transfer fallback when returned. Accepted selections stay locked
during recovery. Only a trusted HTTPS Paystack checkout URL can be opened or
copied. Checkout links are not restored from stale browser storage.

For 202, retry the identical initialization at the advised interval, clamped to
2–10 seconds, at most ten waits. Stop on navigation. A 409 or 412 reloads the
request and removes stale payment instructions. Unknown payment outcomes remain
blocked by the API; the browser does not create another financial attempt itself.

Return-page verification sends the optional reference to the scoped backend.
Neither redirect parameters nor local state can mark a request paid. Receipt
downloads require valid request access and a successful binary document response.

## Verification

Live checks require the local feature API at port 8181, seeded catalog models,
CORS for http://127.0.0.1:3193, and a local email sink. They must never point at a
production database or provider. The opt-in journey creates two test jobs and
checks contact proof, request sessions, and tracking. Existing published quote
fixtures may be checked without initializing a provider payment.

Run live tests only after the feature API is ready:

```sh
FIXXIR_LIVE_TESTS=1 FIXXIR_LIVE_ALLOW_WRITES=feature-db npm run test:live
```

Defaults: `FIXXIR_LIVE_API_URL=http://127.0.0.1:8181` and
`FIXXIR_LIVE_WEB_URL=http://127.0.0.1:3193`. Both must remain loopback origins.
The write acknowledgement confirms the database and email sink were checked.
Run mocked and live suites in sequence, not together.

The intake test discovers a seeded catalog model and submits two physical
devices with distinct serials. To choose a specific catalog fixture, set
`FIXXIR_LIVE_CATALOG_FIXTURE` to JSON with `device_type`, `manufacturer_id`, and
`model_id`. The fixture must exist in the catalog's returned pages.

The quote test needs `FIXXIR_LIVE_QUOTE_FIXTURE` containing `lookup_code` and
`contact` for a published two-job request. It reads the real combined offer and
previews an optional selection without starting payment. Without this fixture,
that test skips explicitly. No live test calls a payment/provider route. Test
records remain in the feature database; the suite does not delete business data.
Live tracing is off so access tokens do not enter trace archives.

For paid proof, `FIXXIR_LIVE_PAID_FIXTURE` has the same lookup/contact shape for a
manually confirmed two-job request. Its test checks the paid state, locked
payment UI, frozen per-job receipt total, and an authorised PDF download. Manual
confirmation belongs to the API/Admin setup, not to this browser suite.

Commands:

```text
npm test
npm run test:e2e
npm run lint
npm run build
git diff --check
```

Unit tests cover selections, locked checkout recovery, bounded polling, session
validation, request authentication, 202 metadata, structured errors, payment
methods, network failures, and safe submission-token renewal. All ten passed.
They run without a new unit-test dependency.

Playwright uses isolated headless Chromium and a local Next server on port 3192.
It mocks API responses; it does not prove live API or Paystack behaviour. Eight
browser tests originally passed, covering draft privacy, all payment methods and 202, stale
review, pending return and receipt download, click-only email exchange,
multi-device editing and submission replay, optional selections, and checkout
recovery. Install the matching browser with `npx playwright install chromium`.
Set `PLAYWRIGHT_CHANNEL=chrome` only when testing the system Chrome install.
An initial system-Chrome rerun timed out during browser-context setup, before
loading application code.

The mocked suite now has ten tests, including `needs_review` blocking and
`payment_not_required` acceptance without a fake charge or paid receipt.
The first live attempt failed before intake because API CORS rejected port 3193;
the quote test skipped because no fixture was supplied. This is not live success.

Still required before release: real API journeys with the feature database,
development provider verification, live email links, production hosting smoke
tests, and visual review on target browsers and devices. No production changes
or provider payments were performed.

Dependency installation reported eight moderate audit findings and a Node 23
engine warning from an existing ESLint dependency. No forced upgrades were made.

## Post-restart live acceptance

All six live browser journeys passed against the isolated API in 10.5 seconds,
using one browser worker and no other heavy task at the same time:

- Two-device intake, contact proof, request session, and tracking.
- Published combined quote and optional-service preview.
- Paid selection lock, frozen receipt, and real local PDF download.
- Withdrawn quote privacy and payment blocking.
- Payment-review state without claiming settlement.
- Zero-cost acceptance without a provider charge or fake paid receipt.

The first run used a zero-cost fixture already accepted before the restart.
Creating a fresh fixture fixed test setup; the assertion stayed unchanged.
No test called a real payment provider. Synthetic payment-review fixture data
does not prove a provider callback; callback/recovery checks remain in the API
test suite. Staging hosting and real provider/email checks remain release gates.

## Changed files

Modified:

```text
.gitignore
app/repair/components/RepairAccess.tsx
app/repair/public-api.ts
app/repair/request/page.tsx
app/repair/request/success/page.tsx
docs/public-repair-tracking.md
package.json
package-lock.json
```

Added:

```text
app/repair/service-request-api.ts
app/repair/service-request-rules.mjs
docs/service-requests.md
playwright.config.ts
playwright.live.config.ts
tests/service-request-api.test.mjs
tests/service-requests.test.mjs
tests/browser/service-requests.spec.ts
tests/live/service-requests.spec.ts
```

Removed obsolete job-scoped code:

```text
app/repair/components/RepairQuoteView.tsx
app/repair/quote-session.ts
app/repair/tracking-view.ts
```

The three existing route wrappers for tracking, quote, and payment return remain
unchanged; their shared access component now implements the request contract.

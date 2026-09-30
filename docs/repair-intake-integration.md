# Temporary Repair Intake Integration

## Request flow

The static Next.js export remains on Cloudflare Pages. The browser submits same-origin requests to `functions/api/repair-requests.ts`; the Pages Function validates the payload, saves it through the existing Apps Script web app, then attempts the customer receipt and optional Slack alert.

A request is considered received only when Apps Script confirms a saved row and returns a genuine request ID. Email and Slack run after persistence. A Brevo rejection does not undo the saved request; the customer sees the reference and an explicit email-queue status. A successful Brevo API response confirms acceptance for sending, not inbox delivery. Slack failure is non-blocking.

## Apps Script contract

The Pages Function sends an HTTPS JSON `POST` to `APPS_SCRIPT_URL`:

```json
{
  "action": "createRepairRequest",
  "token": "server-side shared secret",
  "submissionId": "UUID generated for this form submission",
  "request": {
    "customerName": "Customer name",
    "customerEmail": "customer@example.com",
    "customerPhone": "+234...",
    "deviceType": "Phone",
    "brand": "Brand",
    "model": "Model or Not sure",
    "modelUnknown": false,
    "issue": "Selected issue",
    "details": "Optional issue details",
    "area": "Neighborhood",
    "address": "Optional address",
    "handoff": "pickup, dropoff, or advise",
    "urgency": "asap, 1-2days, week, or nourgency"
  }
}
```

On a newly saved request, Apps Script must return JSON in this shape:

```json
{ "success": true, "requestId": "FXR-..." }
```

For a repeated `submissionId`, it must return the original request ID without creating another row. Use a lock/atomic check around deduplication and row creation. Validate the action and shared secret, reject malformed requests, and never log the token or full customer payload. The function treats non-2xx responses, invalid JSON, missing `success: true`, or missing `requestId` as a failed save.

The existing Apps Script project is external to this repository. Inspect its current `doPost`, columns, and job dashboard behavior before changing it. Preserve its current workflow, and test with a separate test sheet before using production data.

## Cloudflare bindings

Configure these in the Cloudflare Pages project's server-side variables/secrets. Do not prefix them with `NEXT_PUBLIC_` or commit them:

| Binding | Required | Purpose |
| --- | --- | --- |
| `REPAIR_INTAKE_ENABLED` | Yes | Must equal `true` to accept submissions; leave disabled until all launch checks pass. |
| `REPAIR_PRIVACY_NOTICE_URL` | Yes | Published HTTPS customer privacy notice. |
| `APPS_SCRIPT_URL` | Yes | Deployed HTTPS Apps Script `/exec` URL on `script.google.com`. |
| `APPS_SCRIPT_TOKEN` | Yes | Shared secret checked by Apps Script. |
| `BREVO_API_KEY` | Yes | Brevo transactional email API key. |
| `SLACK_WEBHOOK_URL` | No | Incoming webhook for the minimal team alert. |

The GET endpoint reports whether the required configuration is present. The POST endpoint remains disabled unless the feature flag, Apps Script URL/token, Brevo key, and HTTPS privacy URL are all configured.

## Notifications

The receipt uses the Fixxir wordmark, a concise request summary, the genuine request reference, contact links, support hours, and the existing no-repair-authorization disclaimer. It is sent from `no-reply@fixxir.com` with Reply-To `info@fixxir.com`. Verify the sender in Brevo and authenticate the domain with SPF, DKIM, and DMARC before enabling intake.

The optional Slack message contains the request reference and basic device/issue information only. Do not add phone, email, street address, or issue details to Slack. A notification outage must not mark a saved request as failed.

## Photos and future backend

Photo uploads are not part of this contract. The current form directs customers to WhatsApp for photos. Add Cloudinary only with a signed upload flow and store returned asset references in the request row. Keep the storage and notification boundary replaceable so the main backend can take over without changing the email template or form contract.

## Local and launch checks

- Test the Apps Script contract and deduplication against a test sheet.
- Use the Cloudflare Pages local runtime; `next dev` does not execute the `functions/` directory.
- Configure Cloudflare rate limiting or an equivalent abuse-control rule for the public POST endpoint before enabling intake.
- Verify a saved row produces exactly one request reference, one receipt attempt, and at most one Slack alert.
- Test Apps Script failure, Brevo failure after save, Slack failure after save, and retry with the same submission ID.
- Keep public intake disabled until the privacy notice, Sheet access/retention, sender authentication, Apps Script deployment, and production Cloudflare secrets have been reviewed.

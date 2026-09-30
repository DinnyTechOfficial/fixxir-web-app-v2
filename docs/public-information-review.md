# Public Information Review

## Confirmed details applied

- WhatsApp and phone: `+234 906 692 7907`
- Workshop address: `6A Pepple Street, Ikeja, Lagos`
- Support hours: daily, 8am–6pm WAT
- Service cities: Lagos and Abuja; specific pickup availability and fees must be confirmed with Fixxir
- Repair parts: certified by Fixxir; the quote should identify part type and source
- Official logo: `public/logo/fixxir-logo-default.png`, used for the app icon and site branding

## Launch 100 offer recommendation

The promotion is paused on the live homepage until its rules are final. When ready, keep the offer simple and operationally enforceable:

1. Define the eligible customer and repair types, and whether eligibility is limited to the first 100 completed paid repairs.
2. State the credit value, when it is earned, how it is redeemed, and whether it can be combined with other promotions.
3. Set an expiry date and exclusions, including refunds, cancelled repairs, and non-qualifying repairs.
4. Decide whether it applies to one customer, one phone number, or one account, and how duplicate claims are prevented.
5. Explain whether the credit is a discount, wallet balance, or voucher, and whether it has cash value.
6. Publish the terms alongside the amount anywhere the offer appears.

Do not relaunch the ₦5,000 offer until those conditions and the fulfilment process are approved.

## Details still needed before final public copy

### Service and handoff

- [ ] Confirm exact service-area boundaries within Lagos and Abuja; those two cities are the confirmed service cities.
- [ ] Confirm whether pickup and return are available in both cities, and whether there are fees, distance limits, or minimum repair values.
- [ ] Confirm whether customers may visit the Ikeja workshop, appointment requirements, and public opening/visiting hours.
- [ ] Confirm whether the displayed address is complete enough for visitors and whether it may be published publicly.

### Repair policies

- [ ] Diagnostic/inspection fee, when charged, and whether it is credited toward an approved repair.
- [ ] Repair authorization process and what happens when a customer declines the quote.
- [ ] Parts categories offered (for example, original, OEM, refurbished, or compatible), how Fixxir certification works, and whether customers can choose.
- [ ] Warranty period by repair/part, start date, covered faults, exclusions, and resolution process.
- [ ] Realistic turnaround ranges, what starts the clock, and how parts delays are handled.
- [ ] Device data/access policy, including when passcodes are needed, backup expectations, and data-loss responsibility.
- [ ] Privacy notice covering the customer/contact/device data collected, purpose, storage location, access, retention, deletion/contact requests, and any processors receiving it.
- [ ] Terms covering estimates, authorization, cancellations, refunds, liability, abandoned devices, and dispute/support contact details.
- [ ] Add links to the approved privacy notice and terms before activating online collection.
- [ ] Accepted payment methods and provider. Confirm what “Brails” refers to before naming it publicly; do not publish Paystack unless it is the actual launch provider.
- [ ] Cancellation, refund, abandoned-device, and uncollected-device terms.

### Customer communications

- [x] Select Brevo's HTTPS API for transactional receipts while keeping the site on Cloudflare Pages.
- [x] Set the intended sender/reply-to and implement the branded receipt template; verify sender/domain authentication and real delivery before launch.
- [ ] Inspect and update the active Apps Script to persist requests and return a genuine request reference; enforce idempotency before enabling intake.
- [x] Add a fail-closed Pages Function and confirmation flow; keep `REPAIR_INTAKE_ENABLED` off until the external contract and privacy notice are ready.
- [ ] Decide which team inbox receives new requests and who monitors it during daily support hours.
- [ ] Decide whether follow-up is by phone, WhatsApp, email, or a combination; do not promise a response deadline until the operation can meet it.
- [x] Keep Apps Script, Brevo, and Slack credentials server-side in Cloudflare Pages bindings; never expose them to client-side code.
- [ ] Approve and publish the privacy notice covering the temporary Sheet, Brevo, Slack, access, and retention before activating intake.
- [ ] Decide whether photos will use signed Cloudinary uploads or remain on WhatsApp until the main backend is ready.

## Current website behavior

The form and Cloudflare Pages Function now support a persisted request reference and a Fixxir-branded Brevo receipt, but public intake remains disabled until the existing Apps Script contract, Cloudflare secrets, sender authentication, and approved privacy notice are in place. Photo uploads are not supported; customers are directed to WhatsApp for photos.

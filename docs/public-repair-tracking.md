# Public request tracking

The website now uses the request-scoped flow described in
[Service requests](service-requests.md). It does not restore job-scoped sessions.

The existing request, success, tracking, quote, and payment-return URLs stay in
place. Keep `/repair/track/*` mapped to `/repair/track.html` on the static host.

Set `NEXT_PUBLIC_FIXXIR_API_URL` to the API origin only. Do not include `/api/v1`,
credentials, query strings, or fragments. Production requires HTTPS. Development
allows HTTP only for local/private hosts. Allow the exact web origin in API CORS.

Email links use an `email_token` fragment. The page removes it from the address
bar and exchanges it only after the customer clicks Continue. Recovery requires
the request code and contact details. Neither code alone nor a return URL proves
access or payment.

Store only the request ID, access token, and original expiry in tab session
storage. Reload current request and quote data before showing an offer. Never
store draft prices or contact details. Legacy browser state is discarded rather
than translated into another UI flow.

Keep backend Paystack callback and frontend payment return settings separate.
The backend callback verifies/routes provider events; the frontend return page
restores request access and asks the API to verify payment. A redirect is not
payment proof. Keep API and worker quote-access URLs consistent.

Do not deploy this client before its request APIs and access contract are ready.
Use only development providers for verification. This task does not change any
backend settings or authorise deployment.

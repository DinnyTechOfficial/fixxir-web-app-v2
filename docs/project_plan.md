The goal is:

> **Ad / Google / Referral → Landing Page → Repair Request → Qualification → Handoff → Diagnosis → Quote → Approval → Payment → Repair → Updates → QA → Return → Review / Referral**

The landing page gets the customer into the funnel; the repair-request system carries them through it.

## 1. Build principle

For launch, I recommend **no account/signup requirement before requesting a repair**. Requiring registration too early will create unnecessary conversion friction.

The customer should be able to:

**Start a repair → provide phone/contact → submit device problem → receive a Repair Request ID → continue through WhatsApp / secure tracking link.**

An account can become optional later.

This gives us both:

* a low-friction acquisition flow;
* a structured repair record from the beginning.

---

# 2. Overall customer-facing architecture

I would build these customer-facing surfaces:

| Surface                    | Purpose                          |
| -------------------------- | -------------------------------- |
| `/` or `/repair`           | Main conversion landing page     |
| `/repair/request`          | Multi-step repair request        |
| `/repair/request/success`  | Confirmation + Repair Request ID |
| `/repair/track`            | Find/track repair securely       |
| `/repair/[token]`          | Customer repair-status page      |
| `/repair/[token]/quote`    | Diagnosis + quote + approval     |
| `/repair/[token]/payment`  | Payment                          |
| `/repair/[token]/complete` | Completion / return information  |
| Review/referral flow       | Post-repair advocacy             |

The customer should feel like they are moving through **one Fixxir-managed journey**.

---

# 3. Landing page build

We already have the approved positioning and conversion blueprint. The actual landing page should now be implemented around this structure.

### Section 1 — Launch 100 bar

> **Launch 100 — Repair, handled.**

Briefly show the ₦5,000 Care Credit offer.

CTA:

**Start a repair**

---

### Section 2 — Hero

Headline:

> **Device repair without the stress.**

Supporting copy explains:

**phone/laptop → diagnosis → approval → repair → updates → QA → return**

Primary CTA:

**Start a repair**

Secondary:

**Chat on WhatsApp**

Mobile should have a sticky bottom CTA.

---

### Section 3 — Trust signals

Five quick proof points:

**Clear diagnosis**

**No repair without approval**

**Repair updates**

**Quality check before return**

**One accountable repair process**

---

### Section 4 — Problem / differentiation

This explains the problem Fixxir is actually solving:

* unclear prices;
* chasing technicians;
* changing timelines;
* nobody responsible;
* unclear repair status.

Then contrast that with Fixxir.

---

### Section 5 — Services

Only launch scope:

**Phones**

* iPhone
* Samsung
* Tecno
* Infinix
* selected other Android

**Laptops**

* HP
* Dell
* Lenovo
* MacBook
* selected Windows laptops

Don't market tablets/accessories at launch.

Tier 3 jobs such as motherboard and serious liquid damage should say:

> **Diagnosis required**

rather than promising a fixed repair.

---

### Section 6 — How Fixxir Works

Show six steps:

**1. Tell us what happened**

**2. Pickup / handoff**

**3. Diagnosis & quote**

**4. Approve & pay**

**5. Repair + updates**

**6. QA + return**

This is central to the brand.

---

### Section 7 — Launch 100

Dedicated section explaining:

* who qualifies;
* first 100 completed paying B2C customers;
* selected Lagos pickup/return;
* diagnosis before approval;
* Care Credit;
* expiry;
* conditions.

---

### Section 8 — Trust / privacy / warranty

We need clear answers around:

**Will you access my data?**

**What parts are being used?**

**What if the repair fails again?**

**How long will it take?**

**Who has my device?**

This section will probably have a significant impact on conversion.

---

### Section 9 — B2B

Separate proposition:

> **Your outsourced device repair desk.**

CTA:

**Book a Business Repair Pilot**

This should go into a different lead type:

`customer_type = B2B`

---

### Section 10 — Reviews

Only real reviews.

No invented counters such as:

> “5,000 happy customers”

unless we can substantiate them.

---

### Section 11 — FAQ

Around 6–10 high-friction questions.

---

### Section 12 — Final conversion section

Large CTA:

> **Ready to get your device fixed?**

**Start a repair**

and WhatsApp alternative.

---

# 4. Repair-request form

I would make this a **multi-step form**, rather than placing 15 fields on one page.

## Step 1 — Device

Ask:

**What do you need repaired?**

Cards:

**Phone**

**Laptop**

Then:

**Brand**

Then:

**Model**

Include:

> **I'm not sure of the model**

This is important.

---

# 5. Step 2 — Problem

Ask:

> **What is happening with your device?**

Selectable options can depend on device type.

For phones:

* Broken/cracked screen
* Battery problem
* Charging problem
* Won't power on
* Camera problem
* Speaker/microphone
* Liquid damage
* Software problem
* Other

For laptops:

* Broken/display problem
* Battery
* Keyboard/trackpad
* Charging/power
* Slow performance
* SSD/RAM upgrade
* Won't boot
* Liquid damage
* Other

Then:

**Tell us more**

Optional photo upload.

I would allow **up to 3 photos**, compressed before upload.

---

# 6. Step 3 — Customer information

Collect only what we actually need:

**Name**

**Phone / WhatsApp**

**Email — optional**

The phone number becomes the primary customer identity during the guest flow.

---

# 7. Step 4 — Location / handoff

Ask:

**Where is the device?**

* Area
* Lagos location/address
* Pickup preference

Options:

**Pickup**

**Drop-off / handoff**

**Let Fixxir advise me**

Don't promise free pickup until the system confirms the customer is inside an eligible Launch 100/service zone.

---

# 8. Step 5 — Timing

Ask:

> **How soon do you need the device back?**

Options:

**As soon as possible**

**Within 1–2 days**

**This week**

**No urgent deadline**

This is useful both operationally and for lead scoring.

---

# 9. Step 6 — Review request

Show the customer a clean summary:

**Device**

**Problem**

**Location**

**Pickup preference**

**Contact**

Then:

> Submitting this request does not authorize repair work. Fixxir will first confirm the next step and, where required, diagnose the device before you approve any repair.

CTA:

### **Submit repair request**

This wording is important.

The form is a **repair request**, not authorization to repair.

---

# 10. What happens technically on submission

This is where I would make the architecture more structured than a normal marketing form.

A successful submission should create:

### Customer record

If phone already exists, reuse/update the customer rather than creating duplicates.

### Lead record

For marketing/sales tracking.

Example:

`LEAD-20261003-0012`

### Repair Request record

Example:

`FXR-20261003-0012`

The lead and repair request remain linked.

That gives us:

> **Marketing object = Lead**

and

> **Operational object = Repair Request**

This separation will become very valuable later.

---

# 11. Data we should save automatically

The customer shouldn't need to enter all of this.

Capture automatically:

* request ID;
* created timestamp;
* IP/device metadata only where justified;
* landing page;
* UTM source;
* UTM medium;
* UTM campaign;
* UTM content;
* UTM term;
* referrer;
* ad click IDs where available;
* Launch 100 source;
* referral code;
* partner/creator code.

This is what later allows us to say:

> Google Search generated 52 completed repairs at ₦6,900 CAC.

rather than merely saying:

> Google sent traffic.

---

# 12. Confirmation page

After submission:

Large success state:

> **Your repair request has been received.**

Then show:

**Repair Request ID: FXR-XXXXXX**

And:

> A Fixxir team member will review your request and contact you shortly.

Buttons:

**Continue on WhatsApp**

**Track my request**

Don't send them back to the homepage.

---

# 13. WhatsApp integration

The WhatsApp button should open a prefilled message:

> Hi Fixxir, I just submitted repair request FXR-XXXXXX.

That immediately connects the web record with the WhatsApp conversation.

This is much better than:

> Hi.

The Sales/CS agent instantly knows which lead they're speaking to.

---

# 14. Sales/CS admin queue

The request enters a queue.

Example:

| Request  | Customer | Device    | Issue  | Source | Status | Owner   |
| -------- | -------- | --------- | ------ | ------ | ------ | ------- |
| FXR-0012 | Customer | iPhone 13 | Screen | Google | New    | Sales A |

The new Sales/CS team sees:

**New → Contacted → Qualified → Diagnosis/Handoff → Quote → Payment → Repair**

with next-action timers.

Our ≤10-minute response KPI should begin here.

---

# 15. Qualification

Sales confirms:

* correct model;
* fault;
* location;
* urgency;
* serviceability;
* pickup eligibility;
* Tier classification.

Then route:

### Tier 1

Straight into handoff/diagnosis.

### Tier 2

Confirm parts/feasibility.

### Tier 3

Diagnosis-first.

### Unsupported

Close politely with standardized reason.

---

# 16. Handoff / pickup booking

Once qualified:

Customer chooses a handoff window.

Capture:

* pickup address;
* date;
* time window;
* device;
* accessories;
* contact;
* special instructions.

Generate a handoff reference.

When device is received:

**Device Received**

Then send confirmation automatically.

---

# 17. Device intake

Before diagnosis, Operations records:

* IMEI / serial where relevant;
* model;
* visible condition;
* accessories;
* existing damage;
* customer complaints;
* photos;
* receipt timestamp.

This becomes the custody record.

Important for Fixxir's accountability positioning.

---

# 18. Diagnosis

Technician receives a diagnosis job.

Record:

* confirmed fault;
* recommended repair;
* part required;
* technician notes;
* risk;
* duration;
* warranty category;
* quoted cost inputs.

Customer status becomes:

> **Diagnosis in progress**

Then:

> **Diagnosis complete**

---

# 19. Quote page

This should be customer-friendly, not an internal technical sheet.

Display:

### Diagnosis

> Your battery has degraded and should be replaced.

### Recommended repair

Battery replacement.

### Repair cost

**₦XX,XXX**

### Estimated duration

**X hours/days**

### Warranty

Applicable warranty terms.

### Included

* repair;
* QA;
* return where applicable.

Buttons:

**Approve repair**

**Ask a question**

**Decline**

No repair begins before approval.

---

# 20. Payment

After approval:

> **Pay ₦XX,XXX**

Use the production gateway.

System must:

* initialize payment;
* save transaction reference;
* verify server-side;
* prevent duplicate payments;
* handle failed/pending transactions;
* update job only after verification.

Then:

**PAID / REPAIR AUTHORIZED**

This is our commercial gate.

---

# 21. Status tracking

Customer should not need to call repeatedly.

Their tracking page could show:

**Request received** ✓

**Device received** ✓

**Diagnosis completed** ✓

**Quote approved** ✓

**Payment confirmed** ✓

**Repair in progress**

**Quality check**

**Ready for return**

**Returned**

This is one of the strongest practical expressions of:

> **Repair, handled.**

---

# 22. Customer updates

Send notifications at meaningful milestones only.

At minimum:

* request received;
* pickup/handoff confirmed;
* device received;
* diagnosis complete;
* quote ready;
* payment confirmed;
* repair started;
* delay/exception;
* QA passed;
* ready for return;
* return scheduled;
* returned;
* post-repair satisfaction.

Use **WhatsApp first** for launch, with email/SMS as secondary where appropriate.

---

# 23. Exceptions we must build

The happy path isn't enough.

The flow needs explicit handling for:

* incorrect device/model;
* unsupported repair;
* pickup unavailable;
* customer unreachable;
* diagnosis delayed;
* part unavailable;
* price changes after deeper diagnosis;
* quote declined;
* payment failed;
* payment pending;
* additional fault discovered;
* repair delayed;
* repair unsuccessful;
* QA failed;
* customer unavailable for return;
* warranty/rework request;
* refund/cancellation.

Each needs a status and owner.

---

# 24. Post-repair

After return:

### 24–48 hours

Ask:

> How is your device working after the repair?

If satisfied:

**Review request**

Then:

**Fix & Refer**

If there is a problem:

**Service Recovery**

Do not ask an unresolved customer to leave a review.

---

# 25. Launch 100 integration

The system should track Launch 100 automatically.

Fields:

`launch_campaign = LAUNCH100`

`launch_eligible = true/false`

`launch_position = 001–100`

`care_credit_eligible`

`care_credit_issued`

`care_credit_expires_at`

This avoids manually trying to remember who customer #78 was.

---

# 26. Referral system

Each customer can have a simple referral code:

`FXR-JOHN-1234`

Referral URL:

`/repair?ref=FXR-JOHN-1234`

When a referred lead completes a qualifying repair:

**₦5,000 Care Credit → referrer**

Automatically record:

* referrer;
* referred customer;
* qualifying repair;
* amount;
* credit issued;
* expiry;
* redeemed.

---

# 27. Analytics architecture

The key events should be:

**landing_page_view**

→ **start_repair_click**

→ **repair_form_start**

→ **repair_form_submit**

→ **lead_qualified**

→ **device_received**

→ **diagnosis_completed**

→ **quote_sent**

→ **quote_approved**

→ **payment_verified**

→ **repair_started**

→ **qa_passed**

→ **repair_completed**

→ **review_requested**

→ **referral_qualified**

This creates a complete marketing-to-revenue funnel.

---

# 28. MVP vs later

We should **not build every imaginable feature before launch**.

### Launch MVP must include

* responsive landing page;
* Launch 100 section;
* phone/laptop services;
* multi-step repair form;
* UTM/source tracking;
* Repair Request ID;
* WhatsApp handoff;
* lead/admin queue;
* qualification/status fields;
* diagnosis;
* quote;
* approval;
* payment;
* repair statuses;
* milestone notifications;
* QA;
* completion;
* review/referral tracking.

### Post-launch enhancements

* customer accounts;
* saved devices;
* self-service rescheduling;
* live map pickup tracking;
* more sophisticated referral wallet;
* multiple service addresses;
* corporate dashboards;
* automated reactivation;
* repair history portal;
* loyalty programme;
* AI diagnosis assistant;
* deeper customer self-service.

---

# 29. Build sequence

I would build it in **8 implementation blocks**:

| Block | Build                                         | Dependency         |
| ----- | --------------------------------------------- | ------------------ |
| **1** | Landing page UI                               | Approved blueprint |
| **2** | Repair-request form                           | Landing page       |
| **3** | Lead + repair-request backend                 | Form schema        |
| **4** | Confirmation + WhatsApp + Sales queue         | Backend            |
| **5** | Handoff/intake + diagnosis                    | Repair request     |
| **6** | Quote + approval + payment                    | Diagnosis          |
| **7** | Repair status + notifications + QA/return     | Payment            |
| **8** | Review + Launch 100 + referral + analytics QA | Completed journey  |

I would not wait until Block 8 to add analytics. The event plumbing should be implemented alongside each block and then validated end-to-end in Block 8.

---

# 30. Definition of done

I would consider the full flow launch-ready only when we can test this scenario from beginning to end:

> A customer clicks a Google ad → lands on Fixxir → submits an iPhone screen request → attribution is captured → Sales sees the lead → WhatsApp links to the request → pickup is scheduled → device is received → technician diagnoses it → customer receives quote → customer approves → payment verifies → repair begins → customer receives update → QA passes → return occurs → customer receives satisfaction message → review/referral flow triggers → campaign revenue is attributed back to Google.

If **that exact journey works reliably on mobile**, we have the core launch system.

## Recommended delivery order

The immediate implementation sequence should now be:

**1. Finalize data model + repair-request states**
**2. Build the actual landing page**
**3. Build the multi-step repair-request form**
**4. Connect it to lead/repair backend and WhatsApp**
**5. Build diagnosis → quote → approval → payment**
**6. Build tracking/status/notification experience**
**7. Build Launch 100/referral logic**
**8. Perform complete mobile, payment, analytics and operational QA**

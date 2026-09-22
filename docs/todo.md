# Fixxir Web App — Build Todo

This checklist is meant to be used side-by-side with the product plan in [project_plan.md](project_plan.md). It breaks the launch build into concrete, trackable workstreams so the team can build in order without losing the end-to-end flow.

## Working principles

- No account requirement before a repair request
- One customer journey from ad → landing page → repair request → qualification → diagnosis → quote → payment → repair → return
- WhatsApp is the primary live customer communication channel for launch
- Every step should be traceable to a lead and repair request
- Launch MVP should prioritize conversion and operational clarity over feature breadth

---

## Phase 0 — Setup and scope lock

- [ ] Confirm launch MVP scope and exclusions
- [ ] Confirm exact stack/framework and deployment target
- [ ] Confirm source of truth for customer data model
- [ ] Confirm naming conventions for Lead, Repair Request, and Job/Status
- [ ] Confirm required analytics events and UTM tracking fields
- [ ] Finalize launch-only service offerings (phones + laptops only)
- [ ] Confirm Launch 100 rules, eligibility, and referral logic
- [ ] Confirm WhatsApp business number and message template setup
- [ ] Confirm payment provider and sandbox/test keys
- [ ] Confirm which internal admin screens are required for launch

---

## Block 1 — Landing page UI

### Goal
Build the primary conversion landing page and brand funnel entry point.

- [ ] Create responsive page layout for `/` and `/repair`
- [ ] Add launch banner with “Launch 100 — Repair, handled.”
- [ ] Add hero section with headline and CTA
- [ ] Add sticky mobile CTA bar
- [ ] Add trust proof section with five key messages
- [ ] Add problem/differentiation section
- [ ] Add services section for phones and laptops only
- [ ] Add “Diagnosis required” messaging for Tier 3 / serious cases
- [ ] Add “How Fixxir Works” six-step section
- [ ] Add Launch 100 section with eligibility + care credit details
- [ ] Add trust/privacy/warranty FAQ section
- [ ] Add B2B proposition section for business repair pilot
- [ ] Add reviews section with only verified real reviews
- [ ] Add FAQ section with 6–10 high-friction questions
- [ ] Add final conversion CTA area with Start a repair + WhatsApp
- [ ] Add all required metadata, social tags, and SEO basics
- [ ] QA landing page on mobile, tablet, and desktop
- [ ] Verify CTA links flow into the repair request process

---

## Block 2 — Multi-step repair request form

### Goal
Capture the repair request without friction and without requiring account signup.

### Step 1 — Device
- [ ] Add device type selection: Phone / Laptop
- [ ] Add brand selection
- [ ] Add model selection
- [ ] Add “I’m not sure of the model” option
- [ ] Validate required fields before continuing

### Step 2 — Problem
- [ ] Add phone issue options
- [ ] Add laptop issue options
- [ ] Add “Tell us more” text area
- [ ] Add photo upload field with max 3 photos
- [ ] Add client-side compression before upload
- [ ] Validate file size/type constraints

### Step 3 — Customer information
- [ ] Name field
- [ ] Phone/WhatsApp field
- [ ] Email field (optional)
- [ ] Validation for phone format and required fields

### Step 4 — Location / handoff
- [ ] Area field
- [ ] Lagos location/address input
- [ ] Pickup preference selection: Pickup / Drop-off / Let Fixxir advise me
- [ ] Explain that free pickup is conditional on service coverage

### Step 5 — Timing
- [ ] Add urgency options
- [ ] Capture requested timeline

### Step 6 — Review request
- [ ] Show summary of device, problem, location, pickup preference, and contact
- [ ] Add legal/disclaimer text about no authorization before review and diagnosis
- [ ] Add submit button labeled “Submit repair request”
- [ ] Validate final form and error states

### Cross-form tasks
- [ ] Build multi-step progress UI
- [ ] Add saved draft behavior if needed
- [ ] Guard against duplicate customer creation for same phone number
- [ ] Ensure form works smoothly on mobile

---

## Block 3 — Lead + repair request backend

### Goal
Create the structured marketing + operations objects behind the form.

- [ ] Design customer schema
- [ ] Design lead schema
- [ ] Design repair request schema
- [ ] Define system-generated IDs: Lead and Repair Request format
- [ ] Link lead to repair request
- [ ] Create customer dedupe logic by phone number
- [ ] Store landing page source and UTMs
- [ ] Store referrer and campaign metadata
- [ ] Store ad click identifiers and Launch 100 metadata
- [ ] Capture automatic metadata: IP/browser details only where justified
- [ ] Add source fields: Google, referral, partner, creator, etc.
- [ ] Add launch campaign, referral code, and partner code capture
- [ ] Add backend validation and error handling for form submission
- [ ] Add database indexes for search and operational use
- [ ] Build admin database view for leads and repair requests
- [ ] Add API endpoint for new repair request creation
- [ ] Add API endpoint to retrieve a repair request by ID
- [ ] Add status field definitions for launch flow

---

## Block 4 — Confirmation, WhatsApp, and sales queue

### Goal
Turn a form submission into a live operational pipeline.

- [ ] Build success page with repair request ID
- [ ] Show “Your repair request has been received” confirmation state
- [ ] Add “Continue on WhatsApp” CTA with prefilled message
- [ ] Add “Track my request” CTA
- [ ] Create queue view for new sales/customer support requests
- [ ] Add status columns: New, Contacted, Qualified, Diagnosis/Handoff, Quote, Payment, Repair
- [ ] Add owner field and assignment logic
- [ ] Add timer/next-action management for SLA
- [ ] Add response KPI tracking
- [ ] Create customer-facing tracking link and token-based page
- [ ] Add lead routing to sales/CS queue
- [ ] Add internal notes capability for team members
- [ ] Add notification to sales when new request comes in
- [ ] Add ability to mark request as qualified or rejected

---

## Block 5 — Handoff, intake, and diagnosis

### Goal
Move qualified requests into operational physical handling.

- [ ] Create pickup/drop-off scheduling flow
- [ ] Add handoff booking fields: address, date, time window, accessories, notes
- [ ] Generate handoff reference
- [ ] Create device intake record when received
- [ ] Capture IMEI/serial, model, visible condition, accessories, damage, complaints, photos, receipt timestamp
- [ ] Mark request as “Device received”
- [ ] Create diagnosis job for technician
- [ ] Capture confirmed fault, recommended repair, parts needed, notes, risk, duration, warranty category, and cost inputs
- [ ] Update status to “Diagnosis in progress”
- [ ] Update status to “Diagnosis complete”
- [ ] Add internal notification for diagnosis results
- [ ] Add customer-facing status update when diagnosis is complete
- [ ] Add exception paths for incorrect device/model, unsupported repair, and delayed diagnosis

---

## Block 6 — Quote, approval, and payment

### Goal
Create the customer quote and payment gate before repair work begins.

- [ ] Build diagnosis result view for customer
- [ ] Build quote page with: diagnosis summary, recommended repair, cost, duration, warranty, included items
- [ ] Add CTA buttons: Approve repair, Ask a question, Decline
- [ ] Add quote approval flow and audit trail
- [ ] Create payment intent / checkout flow
- [ ] Save payment transaction reference
- [ ] Verify payment server-side
- [ ] Prevent duplicate payment submissions
- [ ] Handle failed and pending payment states
- [ ] Update status to “PAID / REPAIR AUTHORIZED” only after verification
- [ ] Add exception handling for declined quote and failed payment
- [ ] Add internal notification for approved payment

---

## Block 7 — Repair status, notifications, QA, and return

### Goal
Remove repeated call chasing and provide transparency to the customer.

- [ ] Build customer tracking page with milestone states
- [ ] Add lifecycle statuses: Request received, Device received, Diagnosis completed, Quote approved, Payment confirmed, Repair in progress, Quality check, Ready for return, Returned
- [ ] Add milestone notifications via WhatsApp first
- [ ] Add secondary email/SMS notifications where appropriate
- [ ] Add delay/exception notification handling
- [ ] Add QA recorded before return
- [ ] Add return scheduling and pickup/drop-off coordination
- [ ] Add customer return confirmation workflow
- [ ] Add post-return status updates
- [ ] Add support for warranty/rework and customer unavailable states

---

## Block 8 — Review, Launch 100, referral, and analytics QA

### Goal
Close the loop from campaign to revenue and create a measurable launch system.

- [ ] Implement Launch 100 tracking fields
- [ ] Add campaign eligibility flags and position tracking
- [ ] Add care credit eligibility and expiry fields
- [ ] Build referral code generation
- [ ] Add referral URL support and attribution
- [ ] Track qualifying repair and credit issuance
- [ ] Build review request workflow after repair completion
- [ ] Add service recovery path for unresolved issues
- [ ] Add analytics event pipeline for all major funnel steps
- [ ] Add event logging for landing page view, form starts, form submission, qualification, diagnosis, quote, approval, payment, repair, QA, completion, review, and referral
- [ ] Validate end-to-end journey from ad click to review/referral
- [ ] Run mobile QA on the full journey
- [ ] Run payment QA and duplicate-payment safeguards
- [ ] Run operational QA for sales/admin queue and hidden edge cases
- [ ] Validate Launch 100 and referral logic under test data

---

## Data model checklist

### Customer
- [ ] id
- [ ] name
- [ ] phone/WhatsApp
- [ ] email
- [ ] created_at
- [ ] updated_at
- [ ] source metadata
- [ ] referral code

### Lead
- [ ] id
- [ ] customer_id
- [ ] utm_source
- [ ] utm_medium
- [ ] utm_campaign
- [ ] utm_content
- [ ] utm_term
- [ ] landing_page
- [ ] referrer
- [ ] ad_click_id
- [ ] launch_campaign
- [ ] launch_eligible
- [ ] created_at

### Repair Request
- [ ] id
- [ ] lead_id
- [ ] customer_id
- [ ] device_type
- [ ] brand
- [ ] model
- [ ] issue
- [ ] customer_notes
- [ ] photo_urls
- [ ] location
- [ ] pickup_preference
- [ ] urgency
- [ ] status
- [ ] created_at
- [ ] updated_at

### Device / Job / Diagnosis
- [ ] device_received_at
- [ ] IMEI/serial
- [ ] visible_condition
- [ ] accessories
- [ ] diagnosis_notes
- [ ] recommended_repair
- [ ] part_required
- [ ] technician_notes
- [ ] cost_input
- [ ] quote_total
- [ ] warranty_category

### Payment
- [ ] transaction_ref
- [ ] amount
- [ ] status
- [ ] provider
- [ ] verified_at
- [ ] duplicate_guard_value

### Referral / Launch 100
- [ ] referrer_customer_id
- [ ] referred_customer_id
- [ ] qualifying_repair_id
- [ ] credit_amount
- [ ] credit_issued
- [ ] credit_expires_at
- [ ] redemption_status

---

## Launch MVP definition of done

- [ ] Responsive landing page works on mobile and desktop
- [ ] Repair request can be submitted without signup
- [ ] Repair request ID is generated and shown immediately
- [ ] WhatsApp handoff uses the request ID in the message
- [ ] Lead + repair request are captured with attribution
- [ ] Sales queue works and request can be assigned
- [ ] Customer can be qualified and routed for diagnosis
- [ ] Device intake and diagnosis are recorded
- [ ] Quote is displayed clearly and approval is required
- [ ] Payment is verified before any repair work is authorized
- [ ] Repair milestones update customer tracking
- [ ] QA and return workflow exists
- [ ] Review/referral logic is wired for post-repair flow
- [ ] End-to-end journey is tested from ad click to completed repair

---

## Recommended first implementation order

### Immediate next tasks
- [ ] Finalize data model + repair request states
- [ ] Build landing page UI
- [ ] Build multi-step repair request form
- [ ] Connect form to lead + repair request backend
- [ ] Add WhatsApp and sales queue flow
- [ ] Add diagnosis → quote → approval → payment
- [ ] Add tracking/status/notifications
- [ ] Add Launch 100/referral logic and QA

### Suggested working cadence
- [ ] Daily build objective for each day
- [ ] End-of-day QA on the active flow
- [ ] Keep one source of truth for status tracking in this file
- [ ] Update tasks as work is completed

---

## Current build tracker

Use this section to update progress as work continues.

- [ ] Phase 0 complete
- [ ] Block 1 complete
- [ ] Block 2 complete
- [ ] Block 3 complete
- [ ] Block 4 complete
- [ ] Block 5 complete
- [ ] Block 6 complete
- [ ] Block 7 complete
- [ ] Block 8 complete
- [ ] Launch MVP ready

---

## Notes

This document should evolve with the build. If a task changes scope, update the todo and keep the product plan as the high-level source of truth.

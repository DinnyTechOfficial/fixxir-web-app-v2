import {
  buildRepairConfirmationEmail,
  type RepairConfirmationDetails,
} from "../lib/repair-confirmation-email";

interface PagesEnvironment {
  REPAIR_INTAKE_ENABLED?: string;
  REPAIR_PRIVACY_NOTICE_URL?: string;
  APPS_SCRIPT_URL?: string;
  APPS_SCRIPT_TOKEN?: string;
  BREVO_API_KEY?: string;
  SLACK_WEBHOOK_URL?: string;
}

interface PagesContext {
  request: Request;
  env: PagesEnvironment;
}

interface ValidatedSubmission {
  submissionId: string;
  request: RepairConfirmationDetails & {
    customerPhone: string;
    address: string;
    modelUnknown: boolean;
  };
}

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };
const maxBodyBytes = 24_000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length <= maxLength
    ? value.trim()
    : "";
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validateSubmission(value: unknown): ValidatedSubmission | null {
  const body = asRecord(value);
  const data = asRecord(body.data);
  const step1 = asRecord(data.step1);
  const step2 = asRecord(data.step2);
  const step3 = asRecord(data.step3);
  const step4 = asRecord(data.step4);
  const step5 = asRecord(data.step5);
  const brand = asRecord(step1.brand);
  const model = asRecord(step1.model);
  const customerName = text(step3.name, 120);
  const customerPhone = text(step3.phone, 32);
  const customerEmail = text(step3.email, 254);
  const phoneDigits = customerPhone.replace(/\D/g, "");
  const deviceType = step1.deviceType;
  const handoff = step4.handoff;
  const urgency = step5.urgency;
  const modelUnknown = step1.modelUnknown === true;
  const brandName = text(brand.name, 120);
  const modelName = modelUnknown ? "Not sure" : text(model.name, 120);

  if (
    typeof body.submissionId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId) ||
    !customerName ||
    !customerPhone ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15 ||
    !isValidEmail(customerEmail) ||
    (deviceType !== "phone" && deviceType !== "laptop") ||
    !brandName ||
    !modelName ||
    !text(step2.issue, 120) ||
    (handoff !== "pickup" && handoff !== "dropoff" && handoff !== "advise") ||
    !text(step4.area, 120) ||
    (urgency !== "asap" && urgency !== "1-2days" && urgency !== "week" && urgency !== "nourgency")
  ) {
    return null;
  }

  return {
    submissionId: body.submissionId,
    request: {
      customerName,
      customerEmail,
      customerPhone,
      deviceType: deviceType === "phone" ? "Phone" : "Laptop",
      brand: brandName,
      model: modelName,
      modelUnknown,
      issue: text(step2.issue, 120),
      details: text(step2.details, 1_200),
      area: text(step4.area, 120),
      address: text(step4.address, 300),
      handoff,
      urgency,
    },
  };
}

function appsScriptIsConfigured(env: PagesEnvironment) {
  if (!env.APPS_SCRIPT_URL || !env.APPS_SCRIPT_TOKEN) return false;
  try {
    const url = new URL(env.APPS_SCRIPT_URL);
    return url.protocol === "https:" && url.hostname === "script.google.com";
  } catch {
    return false;
  }
}

function intakeIsReady(env: PagesEnvironment) {
  return env.REPAIR_INTAKE_ENABLED === "true" &&
    appsScriptIsConfigured(env) &&
    Boolean(env.BREVO_API_KEY) &&
    isValidPrivacyNoticeUrl(env.REPAIR_PRIVACY_NOTICE_URL);
}

function isValidPrivacyNoticeUrl(value?: string) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function escapeSlack(value: string) {
  return value.replace(/[&<>@]/g, (character) => {
    if (character === "&") return "&amp;";
    if (character === "<") return "&lt;";
    if (character === ">") return "&gt;";
    return "＠";
  });
}

async function persistRequest(
  env: PagesEnvironment,
  submission: ValidatedSubmission,
) {
  const response = await fetch(env.APPS_SCRIPT_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createRepairRequest",
      token: env.APPS_SCRIPT_TOKEN,
      submissionId: submission.submissionId,
      request: submission.request,
    }),
    redirect: "follow",
  });

  if (!response.ok) return null;

  let result: Record<string, unknown>;
  try {
    result = asRecord(await response.json());
  } catch {
    return null;
  }

  const requestId = text(result.requestId, 80);
  return result.success === true && requestId ? requestId : null;
}

async function sendReceipt(
  env: PagesEnvironment,
  requestId: string,
  request: RepairConfirmationDetails,
) {
  const message = buildRepairConfirmationEmail(requestId, request);
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY as string,
    },
    body: JSON.stringify({
      sender: { name: "Fixxir", email: "no-reply@fixxir.com" },
      replyTo: { name: "Fixxir Support", email: "info@fixxir.com" },
      to: [{ email: message.to, name: request.customerName }],
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    }),
  });

  return response.ok;
}

async function sendSlackAlert(
  env: PagesEnvironment,
  requestId: string,
  request: RepairConfirmationDetails,
) {
  if (!env.SLACK_WEBHOOK_URL) return;

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New repair request ${escapeSlack(requestId)}: ${escapeSlack(request.deviceType)} / ${escapeSlack(request.brand)} ${escapeSlack(request.model)} - ${escapeSlack(request.issue)}`,
    }),
  });

  if (!response.ok) throw new Error("Slack notification failed");
}

export const onRequestGet = ({ env }: PagesContext) =>
  jsonResponse({
    enabled: intakeIsReady(env),
    privacyNoticeUrl: isValidPrivacyNoticeUrl(env.REPAIR_PRIVACY_NOTICE_URL)
      ? env.REPAIR_PRIVACY_NOTICE_URL
      : null,
  });

export const onRequestPost = async ({ request, env }: PagesContext) => {
  if (!intakeIsReady(env)) {
    return jsonResponse({ error: "Repair request submissions are not available yet." }, 503);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Expected a JSON request." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBodyBytes) {
    return jsonResponse({ error: "The request is too large." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: "The request could not be read." }, 400);
  }

  if (new TextEncoder().encode(rawBody).byteLength > maxBodyBytes) {
    return jsonResponse({ error: "The request is too large." }, 413);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "The request is not valid JSON." }, 400);
  }

  const submission = validateSubmission(parsedBody);
  if (!submission) {
    return jsonResponse({ error: "Check the required repair request details." }, 400);
  }

  let requestId: string | null;
  try {
    requestId = await persistRequest(env, submission);
  } catch {
    requestId = null;
  }

  if (!requestId) {
    return jsonResponse({ error: "We could not save your request. Please try again." }, 502);
  }

  const [emailResult] = await Promise.allSettled([
    sendReceipt(env, requestId, submission.request),
    sendSlackAlert(env, requestId, submission.request),
  ]);
  const emailAccepted = emailResult.status === "fulfilled" && emailResult.value;

  return jsonResponse({ success: true, requestId, emailAccepted });
};

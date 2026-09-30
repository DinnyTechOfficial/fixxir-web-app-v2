import {
  FIXXIR_PHONE_DISPLAY,
  FIXXIR_SUPPORT_HOURS,
  getFixxirWhatsAppUrl,
} from "../../app/site-info";

export interface RepairConfirmationDetails {
  customerName: string;
  customerEmail: string;
  deviceType: string;
  brand: string;
  model: string;
  issue: string;
  details: string;
  area: string;
  handoff: string;
  urgency: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function summaryRow(label: string, value: string) {
  return `<tr><td style="padding:10px 0;color:#62718a;font-size:13px;vertical-align:top;width:34%">${escapeHtml(label)}</td><td style="padding:10px 0;color:#14233b;font-size:14px;font-weight:600;vertical-align:top">${escapeHtml(value)}</td></tr>`;
}

export function buildRepairConfirmationEmail(
  requestId: string,
  request: RepairConfirmationDetails,
) {
  const device = `${request.deviceType} - ${request.brand} ${request.model}`;
  const issue = request.details
    ? `${request.issue}. ${request.details}`
    : request.issue;
  const whatsappUrl = getFixxirWhatsAppUrl(
    `Hi Fixxir, I have a question about repair request ${requestId}.`,
  );
  const safeName = escapeHtml(request.customerName);
  const safeWhatsappUrl = escapeHtml(whatsappUrl);

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f3f6fb;color:#14233b;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f6fb;padding:28px 12px">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid #dfe6f0;border-radius:8px;overflow:hidden">
          <tr><td style="padding:22px 28px;background:#10213f;color:#ffffff;font-size:23px;font-weight:800">fixxir<span style="color:#70a9ff">.</span></td></tr>
          <tr><td style="padding:32px 28px 12px">
            <p style="margin:0 0 8px;color:#1769e0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Repair request received</p>
            <h1 style="margin:0 0 14px;font-size:25px;line-height:1.25;color:#14233b">Thanks, ${safeName}.</h1>
            <p style="margin:0;color:#52627b;font-size:15px;line-height:1.65">We have your request. Our team will review the details and contact you to confirm the next step.</p>
          </td></tr>
          <tr><td style="padding:20px 28px 8px">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #e6ebf2;border-bottom:1px solid #e6ebf2">
              ${summaryRow("Request reference", requestId)}
              ${summaryRow("Device", device)}
              ${summaryRow("Issue", issue)}
              ${summaryRow("Area", request.area)}
              ${summaryRow("Handoff", request.handoff)}
              ${summaryRow("Requested timing", request.urgency)}
            </table>
          </td></tr>
          <tr><td style="padding:18px 28px">
            <p style="margin:0;color:#52627b;font-size:13px;line-height:1.65">Submitting this request does not authorize repair work. We will confirm any applicable fees and next steps before repair begins.</p>
          </td></tr>
          <tr><td style="padding:4px 28px 28px">
            <p style="margin:0 0 12px;color:#52627b;font-size:14px;line-height:1.6">Need to add information? Contact Fixxir on WhatsApp or call ${escapeHtml(FIXXIR_PHONE_DISPLAY)}.</p>
            <a href="${safeWhatsappUrl}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#1769e0;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">Message Fixxir</a>
          </td></tr>
          <tr><td style="padding:18px 28px;background:#f7f9fc;color:#62718a;font-size:12px;line-height:1.7">Fixxir · ${escapeHtml(FIXXIR_SUPPORT_HOURS)}<br>This is an automated confirmation. Replies are monitored at info@fixxir.com.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = [
    `Fixxir repair request received: ${requestId}`,
    "",
    `Thanks, ${request.customerName}. Our team will review the details and contact you to confirm the next step.`,
    "",
    `Device: ${device}`,
    `Issue: ${issue}`,
    `Area: ${request.area}`,
    `Handoff: ${request.handoff}`,
    `Requested timing: ${request.urgency}`,
    "",
    "Submitting this request does not authorize repair work. We will confirm any applicable fees and next steps before repair begins.",
    "",
    `WhatsApp: ${whatsappUrl}`,
    `Phone: ${FIXXIR_PHONE_DISPLAY}`,
    `Support hours: ${FIXXIR_SUPPORT_HOURS}`,
    "Replies are monitored at info@fixxir.com.",
  ].join("\n");

  return {
    to: request.customerEmail,
    subject: `Fixxir repair request received - ${requestId}`,
    html,
    text,
  };
}

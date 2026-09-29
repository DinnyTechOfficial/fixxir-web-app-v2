export const FIXXIR_WHATSAPP_NUMBER = "2349066927907";
export const FIXXIR_PHONE_DISPLAY = "+234 906 692 7907";
export const FIXXIR_PHONE_LINK = "+2349066927907";
export const FIXXIR_BUSINESS_ADDRESS = "6A Pepple Street, Ikeja, Lagos";
export const FIXXIR_SUPPORT_HOURS = "8am–6pm daily, WAT";

export function getFixxirWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${FIXXIR_WHATSAPP_NUMBER}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

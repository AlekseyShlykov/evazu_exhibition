const defaultGoogleSheetsWebhookUrl = "https://script.google.com/macros/s/AKfycbzTuCNLjO2urbKX5aZxzKk5zZY8k_M8sZ_f2A7bPzNp0ZGaTByEMPZEifs_Op5sRKIx/exec";

export const googleSheetsWebhookUrl =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL?.trim() || defaultGoogleSheetsWebhookUrl;
export const isGoogleSheetsConfigured = googleSheetsWebhookUrl.startsWith("https://script.google.com/macros/s/");

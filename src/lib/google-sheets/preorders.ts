"use client";

import type { Artwork } from "@/types/artwork";
import type { PreorderFormValues } from "@/lib/validation/preorder";
import { googleSheetsWebhookUrl, isGoogleSheetsConfigured } from "./client";

export { isGoogleSheetsConfigured };

export async function submitPreorder(artwork: Artwork, values: PreorderFormValues): Promise<void> {
  if (!isGoogleSheetsConfigured) throw new Error("Google Sheets is not configured.");
  const body = new URLSearchParams({
    action: "postcard",
    email: values.email,
    artwork_id: artwork.id,
    artwork_title: artwork.title,
    website: values.website,
  });
  try {
    await fetch(googleSheetsWebhookUrl, { method: "POST", mode: "no-cors", body, keepalive: true });
  } catch {
    throw new Error("We could not save your email. Please try again.");
  }
}

"use client";

import { artworks } from "@/data/artworks";
import type { GuestbookFormValues } from "@/lib/validation/guestbook";
import { googleSheetsWebhookUrl, isGoogleSheetsConfigured } from "./client";

export interface GuestbookEntryData {
  createdAt: string;
  displayName: string;
  message: string;
  favouriteArtworkTitle: string | null;
}

const demonstrationEntries: readonly GuestbookEntryData[] = [
  { createdAt: "2025-01-18T12:00:00.000Z", displayName: "Anonymous visitor", message: "The stillness between each image stayed with me.", favouriteArtworkTitle: artworks[0]?.title ?? null },
  { createdAt: "2025-01-11T12:00:00.000Z", displayName: "Marta", message: "A beautiful, unexpected hall. I especially loved the shifts in scale.", favouriteArtworkTitle: artworks[1]?.title ?? null },
];

export async function submitGuestbookEntry(values: GuestbookFormValues): Promise<void> {
  if (!isGoogleSheetsConfigured) throw new Error("Google Sheets is not configured.");
  const favourite = artworks.find((artwork) => artwork.id === values.favouriteArtworkId);
  const body = new URLSearchParams({
    action: "guestbook",
    display_name: values.displayName || "Anonymous visitor",
    message: values.message,
    favourite_artwork_id: favourite?.id ?? "",
    favourite_artwork_title: favourite?.title ?? "",
    website: values.website,
  });
  try {
    await fetch(googleSheetsWebhookUrl, { method: "POST", mode: "no-cors", body, keepalive: true });
  } catch {
    throw new Error("Your note could not be sent. Please try again.");
  }
}

export function loadGuestbookEntries(): Promise<GuestbookEntryData[]> {
  if (!isGoogleSheetsConfigured) return Promise.resolve([...demonstrationEntries]);
  return new Promise((resolve, reject) => {
    const callbackName = `__guestbook_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => finish(new Error("The guestbook could not be reached.")), 12_000);
    const finish = (error?: Error, entries?: GuestbookEntryData[]) => {
      window.clearTimeout(timeout);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callbackName];
      if (error) reject(error); else resolve(entries ?? []);
    };
    (window as unknown as Record<string, unknown>)[callbackName] = (entries: GuestbookEntryData[]) => finish(undefined, entries);
    script.onerror = () => finish(new Error("The guestbook could not be reached."));
    script.src = `${googleSheetsWebhookUrl}?action=guestbook&callback=${encodeURIComponent(callbackName)}`;
    document.head.appendChild(script);
  });
}

export { isGoogleSheetsConfigured };

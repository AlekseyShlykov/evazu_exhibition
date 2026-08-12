import type { Metadata } from "next";
import { GuestbookPage } from "@/components/guestbook/GuestbookPage";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a note before exiting Ekaterina Zueva's online exhibition."
};

export default function GuestbookRoute() {
  return <GuestbookPage />;
}

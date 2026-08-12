import type { Metadata } from "next";
import { ExhibitionShell } from "@/components/exhibition/ExhibitionShell";

export const metadata: Metadata = {
  title: "The Exhibition",
  description: "Walk through Ekaterina Zueva's quiet virtual gallery of hand-cut collage."
};

export default function ExhibitionPage() {
  return <ExhibitionShell />;
}

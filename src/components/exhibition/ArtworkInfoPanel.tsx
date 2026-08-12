"use client";

import { motion } from "framer-motion";
import type { Artwork } from "@/types/artwork";

interface ArtworkInfoPanelProps {
  artwork: Artwork;
  onBack: () => void;
  onPreorder: () => void;
}

export function ArtworkInfoPanel({ artwork, onBack, onPreorder }: ArtworkInfoPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="absolute inset-x-0 bottom-0 bg-gallery-paper/95 px-5 py-5 backdrop-blur-sm md:bottom-6 md:left-6 md:right-auto md:w-[min(620px,calc(100vw-3rem))] md:px-7 md:py-6"
      aria-label={`Information about ${artwork.title}`}
    >
      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[.2em] text-gallery-muted">{artwork.year}</p>
          <h2 className="font-serif text-3xl leading-none">{artwork.title}</h2>
          <p className="mt-3 max-w-md text-sm leading-5 text-gallery-muted">{artwork.description}</p>
          <p className="mt-3 text-[11px] text-gallery-muted">{artwork.materials} · {artwork.dimensions}</p>
        </div>
        <div className="flex items-end gap-5 text-xs">
          {artwork.merchandiseAvailable && (
            <button className="border-b border-gallery-ink pb-1" type="button" onClick={onPreorder}>
              Preorder Merchandise
            </button>
          )}
          <button className="border-b border-gallery-line pb-1 text-gallery-muted" type="button" onClick={onBack}>
            Back to Exhibition
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

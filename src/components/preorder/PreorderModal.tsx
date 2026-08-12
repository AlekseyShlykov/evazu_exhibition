"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/types/artwork";
import { PreorderForm } from "./PreorderForm";
import { PreorderSuccess } from "./PreorderSuccess";

interface PreorderModalProps {
  artwork?: Artwork;
  onClose: () => void;
}

export function PreorderModal({ artwork, onClose }: PreorderModalProps) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!artwork) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [artwork, onClose]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end bg-black/35 md:items-center md:justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={`Preorder merchandise for ${artwork.title}`}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="max-h-[92svh] w-full overflow-y-auto bg-gallery-paper px-6 py-6 md:max-w-2xl md:px-10 md:py-8"
          >
            <div className="flex justify-end"><button type="button" onClick={onClose} aria-label="Close preorder form" className="text-xl">×</button></div>
            {success ? <PreorderSuccess onClose={onClose} /> : <PreorderForm artwork={artwork} onSuccess={() => setSuccess(true)} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

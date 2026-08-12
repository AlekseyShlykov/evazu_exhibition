"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Artwork } from "@/types/artwork";
import { assetPath } from "@/lib/paths";
import { useLanguage } from "@/lib/i18n";

interface ArtworkViewerProps { artwork: Artwork; onBack: () => void; onPreorder: () => void; }

export function ArtworkViewer({ artwork, onBack, onPreorder }: ArtworkViewerProps) {
  const { t } = useLanguage();
  return (
    <motion.section
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 grid min-h-0 bg-gallery-paper md:grid-cols-[minmax(0,1fr)_clamp(290px,28vw,430px)]"
      aria-label={`${t("infoAbout")} ${artwork.title}`}
    >
      <div className="relative flex min-h-0 items-center justify-center bg-[#d8d5cc] p-5 md:p-10">
        <Image src={assetPath(artwork.fullImage)} alt={artwork.title} width={1800} height={1800} priority className="h-full max-h-[62svh] w-full object-contain drop-shadow-[0_12px_24px_rgba(30,27,22,.16)] md:max-h-[calc(100svh-5rem)]" />
        <button type="button" onClick={onBack} className="absolute left-5 top-5 bg-gallery-paper/90 px-3 py-2 text-[10px] uppercase tracking-[.18em] md:hidden" aria-label={t("close")}>× {t("back")}</button>
      </div>
      <aside className="flex min-h-0 flex-col justify-between overflow-y-auto px-6 py-7 md:px-9 md:py-10">
        <button type="button" onClick={onBack} className="hidden self-end text-[10px] uppercase tracking-[.18em] md:block" aria-label={t("close")}>× {t("close")}</button>
        <div className="py-5 md:py-10">
          <p className="mb-2 text-[10px] uppercase tracking-[.2em] text-gallery-muted">{artwork.year}</p>
          <h2 className="font-serif text-3xl leading-none md:text-5xl">{artwork.title}</h2>
          <p className="mt-5 text-sm leading-6 text-gallery-muted">{artwork.description}</p>
          <p className="mt-4 text-[11px] leading-5 text-gallery-muted">{artwork.materials}<br />{artwork.dimensions}</p>
        </div>
        <div className="flex flex-col items-start gap-5 text-xs">
          {artwork.merchandiseAvailable && <button className="border-b border-gallery-ink pb-1 text-left" type="button" onClick={onPreorder}>{t("order")}</button>}
          <button className="border-b border-gallery-line pb-1 text-gallery-muted" type="button" onClick={onBack}>{t("back")}</button>
        </div>
      </aside>
    </motion.section>
  );
}

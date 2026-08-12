"use client";

import { useState } from "react";
import { artworks } from "@/data/artworks";
import { assetPath, routePath } from "@/lib/paths";
import { useLanguage } from "@/lib/i18n";

export function FallbackGallery() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const artwork = artworks[index];
  const go = (offset: number) => setIndex((current) => (current + offset + artworks.length) % artworks.length);

  return (
    <main id="main-content" className="min-h-screen bg-gallery-paper px-5 pb-10 pt-6 md:px-12">
      <header className="mb-12 flex items-center justify-between text-xs uppercase tracking-[.18em]">
        <a href={routePath("/")}>Find the Camel!</a>
        <a href={routePath("/guestbook")}>{t("guestbook")}</a>
      </header>
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs text-gallery-muted">{t("catalogueFallback")}</p>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="max-h-[62vh] w-full object-contain object-left" src={assetPath(artwork.fullImage)} alt={artwork.title} />
          <figcaption className="mt-6 max-w-2xl">
            <p className="text-xs uppercase tracking-[.18em] text-gallery-muted">{String(index + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}</p>
            <h1 className="mt-2 font-serif text-4xl">{artwork.title}</h1>
            <p className="mt-3 text-sm leading-6 text-gallery-muted">{artwork.description}</p>
          </figcaption>
        </figure>
        <div className="mt-8 flex gap-6 text-sm">
          <button onClick={() => go(-1)} type="button">← {t("previousWork")}</button>
          <button onClick={() => go(1)} type="button">{t("nextWork")} →</button>
        </div>
      </div>
    </main>
  );
}

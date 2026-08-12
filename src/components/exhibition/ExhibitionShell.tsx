"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { Artwork } from "@/types/artwork";
import { artworks, getArtworkBySlug } from "@/data/artworks";
import { routePath } from "@/lib/paths";
import { track } from "@/lib/analytics";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { ArtworkViewer } from "./ArtworkViewer";
import { NavigationHint } from "./NavigationHint";
import { FallbackGallery } from "./FallbackGallery";
import { PreorderModal } from "@/components/preorder/PreorderModal";
import { LanguageSelector, useLanguage } from "@/lib/i18n";
import type { TimeOfDay } from "@/hooks/useTimeOfDay";
import type { GalleryAction } from "@/components/camera/CameraController";

const GalleryScene = dynamic(() => import("./GalleryScene").then((module) => module.GalleryScene), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#d8d5cc]" aria-label="Loading exhibition hall" />
});

export function ExhibitionShell() {
  const { t } = useLanguage();
  const webgl = useWebGLSupport();
  const [room, setRoom] = useState<1 | 2>(1);
  const [roomTransition, setRoomTransition] = useState(false);
  const [action, setAction] = useState<GalleryAction>(null);
  const [lightingOverride, setLightingOverride] = useState<TimeOfDay>();
  const [selected, setSelected] = useState<Artwork>();
  const [hintVisible, setHintVisible] = useState(true);
  const [preorderArtwork, setPreorderArtwork] = useState<Artwork>();
  const roomArtworks = room === 1 ? artworks.slice(0, 5) : artworks.slice(5, 9);

  const finishAction = useCallback((completed: Exclude<GalleryAction, null>) => {
    setRoomTransition(true);
    window.setTimeout(() => {
      if (completed === "door") {
        setRoom((current) => current === 1 ? 2 : 1);
        setAction(null);
        window.setTimeout(() => setRoomTransition(false), 250);
      } else {
        window.location.href = routePath("/guestbook");
      }
    }, 320);
  }, []);

  const syncFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    setSelected(getArtworkBySlug(params.get("artwork")));
  }, []);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [syncFromUrl]);

  const updateSelection = useCallback((artwork?: Artwork, push = true) => {
    setSelected(artwork);
    setHintVisible(false);
    const url = new URL(window.location.href);
    if (artwork) url.searchParams.set("artwork", artwork.slug);
    else url.searchParams.delete("artwork");
    if (push) window.history.pushState({}, "", url);
    if (artwork) {
      track("artwork_selected", { artwork: artwork.slug });
      track("artwork_close_view", { artwork: artwork.slug });
    }
  }, []);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selected) updateSelection(undefined);
      if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && !preorderArtwork) {
        const current = selected ? roomArtworks.findIndex((artwork) => artwork.id === selected.id) : -1;
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const next = (current + offset + roomArtworks.length) % roomArtworks.length;
        updateSelection(roomArtworks[next]);
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [preorderArtwork, roomArtworks, selected, updateSelection]);

  if (webgl === false) return <FallbackGallery />;

  return (
    <main id="main-content" className="relative h-[100svh] overflow-hidden bg-[#d8d5cc]">
      <GalleryScene selectedArtwork={selected} onSelect={(artwork) => updateSelection(artwork)} room={room} onEnterOtherRoom={() => setAction("door")} onOpenGuestbook={() => setAction("book")} lightingOverride={lightingOverride} action={action} onActionComplete={finishAction} />
      <div className="absolute left-4 top-4 z-20 flex gap-1 rounded-full bg-gallery-paper/90 p-1 shadow-sm" aria-label="Lighting debug controls">
        {([
          ["morning", "🌅", "Morning"],
          ["day", "☀️", "Day"],
          ["evening", "🌆", "Evening"],
          ["night", "🌙", "Night"],
        ] as const).map(([mode, icon, label]) => (
          <button
            key={mode}
            type="button"
            title={label}
            aria-label={`${label} lighting`}
            aria-pressed={lightingOverride === mode}
            onClick={() => setLightingOverride(mode)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-base grayscale transition hover:bg-white hover:grayscale-0 aria-pressed:bg-gallery-ink aria-pressed:grayscale-0"
          >{icon}</button>
        ))}
      </div>
      <header className="pointer-events-none absolute inset-x-0 top-12 flex items-start justify-between p-5 text-[10px] uppercase tracking-[.2em] md:top-0 md:pl-52 md:p-7">
        <a className="pointer-events-auto" href={routePath("/")}>Find the Camel!<br /><span className="text-gallery-muted">Ekaterina Zueva · Hall {room}</span></a>
        <nav className="pointer-events-auto flex items-center gap-5" aria-label="Exhibition navigation">
          <LanguageSelector />
          <button type="button" onClick={() => setHintVisible(true)}>{t("help")}</button>
          <a href={routePath("/guestbook")}>{t("guestbook")}</a>
        </nav>
      </header>
      <NavigationHint visible={hintVisible && !selected} />
      <div className="absolute right-5 top-20 grid max-h-[50svh] grid-cols-2 gap-2 md:right-7" aria-label="Choose an artwork">
        {roomArtworks.map((artwork, index) => (
          <button
            key={artwork.id}
            type="button"
            onClick={() => updateSelection(artwork)}
            aria-label={`View ${artwork.title}`}
            aria-pressed={selected?.id === artwork.id}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gallery-paper/80 text-[10px] transition-colors hover:bg-gallery-paper aria-pressed:bg-gallery-ink aria-pressed:text-gallery-paper"
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
        {room === 2 && (
          <button type="button" onClick={() => setAction("book")} aria-label="Open guestbook" title="Guestbook" className="flex h-8 w-8 items-center justify-center rounded-full bg-gallery-paper/80 text-sm transition-colors hover:bg-gallery-paper">📖</button>
        )}
      </div>
      <AnimatePresence>
        {selected && (
          <ArtworkViewer
            key={selected.id}
            artwork={selected}
            onBack={() => updateSelection(undefined)}
            onPreorder={() => {
              setPreorderArtwork(selected);
              track("preorder_opened", { artwork: selected.slug });
            }}
          />
        )}
      </AnimatePresence>
      <PreorderModal artwork={preorderArtwork} onClose={() => setPreorderArtwork(undefined)} />
      <AnimatePresence>{roomTransition && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }} className="pointer-events-none fixed inset-0 z-40 bg-gallery-paper" />}</AnimatePresence>
    </main>
  );
}

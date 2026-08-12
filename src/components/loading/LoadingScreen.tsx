"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { LanguageSelector, useLanguage } from "@/lib/i18n";
import { assetPath } from "@/lib/paths";

interface LoadingScreenProps {
  progress: number;
  complete: boolean;
  error: boolean;
  onEnter: () => void;
  leaving: boolean;
}

export function LoadingScreen({ progress, complete, error, onEnter, leaving }: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <motion.main
      id="main-content"
      className="fixed inset-0 flex min-h-[100svh] flex-col justify-between bg-gallery-paper px-6 py-7 md:px-12 md:py-10"
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0 : .85, ease: [0.25, 1, 0.5, 1] }}
      aria-busy={!complete}
    >
      <header className="flex justify-end text-[10px] uppercase tracking-[.24em] text-gallery-muted">
        <span className="flex items-center gap-5"><LanguageSelector /><span>2026</span></span>
      </header>
      <section className="grid min-h-0 items-center gap-7 md:grid-cols-[minmax(0,1fr)_minmax(240px,36vw)] md:gap-12">
        <div className="max-w-3xl">
          <h1 className="font-serif text-[clamp(3.15rem,9vw,8rem)] leading-[.88] tracking-[-.045em]">
            Find the<br />Camel!
          </h1>
          <p className="mt-8 text-sm uppercase tracking-[.2em] text-gallery-muted md:text-base">
            Online Exhibition by Ekaterina Zueva
          </p>
        </div>
        <div className="flex h-[20svh] items-center justify-center md:h-[min(52svh,620px)]">
          <Image src={assetPath("/artworks/camel.jpg")} alt="Camel collage — Find the Camel!" width={1171} height={1280} priority className="h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(37,32,26,.16)]" />
        </div>
      </section>
      <section className="w-full max-w-xl" aria-label="Exhibition loading progress">
        <div className="mb-3 flex items-end justify-between text-xs">
          <span>{error ? "Some assets could not be prepared" : complete ? t("ready") : t("loading")}</span>
          <span aria-live="polite">{progress}%</span>
        </div>
        <div className="h-px overflow-hidden bg-gallery-line">
          <div className="h-full bg-gallery-ink transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          onClick={onEnter}
          disabled={!complete || leaving}
          className="mt-7 min-h-12 border-b border-gallery-ink pb-1 text-sm uppercase tracking-[.2em] transition-opacity disabled:cursor-wait disabled:opacity-30"
        >
          {t("start")}
        </button>
      </section>
    </motion.main>
  );
}

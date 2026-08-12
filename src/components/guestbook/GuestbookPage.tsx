"use client";

import { useEffect, useState } from "react";
import { GuestbookForm } from "./GuestbookForm";
import { GuestbookList } from "./GuestbookList";
import { routePath } from "@/lib/paths";
import { track } from "@/lib/analytics";
import { LanguageSelector, useLanguage } from "@/lib/i18n";

export function GuestbookPage() {
  const { t } = useLanguage();
  const [refreshVersion, setRefreshVersion] = useState(0);
  useEffect(() => { track("guestbook_opened"); }, []);

  return (
    <main id="main-content" className="min-h-screen bg-[#77716a] bg-[radial-gradient(circle_at_50%_15%,#b8b0a5_0%,#77716a_72%)] px-3 py-5 md:px-10 md:py-9">
      <header className="mx-auto flex max-w-7xl items-start justify-between pb-5 text-[10px] uppercase tracking-[.2em] text-gallery-paper">
        <a href={routePath("/")}>Find the Camel!<br /><span className="text-gallery-muted">Ekaterina Zueva</span></a>
        <div className="flex items-center gap-5"><LanguageSelector /><a href={routePath("/exhibition")}>{t("returnExhibition")}</a></div>
      </header>
      <div className="guestbook-cover mx-auto max-w-7xl rounded-[8px_14px_14px_8px] bg-[#4b3028] p-2 shadow-[0_28px_70px_rgba(25,18,14,.48),inset_0_0_0_1px_rgba(255,255,255,.08)] md:p-3">
        <div className="guestbook-pages relative grid min-h-[78svh] overflow-hidden rounded-[3px_10px_10px_3px] bg-[#eee8da] lg:grid-cols-2">
          <div className="relative border-b border-[#b9ad99]/60 px-6 py-10 md:px-12 md:py-14 lg:border-b-0 lg:border-r">
            <GuestbookForm onSubmitted={() => setRefreshVersion((version) => version + 1)} />
          </div>
          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <GuestbookList refreshVersion={refreshVersion} />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-8 -translate-x-1/2 bg-gradient-to-r from-black/10 via-white/25 to-black/10 lg:block" />
        </div>
      </div>
      <footer className="mx-auto max-w-7xl pt-5 text-xs text-[#e7e0d4]">{t("hall2")} · {t("exhibition")}</footer>
    </main>
  );
}

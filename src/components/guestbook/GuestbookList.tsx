"use client";

import { useCallback, useEffect, useState } from "react";
import { GuestbookEntry } from "./GuestbookEntry";
import { isGoogleSheetsConfigured, loadGuestbookEntries, type GuestbookEntryData } from "@/lib/google-sheets/guestbook";
import { useLanguage } from "@/lib/i18n";

export function GuestbookList({ refreshVersion = 0 }: { refreshVersion?: number }) {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<GuestbookEntryData[]>([]);
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setEntries(await loadGuestbookEntries());
    } catch {
      setError(t("guestbookError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void load(); }, [load, refreshVersion]);

  return (
    <section aria-labelledby="visitor-notes">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">{t("fromVisitors")}</p>
          <h2 id="visitor-notes" className="mt-2 font-serif text-4xl">{t("notesHall2")}</h2>
        </div>
        {!isGoogleSheetsConfigured && <span className="hidden text-xs text-gallery-muted md:block">{t("demonstration")}</span>}
      </div>
      {loading && <p className="py-8 text-sm text-gallery-muted">{t("openingGuestbook")}</p>}
      {error && (
        <div className="border-t border-gallery-line py-8 text-sm text-gallery-muted">
          <p>{error}</p>
          <button className="mt-3 border-b border-gallery-ink text-gallery-ink" type="button" onClick={() => void load()}>{t("tryAgain")}</button>
        </div>
      )}
      {!loading && !error && entries.length === 0 && <p className="border-t border-gallery-line py-8 text-sm text-gallery-muted">{t("emptyGuestbook")}</p>}
      {entries.slice(0, visible).map((entry, index) => <GuestbookEntry key={`${entry.createdAt}-${index}`} entry={entry} />)}
      {visible < entries.length && <button type="button" className="mt-4 border-b border-gallery-ink pb-1 text-sm" onClick={() => setVisible((count) => count + 6)}>{t("showMore")}</button>}
    </section>
  );
}

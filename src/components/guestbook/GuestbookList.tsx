"use client";

import { useCallback, useEffect, useState } from "react";
import { GuestbookEntry } from "./GuestbookEntry";
import { isGoogleSheetsConfigured, loadGuestbookEntries, type GuestbookEntryData } from "@/lib/google-sheets/guestbook";

export function GuestbookList() {
  const [entries, setEntries] = useState<GuestbookEntryData[]>([]);
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setEntries(await loadGuestbookEntries());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The guestbook could not be reached.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <section aria-labelledby="visitor-notes">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">From the visitors&apos; book</p>
          <h2 id="visitor-notes" className="mt-2 font-serif text-4xl">Notes from Hall 2</h2>
        </div>
        {!isGoogleSheetsConfigured && <span className="hidden text-xs text-gallery-muted md:block">Demonstration entries</span>}
      </div>
      {loading && <p className="py-8 text-sm text-gallery-muted">Opening the guestbook…</p>}
      {error && (
        <div className="border-t border-gallery-line py-8 text-sm text-gallery-muted">
          <p>{error}</p>
          <button className="mt-3 border-b border-gallery-ink text-gallery-ink" type="button" onClick={() => void load()}>Try again</button>
        </div>
      )}
      {!loading && !error && entries.length === 0 && <p className="border-t border-gallery-line py-8 text-sm text-gallery-muted">The first page is waiting for a note.</p>}
      {entries.slice(0, visible).map((entry, index) => <GuestbookEntry key={`${entry.createdAt}-${index}`} entry={entry} />)}
      {visible < entries.length && <button type="button" className="mt-4 border-b border-gallery-ink pb-1 text-sm" onClick={() => setVisible((count) => count + 6)}>Show more</button>}
    </section>
  );
}

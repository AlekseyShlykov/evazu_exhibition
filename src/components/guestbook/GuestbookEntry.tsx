import type { GuestbookEntryData } from "@/lib/google-sheets/guestbook";
import { useLanguage } from "@/lib/i18n";

export function GuestbookEntry({ entry }: { entry: GuestbookEntryData }) {
  const { language, t } = useLanguage();
  const date = new Intl.DateTimeFormat(language, { month: "long", day: "numeric", year: "numeric" }).format(new Date(entry.createdAt));
  return (
    <article className="border-t border-[#b9ad99] py-6">
      <blockquote className="max-w-2xl font-serif text-2xl italic leading-snug md:text-3xl">“{entry.message}”</blockquote>
      <footer className="mt-5 text-xs text-gallery-muted">
        <span className="text-gallery-ink">{entry.displayName}</span> · {date}
        {entry.favouriteArtworkTitle && <span className="block pt-1">{t("remembered")}: {entry.favouriteArtworkTitle}</span>}
      </footer>
    </article>
  );
}

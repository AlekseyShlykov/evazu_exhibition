interface PreorderSuccessProps {
  onClose: () => void;
}

export function PreorderSuccess({ onClose }: PreorderSuccessProps) {
  const { t } = useLanguage();
  return (
    <div className="py-10">
      <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">{t("received")}</p>
      <h3 className="mt-3 font-serif text-4xl">{t("thankYou")}</h3>
      <p className="mt-4 max-w-sm text-sm leading-6 text-gallery-muted">
        {t("receivedText")}
      </p>
      <button className="mt-8 border-b border-gallery-ink pb-1 text-sm" type="button" onClick={onClose}>{t("returnArtwork")}</button>
    </div>
  );
}
import { useLanguage } from "@/lib/i18n";

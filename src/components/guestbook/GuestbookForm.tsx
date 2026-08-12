"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworks } from "@/data/artworks";
import { guestbookSchema, type GuestbookFormValues } from "@/lib/validation/guestbook";
import { isGoogleSheetsConfigured, submitGuestbookEntry } from "@/lib/google-sheets/guestbook";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";

const fieldClass = "mt-2 w-full border-b border-[#9f9585] bg-transparent py-3 text-sm outline-none focus:border-gallery-ink";

export function GuestbookForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { t } = useLanguage();
  const startedAt = useRef(Date.now());
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GuestbookFormValues>({
    resolver: zodResolver(guestbookSchema),
    defaultValues: { displayName: "", message: "", favouriteArtworkId: "", website: "" }
  });

  const onSubmit = async (values: GuestbookFormValues) => {
    setFormError(undefined);
    setSuccess(false);
    if (Date.now() - startedAt.current < 1800) {
      setFormError(t("noteTooFast"));
      return;
    }
    const cooldown = Number(localStorage.getItem("guestbook-cooldown") ?? 0);
    if (Date.now() - cooldown < 30_000) {
      setFormError(t("noteCooldown"));
      return;
    }
    try {
      await submitGuestbookEntry(values);
      localStorage.setItem("guestbook-cooldown", String(Date.now()));
      reset();
      startedAt.current = Date.now();
      setSuccess(true);
      track("guestbook_submitted");
      onSubmitted?.();
    } catch {
      setFormError(t("noteError"));
    }
  };

  return (
    <section aria-labelledby="leave-note">
      <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">{t("visitorsYourPage")}</p>
      <h1 id="leave-note" className="mt-3 max-w-xl font-serif text-5xl italic leading-[.95] md:text-6xl">{t("guestbookQuestion")}</h1>
      <p className="mt-5 max-w-md text-sm leading-6 text-gallery-muted">{t("guestbookIntro")}</p>
      {!isGoogleSheetsConfigured && <p className="mt-4 text-xs text-amber-900">{t("developmentSheets")}</p>}
      <form className="mt-8 max-w-xl bg-[repeating-linear-gradient(transparent_0,transparent_31px,rgba(107,96,81,.12)_32px)]" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block text-xs">{t("displayName")} <span className="text-gallery-muted">({t("optional")})</span><input maxLength={60} className={fieldClass} {...register("displayName")} /></label>
        <label className="mt-7 block text-xs">{t("yourNote")}<textarea maxLength={600} className={`${fieldClass} min-h-40 resize-y font-serif text-xl italic leading-8`} {...register("message")} />{errors.message && <span className="mt-2 block text-red-800">{t("noteLength")}</span>}</label>
        <label className="mt-7 block text-xs">{t("favouriteArtwork")} <span className="text-gallery-muted">({t("optional")})</span>
          <select className={fieldClass} {...register("favouriteArtworkId")}>
            <option value="">{t("noSelection")}</option>
            {artworks.map((artwork) => <option key={artwork.id} value={artwork.id}>{artwork.title}</option>)}
          </select>
        </label>
        <label className="absolute -left-[9999px]" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
        {formError && <p role="alert" className="mt-5 text-sm text-red-800">{formError}</p>}
        {success && <p role="status" className="mt-5 text-sm leading-6">{t("noteSuccess")}</p>}
        <button disabled={isSubmitting || !isGoogleSheetsConfigured} className="mt-8 border-b border-gallery-ink pb-1 text-sm disabled:opacity-40" type="submit">{isSubmitting ? t("leavingNote") : t("leaveNote")}</button>
      </form>
    </section>
  );
}

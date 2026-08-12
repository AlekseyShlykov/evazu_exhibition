"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworks } from "@/data/artworks";
import { guestbookSchema, type GuestbookFormValues } from "@/lib/validation/guestbook";
import { isGoogleSheetsConfigured, submitGuestbookEntry } from "@/lib/google-sheets/guestbook";
import { track } from "@/lib/analytics";

const fieldClass = "mt-2 w-full border-b border-[#9f9585] bg-transparent py-3 text-sm outline-none focus:border-gallery-ink";

export function GuestbookForm() {
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
      setFormError("Please take a moment with your note before sending it.");
      return;
    }
    const cooldown = Number(localStorage.getItem("guestbook-cooldown") ?? 0);
    if (Date.now() - cooldown < 30_000) {
      setFormError("Please wait a moment before leaving another note.");
      return;
    }
    try {
      await submitGuestbookEntry(values);
      localStorage.setItem("guestbook-cooldown", String(Date.now()));
      reset();
      startedAt.current = Date.now();
      setSuccess(true);
      track("guestbook_submitted");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Your note could not be sent.");
    }
  };

  return (
    <section aria-labelledby="leave-note">
      <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">Visitors&apos; book · Your page</p>
      <h1 id="leave-note" className="mt-3 max-w-xl font-serif text-5xl italic leading-[.95] md:text-6xl">What did you like most?</h1>
      <p className="mt-5 max-w-md text-sm leading-6 text-gallery-muted">Leave a short note in the visitors&apos; book. No account or email is needed.</p>
      {!isGoogleSheetsConfigured && <p className="mt-4 text-xs text-amber-900">Development mode: connect Google Sheets to enable submissions.</p>}
      <form className="mt-8 max-w-xl bg-[repeating-linear-gradient(transparent_0,transparent_31px,rgba(107,96,81,.12)_32px)]" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block text-xs">Display name <span className="text-gallery-muted">(optional)</span><input maxLength={60} className={fieldClass} {...register("displayName")} /></label>
        <label className="mt-7 block text-xs">Your note<textarea maxLength={600} className={`${fieldClass} min-h-40 resize-y font-serif text-xl italic leading-8`} {...register("message")} />{errors.message && <span className="mt-2 block text-red-800">{errors.message.message}</span>}</label>
        <label className="mt-7 block text-xs">Favourite artwork <span className="text-gallery-muted">(optional)</span>
          <select className={fieldClass} {...register("favouriteArtworkId")}>
            <option value="">No selection</option>
            {artworks.map((artwork) => <option key={artwork.id} value={artwork.id}>{artwork.title}</option>)}
          </select>
        </label>
        <label className="absolute -left-[9999px]" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
        {formError && <p role="alert" className="mt-5 text-sm text-red-800">{formError}</p>}
        {success && <p role="status" className="mt-5 text-sm leading-6">Thank you. Your message has been added to the guestbook and will appear after review.</p>}
        <button disabled={isSubmitting || !isGoogleSheetsConfigured} className="mt-8 border-b border-gallery-ink pb-1 text-sm disabled:opacity-40" type="submit">{isSubmitting ? "Leaving your note…" : "Leave this note"}</button>
      </form>
    </section>
  );
}

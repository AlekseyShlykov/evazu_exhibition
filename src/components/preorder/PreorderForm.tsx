"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Artwork } from "@/types/artwork";
import { preorderSchema, type PreorderFormValues } from "@/lib/validation/preorder";
import { isGoogleSheetsConfigured, submitPreorder } from "@/lib/google-sheets/preorders";
import { track } from "@/lib/analytics";

interface PreorderFormProps { artwork: Artwork; onSuccess: () => void; }

export function PreorderForm({ artwork, onSuccess }: PreorderFormProps) {
  const openedAt = useRef(Date.now());
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PreorderFormValues>({
    resolver: zodResolver(preorderSchema), defaultValues: { email: "", website: "" }
  });

  const onSubmit = async (values: PreorderFormValues) => {
    setFormError(undefined);
    if (Date.now() - openedAt.current < 1200) { setFormError("Please take a moment before sending."); return; }
    const cooldown = Number(localStorage.getItem("preorder-cooldown") ?? 0);
    if (Date.now() - cooldown < 30_000) { setFormError("Please wait a moment before submitting again."); return; }
    try {
      await submitPreorder(artwork, values);
      localStorage.setItem("preorder-cooldown", String(Date.now()));
      track("preorder_submitted", { artwork: artwork.slug });
      onSuccess();
    } catch (error) { setFormError(error instanceof Error ? error.message : "Something went wrong."); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">Postcard request</p>
      <h3 className="mt-2 font-serif text-4xl">Хочу купить такую открытку</h3>
      <p className="mt-3 text-sm text-gallery-muted">Картина: <span className="text-gallery-ink">{artwork.title}</span></p>
      <p className="mt-5 max-w-md text-sm leading-6 text-gallery-muted">Оставьте email — мы свяжемся с вами, когда открытка будет доступна.</p>
      {!isGoogleSheetsConfigured && <p className="mt-4 text-xs text-amber-900">Подключите Google Sheets, чтобы включить отправку формы.</p>}
      <label className="mt-8 block text-xs">Email
        <input className="mt-2 w-full border-b border-gallery-line bg-transparent py-3 text-base outline-none focus:border-gallery-ink" maxLength={160} type="email" autoComplete="email" placeholder="name@example.com" {...register("email")} />
        {errors.email && <span className="mt-2 block text-red-800">{errors.email.message}</span>}
      </label>
      <label className="absolute -left-[9999px]" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      {formError && <p role="alert" className="mt-4 text-sm text-red-800">{formError}</p>}
      <button disabled={isSubmitting || !isGoogleSheetsConfigured} className="mt-8 border-b border-gallery-ink pb-1 text-sm disabled:opacity-40" type="submit">{isSubmitting ? "Отправляем…" : "Оставить email"}</button>
    </form>
  );
}

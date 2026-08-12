interface PreorderSuccessProps {
  onClose: () => void;
}

export function PreorderSuccess({ onClose }: PreorderSuccessProps) {
  return (
    <div className="py-10">
      <p className="text-xs uppercase tracking-[.2em] text-gallery-muted">Received</p>
      <h3 className="mt-3 font-serif text-4xl">Thank you.</h3>
      <p className="mt-4 max-w-sm text-sm leading-6 text-gallery-muted">
        Ваш email и выбранная картина сохранены. Мы свяжемся с вами, когда открытка будет доступна.
      </p>
      <button className="mt-8 border-b border-gallery-ink pb-1 text-sm" type="button" onClick={onClose}>Return to the artwork</button>
    </div>
  );
}

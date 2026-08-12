import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

interface NavigationHintProps {
  visible: boolean;
}

export function NavigationHint({ visible }: NavigationHintProps) {
  const { t } = useLanguage();
  return (
    <motion.div
      aria-hidden={!visible}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
      className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 whitespace-nowrap bg-gallery-paper/90 px-4 py-2 text-[11px] tracking-[.08em] text-gallery-muted"
    >
      {t("hint")}
    </motion.div>
  );
}

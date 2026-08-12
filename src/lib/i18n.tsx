"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const languages = ["en", "fr", "es", "ru", "it", "sr"] as const;
export type Language = (typeof languages)[number];
const labels: Record<Language, string> = { en: "English", fr: "Français", es: "Español", ru: "Русский", it: "Italiano", sr: "Srpski" };
const messages = {
  en: { start: "Start viewing", ready: "The gallery is ready", loading: "Preparing the gallery", intro: "Enter a quiet room of cut paper, found memory and imagined landscapes.", count: "An exhibition in nine works", help: "Help", guestbook: "Guestbook", hint: "Drag to look around. Click an artwork or the door to enter the next room.", order: "I want to buy this postcard", back: "Back to exhibition", close: "Close artwork", exhibition: "Online exhibition" },
  fr: { start: "Commencer la visite", ready: "La galerie est prête", loading: "Préparation de la galerie", intro: "Entrez dans un espace silencieux de papier découpé, de souvenirs et de paysages imaginés.", count: "Une exposition en neuf œuvres", help: "Aide", guestbook: "Livre d’or", hint: "Faites glisser pour regarder autour de vous. Cliquez sur une œuvre ou sur la porte.", order: "Je veux acheter cette carte postale", back: "Retour à l’exposition", close: "Fermer l’œuvre", exhibition: "Exposition en ligne" },
  es: { start: "Comenzar la visita", ready: "La galería está lista", loading: "Preparando la galería", intro: "Entra en una sala tranquila de papel recortado, memoria encontrada y paisajes imaginados.", count: "Una exposición de nueve obras", help: "Ayuda", guestbook: "Libro de visitas", hint: "Arrastra para mirar alrededor. Haz clic en una obra o en la puerta.", order: "Quiero comprar esta postal", back: "Volver a la exposición", close: "Cerrar obra", exhibition: "Exposición en línea" },
  ru: { start: "Начать выставку", ready: "Галерея готова", loading: "Подготавливаем галерею", intro: "Войдите в тихое пространство бумажных коллажей, найденных воспоминаний и воображаемых пейзажей.", count: "Выставка из девяти работ", help: "Помощь", guestbook: "Книга гостей", hint: "Тяните, чтобы осмотреться вокруг. Нажмите на работу или дверь в следующий зал.", order: "Хочу купить такую открытку", back: "Вернуться на выставку", close: "Закрыть работу", exhibition: "Онлайн-выставка" },
  it: { start: "Inizia la visita", ready: "La galleria è pronta", loading: "Preparazione della galleria", intro: "Entra in una sala silenziosa di carta ritagliata, memorie ritrovate e paesaggi immaginati.", count: "Una mostra di nove opere", help: "Aiuto", guestbook: "Libro degli ospiti", hint: "Trascina per guardarti intorno. Fai clic su un’opera o sulla porta.", order: "Voglio comprare questa cartolina", back: "Torna alla mostra", close: "Chiudi opera", exhibition: "Mostra online" },
  sr: { start: "Započni obilazak", ready: "Galerija je spremna", loading: "Pripremamo galeriju", intro: "Uđite u tihu sobu isečenog papira, pronađenih sećanja i zamišljenih pejzaža.", count: "Izložba od devet radova", help: "Pomoć", guestbook: "Knjiga utisaka", hint: "Prevucite da biste pogledali oko sebe. Kliknite na rad ili vrata.", order: "Želim da kupim ovu razglednicu", back: "Nazad na izložbu", close: "Zatvori rad", exhibition: "Onlajn izložba" },
} as const;
export type MessageKey = keyof (typeof messages)["en"];
interface LanguageContextValue { language: Language; setLanguage: (language: Language) => void; t: (key: MessageKey) => string; }
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("exhibition-language");
    const browser = navigator.language.slice(0, 2);
    const initial = languages.includes(saved as Language) ? saved : browser;
    if (languages.includes(initial as Language)) setLanguageState(initial as Language);
  }, []);
  const setLanguage = (next: Language) => { setLanguageState(next); window.localStorage.setItem("exhibition-language", next); document.documentElement.lang = next; };
  const value = useMemo(() => ({ language, setLanguage, t: (key: MessageKey) => messages[language][key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const value = useContext(LanguageContext); if (!value) throw new Error("LanguageProvider is missing"); return value; }
export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  return <label className={`inline-flex ${className}`}><span className="sr-only">Language</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="cursor-pointer bg-transparent text-[10px] uppercase tracking-[.16em]">{languages.map((code) => <option key={code} value={code}>{labels[code]}</option>)}</select></label>;
}

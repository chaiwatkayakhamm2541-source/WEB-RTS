import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "th" | "en";

const KEY = "rts-lang";

type LangValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tx: (th: string, en: string) => string;
};

const LangContext = createContext<LangValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "th") setLangState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang === "en" ? "en" : "th";
    localStorage.setItem(KEY, lang);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        lang === "en"
          ? "RTS Battlefield — plan, rally, expand your realm, and plant your banner."
          : "เว็บสมรภูมิ RTS — วางแผน รวมพลัง ขยายอาณาจักร และปักธงเข้าสมรภูมิ",
      );
    }
  }, [lang, ready]);

  const value: LangValue = {
    lang,
    setLang: setLangState,
    tx: (th, en) => (lang === "en" ? en : th),
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside LanguageProvider");
  return value;
}

export function usePageTitle(th: string, en: string) {
  const { lang } = useLang();
  useEffect(() => {
    document.title = lang === "en" ? en : th;
  }, [lang, th, en]);
}

export const SEASON_END = Date.parse("2026-10-13T11:00:00+07:00");

export function countdownLabel(lang: Lang, days: number, hours: number, minutes: number, seconds: number, done: boolean) {
  if (done) return lang === "en" ? "Season 1 has ended" : "ซีซั่น 1 จบแล้ว";
  if (lang === "en") return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  return `เหลืออีก ${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วินาที`;
}

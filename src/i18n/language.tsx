import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, type Content, type Lang } from "@/i18n/translations"

type LanguageValue = { lang: Lang; setLang: (l: Lang) => void; t: Content }

const LanguageContext = createContext<LanguageValue | null>(null)

const STORAGE_KEY = "gw-lang"

/** Best guess at the active language from storage / browser preference.
 * Exported for the ErrorBoundary, which renders above the provider and so
 * cannot read the context. */
export function detectInitial(): Lang {
  if (typeof window === "undefined") return "en"
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "en" || saved === "de") return saved
  } catch {
    /* private mode / blocked storage — fall through to browser preference */
  }
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("de") ? "de" : "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectInitial)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore storage failures — the choice still applies for this session */
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider")
  return ctx
}

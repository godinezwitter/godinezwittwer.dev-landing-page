import type { Lang } from "@/i18n/translations"

/* The legal documents are real routes, not static .html files. Each one lives at
   a language-native path — English visitors get /terms and /privacy, German
   visitors the conventional /agb and /datenschutz. The path carries the
   language so a shared or indexed link opens the document in the language it
   was written for, whatever the visitor's saved preference happens to be. */

export type LegalDoc = "terms" | "privacy"

const PATHS: Record<Lang, Record<LegalDoc, string>> = {
  en: { terms: "/terms", privacy: "/privacy" },
  de: { terms: "/agb", privacy: "/datenschutz" },
}

/** Path for a document in a given language, e.g. ("terms", "de") → "/agb". */
export function legalPath(doc: LegalDoc, lang: Lang): string {
  return PATHS[lang][doc]
}

/** Resolve a pathname back to the document and language it encodes, or null. */
export function matchLegalRoute(pathname: string): { doc: LegalDoc; lang: Lang } | null {
  for (const lang of Object.keys(PATHS) as Lang[]) {
    for (const doc of Object.keys(PATHS[lang]) as LegalDoc[]) {
      if (PATHS[lang][doc] === pathname) return { doc, lang }
    }
  }
  return null
}

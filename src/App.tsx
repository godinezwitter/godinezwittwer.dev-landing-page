import { MotionConfig } from "framer-motion"
import { useEffect } from "react"
import { LanguageProvider, useLang } from "@/i18n/language"
import type { Content } from "@/i18n/translations"
import { useRoute } from "@/router"
import { SmoothScroll } from "@/components/SmoothScroll"
import { PageIntro } from "@/components/PageIntro"
import { Nav } from "@/components/Nav"
import { MainPage } from "@/pages/MainPage"
import { AboutPage } from "@/pages/AboutPage"
import { LegalPage } from "@/pages/LegalPage"
import { NotFound } from "@/pages/NotFound"
import { matchLegalRoute, type LegalDoc } from "@/legalRoutes"

/** Document title for the active route, in the active language. */
function documentTitle(route: string, legalDoc: LegalDoc | null, meta: Content["meta"]): string {
  if (legalDoc === "terms") return meta.titleTerms
  if (legalDoc === "privacy") return meta.titlePrivacy
  if (route === "/about") return meta.titleAbout
  if (route === "/") return meta.titleHome
  return meta.titleNotFound
}

/** Everything that needs the language context: the page itself, its landmark
 * and skip link, and the per-route document title. */
function SiteChrome() {
  const route = useRoute()
  const { t } = useLang()

  // /terms, /privacy, /agb, /datenschutz all resolve to the one LegalPage.
  const legal = matchLegalRoute(route)
  const legalDoc = legal?.doc ?? null

  useEffect(() => {
    document.title = documentTitle(route, legalDoc, t.meta)
  }, [route, t, legalDoc])

  return (
    <div className="relative">
      <a href="#main-content" className="skip-link">
        {t.nav.skip}
      </a>
      <SmoothScroll />
      <PageIntro />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        {legal ? (
          <LegalPage doc={legal.doc} routeLang={legal.lang} />
        ) : route === "/about" ? (
          <AboutPage />
        ) : route === "/" ? (
          <MainPage />
        ) : (
          <NotFound />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <SiteChrome />
      </LanguageProvider>
    </MotionConfig>
  )
}

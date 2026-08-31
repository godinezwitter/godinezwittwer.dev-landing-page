import { MotionConfig } from "framer-motion"
import { useEffect } from "react"
import { LanguageProvider, useLang } from "@/i18n/language"
import { useRoute } from "@/router"
import { SmoothScroll } from "@/components/SmoothScroll"
import { PageIntro } from "@/components/PageIntro"
import { Nav } from "@/components/Nav"
import { MainPage } from "@/pages/MainPage"
import { AboutPage } from "@/pages/AboutPage"
import { NotFound } from "@/pages/NotFound"

/** Everything that needs the language context: the page itself, its landmark
 * and skip link, and the per-route document title. */
function SiteChrome() {
  const route = useRoute()
  const { t } = useLang()

  useEffect(() => {
    document.title =
      route === "/about" ? t.meta.titleAbout : route === "/" ? t.meta.titleHome : t.meta.titleNotFound
  }, [route, t])

  return (
    <div className="relative">
      <a href="#main-content" className="skip-link">
        {t.nav.skip}
      </a>
      <SmoothScroll />
      <PageIntro />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        {route === "/about" ? <AboutPage /> : route === "/" ? <MainPage /> : <NotFound />}
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

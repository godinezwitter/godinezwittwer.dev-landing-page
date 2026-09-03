import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { scrollToTarget } from "@/components/SmoothScroll"
import { Footer } from "@/components/Footer"
import { useLang } from "@/i18n/language"
import { translations, type Lang } from "@/i18n/translations"
import { navigate } from "@/router"
import { legalPath, type LegalDoc } from "@/legalRoutes"

const ink = { color: "var(--color-ink-deep)" }
const inkSoft = { color: "var(--color-ink-soft)" }
// section-title carries no size of its own by design (see index.css); every use picks one.
const sectionHeading = { fontSize: "1.4rem" }

/** A legal document (terms or privacy) rendered from the copy dictionary, over
 * the same warm paper as the rest of the light world. `routeLang` comes from the
 * path — see legalRoutes.ts — so the document always reads in the language its
 * URL names, and the surrounding chrome is synced to match. */
export function LegalPage({ doc, routeLang }: { doc: LegalDoc; routeLang: Lang }) {
  const { lang, setLang } = useLang()
  const reduce = useReducedMotion()

  // Read the copy off the route's language, not the context's, so the document
  // never flashes the wrong language in the frame before the two agree.
  const t = translations[routeLang]
  const d = t.legal[doc]

  // Client-side navigation doesn't reset scroll on its own; start at the top.
  useEffect(() => {
    scrollToTarget(0)
  }, [doc, routeLang])

  /* Language and URL are kept in step, in whichever direction the change came
     from: on arrival the path wins (opening /agb switches the site to German),
     and afterwards a nav-toggle wins (switching to EN on /agb moves to /terms). */
  const arrived = useRef(false)
  useEffect(() => {
    if (!arrived.current) {
      arrived.current = true
      if (lang !== routeLang) setLang(routeLang)
      return
    }
    if (lang !== routeLang) navigate(legalPath(doc, lang))
  }, [lang, routeLang, doc, setLang])

  return (
    <div className="relative" lang={routeLang} style={{ background: "var(--color-paper)", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Top room clears the fixed nav pill. */}
        <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-36 pb-16">
          <motion.div
            className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Left rail — document identity. Sticks alongside the prose on desktop. */}
            <header className="lg:sticky lg:top-32 lg:self-start">
              <span className="kicker">{t.legal.kicker}</span>
              {/* German titles are long compound nouns ("Datenschutzerklärung") that
                  overflow the rail at display size. The copy carries soft hyphens at
                  the compound seams (hyphens:auto honours them); overflowWrap is the
                  last-resort break if a seam still isn't enough. */}
              <h1
                className="section-title mt-3"
                lang={routeLang}
                style={{
                  fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
                  hyphens: "auto",
                  overflowWrap: "break-word",
                }}
              >
                {d.title}
              </h1>
              <p className="text-xs mt-4" style={inkSoft}>
                {t.legal.updated}
              </p>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/")
                }}
                className="inline-block mt-6 text-sm font-semibold transition-colors"
                style={{ color: "var(--color-wine)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-wine-deep)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-wine)")}
              >
                {t.legal.back}
              </a>
            </header>

            {/* The document itself — capped at a readable measure inside the wide column. */}
            <div className="max-w-[68ch]">
              <p className="text-lg leading-relaxed" style={ink}>
                {d.intro}
              </p>

              <p
                className="mt-8 pl-4 py-1 text-sm leading-relaxed"
                style={{ ...inkSoft, borderLeft: "3px solid var(--color-wine)" }}
              >
                {t.legal.note}
              </p>

              {d.sections.map((s) => (
                <section key={s.heading} className="mt-12">
                  <h2 className="section-title" style={sectionHeading}>
                    {s.heading}
                  </h2>
                  {s.body.map((p, i) => (
                    <p key={i} className="mt-3 leading-relaxed" style={ink}>
                      {p}
                    </p>
                  ))}
                  {s.list.length > 0 && (
                    <ul className="mt-3 pl-5 list-disc space-y-1.5" style={ink}>
                      {s.list.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.tail.map((p, i) => (
                    <p key={i} className="mt-3 leading-relaxed" style={ink}>
                      {p}
                    </p>
                  ))}
                </section>
              ))}

              <section className="mt-12">
                <h2 className="section-title" style={sectionHeading}>
                  {d.contact.heading}
                </h2>
                <p className="mt-3 leading-relaxed" style={ink}>
                  {d.contact.before}
                  <a
                    href={d.contact.href}
                    onClick={
                      d.contact.href.startsWith("/")
                        ? (e) => {
                            e.preventDefault()
                            navigate(d.contact.href)
                          }
                        : undefined
                    }
                    className="font-semibold underline underline-offset-2"
                    style={{ color: "var(--color-wine)" }}
                  >
                    {d.contact.link}
                  </a>
                  {d.contact.after}
                </p>
              </section>
            </div>
          </motion.div>
        </div>

        <Footer />
        <div className="h-16" aria-hidden="true" />
      </div>
    </div>
  )
}

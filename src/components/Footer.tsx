import { useLang } from "@/i18n/language"
import { navigate } from "@/router"
import { legalPath } from "@/legalRoutes"

/** Site footer — brand wordmark, copyright, and legal/contact links. Shown on
 * every page. The legal pages are routed like any other view, at their
 * language-native paths (German gets /agb + /datenschutz); Contact routes back
 * to the main page's contact form. */
export function Footer() {
  const { t, lang } = useLang()

  const links = [
    { label: t.footer.privacy, href: legalPath("privacy", lang) },
    { label: t.footer.terms, href: legalPath("terms", lang) },
    { label: t.footer.contact, href: "/#contact" },
  ]

  return (
    <div
      className="relative z-10 max-w-7xl mx-auto px-6 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ borderTop: "1px solid var(--color-line-ink)" }}
    >
      <span className="font-display text-lg tracking-tight" style={{ color: "var(--color-ink-deep)" }}>
        Godinez <span style={{ color: "var(--color-wine)" }}>&amp; Wittwer</span>
      </span>
      <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
        {t.footer.copyright}
      </p>
      <div className="flex gap-6">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={(e) => { e.preventDefault(); navigate(l.href) }}
            className="text-xs transition-colors py-2.5 -my-2.5"
            style={{ color: "var(--color-ink-soft)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-wine)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink-soft)")}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}

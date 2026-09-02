import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { lazy, Suspense, useRef, useState, type FormEvent } from "react"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"

// Silk pulls in the three.js / react-three-fiber stack. Load it lazily so that
// weight stays out of the initial bundle — the static wash covers the gap until
// the chunk lands.
const SilkBackground = lazy(() =>
  import("@/components/Silk").then((m) => ({ default: m.SilkBackground })),
)
import { CheckIcon } from "@/components/icons"
import { Footer } from "@/components/Footer"
import { useLang } from "@/i18n/language"

export function Testimonials() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const { t } = useLang()
  // Once the contact card is on screen, still the ambient silk so nothing moves
  // behind the form while the visitor is filling it in.
  const contactRef = useRef<HTMLDivElement>(null)
  const contactInView = useInView(contactRef, { margin: "-25% 0px" })
  const [activeForm, setActiveForm] = useState<{ name: string; email: string; service: string; message: string }>({
    name: "", email: "", service: "", message: "",
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const next: { name?: string; email?: string } = {}
    if (!activeForm.name.trim()) next.name = t.contact.errName
    if (!activeForm.email.trim()) next.email = t.contact.errEmailReq
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(activeForm.email)) next.email = t.contact.errEmailInvalid
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return
    // Simulate the network round-trip so the button always shows real pending
    // feedback; swap this for the actual submit call when the backend lands.
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1100)
  }

  return (
    <motion.section
      ref={ref}
      id="testimonials"
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <Suspense fallback={null}>
        <SilkBackground pauseAnimation={contactInView} />
      </Suspense>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="section-title mb-5"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
          >
            {t.why.heading}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            {t.why.subtext}
          </p>
        </motion.div>

        {/* Honest reasons — no fabricated social proof. An editorial numbered
            list rather than three identical cards: the big wine numerals and
            hairline rows read as a considered argument, not a feature grid. */}
        <ol className="mb-16 border-t" style={{ borderColor: "var(--color-line-ink)" }}>
          {t.why.reasons.map((r, i) => (
            <motion.li
              key={r.n}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 md:gap-x-12 py-8 md:py-10 border-b"
              style={{ borderColor: "var(--color-line-ink)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <span
                className="font-body font-semibold tabular-nums leading-none"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "var(--color-wine)", letterSpacing: "-0.02em" }}
                aria-hidden="true"
              >
                {r.n}
              </span>
              <div className="max-w-2xl self-center">
                <h3 className="font-body mb-2" style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)" }}>
                  {r.title}
                </h3>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                  {r.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div
          className="flex flex-wrap gap-3 mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t.why.proofPoints.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
              style={{
                background: "var(--color-paper-2)",
                border: "1px solid var(--color-line-ink)",
                color: "var(--color-ink-deep)",
              }}
            >
              <span style={{ color: "var(--color-wine)" }}>✓</span> {p}
            </span>
          ))}
        </motion.div>

        {/* CTA + Contact form */}
        <motion.div
          id="contact"
          ref={contactRef}
          className="surface rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <div className="relative p-10 md:p-16">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[90px] pointer-events-none"
              style={{ background: "var(--color-blush)", opacity: 0.35 }}
              aria-hidden="true"
            />
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="section-title mb-5"
                  style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
                >
                  {t.contact.heading}
                </h2>
                <p className="text-base leading-relaxed max-w-[46ch]" style={{ color: "var(--color-ink-soft)" }}>
                  {t.contact.paragraph}
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  {t.contact.checks.map((p) => (
                    <div key={p} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "var(--color-wine)", color: "#fff" }}
                      >
                        <CheckIcon />
                      </span>
                      <span className="text-base" style={{ color: "var(--color-ink-deep)" }}>
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="surface-2 rounded-2xl p-7" style={{ border: "1px solid var(--color-line-ink)" }}>
                <AnimatePresence mode="wait" initial={false}>
                  {submitted ? (
                    <motion.div
                      key="success"
                      className="flex flex-col items-center justify-center text-center py-10"
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -12 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                        style={{ background: "var(--color-wine)", color: "#fff" }}
                      >
                        <CheckIcon size={26} />
                      </span>
                      <p className="font-body text-2xl mb-2" style={{ color: "var(--color-ink-deep)" }}>
                        {t.contact.successTitle}{activeForm.name ? `, ${activeForm.name.split(" ")[0]}` : ""}
                      </p>
                      <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-ink-soft)" }}>
                        {t.contact.successBody}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      noValidate
                      className="flex flex-col gap-4"
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {[
                        { key: "name", label: t.contact.nameLabel, type: "text", placeholder: t.contact.namePlaceholder, required: true },
                        { key: "email", label: t.contact.emailLabel, type: "email", placeholder: t.contact.emailPlaceholder, required: true },
                        { key: "service", label: t.contact.serviceLabel, type: "text", placeholder: t.contact.servicePlaceholder, required: false },
                      ].map((field) => {
                        const err = errors[field.key as "name" | "email"]
                        return (
                          <div key={field.key}>
                            <label
                              htmlFor={`contact-${field.key}`}
                              className="block text-xs font-semibold mb-1.5"
                              style={{ color: "var(--color-ink-soft)" }}
                            >
                              {field.label}
                            </label>
                            <input
                              id={`contact-${field.key}`}
                              type={field.type}
                              required={field.required}
                              placeholder={field.placeholder}
                              value={activeForm[field.key as keyof typeof activeForm]}
                              aria-invalid={err ? true : undefined}
                              aria-describedby={err ? `contact-${field.key}-error` : undefined}
                              onChange={(e) => {
                                setActiveForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                                if (field.key === "name" || field.key === "email") {
                                  setErrors((prev) => ({ ...prev, [field.key]: undefined }))
                                }
                              }}
                              className={`field-input w-full px-4 py-3 rounded-xl text-sm outline-none${err ? " field-input--error" : ""}`}
                              style={{ background: "var(--color-paper)", color: "var(--color-ink-deep)" }}
                            />
                            {err && (
                              <p
                                id={`contact-${field.key}-error`}
                                className="mt-1.5 text-xs"
                                style={{ color: "var(--color-wine-deep)" }}
                              >
                                {err}
                              </p>
                            )}
                          </div>
                        )
                      })}
                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-semibold mb-1.5"
                          style={{ color: "var(--color-ink-soft)" }}
                        >
                          {t.contact.messageLabel}
                        </label>
                        <textarea
                          id="contact-message"
                          rows={3}
                          placeholder={t.contact.messagePlaceholder}
                          value={activeForm.message}
                          onChange={(e) => setActiveForm((prev) => ({ ...prev, message: e.target.value }))}
                          className="field-input w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                          style={{ background: "var(--color-paper)", color: "var(--color-ink-deep)" }}
                        />
                      </div>
                      {/* The one true conversion control — the highest-contrast
                          element in the panel so it never reads as another input
                          field. Shows real pending feedback while submitting. */}
                      <MagneticButton
                        as="button"
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                        className="w-full py-4 rounded-lg font-semibold text-sm mt-3 inline-flex items-center justify-center gap-2 disabled:cursor-progress"
                        style={{
                          background: "var(--color-wine)",
                          color: "#fff",
                          boxShadow: "0 12px 28px -12px rgba(184,48,92,0.55)",
                          opacity: submitting ? 0.85 : 1,
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {submitting && (
                          <svg
                            className="animate-spin motion-reduce:animate-none"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.35" strokeWidth="3" />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        )}
                        {submitting ? t.contact.submitting : t.contact.submit}
                      </MagneticButton>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </motion.section>
  )
}

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useState, type FormEvent } from "react"
import { useSection } from "@/hooks/useSection"
import { useHCaptcha } from "@/hooks/useHCaptcha"
import { useIsMobile } from "@/hooks/useIsMobile"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"
import { CheckIcon } from "@/components/icons"
import { sendContactForm } from "@/lib/contact"
import { useLang } from "@/i18n/language"
import type { Content } from "@/i18n/translations"

/** hCaptcha sitekey — present only when hCaptcha is turned on in the Web3Forms
 *  dashboard. When unset, the widget and its check are skipped entirely. */
const HCAPTCHA_SITEKEY = import.meta.env.VITE_HCAPTCHA_SITEKEY

type FieldKey = "name" | "email" | "service" | "message"
type FieldErrors = Partial<Record<FieldKey, string>>

/** Deliberately permissive: one @, a dot in the domain, no spaces. Enough to
 *  catch typos without rejecting valid-but-unusual addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The rule for a single field. Returns the message to show, or undefined when
 *  the value is acceptable. `service` is the only optional field. */
function fieldError(key: FieldKey, raw: string, c: Content["contact"]): string | undefined {
  const v = raw.trim()
  if (key === "service") return undefined
  if (!v) return key === "name" ? c.errName : key === "email" ? c.errEmailReq : c.errMessage
  if (key === "email" && !EMAIL_RE.test(v)) return c.errEmailInvalid
  if (key === "message" && v.length < 10) return c.errMessageShort
  return undefined
}

const ORDER: FieldKey[] = ["name", "email", "service", "message"]

export function Testimonials() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const { t } = useLang()
  const [activeForm, setActiveForm] = useState({
    name: "", email: "", service: "", message: "", botcheck: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sendFailed, setSendFailed] = useState(false)
  const [captchaError, setCaptchaError] = useState(false)
  // The normal hCaptcha checkbox is a fixed ~303px — wider than the form panel
  // on a phone — so anything under the `sm` breakpoint gets the compact widget.
  const narrow = useIsMobile("(max-width: 639px)")

  const {
    containerRef: captchaRef,
    token: captchaToken,
    reset: resetCaptcha,
    enabled: captchaEnabled,
  } = useHCaptcha(HCAPTCHA_SITEKEY, narrow ? "compact" : "normal")

  // Update a field's value, and — once it's been blurred at least once — keep
  // its error message live so fixing a mistake clears it as you type.
  const setField = (key: FieldKey, value: string) => {
    setActiveForm((prev) => ({ ...prev, [key]: value }))
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: fieldError(key, value, t.contact) }))
  }

  const handleBlur = (key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, activeForm[key], t.contact) }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const found: FieldErrors = {}
    for (const k of ORDER) {
      const msg = fieldError(k, activeForm[k], t.contact)
      if (msg) found[k] = msg
    }
    setErrors(found)
    setTouched({ name: true, email: true, service: true, message: true })

    const firstBad = ORDER.find((k) => found[k])
    if (firstBad) {
      document.getElementById(`contact-${firstBad}`)?.focus()
      return
    }

    if (captchaEnabled && !captchaToken) {
      setCaptchaError(true)
      return
    }
    setCaptchaError(false)

    setSendFailed(false)
    setSubmitting(true)
    try {
      await sendContactForm({ ...activeForm, hcaptcha: captchaToken })
      setSubmitted(true)
    } catch (err) {
      console.error("Contact form submission failed:", err)
      setSendFailed(true)
    } finally {
      setSubmitting(false)
      resetCaptcha() // hCaptcha tokens are single-use — force a fresh one per attempt
    }
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
              <span className="shrink-0" style={{ color: "var(--color-wine)" }}>
                <CheckIcon size={13} />
              </span>
              {p}
            </span>
          ))}
        </motion.div>

        {/* CTA + Contact form */}
        <motion.div
          id="contact"
          className="surface rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <div className="relative p-6 sm:p-10 md:p-16">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[90px] pointer-events-none"
              style={{ background: "var(--color-blush)", opacity: 0.35 }}
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="min-w-0">
                <h2
                  className="section-title mb-5"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)" }}
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
              <div className="surface-2 min-w-0 rounded-2xl p-5 sm:p-7" style={{ border: "1px solid var(--color-line-ink)" }}>
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
                      onSubmit={(e) => void handleSubmit(e)}
                      noValidate
                      className="flex flex-col gap-4"
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {([
                        { key: "name", label: t.contact.nameLabel, type: "text", autoComplete: "name", placeholder: t.contact.namePlaceholder, multiline: false, required: true },
                        { key: "email", label: t.contact.emailLabel, type: "email", autoComplete: "email", placeholder: t.contact.emailPlaceholder, multiline: false, required: true },
                        { key: "service", label: t.contact.serviceLabel, type: "text", autoComplete: "off", placeholder: t.contact.servicePlaceholder, multiline: false, required: false },
                        { key: "message", label: t.contact.messageLabel, type: "text", autoComplete: "off", placeholder: t.contact.messagePlaceholder, multiline: true, required: true },
                      ] as const).map((field) => {
                        const err = errors[field.key]
                        const id = `contact-${field.key}`
                        const shared = {
                          id,
                          placeholder: field.placeholder,
                          value: activeForm[field.key],
                          required: field.required,
                          "aria-required": field.required || undefined,
                          "aria-invalid": err ? (true as const) : undefined,
                          "aria-describedby": err ? `${id}-error` : undefined,
                          onChange: (e: { target: { value: string } }) => setField(field.key, e.target.value),
                          onBlur: () => handleBlur(field.key),
                          className: `field-input w-full px-4 py-3 rounded-xl text-base sm:text-sm outline-none${field.multiline ? " resize-none" : ""}${err ? " field-input--error" : ""}`,
                          style: { background: "var(--color-paper)", color: "var(--color-ink-deep)" },
                        }
                        return (
                          <div key={field.key}>
                            <label htmlFor={id} className="flex items-baseline gap-2 text-xs font-semibold mb-1.5" style={{ color: "var(--color-ink-soft)" }}>
                              {field.label}
                              {!field.required && (
                                <span className="font-normal" style={{ opacity: 0.7 }}>
                                  {t.contact.optional}
                                </span>
                              )}
                            </label>
                            {field.multiline ? (
                              <textarea rows={3} {...shared} className={`${shared.className} min-h-[7.5rem] sm:min-h-0`} />
                            ) : (
                              <input type={field.type} autoComplete={field.autoComplete} {...shared} />
                            )}
                            {err && (
                              <p id={`${id}-error`} className="mt-1.5 text-xs" style={{ color: "var(--color-wine-deep)" }}>
                                {err}
                              </p>
                            )}
                          </div>
                        )
                      })}

                      {/* Honeypot — off-screen, unlabelled, never tab-reachable.
                          Web3Forms drops any submission where `botcheck` is filled. */}
                      <input
                        type="checkbox"
                        name="botcheck"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        checked={activeForm.botcheck !== ""}
                        onChange={(e) => setActiveForm((prev) => ({ ...prev, botcheck: e.target.checked ? "1" : "" }))}
                        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                      />

                      {/* hCaptcha — only mounts when VITE_HCAPTCHA_SITEKEY is set,
                          which must line up with the Web3Forms dashboard toggle. */}
                      {captchaEnabled && (
                        <div>
                          <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>
                            {t.contact.captchaLabel}
                          </span>
                          {/* The widget itself is a fixed-size iframe we can't restyle,
                              so it sits centred in a field-shaped shell that carries the
                              same border, radius and paper tone as the inputs above. */}
                          <div
                            className="field-input flex justify-center rounded-xl px-3 py-3"
                            style={{ background: "var(--color-paper)" }}
                          >
                            <div ref={captchaRef} />
                          </div>
                          {captchaError && (
                            <p role="alert" className="mt-1.5 text-xs" style={{ color: "var(--color-wine-deep)" }}>
                              {t.contact.errCaptcha}
                            </p>
                          )}
                        </div>
                      )}

                      {sendFailed && (
                        <p role="alert" className="text-xs leading-relaxed" style={{ color: "var(--color-wine-deep)" }}>
                          {t.contact.errSend}
                        </p>
                      )}

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
    </motion.section>
  )
}

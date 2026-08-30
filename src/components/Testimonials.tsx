import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useState, type FormEvent } from "react"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"
import { SilkBackground } from "@/components/Silk"
import { CheckIcon } from "@/components/icons"
import { useLang } from "@/i18n/language"

export function Testimonials() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const { t, lang } = useLang()
  // Serve the language-matched legal stub (…de.html for German, …html for English).
  const legalSuffix = lang === "de" ? ".de.html" : ".html"
  const [activeForm, setActiveForm] = useState<{ name: string; email: string; service: string; message: string }>({
    name: "", email: "", service: "", message: "",
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
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
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitted(true)
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
      <SilkBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="kicker mb-3">{t.why.kicker}</span>
          <h2
            className="font-serif leading-[1.05] mb-5"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
          >
            {t.why.heading}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            {t.why.subtext}
          </p>
        </motion.div>

        {/* Honest reasons — no fabricated social proof. */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {t.why.reasons.map((r, i) => (
            <motion.div
              key={r.n}
              className="surface rounded-3xl p-8 flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 * i }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div
                className="font-serif font-semibold mb-5 tabular-nums"
                style={{ fontSize: "1.6rem", lineHeight: 1, color: "var(--color-wine)" }}
              >
                {r.n}
              </div>
              <h3 className="font-serif text-xl mb-3" style={{ color: "var(--color-ink-deep)" }}>
                {r.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-wrap gap-3 mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t.why.proofPoints.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
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
                <span className="kicker mb-4">{t.contact.kicker}</span>
                <h2
                  className="font-serif leading-[1.05] mb-5"
                  style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
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
                      <p className="font-serif text-2xl mb-2" style={{ color: "var(--color-ink-deep)" }}>
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
                      <MagneticButton
                        as="button"
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-semibold text-sm mt-1"
                        style={{ background: "var(--color-wine)", color: "#fff" }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {t.contact.submit}
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--color-line-ink)" }}>
        <span className="font-display text-lg tracking-tight" style={{ color: "var(--color-ink-deep)" }}>
          Godinez <span style={{ color: "var(--color-wine)" }}>&amp; Wittwer</span>
        </span>
        <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
          {t.footer.copyright}
        </p>
        <div className="flex gap-6">
          {[
            { label: t.footer.privacy, href: `/privacy${legalSuffix}` },
            { label: t.footer.terms, href: `/terms${legalSuffix}` },
            { label: t.footer.contact, href: "#contact" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs transition-colors"
              style={{ color: "var(--color-ink-soft)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-wine)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink-soft)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useState, type FormEvent } from "react"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"
import { SilkBackground } from "@/components/Silk"
import { CheckIcon, StarIcon } from "@/components/icons"

const testimonials = [
  {
    quote: "My Fiverr impressions doubled in three weeks. The page PageCraft built is genuinely the best investment I made as a seller.",
    name: "Sofia Reyes",
    role: "Top Rated Seller · Graphic Design",
    rating: 5,
  },
  {
    quote: "I went from 2–3 orders a month to fully booked within 30 days of launching my new page. The copy alone was worth every cent.",
    name: "Marcus Obi",
    role: "Pro Seller · Video Editing",
    rating: 5,
  },
  {
    quote: "Clean, fast, and actually converts. I've worked with three other page designers before — PageCraft is on another level.",
    name: "Yuki Tanaka",
    role: "Level 2 Seller · SEO Services",
    rating: 5,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-4" role="img" aria-label={`Rated ${n} out of 5`} style={{ color: "var(--color-wine)" }}>
      {Array.from({ length: n }).map((_, j) => (
        <StarIcon key={j} />
      ))}
    </div>
  )
}

export function Testimonials() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const [activeForm, setActiveForm] = useState<{ name: string; email: string; service: string; message: string }>({
    name: "", email: "", service: "", message: "",
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const next: { name?: string; email?: string } = {}
    if (!activeForm.name.trim()) next.name = "Please enter your name."
    if (!activeForm.email.trim()) next.email = "Please enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(activeForm.email)) next.email = "That email address doesn't look right."
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitted(true)
  }

  const [lead, ...rest] = testimonials

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
          className="mb-14 max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="kicker mb-3">Client results</span>
          <h2
            className="font-serif leading-[1.05]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
          >
            Heard from real sellers
          </h2>
        </motion.div>

        {/* Quote-led wall: one lead quote, two supporting. */}
        <div className="grid lg:grid-cols-5 gap-6 mb-24">
          <motion.figure
            className="surface rounded-3xl p-9 md:p-11 lg:col-span-3 flex flex-col justify-between"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div>
              <Stars n={lead.rating} />
              <blockquote
                className="font-serif leading-snug mb-8"
                style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", color: "var(--color-ink-deep)", textWrap: "pretty" }}
              >
                “{lead.quote}”
              </blockquote>
            </div>
            <figcaption>
              <p className="text-sm font-semibold" style={{ color: "var(--color-ink-deep)" }}>
                {lead.name}
              </p>
              <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                {lead.role}
              </p>
            </figcaption>
          </motion.figure>

          <div className="lg:col-span-2 flex flex-col gap-6">
            {rest.map((t, i) => (
              <motion.figure
                key={t.name}
                className="surface surface-2 rounded-3xl p-7 flex-1 flex flex-col justify-between"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.12 * (i + 1) }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <blockquote
                  className="text-base leading-relaxed mb-5"
                  style={{ color: "var(--color-ink-deep)", textWrap: "pretty" }}
                >
                  “{t.quote}”
                </blockquote>
                <figcaption>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-ink-deep)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                    {t.role}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

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
                <span className="kicker mb-4">Start today</span>
                <h2
                  className="font-serif leading-[1.05] mb-5"
                  style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
                >
                  Ready to build a page that actually works?
                </h2>
                <p className="text-base leading-relaxed max-w-[46ch]" style={{ color: "var(--color-ink-soft)" }}>
                  Tell us about your Fiverr gig and we'll come back within 24 hours with
                  a strategy and a clear quote.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  {["Free initial consultation", "Clear pricing — no surprises", "Delivery within 2–5 days"].map((p) => (
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
                        Brief received{activeForm.name ? `, ${activeForm.name.split(" ")[0]}` : ""}
                      </p>
                      <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-ink-soft)" }}>
                        We'll review your gig and reply with a strategy and quote within 24 hours.
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
                        { key: "name", label: "Your name", type: "text", placeholder: "Sofia Reyes", required: true },
                        { key: "email", label: "Email address", type: "email", placeholder: "sofia@email.com", required: true },
                        { key: "service", label: "Fiverr category", type: "text", placeholder: "e.g. Logo Design, SEO, Writing", required: false },
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
                          Tell us about your gig
                        </label>
                        <textarea
                          id="contact-message"
                          rows={3}
                          placeholder="Briefly describe what you sell and your goal for the page…"
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
                        Send my brief →
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
          Page<span style={{ color: "var(--color-wine)" }}>Craft</span>
        </span>
        <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
          © 2026 PageCraft. All rights reserved.
        </p>
        <div className="flex gap-6">
          {[
            { label: "Privacy", href: "/privacy.html" },
            { label: "Terms", href: "/terms.html" },
            { label: "Contact", href: "#contact" },
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

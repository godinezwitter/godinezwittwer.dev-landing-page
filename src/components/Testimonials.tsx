import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"

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

export function Testimonials() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const [activeForm, setActiveForm] = useState<{ name: string; email: string; service: string; message: string }>({
    name: "", email: "", service: "", message: "",
  })

  return (
    <motion.section
      ref={ref}
      id="testimonials"
      className="relative py-28 overflow-hidden"
      style={{ background: "var(--color-void)" }}
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      {/* decorative depth orb */}
      <div
        className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full opacity-15 blur-[110px] pointer-events-none"
        style={{ background: "var(--color-blush)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Testimonials */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="label-mono mb-3">[ Client Results ]</p>
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "var(--color-ink)" }}
          >
            Heard from real sellers
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="lab-panel glass-taupe rounded-2xl p-7"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} style={{ color: "var(--color-rose)" }}>★</span>
                ))}
              </div>
              <p
                className="text-base leading-relaxed mb-6 font-display italic"
                style={{ color: "var(--color-ink)" }}
              >
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA + Contact form */}
        <motion.div
          id="contact"
          className="lab-panel rounded-3xl overflow-hidden"
          style={{ background: "var(--color-void-light)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative p-10 md:p-16">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15 blur-[80px] pointer-events-none"
              style={{ background: "var(--color-wine)" }}
            />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="label-mono mb-4">[ Start Today ]</p>
                <h2
                  className="font-display leading-tight mb-5"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--color-ink)" }}
                >
                  Ready to build a page that actually works?
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                  Tell us about your Fiverr gig and we'll come back within 24 hours with
                  a strategy and a clear quote.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  {["Free initial consultation", "Clear pricing — no surprises", "Delivery within 2–5 days"].map((p) => (
                    <div key={p} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
                      >
                        ✓
                      </span>
                      <span className="text-base" style={{ color: "var(--color-ink-muted)" }}>
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="glass rounded-2xl p-7">
                <div className="flex flex-col gap-4">
                  {[
                    { key: "name", label: "Your Name", type: "text", placeholder: "Sofia Reyes" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "sofia@email.com" },
                    { key: "service", label: "Fiverr Category", type: "text", placeholder: "e.g. Logo Design, SEO, Writing" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-ink-muted)" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={activeForm[field.key as keyof typeof activeForm]}
                        onChange={(e) => setActiveForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "var(--color-ink-muted)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-rose)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-ink-muted)" }}>
                      Tell Us About Your Gig
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe what you sell and your goal for the page…"
                      value={activeForm.message}
                      onChange={(e) => setActiveForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "var(--color-ink-muted)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--color-rose)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                    />
                  </div>
                  <MagneticButton
                    as="button"
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-semibold text-sm mt-1"
                    style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
                    whileHover={{ scale: 1.02 }}
                  >
                    Send My Brief →
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--color-line)" }}>
        <span className="font-display text-lg" style={{ color: "var(--color-ink)" }}>
          Page<span style={{ color: "var(--color-rose)" }}>Craft</span>
        </span>
        <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
          © 2026 PageCraft. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs transition-colors"
              style={{ color: "var(--color-ink-muted)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e0567f")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#9b98a8")}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

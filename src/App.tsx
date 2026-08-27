import { useRef, useState, useEffect } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  easeOut,
} from "framer-motion"
import heroPortfolio1 from "@/imports/78cb4ddb73065348eb902584821acd94.jpg"
import heroPortfolio2 from "@/imports/0569e0ae4f0c254626ea1e061e84132a.jpg"
import heroPortfolio3 from "@/imports/e627535f5235de08f6fd1340b45b5ee7.jpg"

/* ─── fade-up entrance variant ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: easeOut },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function useSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  return { ref, inView }
}

/* ─── Animated counter ──────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / 60
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Nav ────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])
  const links = ["Services", "Process", "Work", "Testimonials", "Contact"]
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="font-display text-xl tracking-tight"
          style={{ color: scrolled ? "#ada49a" : "#ada49a" }}
          whileHover={{ scale: 1.02 }}
        >
          Page<span style={{ color: "#828e73" }}>Craft</span>
        </motion.div>

        {/* desktop links */}
        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <motion.a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm font-medium tracking-wide transition-colors"
              style={{ color: "rgba(173,164,154,0.85)" }}
              whileHover={{ color: "#828e73", y: -1 }}
            >
              {l}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          className="hidden md:block text-sm font-semibold px-5 py-2 rounded-full transition-all"
          style={{ background: "#828e73", color: "#fff" }}
          whileHover={{ scale: 1.05, background: "#6e7a61" }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
        </motion.a>

        {/* hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[2px] w-6 rounded-full"
              style={{ background: "#ada49a" }}
              animate={
                menuOpen
                  ? i === 1
                    ? { opacity: 0, x: 10 }
                    : i === 0
                    ? { rotate: 45, y: 7 }
                    : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1, x: 0 }
              }
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-dark overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="text-sm font-medium"
                  style={{ color: "#ada49a" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {l}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ─── 1. HERO ────────────────────────────────────────────────────────────── */
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 160])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-0 w-full h-[110%]"
          style={{
            background: `
              linear-gradient(135deg, #252640 0%, #3b3d66 35%, #2d3d2e 65%, #1a1a2e 100%)
            `,
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "256px",
          }}
        />
        {/* Radial glow spots */}
        <div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "#828e73" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "#ada49a" }}
        />
      </motion.div>

      {/* Floating background shapes */}
      {[
        { top: "15%", left: "8%", size: 240, delay: 0 },
        { top: "60%", right: "6%", size: 180, delay: 1.5 },
        { top: "40%", left: "50%", size: 120, delay: 0.8 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl glass pointer-events-none"
          style={{
            top: s.top,
            left: (s as any).left,
            right: (s as any).right,
            width: s.size,
            height: s.size,
            rotate: i * 15 - 10,
          }}
          animate={{ rotate: [i * 15 - 10, i * 15 + 5, i * 15 - 10], y: [0, -18, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full"
        style={{ opacity }}
        ref={containerRef}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#828e73" }}
              />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#ada49a" }}>
                Fiverr Landing Page Specialists
              </span>
            </motion.div>

            <motion.h1
              className="font-display leading-[1.05] mb-6"
              style={{ color: "#ada49a", fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: easeOut }}
            >
              We Build Pages
              <br />
              <em style={{ color: "#828e73" }}>That Convert</em>
              <br />
              Clicks to Clients
            </motion.h1>

            <motion.p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(173,164,154,0.7)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Premium landing page design for Fiverr sellers and buyers. We craft high-converting
              pages that turn traffic into revenue — fast, strategic, and cinematic.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.a
                href="#contact"
                className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all"
                style={{ background: "#828e73", color: "#fff" }}
                whileHover={{ scale: 1.05, background: "#6e7a61" }}
                whileTap={{ scale: 0.97 }}
              >
                Start Your Project →
              </motion.a>
              <motion.a
                href="#work"
                className="px-8 py-3.5 rounded-full font-medium text-sm glass transition-all"
                style={{ color: "#ada49a" }}
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.97 }}
              >
                See Our Work
              </motion.a>
            </motion.div>
          </div>

          {/* Right: glass stats card */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <div className="glass-dark rounded-3xl p-8 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl"
                style={{ background: "#828e73" }}
              />
              <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#828e73" }}>
                Proven Results
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { n: 340, suf: "+", label: "Pages Delivered" },
                  { n: 98, suf: "%", label: "Client Satisfaction" },
                  { n: 4, suf: ".9★", label: "Fiverr Rating" },
                  { n: 2, suf: "–5 Days", label: "Turnaround" },
                ].map(({ n, suf, label }) => (
                  <div key={label}>
                    <div
                      className="font-display text-3xl font-bold mb-1"
                      style={{ color: "#ada49a" }}
                    >
                      <Counter to={n} suffix={suf} />
                    </div>
                    <div className="text-xs" style={{ color: "rgba(173,164,154,0.55)" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex -space-x-3">
                {["bg-indigo-400", "bg-sage-400", "bg-taupe-400", "bg-indigo-300"].map((_c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 overflow-hidden"
                    style={{
                      borderColor: "rgba(255,255,255,0.15)",
                      background: ["#5557a0", "#828e73", "#ada49a", "#3b3d66"][i],
                    }}
                  />
                ))}
                <div
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-medium"
                  style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ada49a",
                  }}
                >
                  +40
                </div>
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(173,164,154,0.5)" }}>
                Happy clients this month
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-px h-12 rounded-full"
            style={{ background: "linear-gradient(to bottom, #828e73, transparent)" }}
            animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(173,164,154,0.4)" }}>
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ─── 2. ABOUT / WHY US ─────────────────────────────────────────────────── */
function About() {
  const { ref, inView } = useSection()
  return (
    <section
      ref={ref}
      id="services"
      className="relative py-28 overflow-hidden"
      style={{ background: "#ada49a" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: "#828e73" }}
            >
              Why PageCraft
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "#3b3d66" }}
            >
              Your Fiverr listing deserves a page as sharp as your skills
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base leading-relaxed mb-8"
              style={{ color: "#5a504a" }}
            >
              Most Fiverr buyers scroll past forgettable pages in seconds. We craft landing pages
              that stop the scroll — combining conversion psychology, high-end design, and
              persuasive copy into pages that consistently outperform.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              {[
                "Conversion-first design rooted in buyer psychology",
                "SEO-optimized copy that ranks and resonates",
                "A/B-tested layouts for maximum ROI",
                "Mobile-perfect across every device",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: "#828e73", color: "#fff" }}
                  >
                    ✓
                  </span>
                  <span className="text-sm" style={{ color: "#3b3d66" }}>
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: glassmorphism metric cards */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { stat: 3, suf: "×", label: "Higher Click-Through Rate", desc: "vs. standard Fiverr pages" },
              { stat: 67, suf: "%", label: "More Conversions", desc: "from optimised page structure" },
              { stat: 340, suf: "+", label: "Pages Live", desc: "across 15+ industries" },
              { stat: 5, suf: " Days", label: "Avg. Delivery Time", desc: "from brief to live" },
            ].map(({ stat, suf, label, desc }, i) => (
              <motion.div
                key={label}
                className="glass-taupe rounded-2xl p-6"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              >
                <div
                  className="font-display text-4xl font-bold mb-2"
                  style={{ color: "#3b3d66" }}
                >
                  <Counter to={stat} suffix={suf} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#3b3d66" }}>
                  {label}
                </p>
                <p className="text-xs" style={{ color: "#5a504a" }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── 3. SERVICES ─────────────────────────────────────────────────────────── */
const services = [
  {
    icon: "⬡",
    title: "Landing Page Design",
    desc: "Pixel-perfect, brand-consistent pages that load fast and look stunning on every screen.",
    tags: ["UI/UX", "Responsive", "Figma"],
  },
  {
    icon: "◈",
    title: "Conversion Copywriting",
    desc: "Words that persuade. We write headlines, hooks, and CTAs that move buyers to click.",
    tags: ["SEO", "Psychology", "A/B tested"],
  },
  {
    icon: "◎",
    title: "Fiverr Gig Pages",
    desc: "Purpose-built for the Fiverr ecosystem — structured to rank higher and convert better.",
    tags: ["Fiverr SEO", "Social proof", "Trust signals"],
  },
  {
    icon: "⊕",
    title: "Full Funnel Build",
    desc: "From hero to thank-you page — complete funnel architecture for serious sellers.",
    tags: ["Multi-page", "Analytics", "Integration"],
  },
  {
    icon: "◉",
    title: "Page Refresh & Audit",
    desc: "Already have a page? We audit, redesign, and fix what's silently killing your conversions.",
    tags: ["Audit", "Optimisation", "CRO"],
  },
  {
    icon: "◇",
    title: "Brand Identity Add-on",
    desc: "Logo, color system, and typography kit — everything you need to look like a pro.",
    tags: ["Branding", "Logo", "Style guide"],
  },
]

function Services() {
  const { ref, inView } = useSection()
  return (
    <section
      ref={ref}
      id="services"
      className="relative py-28 overflow-hidden"
      style={{ background: "#3b3d66" }}
    >
      {/* background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "#828e73" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "#828e73" }}
          >
            What We Offer
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#ada49a" }}
          >
            Everything a winning page needs
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              custom={i * 0.05}
              className="glass rounded-2xl p-7 group cursor-default relative overflow-hidden"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(130,142,115,0.08) 0%, transparent 100%)",
                }}
              />
              <span
                className="text-3xl block mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ color: "#828e73" }}
              >
                {s.icon}
              </span>
              <h3
                className="font-display text-xl mb-3"
                style={{ color: "#ada49a" }}
              >
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(173,164,154,0.65)" }}>
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(130,142,115,0.15)",
                      color: "#828e73",
                      border: "1px solid rgba(130,142,115,0.2)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── 4. PROCESS ──────────────────────────────────────────────────────────── */
const steps = [
  {
    n: "01",
    title: "Discovery Call",
    desc: "We start with a focused 30-minute brief: your offer, audience, competitors, and goal. No fluff, all signal.",
  },
  {
    n: "02",
    title: "Strategy & Wireframe",
    desc: "We map the page architecture — above-the-fold, value stack, objection handling, CTA flow. Every section earns its place.",
  },
  {
    n: "03",
    title: "Design & Copywriting",
    desc: "Simultaneous design and copy sprints. Visual hierarchy, persuasive words, and brand consistency delivered together.",
  },
  {
    n: "04",
    title: "Review & Launch",
    desc: "Two revision rounds, final QA across devices, and hand-off with code or direct platform publishing.",
  },
]

function Process() {
  const { ref, inView } = useSection()
  return (
    <section
      ref={ref}
      id="process"
      className="relative py-28 overflow-hidden"
      style={{ background: "#c5bdb5" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#828e73" }}>
            How We Work
          </p>
          <h2
            className="font-display leading-tight max-w-lg"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#3b3d66" }}
          >
            From idea to live page — four clean steps
          </h2>
        </motion.div>

        <div className="relative">
          {/* connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-[2.75rem] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px"
            style={{ background: "linear-gradient(to right, transparent, #828e73, transparent)" }}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-lg font-bold mb-5 relative z-10"
                  style={{ background: "#3b3d66", color: "#ada49a" }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.n}
                </motion.div>
                <h3 className="font-display text-xl mb-3" style={{ color: "#3b3d66" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a504a" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantee strip */}
        <motion.div
          className="mt-20 glass-dark rounded-3xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <div>
            <p className="font-display text-2xl mb-1" style={{ color: "#ada49a" }}>
              100% Satisfaction Guarantee
            </p>
            <p className="text-sm" style={{ color: "rgba(173,164,154,0.6)" }}>
              Not happy after two revisions? You get a full refund — no questions asked.
            </p>
          </div>
          <motion.a
            href="#contact"
            className="shrink-0 px-7 py-3 rounded-full font-semibold text-sm"
            style={{ background: "#828e73", color: "#fff" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Claim Your Page →
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── 5. PORTFOLIO ───────────────────────────────────────────────────────── */
function Portfolio() {
  const { ref, inView } = useSection()
  const portfolioItems = [
    {
      img: heroPortfolio1,
      title: "GreenMotive",
      category: "Eco Tech",
      result: "+312% conversion",
    },
    {
      img: heroPortfolio2,
      title: "Helious",
      category: "Digital Nomad Platform",
      result: "+2.8× signups",
    },
    {
      img: heroPortfolio3,
      title: "Terrava",
      category: "Infrastructure SaaS",
      result: "+184% demo requests",
    },
  ]

  return (
    <section
      ref={ref}
      id="work"
      className="relative py-28 overflow-hidden"
      style={{ background: "#252640" }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(37,38,64,0) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#828e73" }}>
              Selected Work
            </p>
            <h2
              className="font-display leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#ada49a" }}
            >
              Pages that perform
            </h2>
          </div>
          <p className="text-sm max-w-xs" style={{ color: "rgba(173,164,154,0.55)" }}>
            Each project starts with a clear conversion goal and ends with measurable results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: "4/5" }}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * i }}
              whileHover="hovered"
            >
              {/* image */}
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
                variants={{ hovered: { scale: 1.06 } }}
                transition={{ duration: 0.5 }}
              />

              {/* gradient overlay always */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(37,38,64,0.9) 0%, transparent 50%)",
                }}
              />

              {/* hover tint */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(130,142,115,0.12)" }}
                initial={{ opacity: 0 }}
                variants={{ hovered: { opacity: 1 } }}
                transition={{ duration: 0.3 }}
              />

              {/* text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <motion.span
                  className="block text-xs font-medium tracking-widest uppercase mb-1"
                  style={{ color: "#828e73" }}
                >
                  {item.category}
                </motion.span>
                <h3 className="font-display text-xl mb-2" style={{ color: "#ada49a" }}>
                  {item.title}
                </h3>
                <motion.div
                  className="flex items-center gap-2 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  variants={{ hovered: { height: "auto", opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "rgba(130,142,115,0.25)", color: "#a3b090" }}
                  >
                    {item.result}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 6. TESTIMONIALS + CTA ──────────────────────────────────────────────── */
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

function Testimonials() {
  const { ref, inView } = useSection()
  const [activeForm, setActiveForm] = useState<{ name: string; email: string; service: string; message: string }>({
    name: "", email: "", service: "", message: "",
  })

  return (
    <section
      ref={ref}
      id="testimonials"
      className="relative py-28 overflow-hidden"
      style={{ background: "#ada49a" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Testimonials */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#828e73" }}>
            Client Results
          </p>
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#3b3d66" }}
          >
            Heard from real sellers
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass-taupe rounded-2xl p-7"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} style={{ color: "#828e73" }}>★</span>
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-6 font-display italic"
                style={{ color: "#3b3d66" }}
              >
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#3b3d66" }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "#5a504a" }}>
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA + Contact form */}
        <motion.div
          id="contact"
          className="rounded-3xl overflow-hidden"
          style={{ background: "#3b3d66" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative p-10 md:p-16">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-[80px] pointer-events-none"
              style={{ background: "#828e73" }}
            />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#828e73" }}>
                  Start Today
                </p>
                <h2
                  className="font-display leading-tight mb-5"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "#ada49a" }}
                >
                  Ready to build a page that actually works?
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(173,164,154,0.6)" }}>
                  Tell us about your Fiverr gig and we'll come back within 24 hours with
                  a strategy and a clear quote.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  {["Free initial consultation", "Clear pricing — no surprises", "Delivery within 2–5 days"].map((p) => (
                    <div key={p} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "#828e73", color: "#fff" }}
                      >
                        ✓
                      </span>
                      <span className="text-sm" style={{ color: "rgba(173,164,154,0.8)" }}>
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
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(173,164,154,0.7)" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={(activeForm as any)[field.key]}
                        onChange={(e) => setActiveForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#ada49a",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#828e73")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(173,164,154,0.7)" }}>
                      Tell Us About Your Gig
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe what you sell and your goal for the page…"
                      value={activeForm.message}
                      onChange={(e) => setActiveForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#ada49a",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#828e73")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                    />
                  </div>
                  <motion.button
                    className="w-full py-3.5 rounded-xl font-semibold text-sm mt-1"
                    style={{ background: "#828e73", color: "#fff" }}
                    whileHover={{ scale: 1.02, background: "#6e7a61" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Send My Brief →
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(59,61,102,0.15)" }}>
        <span className="font-display text-lg" style={{ color: "#3b3d66" }}>
          Page<span style={{ color: "#828e73" }}>Craft</span>
        </span>
        <p className="text-xs" style={{ color: "rgba(59,61,102,0.5)" }}>
          © 2026 PageCraft. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs transition-colors"
              style={{ color: "rgba(59,61,102,0.5)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#828e73")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(59,61,102,0.5)")}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="relative">
      <Nav />
      <Hero />
      <About />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
    </div>
  )
}

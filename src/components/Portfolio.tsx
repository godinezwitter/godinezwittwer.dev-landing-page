import { motion, useReducedMotion, type PanInfo } from "framer-motion"
import { useLayoutEffect, useRef, useState } from "react"
import { useSection } from "@/hooks/useSection"
import { useIsMobile } from "@/hooks/useIsMobile"
import { gsap } from "@/lib/gsap"
import { TiltCard } from "@/components/TiltCard"
import heroPortfolio1 from "@/imports/greenmotive-hero.webp"
import heroPortfolio2 from "@/imports/0569e0ae4f0c254626ea1e061e84132a.jpg"
import heroPortfolio3 from "@/imports/terrava-hero.webp"

const portfolioItems = [
  {
    img: heroPortfolio1,
    title: "GreenMotive",
    category: "Eco-tech · Landing page",
    tag: "Concept",
  },
  {
    img: heroPortfolio2,
    title: "Helious",
    category: "Editorial · Portfolio",
    tag: "Concept",
  },
  {
    img: heroPortfolio3,
    title: "Terrava",
    category: "SaaS · Marketing site",
    tag: "Concept",
  },
]

/** Pinned, scroll-scrubbed slide sequence — each project holds the viewport while the next one crossfades in underneath. */
function PinnedSlides() {
  const pinRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".portfolio-slide")
      if (slides.length < 2) return

      gsap.set(slides.slice(1), { autoAlpha: 0, scale: 0.96 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${(slides.length - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      })

      slides.forEach((slide, i) => {
        if (i === 0) return
        tl.to(slides[i - 1], { autoAlpha: 0, scale: 0.96, duration: 1 }, i - 1)
        tl.to(slide, { autoAlpha: 1, scale: 1, duration: 1 }, i - 1)
      })
    }, pinRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pinRef} className="relative w-full h-[100dvh] overflow-hidden">
      {portfolioItems.map((item) => (
        <div key={item.title} className="portfolio-slide absolute inset-0">
          <img src={item.img} alt={`${item.title} — ${item.category} landing page`} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(12,4,7,0.94) 0%, rgba(12,4,7,0.2) 45%, transparent 70%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 max-w-3xl">
            <span
              className="block text-xs font-semibold tracking-[0.16em] uppercase mb-2"
              style={{ color: "var(--color-rose)" }}
            >
              {item.category}
            </span>
            <h3 className="font-serif mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", color: "#fff" }}>
              {item.title}
            </h3>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
            >
              {item.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Static grid fallback for reduced-motion — no pinning, no scroll-scrub. */
function GridFallback() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {portfolioItems.map((item) => (
        <TiltCard
          key={item.title}
          className="group relative rounded-2xl overflow-hidden cursor-pointer"
          style={{ aspectRatio: "4/5" }}
          maxTilt={5}
          motionProps={{ whileHover: "hovered" }}
        >
          <motion.img
            src={item.img}
            alt={`${item.title} — ${item.category} landing page`}
            className="w-full h-full object-cover"
            variants={{ hovered: { scale: 1.06 } }}
            transition={{ duration: 0.5 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(12,4,7,0.92) 0%, transparent 55%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="block text-xs font-semibold tracking-[0.16em] uppercase mb-1" style={{ color: "var(--color-rose)" }}>
              {item.category}
            </span>
            <h3 className="font-serif text-2xl mb-2" style={{ color: "#fff" }}>
              {item.title}
            </h3>
            <span
              className="text-xs font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
            >
              {item.tag}
            </span>
          </div>
        </TiltCard>
      ))}
    </div>
  )
}

/** Mobile-native swipeable carousel — adapted from React Bits "Carousel" (drag + snap +
 *  spring + dot indicators), styled with the project cards. Replaces the heavy pinned
 *  scroll-scrub on phones, where GSAP pinning feels janky and isn't touch-native. */
function PortfolioCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [index, setIndex] = useState(0)
  const last = portfolioItems.length - 1

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const itemWidth = width * 0.84
  const gap = 14
  const offset = itemWidth + gap
  const sidePad = Math.max((width - itemWidth) / 2, 0)

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, last)))

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dir =
      info.offset.x < -40 || info.velocity.x < -500
        ? 1
        : info.offset.x > 40 || info.velocity.x > 500
          ? -1
          : 0
    if (dir !== 0) goTo(index + dir)
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap, paddingLeft: sidePad, paddingRight: sidePad }}
          drag="x"
          dragElastic={0.12}
          dragConstraints={{ left: -offset * last, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ x: -index * offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {portfolioItems.map((item, i) => (
            <motion.article
              key={item.title}
              className="relative shrink-0 rounded-2xl overflow-hidden"
              style={{ width: itemWidth, aspectRatio: "4/5" }}
              animate={{ scale: i === index ? 1 : 0.92, opacity: i === index ? 1 : 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <img
                src={item.img}
                alt={`${item.title} — ${item.category} landing page`}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(12,4,7,0.92) 0%, transparent 58%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="block text-xs font-semibold tracking-[0.16em] uppercase mb-1"
                  style={{ color: "var(--color-rose)" }}
                >
                  {item.category}
                </span>
                <h3 className="font-serif text-2xl mb-2" style={{ color: "#fff" }}>
                  {item.title}
                </h3>
                <span
                  className="inline-block text-xs font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
                >
                  {item.tag}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Dot indicators — active dot elongates in wine. */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {portfolioItems.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${item.title}`}
            aria-current={i === index}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 22 : 8,
              background: i === index ? "var(--color-wine)" : "var(--color-line-ink)",
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function Portfolio() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  return (
    <section id="work" ref={ref} className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-14">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="kicker mb-3">Selected work</span>
            <h2
              className="font-serif leading-[1.05]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
            >
              Proof of craft
            </h2>
          </div>
          <p className="text-base max-w-xs" style={{ color: "var(--color-ink-soft)" }}>
            Client work is just getting started — so here's what we've built to show range: concept
            pages designed and coded end to end.
          </p>
        </motion.div>
      </div>

      {reduce ? (
        <div className="relative max-w-7xl mx-auto px-6 pb-28">
          <GridFallback />
        </div>
      ) : isMobile ? (
        <div className="relative pb-20">
          <PortfolioCarousel />
        </div>
      ) : (
        <PinnedSlides />
      )}
    </section>
  )
}

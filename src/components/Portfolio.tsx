import { motion, useReducedMotion } from "framer-motion"
import { useLayoutEffect, useRef } from "react"
import { useSection } from "@/hooks/useSection"
import { gsap } from "@/lib/gsap"
import { TiltCard } from "@/components/TiltCard"
import heroPortfolio1 from "@/imports/78cb4ddb73065348eb902584821acd94.jpg"
import heroPortfolio2 from "@/imports/0569e0ae4f0c254626ea1e061e84132a.jpg"
import heroPortfolio3 from "@/imports/e627535f5235de08f6fd1340b45b5ee7.jpg"

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
          scrub: 1,
          anticipatePin: 1,
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
    <div ref={pinRef} className="relative w-full h-screen overflow-hidden">
      {portfolioItems.map((item) => (
        <div key={item.title} className="portfolio-slide absolute inset-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(37,38,64,0.92) 0%, transparent 55%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 max-w-3xl">
            <span
              className="block text-xs font-medium tracking-widest uppercase mb-2"
              style={{ color: "#b4c2a3" }}
            >
              {item.category}
            </span>
            <h3 className="font-display mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", color: "#ada49a" }}>
              {item.title}
            </h3>
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full"
              style={{ background: "rgba(130,142,115,0.3)", color: "#b4c2a3" }}
            >
              {item.result}
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
            alt={item.title}
            className="w-full h-full object-cover"
            variants={{ hovered: { scale: 1.06 } }}
            transition={{ duration: 0.5 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(37,38,64,0.9) 0%, transparent 50%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="block text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#b4c2a3" }}>
              {item.category}
            </span>
            <h3 className="font-display text-xl mb-2" style={{ color: "#ada49a" }}>
              {item.title}
            </h3>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(130,142,115,0.3)", color: "#b4c2a3" }}
            >
              {item.result}
            </span>
          </div>
        </TiltCard>
      ))}
    </div>
  )
}

export function Portfolio() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()

  return (
    <section id="work" ref={ref} className="relative overflow-hidden" style={{ background: "#252640" }}>
      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-14">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#b4c2a3" }}>
              Selected Work
            </p>
            <h2
              className="font-display leading-tight"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#ada49a" }}
            >
              Pages that perform
            </h2>
          </div>
          <p className="text-base max-w-xs" style={{ color: "#c8c0b8" }}>
            Each project starts with a clear conversion goal and ends with measurable results.
          </p>
        </motion.div>
      </div>

      {reduce ? (
        <div className="relative max-w-7xl mx-auto px-6 pb-28">
          <GridFallback />
        </div>
      ) : (
        <PinnedSlides />
      )}
    </section>
  )
}

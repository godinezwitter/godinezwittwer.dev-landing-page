import { motion, useReducedMotion } from "framer-motion"
import { useState, type KeyboardEvent } from "react"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { useLang } from "@/i18n/language"
import { TiltCard } from "@/components/TiltCard"
import CardSwap, { Card } from "@/components/CardSwap"
import heroPortfolio1 from "@/imports/greenmotive-hero.webp"
import heroPortfolio2 from "@/imports/0569e0ae4f0c254626ea1e061e84132a.jpg"
import heroPortfolio3 from "@/imports/terrava-hero.webp"

// Image and project name are language-independent; category + tag come from
// the dictionary (matched by index). `url` is each concept project's own
// live site — left undefined until it's actually deployed, at which point
// the card becomes a real link with no other changes needed.
const portfolioItems: { img: string; title: string; url?: string }[] = [
  { img: heroPortfolio1, title: "GreenMotive" },
  { img: heroPortfolio2, title: "Helious" },
  { img: heroPortfolio3, title: "Terrava" },
]

function openProject(url: string | undefined) {
  if (url) window.open(url, "_blank", "noopener,noreferrer")
}

function onProjectKeyDown(e: KeyboardEvent<HTMLDivElement>, url: string | undefined) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    openProject(url)
  }
}

type CardContentProps = {
  item: (typeof portfolioItems)[number]
  category: string
  tag: string
  comingSoon: string
}

/** Shared card face — a photo with a bottom gradient for legible title/tags, used both in the CardSwap stack and the reduced-motion grid fallback. */
function CardFace({ item, category, tag, comingSoon }: CardContentProps) {
  return (
    <>
      <img src={item.img} alt={`${item.title} — ${category}`} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(12,4,7,0.95) 0%, rgba(12,4,7,0.4) 50%, transparent 78%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-body text-xl mb-2.5" style={{ color: "#fff" }}>
          {item.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-[0.1em] px-3 py-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
          >
            {tag}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            {category}
          </span>
        </div>
        {!item.url && (
          <p className="text-[0.7rem] mt-2.5" style={{ color: "rgba(255,255,255,0.55)" }}>
            {comingSoon}
          </p>
        )}
      </div>
    </>
  )
}

/** Static grid fallback for reduced-motion — no auto-rotation, no pinning.
 * Only becomes a real, focusable control once a project has a live `url` —
 * an undeployed concept renders as plain (non-interactive) content instead
 * of a button that would announce itself to assistive tech and then do
 * nothing on activation. */
function GridFallback() {
  const { t } = useLang()
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {portfolioItems.map((item, i) => {
        const face = <CardFace item={item} category={t.work.categories[i]} tag={t.work.tag} comingSoon={t.work.comingSoon} />
        return (
          <TiltCard
            key={item.title}
            className="group relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: "4/5", boxShadow: "0 22px 48px -24px rgba(120,20,50,0.5)" }}
            maxTilt={5}
          >
            {item.url ? (
              <button
                type="button"
                className="absolute inset-0 w-full h-full text-left cursor-pointer"
                onClick={() => openProject(item.url)}
                aria-label={`${t.work.visit} — ${item.title}`}
              >
                {face}
              </button>
            ) : (
              <div className="absolute inset-0 w-full h-full">{face}</div>
            )}
          </TiltCard>
        )
      })}
    </div>
  )
}

/** The auto-rotating card stack, boxed in a reserved column so its drop/return animation never fights the page layout. */
function CardStack() {
  const { t } = useLang()
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* CardSwap.css scales the stack down below 768px, but this reserved
       * box doesn't shrink with it unless told to — match its breakpoint so
       * mobile doesn't carry a tall empty gap above the (now smaller) cards.
       * overflow-hidden contains the drop/return animation's ~1.25x-height
       * swing to this box instead of letting it paint over Testimonials
       * below — nothing else in the ancestor chain clips it. */}
      <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden">
        <CardSwap
          width={300}
          height={380}
          cardDistance={45}
          verticalDistance={50}
          delay={4500}
          pauseOnHover
          skewAmount={5}
          onActiveChange={setActive}
        >
          {portfolioItems.map((item, i) => (
            <Card
              key={item.title}
              role={item.url ? "link" : undefined}
              tabIndex={item.url ? 0 : undefined}
              aria-label={item.url ? `${t.work.visit} — ${item.title}` : undefined}
              style={{ cursor: item.url ? "pointer" : "default" }}
              onClick={() => openProject(item.url)}
              onKeyDown={(e) => onProjectKeyDown(e, item.url)}
            >
              <CardFace item={item} category={t.work.categories[i]} tag={t.work.tag} comingSoon={t.work.comingSoon} />
            </Card>
          ))}
        </CardSwap>
      </div>

      {/* Position indicator — without this, a visitor has no way to tell how
       * many projects exist or where they are short of waiting through the
       * full auto-rotation. */}
      <div className="flex items-center justify-center gap-2 mt-6" role="status" aria-label={`${active + 1} / ${portfolioItems.length}`}>
        {portfolioItems.map((item, i) => (
          <span
            key={item.title}
            aria-hidden="true"
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 22 : 8,
              background: i === active ? "var(--color-wine)" : "var(--color-line-ink)",
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
  const { t } = useLang()

  return (
    <motion.section
      ref={ref}
      id="work"
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <motion.p variants={fadeUp} className="kicker mb-4">
              {t.work.kicker}
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-6" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}>
              {t.work.heading}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed max-w-md" style={{ color: "var(--color-ink-soft)" }}>
              {t.work.subhead}
            </motion.p>
          </motion.div>

          {reduce ? <GridFallback /> : <CardStack />}
        </div>
      </div>
    </motion.section>
  )
}

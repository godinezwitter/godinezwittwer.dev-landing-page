import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState, type KeyboardEvent } from "react"
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
// live site — left undefined until it's actually deployed. Clicking a card
// always does something: opens the live site once `url` exists, or opens a
// larger preview of the concept in the meantime.
const portfolioItems: { img: string; title: string; url?: string }[] = [
  { img: heroPortfolio1, title: "GreenMotive" },
  { img: heroPortfolio2, title: "Helious" },
  { img: heroPortfolio3, title: "Terrava" },
]

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

/** Full-size preview shown when a card without a live `url` is clicked — the
 * concept still deserves a closer look even though there's nowhere to send
 * the click yet. Closes on backdrop click, its own button, or Escape. */
function ProjectLightbox({
  item,
  category,
  tag,
  comingSoon,
  closeLabel,
  onClose,
}: CardContentProps & { closeLabel: string; onClose: () => void }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: "rgba(12,4,7,0.85)", backdropFilter: "blur(8px)" }}
      initial={reduce ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 40px 90px -20px rgba(0,0,0,0.65)", aspectRatio: "4/5" }}
        initial={reduce ? undefined : { opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardFace item={item} category={category} tag={tag} comingSoon={comingSoon} />
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

/** Static grid fallback for reduced-motion — no auto-rotation, no pinning. Every card is a real, focusable button: it either opens the live site or the preview lightbox, so it's never a dead control. */
function GridFallback({ onOpen }: { onOpen: (i: number) => void }) {
  const { t } = useLang()
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {portfolioItems.map((item, i) => (
        <TiltCard
          key={item.title}
          className="group relative rounded-2xl overflow-hidden"
          style={{ aspectRatio: "4/5", boxShadow: "0 22px 48px -24px rgba(120,20,50,0.5)" }}
          maxTilt={5}
        >
          <button
            type="button"
            className="absolute inset-0 w-full h-full text-left cursor-pointer"
            onClick={() => onOpen(i)}
            aria-label={item.url ? `${t.work.visit} — ${item.title}` : `${t.work.preview} — ${item.title}`}
          >
            <CardFace item={item} category={t.work.categories[i]} tag={t.work.tag} comingSoon={t.work.comingSoon} />
          </button>
        </TiltCard>
      ))}
    </div>
  )
}

/** The auto-rotating card stack, boxed in a reserved column so its drop/return animation never fights the page layout. */
function CardStack({ onOpen }: { onOpen: (i: number) => void }) {
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
      <div className="relative w-full h-[440px] md:h-[580px] overflow-hidden">
        <CardSwap
          width={360}
          height={460}
          cardDistance={55}
          verticalDistance={60}
          delay={4500}
          pauseOnHover
          skewAmount={5}
          onActiveChange={setActive}
        >
          {portfolioItems.map((item, i) => (
            <Card
              key={item.title}
              role={item.url ? "link" : "button"}
              tabIndex={0}
              aria-label={item.url ? `${t.work.visit} — ${item.title}` : `${t.work.preview} — ${item.title}`}
              className="cursor-pointer"
              onClick={() => onOpen(i)}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onOpen(i)
                }
              }}
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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const openCard = (i: number) => {
    const item = portfolioItems[i]
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    } else {
      setPreviewIndex(i)
    }
  }

  const previewItem = previewIndex !== null ? portfolioItems[previewIndex] : null

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

          {reduce ? <GridFallback onOpen={openCard} /> : <CardStack onOpen={openCard} />}
        </div>
      </div>

      <AnimatePresence>
        {previewItem && (
          <ProjectLightbox
            item={previewItem}
            category={t.work.categories[portfolioItems.indexOf(previewItem)]}
            tag={t.work.tag}
            comingSoon={t.work.comingSoon}
            closeLabel={t.work.close}
            onClose={() => setPreviewIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  )
}

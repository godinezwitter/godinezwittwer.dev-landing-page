import { motion, useReducedMotion } from "framer-motion"
import { Fragment, useLayoutEffect, useRef, type CSSProperties } from "react"
import { useSection } from "@/hooks/useSection"
import { useIsMobile } from "@/hooks/useIsMobile"
import { gsap } from "@/lib/gsap"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { ServiceVisual } from "@/components/service-visuals"
import { navigate } from "@/router"
import { useLang } from "@/i18n/language"

type Variant = "accent" | "paper" | "dark"

// Per-card background treatment, matched by index. A diagonal rhythm of
// wine-gradient / paper / dark so no two identical cards sit adjacent, with the
// lead service (Landing page design) carried on the accent card.
const variants: Variant[] = ["accent", "paper", "dark", "paper", "accent", "dark"]

// The bloom that rises out of the bottom edge as the section takes over. The
// reference (neutomni) lifts a cold blue light; we keep it on-brand with the
// burgundy accent, and soft enough that ink type stays readable once it has
// filled. The radial ellipse anchored below the frame is the light source; the
// linear layer keeps the very bottom of the screen saturated as it arrives.
const BLOOM = [
  "radial-gradient(130% 82% at 50% 106%, rgba(224,86,127,0.46) 0%, rgba(224,86,127,0.26) 34%, rgba(224,86,127,0.09) 60%, transparent 82%)",
  "linear-gradient(to top, rgba(184,48,92,0.30) 0%, rgba(184,48,92,0.12) 32%, transparent 66%)",
].join(", ")

type VariantStyle = {
  card: CSSProperties
  lead: string
  tail: string
  action: string
}

const styles: Record<Variant, VariantStyle> = {
  paper: {
    card: {
      background: "var(--color-paper)",
      border: "1px solid var(--color-line-ink)",
      boxShadow: "0 1px 2px rgba(120,20,50,0.05), 0 22px 44px -28px var(--color-shadow-wine)",
    },
    lead: "var(--color-ink-deep)",
    tail: "var(--color-ink-soft)",
    action: "var(--color-ink-soft)",
  },
  accent: {
    card: {
      background: "linear-gradient(135deg, var(--color-wine) 0%, var(--color-wine-deep) 100%)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 22px 48px -24px rgba(120,20,50,0.6)",
    },
    lead: "#ffffff",
    tail: "rgba(255,255,255,0.72)",
    action: "rgba(255,255,255,0.75)",
  },
  dark: {
    card: {
      background: "linear-gradient(140deg, var(--color-void-lighter) 0%, var(--color-void) 78%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 22px 48px -24px rgba(120,20,50,0.5)",
    },
    lead: "var(--color-ink)",
    tail: "var(--color-ink-muted)",
    action: "var(--color-ink-muted)",
  },
}

type CardData = { title: string; desc: string }

/** One service card face. Shared by the scrubbed and reduced-motion paths so the
 * markup never drifts between them — only the wrapping element differs (a plain
 * <a> the GSAP timeline drives, or a motion.a with Framer variants). */
function CardBody({ item, i, cardAction }: { item: CardData; i: number; cardAction: string }) {
  const v = styles[variants[i]]
  // First word carries the strong tone, the rest the muted tone — the
  // reference's two-line title. Single-token titles (common in German) simply
  // render one strong line.
  const [leadWord, ...restWords] = item.title.split(" ")
  const tailText = restWords.join(" ")
  return (
    <>
      {/* Glossy object, bleeding off the right edge (clipped by the card). */}
      <div
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-[14%] w-[9.5rem] sm:w-[11.5rem] md:w-[13rem] transition-transform duration-500 group-hover:scale-[1.06]"
        aria-hidden="true"
      >
        <ServiceVisual index={i} className="w-full h-auto" />
      </div>

      <div className="relative z-10 max-w-[60%]">
        <h3 className="font-body font-semibold leading-[1.04]" style={{ fontSize: "clamp(1.45rem, 2.3vw, 2rem)", letterSpacing: "-0.02em" }}>
          <span className="block" style={{ color: v.lead }}>{leadWord}</span>
          {tailText && <span className="block" style={{ color: v.tail }}>{tailText}</span>}
        </h3>
        <p className="mt-3 text-sm leading-relaxed line-clamp-2" style={{ color: v.tail }}>
          {item.desc}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-3">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em]" style={{ color: v.action }}>
          {cardAction}
        </span>
      </div>
    </>
  )
}

const CARD_CLASS =
  "group relative flex h-full flex-col justify-between overflow-hidden rounded-lg p-7 md:p-8 min-h-[13.5rem] md:min-h-[15rem] transition-transform duration-300"

const QUOTE_SIZE = "clamp(2rem, 4.4vw, 3.4rem)"

/** Scroll-driven "what we offer" stage, modelled on the neutomni pre-pricing
 * sequence: a soft bloom rises out of the bottom edge and fills the frame, the
 * quote drifts through several levels of focus while it does, and then the
 * service cards fold up — tipped away from the viewer, hinging forward on their
 * own bottom edge as they rise into place. Everything is scrubbed, so it tracks
 * the scrollbar in both directions and freezes mid-air when you stop scrolling;
 * Lenis (SmoothScroll) makes the scrub glide.
 *
 * Desktop pins the stage and plays the whole sequence in place. Six cards plus a
 * display-size quote don't fit one pinned viewport, so there the quote is a layer
 * centred behind the grid, and the cards rise over it as they land.
 * Phones can't spare that much pinned height at all, so they run the same motion
 * unpinned, card by card, with the quote in the flow above the grid.
 * prefers-reduced-motion skips the rig entirely. */
export function Services() {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  if (reduce) return <ServicesStatic />
  return <ServicesMotion pinned={!isMobile} />
}

/** Original behaviour — kept as the reduced-motion / no-timeline path. */
function ServicesStatic() {
  const { ref, inView } = useSection()
  const { t } = useLang()

  return (
    <motion.section
      ref={ref}
      id="services"
      className="relative py-28"
      variants={wipeReveal}
      initial={false}
      animate={inView ? "visible" : "hidden"}
    >
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="section-title mx-auto max-w-3xl text-center" style={{ fontSize: QUOTE_SIZE }}>
            {t.services.quote}
          </h2>
        </div>

        <p className="kicker mb-3 block w-full text-center">{t.services.kicker}</p>

        <motion.div
          className="grid md:grid-cols-2 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {t.services.items.map((item, i) => (
            <motion.a
              key={i}
              href="/#contact"
              onClick={(e) => { e.preventDefault(); navigate("/#contact") }}
              aria-label={`${item.title} — ${t.services.cardAction}`}
              className={CARD_CLASS}
              style={styles[variants[i]].card}
              variants={fadeUp}
              custom={i * 0.05}
            >
              <CardBody item={item} i={i} cardAction={t.services.cardAction} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

function ServicesMotion({ pinned }: { pinned: boolean }) {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLHeadingElement>(null)
  const kickerRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const words = t.services.quote.split(" ")

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const bloom = bloomRef.current
    const quote = quoteRef.current
    const kicker = kickerRef.current
    if (!section || !stage || !bloom || !quote || !kicker) return

    const wordEls = Array.from(quote.querySelectorAll<HTMLElement>("[data-word]"))
    const cardEls = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    // context() scopes every tween and trigger created inside it, so revert()
    // tears the whole rig down — including the gsap.set() calls — when the
    // breakpoint flips this component between pinned and unpinned.
    const ctx = gsap.context(() => {
      // Cards wait below their slot, tipped away from the viewer and hinged on
      // their own bottom edge, so the reveal reads as a fold-up rather than a
      // slide. The pinned stage flies them in from off-screen; unpinned they only
      // travel the last stretch, since scrolling brings them up on its own.
      const lift = () => (pinned ? window.innerHeight * 0.62 : 150)

      gsap.set(bloom, { yPercent: 26, opacity: 0 })
      gsap.set(wordEls, { opacity: 0, yPercent: 55, filter: "blur(18px)" })
      gsap.set(kicker, { opacity: 0, y: 18 })
      gsap.set(cardEls, { opacity: 0, y: lift, rotationX: 62, transformOrigin: "50% 100%" })

      if (pinned) {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=2400",
            scrub: 1,
            pin: stage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(bloom, { yPercent: 0, opacity: 1, duration: 1.6, ease: "power2.out" })
          // Words rise out of a heavy blur and then stay sharp for the rest of
          // the sequence — the entrance is the only time the type is out of focus.
          .to(wordEls, { opacity: 1, yPercent: 0, filter: "blur(0px)", stagger: 0.16, duration: 1.1 }, "-=1.15")
          // The label lands first — it introduces the cards that follow it.
          .to(kicker, { opacity: 1, y: 0, duration: 0.7 }, "+=0.4")
          // The fold-up. Opacity leads the travel so a card is already solid by
          // the time it crosses the quote. Everything after this is placed off the
          // "cards" label rather than chained, so the beats stay put if one of the
          // durations is retuned.
          .addLabel("cards", "-=0.15")
          .to(cardEls, { opacity: 1, stagger: 0.14, duration: 0.6, ease: "power1.out" }, "cards")
          .to(cardEls, { y: 0, rotationX: 0, stagger: 0.14, duration: 1.8 }, "cards")
          // Once the cards are climbing over the quote it falls out of focus, so
          // what shows between them reads as a soft backdrop rather than type.
          .to(wordEls, { filter: "blur(12px)", stagger: 0.05, duration: 1, ease: "power1.inOut" }, "cards+=0.9")
          // Let the wash dissolve on the way out so the section hands back to the
          // paper world below without a hard colour seam.
          .to(bloom, { opacity: 0, duration: 0.9, ease: "power2.in" }, "cards+=2.55")
        return
      }

      // Unpinned: the same beats, hung off the section as it scrolls past.
      gsap.to(bloom, {
        yPercent: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 1 },
      })
      gsap.to(bloom, {
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: { trigger: section, start: "bottom 80%", end: "bottom 30%", scrub: 1 },
      })
      gsap.to(wordEls, {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: { trigger: quote, start: "top 90%", end: "top 45%", scrub: 1 },
      })
      gsap.to(kicker, {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        scrollTrigger: { trigger: kicker, start: "top 92%", end: "top 62%", scrub: 1 },
      })
      cardEls.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 95%", end: "top 55%", scrub: 1, invalidateOnRefresh: true },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [pinned, t.services.quote])

  // The quote sits in the flow on phones and, on desktop, in the dead centre of
  // the pinned stage — behind the cards, which rise over it and take the frame.
  const quoteBlock = (
    <div className={pinned ? "pointer-events-none absolute inset-0 z-10 flex items-center" : "mb-12"}>
      <div className={pinned ? "mx-auto w-full max-w-7xl px-6" : undefined}>
        <h2
          ref={quoteRef}
          className="section-title mx-auto max-w-3xl text-center"
          style={{ fontSize: QUOTE_SIZE }}
          aria-label={t.services.quote}
        >
          {words.map((word, i) => (
            <Fragment key={i}>
              <span data-word className="inline-block will-change-[filter,transform]" aria-hidden="true">
                {word}
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h2>
      </div>
    </div>
  )

  return (
    <section ref={sectionRef} id="services" className="relative">
      {/* overflow-x-clip (not overflow-hidden) keeps the wide bloom from adding a
          horizontal scrollbar while letting it bleed past the top/bottom edges
          and dissolve into the paper — overflow-hidden was slicing it off with a
          hard horizontal line just below the cards. */}
      <div
        ref={stageRef}
        className={`relative overflow-x-clip ${pinned ? "flex min-h-[100svh] items-center py-6" : "py-24"}`}
      >
        {/* Colour bloom, anchored to the bottom edge and rising as you scroll.
            No transform utilities here — GSAP owns this element's transform. */}
        <div
          ref={bloomRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[-25vw] h-[135%] w-[150vw]"
          style={{ background: BLOOM, filter: "blur(60px)" }}
        />

        {pinned ? quoteBlock : null}

        <div className="relative z-20 mx-auto w-full max-w-7xl px-6">
          {pinned ? null : quoteBlock}

          <p ref={kickerRef} className="kicker mb-3 block w-full text-center">
            {t.services.kicker}
          </p>

          {/* Shared vanishing point for the fold-up: one perspective on the grid,
              so the cards tip toward a single camera instead of six of their own. */}
          <div className="grid gap-5 md:grid-cols-2" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
            {t.services.items.map((item, i) => (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el }}
                className="will-change-transform"
              >
                <a
                  href="/#contact"
                  onClick={(e) => { e.preventDefault(); navigate("/#contact") }}
                  aria-label={`${item.title} — ${t.services.cardAction}`}
                  className={`${CARD_CLASS} hover:-translate-y-1.5`}
                  style={styles[variants[i]].card}
                >
                  <CardBody item={item} i={i} cardAction={t.services.cardAction} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

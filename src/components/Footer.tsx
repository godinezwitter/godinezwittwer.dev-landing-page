import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react"
import { scrollToTarget } from "@/components/SmoothScroll"
import { useLang } from "@/i18n/language"
import { navigate } from "@/router"
import { legalPath } from "@/legalRoutes"
import "./Footer.css"

/** Interactive dot field behind the footer — React Bits' DotGrid, trimmed to
 * what this block needs: a still grid that brightens and swells toward the
 * cursor. The unlit grid is painted once into an offscreen canvas and blitted
 * each frame, so a pointer pass only ever redraws the ~70 dots it touches.
 * Skipped for touch pointers and reduced motion, where there is no cursor to
 * follow and the field would just cost frames. */
function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host || reduce) return
    if (window.matchMedia("(hover: none)").matches) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const GAP = 28 // px between dot centres
    const DOT = 1.15 // unlit dot radius
    const REACH = 150 // how far the cursor's influence carries
    const TAU = Math.PI * 2

    let width = 0
    let height = 0
    let base: HTMLCanvasElement | null = null
    let px = -1e5
    let py = -1e5
    let strength = 0 // eased 0 to 1 as the pointer enters and leaves
    let target = 0
    let raf = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      if (base) ctx.drawImage(base, 0, 0, width, height)
      if (strength <= 0.01) return
      // Only the cells inside the cursor's reach are repainted — the rest of
      // the grid is already there from the blit above.
      const firstCell = (v: number) => Math.max(GAP / 2, Math.floor((v - GAP / 2) / GAP) * GAP + GAP / 2)
      const lastY = Math.min(height, py + REACH)
      const lastX = Math.min(width, px + REACH)
      for (let y = firstCell(py - REACH); y < lastY; y += GAP) {
        for (let x = firstCell(px - REACH); x < lastX; x += GAP) {
          const d = Math.hypot(x - px, y - py)
          if (d > REACH) continue
          const t = (1 - d / REACH) ** 2 * strength
          ctx.fillStyle = "rgba(245, 236, 233, " + (0.06 + t * 0.5) + ")"
          ctx.beginPath()
          ctx.arc(x, y, DOT + t * 1.1, 0, TAU)
          ctx.fill()
        }
      }
    }

    const tick = () => {
      strength += (target - strength) * 0.12
      render()
      if (target > 0 || strength > 0.01) {
        raf = requestAnimationFrame(tick)
      } else {
        strength = 0
        render() // settle on the unlit grid, then stop burning frames
        raf = 0
      }
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const build = () => {
      const rect = host.getBoundingClientRect()
      width = Math.round(rect.width)
      height = Math.round(rect.height)
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      base = document.createElement("canvas")
      base.width = canvas.width
      base.height = canvas.height
      const bctx = base.getContext("2d")
      if (!bctx) return
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.fillStyle = "rgba(245, 236, 233, 0.055)"
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          bctx.beginPath()
          bctx.arc(x, y, DOT, 0, TAU)
          bctx.fill()
        }
      }
      render()
    }

    const onMove = (e: globalThis.PointerEvent) => {
      const rect = host.getBoundingClientRect()
      px = e.clientX - rect.left
      py = e.clientY - rect.top
      target = 1
      start()
    }
    const onLeave = () => {
      target = 0
      start()
    }

    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)

    let resizeRaf = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(build)
    })
    observer.observe(host)
    build()

    return () => {
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
      observer.disconnect()
      cancelAnimationFrame(resizeRaf)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return <canvas ref={canvasRef} className="gw-footer__dots" aria-hidden="true" />
}

/** The oversized GW monogram. Hollow letterforms with a wine fill that exists
 * only inside a spotlight following the cursor; clicking it returns to the top
 * of the page. The spotlight is written straight to CSS custom properties
 * inside a rAF, so tracking the pointer never re-renders React. */
function Wordmark({ label }: { label: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const raf = useRef(0)

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el || e.pointerType === "touch") return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--gw-x", x + "px")
      el.style.setProperty("--gw-y", y + "px")
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      className="gw-mark"
      aria-label={label}
      title={label}
      onPointerMove={onMove}
      onClick={() => scrollToTarget(0)}
    >
      <span className="gw-mark__layer gw-mark__outline" aria-hidden="true">
        GW
      </span>
      <span className="gw-mark__layer gw-mark__fill" aria-hidden="true">
        GW
      </span>
    </button>
  )
}

type FooterLink = { label: string; href: string; external?: boolean }

/** One footer link. In-app paths are routed; mail and profile links leave. */
function Link({ link, className = "" }: { link: FooterLink; className?: string }) {
  const onClick = link.external
    ? undefined
    : (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        navigate(link.href)
      }

  return (
    <a
      href={link.href}
      onClick={onClick}
      className={"gw-link py-1.5 " + className}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
    >
      {link.label}
    </a>
  )
}

function Column({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="gw-footer__heading mb-4">{heading}</h2>
      <ul className="flex flex-col gap-0.5 text-[0.95rem]">{children}</ul>
    </div>
  )
}

/** Site footer — the single dark block that closes every page. The link columns
 * sit up top; the GW monogram anchors the bottom. Rendered once by App, below
 * the routed page, so it always spans the full viewport. */
export function Footer() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()

  const pages: FooterLink[] = [
    { label: t.nav.tabs.work, href: "/" },
    { label: t.nav.tabs.projects, href: "/projects" },
    { label: t.nav.tabs.about, href: "/about" },
  ]
  // The service names are already written and translated once, on the cards.
  const services: FooterLink[] = t.services.items.slice(0, 4).map((s) => ({ label: s.title, href: "/#services" }))
  const legal: FooterLink[] = [
    { label: t.footer.terms, href: legalPath("terms", lang) },
    { label: t.footer.privacy, href: legalPath("privacy", lang) },
    { label: t.footer.contact, href: "/#contact" },
  ]

  return (
    <motion.footer
      className="gw-footer"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <DotField />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-24 md:pb-14">
        {/* Link columns. The last one carries the calls to action and the small
            print, the way the reference footer stacks its final column. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,15rem)] lg:gap-x-10">
          <Column heading={t.footer.headings.pages}>
            {pages.map((l) => (
              <li key={l.label}>
                <Link link={l} />
              </li>
            ))}
          </Column>

          <Column heading={t.footer.headings.services}>
            {services.map((l) => (
              <li key={l.label}>
                <Link link={l} />
              </li>
            ))}
          </Column>

          <div className="lg:col-start-4">
            <Column heading={t.legal.kicker}>
              {legal.map((l) => (
                <li key={l.label}>
                  <Link link={l} />
                </li>
              ))}
            </Column>
          </div>
        </div>

        {/* The monogram alone closes the page. */}
        <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--color-line)" }}>
          <Wordmark label={t.footer.backToTop} />
        </div>
      </div>
    </motion.footer>
  )
}

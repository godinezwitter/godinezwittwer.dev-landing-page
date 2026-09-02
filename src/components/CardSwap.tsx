import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from "react"
import { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from "react"
import { gsap } from "@/lib/gsap"
import "./CardSwap.css"

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  customClass?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ""} ${rest.className ?? ""}`.trim()} />
))
Card.displayName = "Card"

type Slot = { x: number; y: number; z: number; zIndex: number }

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
})

const placeNow = (el: HTMLDivElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  })

type CardSwapProps = {
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  onCardClick?: (idx: number) => void
  /** Called with the index of whichever card is now front-and-center, right after each rotation (and once on mount) — lets a consumer render a position indicator without duplicating the rotation state. */
  onActiveChange?: (idx: number) => void
  skewAmount?: number
  easing?: "linear" | "elastic"
  children: ReactNode
  style?: CSSProperties
}

/** Auto-rotating 3D card stack (React Bits "CardSwap", adapted to TS + this
 * project's GSAP instance). The front card drops away and rejoins the back
 * of the stack on a timer; every other card advances one slot up. */
function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveChange,
  skewAmount = 6,
  easing = "elastic",
  children,
  style,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        }

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children])
  const refs = useMemo(
    () => childArr.map(() => ({ current: null as HTMLDivElement | null })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  )

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)
  const container = useRef<HTMLDivElement>(null)

  // The original component drops the front card by a fixed 500px, tuned for
  // its own demo's spacious layout. Scale it to the card's own height instead
  // so the drop reads the same regardless of how this instance is sized, and
  // doesn't need a huge reserve of empty space below it to avoid clipping.
  const dropDistance = typeof height === "number" ? height * 1.25 : 500

  useEffect(() => {
    const total = refs.length
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    })

    const swap = () => {
      if (order.current.length < 2) return

      const [front, ...rest] = order.current
      const elFront = refs[front].current
      if (!elFront) return
      const tl = gsap.timeline()
      tlRef.current = tl

      tl.to(elFront, {
        y: `+=${dropDistance}`,
        duration: config.durDrop,
        ease: config.ease,
      })

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`)
      rest.forEach((idx, i) => {
        const el = refs[idx].current
        if (!el) return
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length)
        tl.set(el, { zIndex: slot.zIndex }, "promote")
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        )
      })

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`)
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex })
        },
        undefined,
        "return",
      )
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      )

      tl.call(() => {
        order.current = [...rest, front]
        onActiveChange?.(order.current[0])
      })
    }

    onActiveChange?.(order.current[0])
    swap()
    intervalRef.current = window.setInterval(swap, delay)

    if (pauseOnHover) {
      const node = container.current
      const pause = () => {
        tlRef.current?.pause()
        window.clearInterval(intervalRef.current)
      }
      const resume = () => {
        tlRef.current?.play()
        intervalRef.current = window.setInterval(swap, delay)
      }
      node?.addEventListener("mouseenter", pause)
      node?.addEventListener("mouseleave", resume)
      // mouseenter/mouseleave never fire on touch — without this, a phone
      // visitor has no way to stop an indefinitely auto-rotating stack
      // (WCAG 2.2.2). Press-and-hold pauses; releasing resumes, so a quick
      // tap still reaches the card's own onClick normally.
      node?.addEventListener("touchstart", pause, { passive: true })
      node?.addEventListener("touchend", resume)
      node?.addEventListener("touchcancel", resume)
      return () => {
        node?.removeEventListener("mouseenter", pause)
        node?.removeEventListener("mouseleave", resume)
        node?.removeEventListener("touchstart", pause)
        node?.removeEventListener("touchend", resume)
        node?.removeEventListener("touchcancel", resume)
        window.clearInterval(intervalRef.current)
      }
    }
    return () => window.clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing])

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: (node: HTMLDivElement | null) => {
            refs[i].current = node
          },
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e)
            onCardClick?.(i)
          },
        } as Partial<CardProps>)
      : child,
  )

  return (
    <div ref={container} className="card-swap-container" style={{ width, height, ...style }}>
      {rendered}
    </div>
  )
}

export default CardSwap

import { useEffect, useState } from "react"

/** Tracks a min-width breakpoint via matchMedia. Defaults to the Tailwind `md` cutoff (< 768px). */
export function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    // Also re-evaluate on resize — some embedded webviews change the layout
    // viewport without dispatching a matchMedia change event.
    window.addEventListener("resize", onChange)
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", onChange)
    }
  }, [query])

  return isMobile
}

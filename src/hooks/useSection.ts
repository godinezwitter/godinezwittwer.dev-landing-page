import { useRef } from "react"
import { useInView } from "framer-motion"

export function useSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  return { ref, inView }
}

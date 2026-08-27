import { easeOut } from "framer-motion"

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: easeOut },
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/** Clip-path wipe used to reveal whole sections as they scroll into view. */
export const wipeReveal = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: 0.9, ease: easeOut },
  },
}

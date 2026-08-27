import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
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

export function Portfolio() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      id="work"
      className="relative py-28 overflow-hidden"
      style={{ background: "#252640" }}
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(37,38,64,0) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
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

        <div className="grid md:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <TiltCard
              key={item.title}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: "4/5" }}
              maxTilt={5}
              motionProps={{
                initial: { opacity: 0, y: 50 },
                animate: inView ? { opacity: 1, y: 0 } : {},
                transition: { duration: 0.7, delay: 0.1 * i },
                whileHover: "hovered",
              }}
            >
              {/* image */}
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
                variants={{ hovered: { scale: 1.06 } }}
                transition={{ duration: 0.5 }}
              />

              {/* gradient overlay always */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(37,38,64,0.9) 0%, transparent 50%)",
                }}
              />

              {/* hover tint */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(130,142,115,0.12)" }}
                initial={{ opacity: 0 }}
                variants={{ hovered: { opacity: 1 } }}
                transition={{ duration: 0.3 }}
              />

              {/* text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <motion.span
                  className="block text-xs font-medium tracking-widest uppercase mb-1"
                  style={{ color: "#b4c2a3" }}
                >
                  {item.category}
                </motion.span>
                <h3 className="font-display text-xl mb-2" style={{ color: "#ada49a" }}>
                  {item.title}
                </h3>
                <motion.div
                  className="flex items-center gap-2 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  variants={{ hovered: { height: "auto", opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "rgba(130,142,115,0.3)", color: "#b4c2a3" }}
                  >
                    {item.result}
                  </span>
                </motion.div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

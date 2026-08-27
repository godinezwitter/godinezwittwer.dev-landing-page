import { MotionConfig } from "framer-motion"
import { PageIntro } from "@/components/PageIntro"
import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Services } from "@/components/Services"
import { Process } from "@/components/Process"
import { Portfolio } from "@/components/Portfolio"
import { Testimonials } from "@/components/Testimonials"

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <PageIntro />
        <Nav />
        <Hero />
        <About />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
      </div>
    </MotionConfig>
  )
}

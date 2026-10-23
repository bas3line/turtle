import { Catches } from './site/Catches'
import { Faq } from './site/Faq'
import { Footer } from './site/Footer'
import { Hero } from './site/Hero'
import { HowItWorks } from './site/HowItWorks'
import { Logos } from './site/Logos'
import { Nav } from './site/Nav'
import { Pricing } from './site/Pricing'
import { Race } from './site/Race'
import { Review } from './site/Review'
import { Setup } from './site/Setup'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <HowItWorks />
        <Review />
        <Catches />
        <Race />
        <Setup />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  )
}

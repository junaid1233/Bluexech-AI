import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Features from './components/Features'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GalaxyBackground from './components/GalaxyBackground'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppFloat from './components/WhatsAppFloat'
import CursorGlow from './components/CursorGlow'
import './App.css'

export default function App() {
  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <GalaxyBackground />
      <div className="shell">
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Features />
          <Portfolio />
          <Process />
          <Testimonials />
          <Pricing />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
      <WhatsAppFloat />
    </>
  )
}

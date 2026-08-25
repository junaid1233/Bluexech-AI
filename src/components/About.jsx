import { useEffect, useRef, useState } from 'react'
import { AccentText } from './AccentTitle'
import './About.css'

const stats = [
  { target: 120, suffix: '+', label: 'Projects Completed' },
  { target: 40, suffix: '+', label: 'Happy Clients' },
  { target: 12, suffix: '+', label: 'Countries Served' },
  { target: 8, suffix: '+', label: 'Years of Experience' },
]

const DURATION_MS = 1900

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function StatValue({ target, suffix, active }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return undefined
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return undefined
    }

    let raf = 0
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      setValue(Math.round(easeOutCubic(t) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return (
    <strong>
      {value}
      {suffix}
    </strong>
  )
}

export default function About() {
  const statsRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          setActive(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="section" aria-labelledby="stats-heading">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Statistics</span>
          <h2 id="stats-heading">
            <AccentText text="Trusted delivery at a glance" />
          </h2>
          <p>
            Bluexech AI helps organizations grow with unique AI services - chatbots, document intelligence,
            predictive models, computer vision, and agentic automation - delivered close to your goals.
          </p>
        </div>
        <div className="about-stats reveal" ref={statsRef}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <StatValue target={stat.target} suffix={stat.suffix} active={active} />
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useReveal } from '../hooks/useReveal'
import './About.css'

const stats = [
  { value: '120+', label: 'Projects Completed' },
  { value: '40+', label: 'Happy Clients' },
  { value: '12+', label: 'Countries Served' },
  { value: '8+', label: 'Years of Experience' },
]

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" className="section" aria-labelledby="stats-heading">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Statistics</span>
          <h2 id="stats-heading">Trusted delivery at a glance</h2>
          <p>
            Bluexech AI helps organizations grow with unique AI services - chatbots, document intelligence,
            predictive models, computer vision, and agentic automation - delivered close to your goals.
          </p>
        </div>
        <div className="about-stats reveal" ref={ref}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

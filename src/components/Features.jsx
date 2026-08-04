import { useReveal } from '../hooks/useReveal'
import './Features.css'

const features = [
  {
    title: 'Outcome-first delivery',
    desc: 'Every engagement is tied to measurable business results - not vanity demos.',
  },
  {
    title: 'Senior AI specialists',
    desc: 'AI, automation, vision, and data experts who ship production AI systems.',
  },
  {
    title: 'Safe AI by default',
    desc: 'Guardrails, human-in-the-loop checks, and data privacy baked into every build.',
  },
  {
    title: 'Transparent communication',
    desc: 'Clear milestones, demos, and ownership so you always know what is next.',
  },
  {
    title: 'Scalable AI architecture',
    desc: 'Pipelines and agents designed to grow with data volume, channels, and use cases.',
  },
  {
    title: 'Long-term partnership',
    desc: 'Support, iteration, and guidance after launch - not a one-and-done handoff.',
  },
]

export default function Features() {
  const ref = useReveal()

  return (
    <section id="features" className="section" aria-labelledby="why-heading">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Why Choose Bluexech</span>
          <h2 id="why-heading">Built for teams that need real results</h2>
          <p>Reliable craft, sharp strategy, and partners who stay accountable after launch.</p>
        </div>
        <div className="features-grid reveal" ref={ref}>
          {features.map((f, i) => (
            <article key={f.title} className="feature-item" style={{ transitionDelay: `${i * 50}ms` }}>
              <span className="feature-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useReveal } from '../hooks/useReveal'
import './Features.css'

const features = [
  { title: '24/7 Support', desc: 'Always-on response for critical systems and production issues.' },
  { title: 'Expert Team', desc: 'Senior engineers across AI, cloud, security, and product design.' },
  { title: 'Scalable Solutions', desc: 'Architectures that grow with traffic, teams, and markets.' },
  { title: 'Transparent Delivery', desc: 'Clear milestones, demos, and communication every sprint.' },
  { title: 'Security First', desc: 'Hardening and compliance woven into every engagement.' },
  { title: 'Business Alignment', desc: 'Technology choices tied to measurable ROI — not hype.' },
]

export default function Features() {
  const ref = useReveal()

  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Why Us</span>
          <h2>What sets Bluexech AI apart</h2>
          <p>Reliable delivery, sharp craft, and partners who stay accountable after launch.</p>
        </div>
        <div className="features-grid reveal" ref={ref}>
          {features.map((f, i) => (
            <article key={f.title} className="feature-item" style={{ transitionDelay: `${i * 60}ms` }}>
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

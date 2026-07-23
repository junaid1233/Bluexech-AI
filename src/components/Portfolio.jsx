import { useReveal } from '../hooks/useReveal'
import './Portfolio.css'

const projects = [
  {
    title: 'NovaOps Platform',
    tag: 'AI + Cloud',
    desc: 'Operations intelligence suite that cut incident response time by 42%.',
  },
  {
    title: 'HarborPay Portal',
    tag: 'Web App',
    desc: 'Secure customer payments hub with real-time reconciliation dashboards.',
  },
  {
    title: 'ShieldGrid Monitor',
    tag: 'Cybersecurity',
    desc: 'Continuous threat visibility for a multi-region logistics network.',
  },
  {
    title: 'Lumen Care Suite',
    tag: 'Custom Software',
    desc: 'Clinic workflow system connecting scheduling, records, and billing.',
  },
]

export default function Portfolio() {
  const ref = useReveal()

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Portfolio</span>
          <h2>Selected case studies</h2>
          <p>A snapshot of recent work across industries and stacks.</p>
        </div>
        <div className="portfolio-grid reveal" ref={ref}>
          {projects.map((p) => (
            <article key={p.title} className="portfolio-item">
              <div className="portfolio-visual" aria-hidden="true">
                <span>{p.tag}</span>
              </div>
              <div className="portfolio-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

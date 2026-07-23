import { useReveal } from '../hooks/useReveal'
import './Portfolio.css'

const projects = [
  {
    title: 'NovaOps Platform',
    tag: 'AI + Cloud',
    url: 'novaops.example',
    mark: 'N',
    subtitle: 'Operations intelligence',
    tech: ['AI', 'Cloud', 'React'],
    theme: 'a1',
    desc: 'Operations intelligence suite that cut incident response time by 42%.',
  },
  {
    title: 'HarborPay Portal',
    tag: 'Web App',
    url: 'harborpay.example',
    mark: 'H',
    subtitle: 'Payments hub',
    tech: ['Fintech', 'Realtime', 'Secure'],
    theme: 'a2',
    desc: 'Secure customer payments hub with real-time reconciliation dashboards.',
  },
  {
    title: 'ShieldGrid Monitor',
    tag: 'Cybersecurity',
    url: 'shieldgrid.example',
    mark: 'S',
    subtitle: 'Threat visibility',
    tech: ['Security', 'Monitoring', 'SOC'],
    theme: 'a3',
    desc: 'Continuous threat visibility for a multi-region logistics network.',
  },
  {
    title: 'Lumen Care Suite',
    tag: 'Custom Software',
    url: 'lumencare.example',
    mark: 'L',
    subtitle: 'Clinic workflows',
    tech: ['Healthcare', 'Workflow', 'SaaS'],
    theme: 'a4',
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
            <article key={p.title} className="portfolio-card">
              <div className="pc-bar">
                <span className="pc-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="pc-url">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  {p.url}
                </span>
                <span className="pc-live">LIVE</span>
              </div>
              <div className={`pc-thumb pc-thumb-${p.theme}`} aria-hidden="true">
                <span className="pc-mark">{p.mark}</span>
                <span className="pc-wm">{p.title}</span>
                <span className="pc-tl">{p.subtitle}</span>
              </div>
              <div className="pc-body">
                <div className="pc-top">
                  <h3>{p.title}</h3>
                  <span className="pc-cat">{p.tag}</span>
                </div>
                <p>{p.desc}</p>
                <div className="pc-tech">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

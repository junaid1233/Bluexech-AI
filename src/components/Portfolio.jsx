import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import DetailModal from './DetailModal'
import './Portfolio.css'

const projects = [
  {
    id: 'novaops',
    title: 'NovaOps Platform',
    tag: 'AI + Cloud',
    url: 'novaops.example',
    mark: 'N',
    subtitle: 'Operations intelligence',
    tech: ['AI', 'Cloud', 'React'],
    theme: 'a1',
    desc: 'Operations intelligence suite that cut incident response time by 42%.',
    details:
      'A real-time operations platform combining AI alerts, cloud telemetry, and operator workflows for faster incident handling.',
    highlights: ['Live incident board', 'AI triage suggestions', 'Cloud metric connectors', 'Role-based access'],
  },
  {
    id: 'harborpay',
    title: 'HarborPay Portal',
    tag: 'Web App',
    url: 'harborpay.example',
    mark: 'H',
    subtitle: 'Payments hub',
    tech: ['Fintech', 'Realtime', 'Secure'],
    theme: 'a2',
    desc: 'Secure customer payments hub with real-time reconciliation dashboards.',
    details:
      'Customer-facing payments portal with secure checkout flows, reconciliation views, and admin controls for finance teams.',
    highlights: ['Realtime payment status', 'Reconciliation dashboards', 'Secure auth flows', 'Exportable reports'],
  },
  {
    id: 'shieldgrid',
    title: 'ShieldGrid Monitor',
    tag: 'Cybersecurity',
    url: 'shieldgrid.example',
    mark: 'S',
    subtitle: 'Threat visibility',
    tech: ['Security', 'Monitoring', 'SOC'],
    theme: 'a3',
    desc: 'Continuous threat visibility for a multi-region logistics network.',
    details:
      'Security monitoring suite that centralizes alerts, endpoint health, and SOC workflows across multiple regions.',
    highlights: ['Threat feed panel', 'Endpoint health map', 'Escalation workflows', 'Audit-ready logs'],
  },
  {
    id: 'lumencare',
    title: 'Lumen Care Suite',
    tag: 'Custom Software',
    url: 'lumencare.example',
    mark: 'L',
    subtitle: 'Clinic workflows',
    tech: ['Healthcare', 'Workflow', 'SaaS'],
    theme: 'a4',
    desc: 'Clinic workflow system connecting scheduling, records, and billing.',
    details:
      'Clinic operations software linking appointments, patient records, and billing into one practical daily workflow.',
    highlights: ['Scheduling board', 'Patient records', 'Billing sync', 'Staff roles'],
  },
]

export default function Portfolio() {
  const ref = useReveal()
  const [activeId, setActiveId] = useState(null)
  const active = projects.find((p) => p.id === activeId) || null

  useEffect(() => {
    if (!activeId) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveId(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeId])

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Portfolio</span>
          <h2>Selected case studies</h2>
          <p>A snapshot of recent work across industries and stacks. Click a project to open details.</p>
        </div>
        <div className="portfolio-grid reveal" ref={ref}>
          {projects.map((p) => (
            <article key={p.id} className="portfolio-card">
              <button type="button" className="portfolio-open" onClick={() => setActiveId(p.id)} aria-label={`Open ${p.title}`}>
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
                  <span className="pc-cta">View case study →</span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      <DetailModal open={Boolean(active)} onClose={() => setActiveId(null)} title={active?.title}>
        {active ? (
          <>
            <div className="detail-meta">
              <span>{active.tag}</span>
              <span>{active.url}</span>
            </div>
            <p>{active.details}</p>
            <p className="detail-list-title">Highlights</p>
            <ul className="detail-list">
              {active.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="detail-actions">
              <a href="#contact" className="btn btn-primary" onClick={() => setActiveId(null)}>
                Start similar project
              </a>
              <button type="button" className="btn btn-ghost" onClick={() => setActiveId(null)}>
                Close
              </button>
            </div>
          </>
        ) : null}
      </DetailModal>
    </section>
  )
}

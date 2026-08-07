import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import DetailModal from './DetailModal'
import './Portfolio.css'

const projects = [
  {
    id: 'ai-support-agent',
    title: 'AI Customer Support Agent',
    category: 'AI Chatbot / Virtual Agent',
    accent: 'purple',
    image: 'images/portfolio/chatbot.png',
    alt: 'AI customer support robot with chat interface',
    desc: 'Intelligent virtual agent that handles customer queries 24/7 and reduced response time by 60%.',
    tech: ['NLP', 'GPT-4', 'RAG', 'Vector DB'],
    details:
      'A production-ready support agent trained on your product docs and policies. It resolves common tickets, books appointments, and escalates edge cases to humans with full conversation context.',
    highlights: ['24/7 multilingual support', '60% faster first response', 'Human handoff with context', 'Ticket analytics dashboard'],
  },
  {
    id: 'document-processing',
    title: 'Intelligent Document Processing',
    category: 'Intelligent Documents AI',
    accent: 'green',
    image: 'images/portfolio/document.png',
    alt: 'Intelligent document processing invoice extraction',
    desc: 'Automated extraction, classification and validation of documents with 99% accuracy.',
    tech: ['OCR', 'NLP', 'AI Models', 'OCR++'],
    details:
      'Turn messy PDFs and scans into structured data. OCR plus AI extraction, validation rules, and direct push into CRM or ERP — with human review only on exceptions.',
    highlights: ['Invoice & contract parsing', '99% field accuracy', 'Exception review queue', 'CRM / ERP sync'],
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics & Forecasting',
    category: 'Predictive Analytics',
    accent: 'orange',
    image: 'images/portfolio/analytics.png',
    alt: 'Predictive analytics forecasting chart',
    desc: 'Advanced analytics platform that improved forecast accuracy by 35% using ML models.',
    tech: ['Python', 'Scikit-learn', 'XGBoost', 'Power BI'],
    details:
      'Historical data powered into live forecasts for sales, inventory, and churn risk — with dashboards and alert thresholds your team can act on.',
    highlights: ['Demand & sales forecasts', '+35% accuracy lift', 'Churn risk scoring', 'Live KPI dashboards'],
  },
  {
    id: 'content-platform',
    title: 'AI Content Generation Platform',
    category: 'Generative AI System',
    accent: 'blue',
    image: 'images/portfolio/content.png',
    alt: 'AI content generation platform interface',
    desc: 'Generates high-quality content, product descriptions and marketing copy 10x faster.',
    tech: ['LLM', 'LangChain', 'OpenAI', 'Vector DB'],
    details:
      'Private generative AI workspace grounded in your brand voice and approved sources. Templates for blogs, ads, emails, and product copy with quality review workflows.',
    highlights: ['On-brand voice system', 'Multi-format templates', 'Source-grounded drafts', 'Team review workflow'],
  },
  {
    id: 'agentic-suite',
    title: 'Agentic Process Automation Suite',
    category: 'Agentic Process Automation',
    accent: 'gold',
    image: 'images/portfolio/agentic.png',
    alt: 'Agentic process automation workflow diagram',
    desc: 'Autonomous AI agents that automate workflows and reduced operational cost by 45%.',
    tech: ['RPA', 'AI Agents', 'Workflow', 'Automation'],
    details:
      'Agents that plan and run multi-step processes across CRM, email, sheets, and APIs — with approvals, audit logs, retries, and measurable ROI.',
    highlights: ['Trigger → Agent → Execute', 'Tool integrations', 'Approval guardrails', 'Audit-ready logs'],
  },
  {
    id: 'visual-inspection',
    title: 'Visual Inspection AI System',
    category: 'Computer Vision AI',
    accent: 'cyan',
    image: 'images/portfolio/vision.png',
    alt: 'Visual inspection AI on bottle production line',
    desc: 'Real-time defect detection in production line with 98% accuracy.',
    tech: ['OpenCV', 'YOLOv8', 'PyTorch', 'Python'],
    details:
      'Vision models that catch what humans miss — defect detection, counting, and quality alerts with camera pipelines built for the factory floor.',
    highlights: ['Real-time defect detection', 'Bounding-box alerts', 'Batch or live inference', 'Ops reporting'],
  },
  {
    id: 'ops-dashboard',
    title: 'AI Operations Dashboard',
    category: 'Enterprise AI Dashboard',
    accent: 'pink',
    image: 'images/portfolio/dashboard.png',
    alt: 'Enterprise AI operations dashboard',
    desc: 'Centralized dashboard to monitor AI models, agents and system performance in real-time.',
    tech: ['Next.js', 'Tailwind CSS', 'Chart.js', 'PostgreSQL'],
    details:
      'A single pane for AI operations: agent health, pipeline status, cost, and outcome KPIs — built for teams that need clarity without spreadsheet chaos.',
    highlights: ['24 total projects tracked', '98.6% success rate', 'Active agents overview', 'Live performance charts'],
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

  const startSimilar = () => {
    setActiveId(null)
    window.open(`${import.meta.env.BASE_URL}message.html`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="portfolio" className="section portfolio-section">
      <div className="portfolio-wrap">
        <div className="section-head center">
          <span className="eyebrow">Our Portfolio</span>
          <h2>
            Building AI Solutions That Deliver <span className="portfolio-grad">Real Results</span>
          </h2>
          <p>
            Explore a selection of our AI-powered projects that solve complex problems and drive business
            growth.
          </p>
        </div>

        <div className="portfolio-filters" role="tablist" aria-label="Project filters">
          <button type="button" className="portfolio-filter is-active" role="tab" aria-selected="true">
            All Projects
          </button>
        </div>

        <div className="portfolio-grid reveal" ref={ref}>
          {projects.map((p) => (
            <article key={p.id} className={`portfolio-card accent-${p.accent}`}>
              <button
                type="button"
                className="portfolio-open"
                onClick={() => setActiveId(p.id)}
                aria-label={`Open ${p.title}`}
              >
                <span className={`pc-badge badge-${p.accent}`}>{p.category}</span>
                <div className="pc-media">
                  <img
                    src={`${import.meta.env.BASE_URL}${p.image}`}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pc-body">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="pc-tech">
                    {p.tech.map((t) => (
                      <span key={t} className={`tech-${p.accent}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="pc-footer">
                    <span className={`pc-cta cta-${p.accent}`}>
                      View Case Study
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="pc-expand" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      <DetailModal
        open={Boolean(active)}
        onClose={() => setActiveId(null)}
        title={active?.title}
        image={active ? `${import.meta.env.BASE_URL}${active.image}` : ''}
        imageAlt={active?.alt}
      >
        {active ? (
          <>
            <div className="detail-meta">
              <span>{active.category}</span>
            </div>
            <p>{active.details}</p>
            <p className="detail-list-title">Highlights</p>
            <ul className="detail-list">
              {active.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="detail-actions">
              <button type="button" className="btn btn-primary" onClick={startSimilar}>
                Start similar project
              </button>
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

import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import './FAQ.css'

const items = [
  {
    q: 'What AI development services does Bluexech AI offer?',
    a: 'We build custom AI solutions including copilots, chatbots, document intelligence, forecasting, and AI features integrated into your existing products and workflows.',
  },
  {
    q: 'How does AI automation help my business?',
    a: 'AI automation reduces repetitive work across sales, support, and operations. We map high-ROI processes, connect your tools, and add human review where decisions need oversight.',
  },
  {
    q: 'What does your web development process look like?',
    a: 'We start with discovery and UX, then build a responsive product with SEO foundations, performance checks, analytics, and a clear launch plan.',
  },
  {
    q: 'Can you build a SaaS product from scratch?',
    a: 'Yes. We design multi-tenant architecture, authentication, billing, admin tools, and core features so you can launch an MVP and scale with confidence.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Pricing depends on scope, timeline, and complexity. We offer package options and custom quotes after a short discovery call so costs stay transparent.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Most websites start in 3–8 weeks. AI and SaaS builds usually range from 4–16 weeks depending on features, integrations, and review cycles.',
  },
  {
    q: 'What support do you provide after launch?',
    a: 'We offer post-launch support, monitoring, iteration sprints, and optional SLAs so your product stays stable as usage grows.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(-1)
  const ref = useReveal()

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    }

    document.getElementById('faq-schema')?.remove()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'faq-schema'
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => document.getElementById('faq-schema')?.remove()
  }, [])

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">FAQ</span>
          <h2>Answers before you reach out</h2>
          <p>Clear guidance on AI, web, SaaS, pricing, timelines, and support.</p>
        </div>
        <div className="faq-list reveal" ref={ref}>
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div className="faq-panel" hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

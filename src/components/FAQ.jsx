import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import './FAQ.css'

const items = [
  {
    q: 'What industries do you serve?',
    a: 'We work with SaaS, healthcare, logistics, retail, and professional services — anywhere modern IT and AI create leverage.',
  },
  {
    q: 'How quickly can a project start?',
    a: 'Most engagements begin within 1–2 weeks after discovery. Urgent audits or stabilizations can start sooner.',
  },
  {
    q: 'Do you work with existing teams?',
    a: 'Yes. We embed with your engineers, product owners, and vendors — or run as a self-contained delivery squad.',
  },
  {
    q: 'Can you help with cloud migration?',
    a: 'We plan and execute migrations to AWS, Azure, and GCP with security, cost, and uptime as first-class goals.',
  },
  {
    q: 'What does support look like after launch?',
    a: 'Packages include post-launch coverage. Enterprise clients get SLAs, on-call rotation, and continuous improvement cycles.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(-1)
  const ref = useReveal()

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">FAQ</span>
          <h2>Answers before you reach out</h2>
          <p>Quick clarity on how Bluexech AI partners with teams.</p>
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

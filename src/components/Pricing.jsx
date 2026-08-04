import { useReveal } from '../hooks/useReveal'
import './Pricing.css'

const plans = [
  {
    name: 'Starter',
    price: '$1,999',
    period: '/project',
    desc: 'Focused AI pilots - chatbots or document automation.',
    features: ['AI discovery workshop', 'Chatbot or Doc AI pilot', 'Basic analytics', '2 weeks support'],
    featured: false,
  },
  {
    name: 'Growth',
    price: '$4,999',
    period: '/month',
    desc: 'Ongoing AI product and automation partnership.',
    features: ['Dedicated AI squad', 'Agents + AI models scope', 'Sprint demos', 'Priority support'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Multi-agent systems, vision, and org-wide AI rollout.',
    features: ['AI architecture review', 'Custom models / RAG', '24/7 coverage', 'SLA & onsite options'],
    featured: false,
  },
]

export default function Pricing() {
  const ref = useReveal()

  return (
    <section id="pricing" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Packages</span>
          <h2>Simple pricing that scales with you</h2>
          <p>Start lean or engage a full delivery partner - we’ll match the right package.</p>
        </div>
        <div className="pricing-grid reveal" ref={ref}>
          {plans.map((plan) => (
            <article key={plan.name} className={`price-card ${plan.featured ? 'is-featured' : ''}`}>
              <h3>{plan.name}</h3>
              <p className="price-amount">
                {plan.price}
                {plan.period && <span>{plan.period}</span>}
              </p>
              <p className="price-desc">{plan.desc}</p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#contact" className={`btn ${plan.featured ? 'btn-light' : 'btn-primary'}`}>
                Talk to us
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

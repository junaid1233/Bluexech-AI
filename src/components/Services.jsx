import { useReveal } from '../hooks/useReveal'
import './Services.css'

const services = [
  {
    title: 'AI Solutions',
    desc: 'Custom models, automation, and intelligent workflows that reduce busywork and surface better decisions.',
    icon: '◎',
  },
  {
    title: 'Web Development',
    desc: 'Fast, accessible product sites and web apps engineered for performance and conversion.',
    icon: '◇',
  },
  {
    title: 'Cloud & DevOps',
    desc: 'Scalable cloud architecture, CI/CD, and observability so releases stay predictable.',
    icon: '☁',
  },
  {
    title: 'Cybersecurity',
    desc: 'Threat assessments, hardening, and continuous monitoring to protect data and uptime.',
    icon: '⬡',
  },
  {
    title: 'Custom Software',
    desc: 'Tailored platforms that fit your processes — from internal tools to customer-facing products.',
    icon: '▣',
  },
  {
    title: 'IT Consulting',
    desc: 'Clear roadmaps, stack choices, and delivery plans aligned to growth and budget.',
    icon: '✦',
  },
]

export default function Services() {
  const ref = useReveal()

  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Services</span>
          <h2>IT capabilities built for real outcomes</h2>
          <p>From strategy to shipping — one team across AI, software, cloud, and security.</p>
        </div>
        <div className="services-grid reveal" ref={ref}>
          {services.map((item) => (
            <article key={item.title} className="service-item">
              <span className="service-icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

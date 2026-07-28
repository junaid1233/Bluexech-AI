import { useReveal } from '../hooks/useReveal'
import './Services.css'

const services = [
  {
    title: 'AI Solutions',
    desc: 'Custom models, automation, and intelligent workflows that reduce busywork and surface better decisions.',
    image: 'images/services/ai.png',
    alt: 'AI neural network and intelligent systems',
  },
  {
    title: 'Web Development',
    desc: 'Fast, accessible product sites and web apps engineered for performance and conversion.',
    image: 'images/services/web.png',
    alt: 'Modern web development and interface design',
  },
  {
    title: 'Cloud & DevOps',
    desc: 'Scalable cloud architecture, CI/CD, and observability so releases stay predictable.',
    image: 'images/services/cloud.png',
    alt: 'Cloud infrastructure and DevOps pipelines',
  },
  {
    title: 'Cybersecurity',
    desc: 'Threat assessments, hardening, and continuous monitoring to protect data and uptime.',
    image: 'images/services/cyber.png',
    alt: 'Cybersecurity shield and digital protection',
  },
  {
    title: 'Custom Software',
    desc: 'Tailored platforms that fit your processes — from internal tools to customer-facing products.',
    image: 'images/services/software.png',
    alt: 'Custom software modules and applications',
  },
  {
    title: 'IT Consulting',
    desc: 'Clear roadmaps, stack choices, and delivery plans aligned to growth and budget.',
    image: 'images/services/consulting.png',
    alt: 'IT consulting strategy and technology roadmap',
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
              <div className="service-media">
                <img
                  src={`${import.meta.env.BASE_URL}${item.image}`}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="service-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

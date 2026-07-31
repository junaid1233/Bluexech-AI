import { useReveal } from '../hooks/useReveal'
import { technologies } from '../data/content'
import './Technologies.css'

export default function Technologies() {
  const ref = useReveal()

  return (
    <section id="technologies" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Technologies</span>
          <h2>Modern stack. Proven delivery.</h2>
          <p>We ship with tools that scale — from frontend and AI to cloud and design systems.</p>
        </div>
        <div className="tech-grid reveal" ref={ref}>
          {technologies.map((tech) => (
            <div key={tech.name} className="tech-chip">
              <span className="tech-group">{tech.group}</span>
              <strong>{tech.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

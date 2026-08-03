import { technologies } from '../data/content'
import './Technologies.css'

export default function Technologies() {
  const track = [...technologies, ...technologies]

  return (
    <section id="technologies" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Technologies</span>
          <h2>Modern stack. Proven delivery.</h2>
          <p>Tools we use across AI models, automation, data, cloud, and product delivery.</p>
        </div>
      </div>

      <div className="tech-marquee" aria-label="Technology logos">
        <div className="tech-track">
          {track.map((tech, i) => (
            <div key={`${tech.name}-${i}`} className="tech-card">
              <img
                src={`${import.meta.env.BASE_URL}${tech.image}`}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
              />
              <strong>{tech.name}</strong>
              <span>{tech.group}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

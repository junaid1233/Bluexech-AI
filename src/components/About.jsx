import { useReveal } from '../hooks/useReveal'
import './About.css'

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" className="section">
      <div className="container about-grid reveal" ref={ref}>
        <div className="section-head">
          <span className="eyebrow">About Us</span>
          <h2>Technology partners who build with purpose</h2>
          <p>
            Bluexech AI helps organizations modernize operations with practical AI, reliable software,
            and secure infrastructure — delivered by specialists who stay close to your goals.
          </p>
        </div>
        <div className="about-stats">
          <div>
            <strong>120+</strong>
            <span>Projects delivered</span>
          </div>
          <div>
            <strong>40+</strong>
            <span>Enterprise clients</span>
          </div>
          <div>
            <strong>8 yrs</strong>
            <span>Industry experience</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Support coverage</span>
          </div>
        </div>
      </div>
    </section>
  )
}

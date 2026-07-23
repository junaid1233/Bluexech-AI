import { useReveal } from '../hooks/useReveal'
import './Testimonials.css'

const quotes = [
  {
    text: 'Bluexche AI turned a messy backlog into a shipping rhythm. Our platform is faster and our team finally trusts the stack.',
    name: 'Sara Malik',
    role: 'CTO, Freightline',
  },
  {
    text: 'Their security review caught gaps we had overlooked for years. The remediation plan was practical and well sequenced.',
    name: 'Daniel Okoye',
    role: 'Head of IT, Meridian Health',
  },
  {
    text: 'From discovery to launch, communication stayed crisp. The AI automation they built paid for itself in the first quarter.',
    name: 'Priya Nair',
    role: 'COO, Atlas Retail',
  },
]

export default function Testimonials() {
  const ref = useReveal()

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Testimonials</span>
          <h2>Trusted by teams who ship</h2>
          <p>What partners say after working with Bluexche AI.</p>
        </div>
        <div className="testimonials-grid reveal" ref={ref}>
          {quotes.map((q) => (
            <blockquote key={q.name} className="quote">
              <p>“{q.text}”</p>
              <footer>
                <strong>{q.name}</strong>
                <span>{q.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

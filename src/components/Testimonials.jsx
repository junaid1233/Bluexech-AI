import { useReveal } from '../hooks/useReveal'
import './Testimonials.css'

const quotes = [
  {
    text: 'Bluexech AI turned a messy backlog into a shipping rhythm. Our platform is faster and our team finally trusts the stack.',
    name: 'Sara Malik',
    role: 'CTO',
    company: 'Freightline',
    rating: 5,
    initials: 'SM',
  },
  {
    text: 'Their security review caught gaps we had overlooked for years. The remediation plan was practical and well sequenced.',
    name: 'Daniel Okoye',
    role: 'Head of IT',
    company: 'Meridian Health',
    rating: 5,
    initials: 'DO',
  },
  {
    text: 'From discovery to launch, communication stayed crisp. The AI automation they built paid for itself in the first quarter.',
    name: 'Priya Nair',
    role: 'COO',
    company: 'Atlas Retail',
    rating: 5,
    initials: 'PN',
  },
]

function Stars({ rating }) {
  return (
    <div className="quote-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <svg key={value} className={value <= rating ? 'is-on' : ''} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useReveal()

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Testimonials</span>
          <h2>Trusted by teams who ship</h2>
          <p>What partners say after working with Bluexech AI.</p>
        </div>
        <div className="testimonials-grid reveal" ref={ref}>
          {quotes.map((q) => (
            <blockquote key={q.name} className="quote">
              <Stars rating={q.rating} />
              <p>“{q.text}”</p>
              <footer>
                <span className="quote-avatar" aria-hidden="true">
                  {q.initials}
                </span>
                <span className="quote-person">
                  <strong>{q.name}</strong>
                  <span>
                    {q.role}, {q.company}
                  </span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

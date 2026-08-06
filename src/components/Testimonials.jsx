import { useReveal } from '../hooks/useReveal'
import './Testimonials.css'

const quotes = [
  {
    text: 'Bluexech AI is an outstanding company. They deliver projects quickly without cutting corners, and working with them has been a smooth, reliable experience from start to finish.',
    name: 'Sara Malik',
    role: 'CTO',
    company: 'Freightline',
    rating: 5,
    photo: '/images/testimonials/sara-malik.jpg',
  },
  {
    text: 'A truly great company to partner with. They understood our goals fast, completed the project on time, and the quality of their work exceeded our expectations.',
    name: 'Daniel Okoye',
    role: 'Head of Ops',
    company: 'Meridian Health',
    rating: 5,
    photo: '/images/testimonials/daniel-okoye.jpg',
  },
  {
    text: 'We are very happy with Bluexech AI. They finish projects promptly, communicate clearly, and consistently deliver excellent results. Highly recommended.',
    name: 'Priya Nair',
    role: 'COO',
    company: 'Atlas Retail',
    rating: 5,
    photo: '/images/testimonials/priya-nair.jpg',
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
              <footer>
                <img className="quote-avatar" src={q.photo} alt="" width={72} height={72} />
                <span className="quote-person">
                  <strong>{q.name}</strong>
                  <span>
                    {q.role}, {q.company}
                  </span>
                </span>
              </footer>
              <p>“{q.text}”</p>
              <Stars rating={q.rating} />
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

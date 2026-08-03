import { useReveal } from '../hooks/useReveal'
import './Contact.css'

const messagePageHref = `${import.meta.env.BASE_URL}message.html`
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Gulshan-e-Hadeed%2C+Karachi%2C+Pakistan'
/* OpenStreetMap embed — reliable in iframes; click opens Google Maps */
const MAPS_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=67.3300%2C24.8500%2C67.3900%2C24.8900&layer=mapnik&marker=24.86972%2C67.36028'

export default function Contact() {
  const ref = useReveal()

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Contact</span>
          <h2>Let’s build what’s next</h2>
          <p>
            Tell us about your goals. We’ll reply within one business day with next steps and a clear path forward.
          </p>
        </div>
        <div className="contact-layout reveal" ref={ref}>
          <div className="contact-info">
            <ul className="contact-details">
              <li>
                <strong>Email</strong>
                <a href="mailto:support@bluexech.com">support@bluexech.com</a>
              </li>
              <li>
                <strong>Phone</strong>
                <a href="tel:+923092547332">+92 309 2547332</a>
              </li>
              <li>
                <strong>Office</strong>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  Gulshan Hadeed
                  <br />
                  Karachi, Pakistan
                </a>
              </li>
            </ul>

            <a
              className="wa-link"
              href="https://wa.me/923092547332?text=Hi%21%20I%27d%20like%20to%20talk%20about%20a%20project%20with%20Bluexech%20AI."
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="wa-ic" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.1.8.8-4-.3-.4A8.7 8.7 0 0 1 7.2 15c0-4.9 4-8.8 8.8-8.8S24.8 10.1 24.8 15 20.9 24.8 16 24.8z" />
                  <path d="M21.2 18.4c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.2 7.2 0 0 1-3.5-3.1c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.2.7 2.6.6.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1s-.3-.2-.6-.3z" />
                </svg>
              </span>
              <span className="wa-tx">
                <small>WHATSAPP</small>
                <b>+92 309 2547332</b>
              </span>
            </a>
          </div>

          <a href={messagePageHref} target="_blank" rel="noopener noreferrer" className="contact-cta-card">
            <span className="contact-cta-badge">Message Form</span>
            <h3>Ready to share your project?</h3>
            <p>Open the message form in a new tab and submit your details.</p>
            <span className="contact-cta-action">
              Open message form
              <span aria-hidden="true">→</span>
            </span>
          </a>
        </div>

        <a
          className="contact-map"
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Gulshan Hadeed, Karachi on Google Maps"
        >
          <iframe
            title="Bluexech AI office — Gulshan Hadeed, Karachi"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            tabIndex={-1}
          />
          <span className="contact-map-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
            Gulshan Hadeed, Karachi — Open in Maps
          </span>
        </a>
      </div>
    </section>
  )
}

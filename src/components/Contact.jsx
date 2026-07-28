import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { COUNTRY_CODES } from '../data/countryCodes'
import './Contact.css'

const initial = {
  name: '',
  email: '',
  country: 'PK',
  phone: '',
  service: '',
  description: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)
  const ref = useReveal()

  const dial = COUNTRY_CODES.find((c) => c.code === form.country)?.dial || '+92'

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm(initial)
  }

  return (
    <section id="contact" className="section">
      <div className="container contact-layout reveal" ref={ref}>
        <div className="contact-info">
          <span className="eyebrow">Contact</span>
          <h2>Let’s build what’s next</h2>
          <p>
            Tell us about your goals. We’ll reply within one business day with next steps and a clear path forward.
          </p>
          <ul className="contact-details">
            <li>
              <strong>Email</strong>
              <a href="mailto:support@bluexech.com">support@bluexech.com</a>
            </li>
            <li>
              <strong>Phone</strong>
              <a href="tel:+923092547332">03092547332</a>
            </li>
            <li>
              <strong>Office</strong>
              <span>120 Innovation Drive, Suite 400<br />Austin, TX 78701</span>
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
              <b>03092547332</b>
            </span>
          </a>
        </div>

        <div className="contact-box">
          <h3>Send a message</h3>
          {sent ? (
            <p className="contact-success" role="status">
              Thanks — your message is in. We’ll be in touch shortly.
            </p>
          ) : null}
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@company.com"
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <div className="phone-combo">
                <select
                  id="country"
                  name="country"
                  aria-label="Country code"
                  value={form.country}
                  onChange={onChange}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
                <div className="phone-input-wrap">
                  <span className="phone-dial" aria-hidden="true">
                    {dial}
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel-national"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="300 1234567"
                  />
                </div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="service">Service</label>
              <select id="service" name="service" required value={form.service} onChange={onChange}>
                <option value="" disabled>
                  Select a service
                </option>
                <option>AI Solutions</option>
                <option>Web Development</option>
                <option>Cloud & DevOps</option>
                <option>Cybersecurity</option>
                <option>Custom Software</option>
                <option>IT Consulting</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="description">Message description</label>
              <input
                id="description"
                name="description"
                type="text"
                required
                value={form.description}
                onChange={onChange}
                placeholder="Short summary — e.g. Need AI chatbot for support"
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message details</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={onChange}
                placeholder="Describe your project, goals, timeline, and any challenges in detail…"
              />
            </div>
            <button type="submit" className="btn btn-light contact-submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

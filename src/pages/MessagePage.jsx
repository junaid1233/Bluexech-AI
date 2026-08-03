import { useEffect, useState } from 'react'
import { COUNTRY_CODES } from '../data/countryCodes'
import { serviceTitles } from '../data/services'
import GalaxyBackground from '../components/GalaxyBackground'
import '../components/Contact.css'
import './MessagePage.css'

const initial = {
  name: '',
  email: '',
  country: 'PK',
  phone: '',
  service: '',
  message: '',
}

export default function MessagePage() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fromStorage = sessionStorage.getItem('selectedService')
    if (fromStorage) {
      setForm((prev) => ({ ...prev, service: fromStorage }))
      sessionStorage.removeItem('selectedService')
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.phone.trim()) next.phone = 'Enter your phone number.'
    if (!form.service) next.service = 'Select a service.'
    if (form.message.trim().length < 10) next.message = 'Please share a bit more detail.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
    setForm(initial)
    setErrors({})
  }

  const homeHref = `${import.meta.env.BASE_URL}index.html`

  return (
    <>
      <GalaxyBackground />
      <div className="shell message-shell">
        <header className="message-topbar">
          <div className="container message-topbar-inner">
            <a href={homeHref} className="message-brand">
              <img
                src={`${import.meta.env.BASE_URL}images/logo.png`}
                alt=""
                width={28}
                height={28}
                decoding="async"
              />
              <span>
                luexech <em>AI</em>
              </span>
            </a>
            <a href={homeHref} className="btn btn-ghost message-back">
              ← Back to Home
            </a>
          </div>
        </header>

        <main className="message-main container">
          <div className="message-stack">
            <section className="contact-box message-form-card">
              <h2>Send a message</h2>
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
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? <span className="field-error">{errors.name}</span> : null}
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
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? <span className="field-error">{errors.email}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <div className="phone-combo">
                    <select
                      id="country"
                      name="country"
                      className="country-code"
                      aria-label="Country code"
                      value={form.country}
                      onChange={onChange}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.dial}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel-national"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="300 1234567"
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                  {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="service">Service</label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={form.service}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.service)}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {serviceTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  {errors.service ? <span className="field-error">{errors.service}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    placeholder="Describe your project, goals, timeline, and any challenges…"
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message ? <span className="field-error">{errors.message}</span> : null}
                </div>
                <button type="submit" className="btn btn-light contact-submit">
                  Submit message
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

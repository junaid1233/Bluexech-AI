import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import './Contact.css'

const initial = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)
  const ref = useReveal()

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
              <a href="mailto:hello@bluexche.ai">hello@bluexche.ai</a>
            </li>
            <li>
              <strong>Phone</strong>
              <a href="tel:+15550188200">+1 (555) 018-8200</a>
            </li>
            <li>
              <strong>Office</strong>
              <span>120 Innovation Drive, Suite 400<br />Austin, TX 78701</span>
            </li>
          </ul>
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
            <div className="field-row">
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
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+1 ..."
                />
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
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={onChange}
                placeholder="What are you looking to build or improve?"
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

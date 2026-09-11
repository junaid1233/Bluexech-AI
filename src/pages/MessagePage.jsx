import { useEffect, useState } from 'react'
import { COUNTRY_CODES } from '../data/countryCodes'
import { serviceTitles } from '../data/services'
import GalaxyBackground from '../components/GalaxyBackground'
import { MeetingDatePicker, MeetingTimePicker, MeetingSelect } from '../components/MeetingPickers'
import '../components/Contact.css'
import './MessagePage.css'

const TIMEZONES = [
  'Asia/Karachi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Riyadh',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Australia/Sydney',
  'UTC',
]

const DURATION_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
]

const initial = {
  name: '',
  email: '',
  country: 'PK',
  phone: '',
  service: '',
  meetingDate: '',
  meetingTime: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi',
  durationMinutes: '30',
  message: '',
}

function contactApiUrl() {
  const configured = import.meta.env.VITE_CONTACT_API_URL
  if (configured) return configured.replace(/\/$/, '')
  return '/api/contact'
}

export default function MessagePage() {
  const [form, setForm] = useState(initial)
  const [scheduleMeet, setScheduleMeet] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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
    setSubmitError('')
  }

  const setMeetingField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.phone.trim()) next.phone = 'Enter your phone number.'
    if (!form.service) next.service = 'Select a service.'
    if (form.message.trim().length < 10) next.message = 'Please share a bit more detail.'
    if (scheduleMeet) {
      if (!form.meetingDate) next.meetingDate = 'Choose a meeting date.'
      if (!form.meetingTime) next.meetingTime = 'Choose a meeting time.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onScheduleMeetChange = (e) => {
    const checked = e.target.checked
    setScheduleMeet(checked)
    setSubmitError('')
    if (!checked) {
      setForm((prev) => ({ ...prev, meetingDate: '', meetingTime: '' }))
      setErrors((prev) => ({ ...prev, meetingDate: '', meetingTime: '', timezone: '' }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || submitting) return

    const countryMeta = COUNTRY_CODES.find((c) => c.code === form.country)
    const wantsMeeting = scheduleMeet && Boolean(form.meetingDate && form.meetingTime)
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      country: form.country,
      dial: countryMeta?.dial || '',
      phone: form.phone.trim(),
      service: form.service,
      meetingDate: wantsMeeting ? form.meetingDate : '',
      meetingTime: wantsMeeting ? form.meetingTime : '',
      timezone: wantsMeeting ? form.timezone : '',
      durationMinutes: wantsMeeting ? Number(form.durationMinutes) : null,
      message: form.message.trim(),
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(contactApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not send your request. Please try again.')
      }
      setSent(true)
      setScheduleMeet(false)
      setForm({
        ...initial,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi',
      })
      setErrors({})
    } catch (err) {
      setSubmitError(err?.message || 'Could not send your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const homeHref = `${import.meta.env.BASE_URL}index.html`
  const minDate = new Date().toISOString().slice(0, 10)
  const timezoneOptions = TIMEZONES.includes(form.timezone)
    ? TIMEZONES
    : [form.timezone, ...TIMEZONES]

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
              <p className="contact-form-hint">
                Tell us about your project. Optionally pick a time if you’d like a Google Meet —
                we’ll email a confirmation and follow up with the link.
              </p>
              {sent ? (
                <p className="contact-success" role="status">
                  Thanks — your message is in. Check your email for confirmation. If you requested a
                  meeting, your Google Meet link and calendar invite are on the way.
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
                    <MeetingSelect
                      id="country"
                      className="country-code-picker"
                      value={form.country}
                      placeholder="Code"
                      triggerLabel={
                        COUNTRY_CODES.find((c) => c.code === form.country)?.dial || '+…'
                      }
                      menuMinWidth={300}
                      options={COUNTRY_CODES.map((c) => ({
                        value: c.code,
                        label: `${c.dial}  ${c.name}`,
                      }))}
                      onChange={(value) => setMeetingField('country', value)}
                    />
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
                  <MeetingSelect
                    id="service"
                    value={form.service}
                    invalid={Boolean(errors.service)}
                    placeholder="Select a service"
                    options={serviceTitles.map((title) => ({ value: title, label: title }))}
                    onChange={(value) => setMeetingField('service', value)}
                  />
                  {errors.service ? <span className="field-error">{errors.service}</span> : null}
                </div>

                <label className="meeting-toggle" htmlFor="scheduleMeet">
                  <input
                    id="scheduleMeet"
                    name="scheduleMeet"
                    type="checkbox"
                    checked={scheduleMeet}
                    onChange={onScheduleMeetChange}
                  />
                  <span>Schedule a Google Meet (optional)</span>
                </label>

                {scheduleMeet ? (
                  <div className="meeting-fields">
                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="meetingDate">Meeting date</label>
                        <MeetingDatePicker
                          id="meetingDate"
                          value={form.meetingDate}
                          min={minDate}
                          invalid={Boolean(errors.meetingDate)}
                          onChange={(value) => setMeetingField('meetingDate', value)}
                        />
                        {errors.meetingDate ? (
                          <span className="field-error">{errors.meetingDate}</span>
                        ) : null}
                      </div>
                      <div className="field">
                        <label htmlFor="meetingTime">Meeting time</label>
                        <MeetingTimePicker
                          id="meetingTime"
                          value={form.meetingTime}
                          invalid={Boolean(errors.meetingTime)}
                          onChange={(value) => setMeetingField('meetingTime', value)}
                        />
                        {errors.meetingTime ? (
                          <span className="field-error">{errors.meetingTime}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="timezone">Timezone</label>
                        <MeetingSelect
                          id="timezone"
                          value={form.timezone}
                          invalid={Boolean(errors.timezone)}
                          placeholder="Select timezone"
                          options={timezoneOptions.map((tz) => ({ value: tz, label: tz }))}
                          onChange={(value) => setMeetingField('timezone', value)}
                        />
                        {errors.timezone ? (
                          <span className="field-error">{errors.timezone}</span>
                        ) : null}
                      </div>
                      <div className="field">
                        <label htmlFor="durationMinutes">Duration</label>
                        <MeetingSelect
                          id="durationMinutes"
                          value={form.durationMinutes}
                          placeholder="Select duration"
                          options={DURATION_OPTIONS}
                          onChange={(value) => setMeetingField('durationMinutes', value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

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

                {submitError ? (
                  <p className="field-error" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-light contact-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Submit message'}
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { services, getServiceById } from '../data/services'
import { SERVICE_ICONS } from '../data/icons'
import DetailModal from './DetailModal'
import './Services.css'

export default function Services() {
  const ref = useReveal()
  const [activeId, setActiveId] = useState(null)
  const active = activeId ? getServiceById(activeId) : null

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash.startsWith('service-')) {
        const id = hash.replace('service-', '')
        if (getServiceById(id)) {
          setActiveId(id)
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  useEffect(() => {
    if (!activeId) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeId])

  const openService = (id) => {
    setActiveId(id)
    window.history.replaceState(null, '', `#service-${id}`)
  }

  const closeModal = () => {
    setActiveId(null)
    if (window.location.hash.startsWith('#service-')) {
      window.history.replaceState(null, '', '#services')
    }
  }

  const goContact = (title) => {
    sessionStorage.setItem('selectedService', title)
    closeModal()
    window.location.hash = 'contact'
    window.dispatchEvent(new CustomEvent('prefill-service', { detail: title }))
  }

  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Services</span>
          <h2>Capabilities built for modern growth</h2>
          <p>From AI systems to cloud delivery — one team across product, design, and engineering.</p>
        </div>
        <div className="services-grid reveal" ref={ref}>
          {services.map((item) => (
            <article key={item.id} className="service-card">
              <div className="service-icon" aria-hidden="true">
                {SERVICE_ICONS[item.icon]}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="service-actions">
                <button type="button" className="btn btn-ghost service-btn" onClick={() => openService(item.id)}>
                  Learn more
                </button>
                <button type="button" className="btn btn-primary service-btn" onClick={() => goContact(item.title)}>
                  Get started
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <DetailModal
        open={Boolean(active)}
        onClose={closeModal}
        title={active?.title}
        image={active ? `${import.meta.env.BASE_URL}${active.image}` : ''}
        imageAlt={active?.alt}
      >
        {active ? (
          <>
            <div className="detail-meta">
              <span>{active.duration}</span>
              <span>{active.level}</span>
            </div>
            <p>{active.details}</p>
            <p className="detail-list-title">What you get</p>
            <ul className="detail-list">
              {active.modules.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="detail-list-title">Outcomes</p>
            <ul className="detail-list">
              {active.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <div className="detail-actions">
              <button type="button" className="btn btn-primary" onClick={() => goContact(active.title)}>
                Get this service
              </button>
              <button type="button" className="btn btn-ghost" onClick={closeModal}>
                Close
              </button>
            </div>
          </>
        ) : null}
      </DetailModal>
    </section>
  )
}

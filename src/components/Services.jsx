import { useCallback, useEffect, useRef, useState } from 'react'
import { services, getServiceById } from '../data/services'
import DetailModal from './DetailModal'
import './Services.css'

const SLIDE_MS = 6000

function FeatureIcon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (name) {
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16M8 17V10M12 17V7M16 17v-4" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h6" />
        </svg>
      )
    case 'image':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      )
    case 'code':
      return (
        <svg {...common}>
          <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
        </svg>
      )
    case 'bulb':
      return (
        <svg {...common}>
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.6.6 1 1.4 1 2.2V17h6v-.8c0-.8.4-1.6 1-2.2A7 7 0 0 0 12 2z" />
        </svg>
      )
    case 'scan':
      return (
        <svg {...common}>
          <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16" />
        </svg>
      )
    case 'brain':
      return (
        <svg {...common}>
          <path d="M9.5 2a4 4 0 0 0-3.5 6 3.5 3.5 0 0 0 0 6A4 4 0 0 0 12 20a4 4 0 0 0 6-3.5 3.5 3.5 0 0 0 0-6A4 4 0 0 0 14.5 2 3.5 3.5 0 0 0 12 4a3.5 3.5 0 0 0-2.5-2z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'trend':
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      )
    case 'alert':
      return (
        <svg {...common}>
          <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>
      )
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'box':
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z" />
        </svg>
      )
    case 'face':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 10h.01M15 10h.01M8 15s1.5 2 4 2 4-2 4-2" />
        </svg>
      )
    case 'video':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3z" />
        </svg>
      )
    case 'bot':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="12" rx="3" />
          <circle cx="9" cy="13" r="1.5" />
          <circle cx="15" cy="13" r="1.5" />
          <path d="M12 2v4M9 20v2M15 20v2" />
        </svg>
      )
    case 'flow':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="6" height="4" rx="1" />
          <rect x="15" y="10" width="6" height="4" rx="1" />
          <rect x="3" y="16" width="6" height="4" rx="1" />
          <path d="M9 6h3a3 3 0 0 1 3 3v1M9 18h3a3 3 0 0 0 3-3v-1" />
        </svg>
      )
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common}>
          <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

function ServiceVisual({ activeIndex }) {
  return (
    <div className="sv-stack" aria-hidden="true">
      {services.map((s, i) => (
        <div key={s.id} className={`sv-photo ${i === activeIndex ? 'is-active' : ''}`}>
          <img
            src={`${import.meta.env.BASE_URL}${s.visualImage}`}
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority={i === activeIndex ? 'high' : 'low'}
          />
        </div>
      ))}
    </div>
  )
}

export default function Services() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState('next')
  const [activeId, setActiveId] = useState(null)
  const dragX = useRef(null)
  const slideRef = useRef(null)
  const active = activeId ? getServiceById(activeId) : null
  const slide = services[index]

  // Preload every slide image so text + pic switch together
  useEffect(() => {
    services.forEach((s) => {
      const img = new Image()
      img.src = `${import.meta.env.BASE_URL}${s.visualImage}`
    })
  }, [])

  // Restart slide animation without remounting images
  useEffect(() => {
    const el = slideRef.current
    if (!el) return
    el.classList.remove('is-next', 'is-prev')
    // force reflow so animation replays
    void el.offsetWidth
    el.classList.add(dir === 'prev' ? 'is-prev' : 'is-next')
  }, [index, dir])

  const go = useCallback((nextIndex, direction = 'next') => {
    setDir(direction)
    setIndex(((nextIndex % services.length) + services.length) % services.length)
  }, [])

  const next = useCallback(() => {
    setDir('next')
    setIndex((i) => (i + 1) % services.length)
  }, [])
  const prev = useCallback(() => {
    setDir('prev')
    setIndex((i) => (i - 1 + services.length) % services.length)
  }, [])

  // Always auto-advance every 6s (pause only while detail modal is open)
  useEffect(() => {
    if (activeId) return undefined
    const t = setInterval(() => {
      setDir('next')
      setIndex((i) => (i + 1) % services.length)
    }, SLIDE_MS)
    return () => clearInterval(t)
  }, [activeId])

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash.startsWith('service-')) {
        const id = hash.replace('service-', '')
        const found = services.findIndex((s) => s.id === id)
        if (found >= 0) {
          setIndex(found)
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
      if (e.key === 'Escape') {
        setActiveId(null)
        if (window.location.hash.startsWith('#service-')) {
          window.history.replaceState(null, '', '#services')
        }
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeId])

  const closeModal = () => {
    setActiveId(null)
    if (window.location.hash.startsWith('#service-')) {
      window.history.replaceState(null, '', '#services')
    }
  }

  const learnMore = () => {
    setActiveId(slide.id)
    window.history.replaceState(null, '', `#service-${slide.id}`)
  }

  const goContact = (title) => {
    sessionStorage.setItem('selectedService', title)
    closeModal()
    window.open(`${import.meta.env.BASE_URL}message.html`, '_blank', 'noopener,noreferrer')
  }

  const onPointerDown = (e) => {
    dragX.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (dragX.current == null) return
    const dx = e.clientX - dragX.current
    dragX.current = null
    if (Math.abs(dx) < 40) return
    if (dx < 0) next()
    else prev()
  }

  return (
    <section id="services" className="section services-section">
      <div className="services-wrap">
        <div className="section-head center">
          <span className="eyebrow">Services</span>
          <h2>Unique AI services built for real outcomes</h2>
          <p>From chatbots to vision and agentic automation — explore each service below.</p>
        </div>

        <div
          className="services-carousel"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="services-slide" ref={slideRef}>
            <div className="services-copy">
              <span className={`svc-badge badge-${slide.badgeIcon}`}>
                <FeatureIcon name={slide.badgeIcon} />
                {slide.badge}
              </span>
              <h3 className="svc-title">
                {slide.titleLead} <span>{slide.titleAccent}</span>
              </h3>
              <p className="svc-desc">{slide.desc}</p>

              {slide.featureStyle === 'pills' && (
                <div className="svc-pills">
                  {slide.features.map((f) => (
                    <span key={f.label} className="svc-pill">
                      <FeatureIcon name={f.icon} />
                      {f.label}
                    </span>
                  ))}
                </div>
              )}

              {slide.featureStyle === 'list' && (
                <ul className="svc-list">
                  {slide.features.map((f) => (
                    <li key={f.label}>
                      <span className="svc-list-icon">
                        <FeatureIcon name={f.icon} />
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>
              )}

              {slide.featureStyle === 'rich' && (
                <ul className="svc-rich">
                  {slide.features.map((f) => (
                    <li key={f.label}>
                      <span className="svc-list-icon">
                        <FeatureIcon name={f.icon} />
                      </span>
                      <div>
                        <strong>{f.label}</strong>
                        {f.sub ? <small>{f.sub}</small> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <button type="button" className="btn btn-primary svc-learn" onClick={learnMore}>
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="services-visual">
              <ServiceVisual activeIndex={index} />
            </div>
          </div>

          <div className="services-dots" role="tablist" aria-label="Service slides">
            {services.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${s.title} (${i + 1} of ${services.length})`}
                className={`services-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i, i > index || (index === services.length - 1 && i === 0) ? 'next' : 'prev')}
              >
                <span key={`fill-${index}-${i}`} className="services-dot-fill" />
              </button>
            ))}
          </div>

          <button type="button" className="services-nav services-prev" onClick={prev} aria-label="Previous service">
            ‹
          </button>
          <button type="button" className="services-nav services-next" onClick={next} aria-label="Next service">
            ›
          </button>
        </div>
      </div>

      <DetailModal open={Boolean(active)} onClose={closeModal} title={active?.title}>
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

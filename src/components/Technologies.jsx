import { useEffect, useRef } from 'react'
import { technologies } from '../data/content'
import './Technologies.css'

export default function Technologies() {
  const track = [...technologies, ...technologies]
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef(false)
  const lastXRef = useRef(0)
  const pausedRef = useRef(false)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.current) return undefined

    let raf = 0
    const speed = 0.55

    const tick = () => {
      const el = trackRef.current
      if (el && !draggingRef.current && !pausedRef.current) {
        const half = el.scrollWidth / 2
        if (half > 0) {
          offsetRef.current -= speed
          if (-offsetRef.current >= half) offsetRef.current += half
          if (offsetRef.current > 0) offsetRef.current -= half
          el.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const wrapOffset = () => {
    const el = trackRef.current
    if (!el) return
    const half = el.scrollWidth / 2
    if (half <= 0) return
    while (-offsetRef.current >= half) offsetRef.current += half
    while (offsetRef.current > 0) offsetRef.current -= half
  }

  const onPointerDown = (e) => {
    if (reducedMotion.current) return
    draggingRef.current = true
    lastXRef.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
    e.currentTarget.classList.add('is-dragging')
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current || reducedMotion.current) return
    const el = trackRef.current
    if (!el) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    offsetRef.current += dx
    wrapOffset()
    el.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
  }

  const endDrag = (e) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.classList.remove('is-dragging')
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* already released */
    }
  }

  return (
    <section id="technologies" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Technologies</span>
          <h2>Modern stack. Proven delivery.</h2>
          <p>Tools we use across AI models, automation, data, cloud, and product delivery.</p>
        </div>
      </div>

      <div
        className="tech-marquee"
        aria-label="Technology logos"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (draggingRef.current) endDrag(e)
          pausedRef.current = false
        }}
        onMouseEnter={() => {
          if (!draggingRef.current) pausedRef.current = true
        }}
        onMouseLeave={() => {
          pausedRef.current = false
        }}
      >
        <div className="tech-track" ref={trackRef}>
          {track.map((tech, i) => (
            <div key={`${tech.name}-${i}`} className={`tech-card${tech.hideName ? ' tech-card-logo-only' : ''}`}>
              <img
                src={`${import.meta.env.BASE_URL}${tech.image}`}
                alt={tech.hideName ? tech.name : ''}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              {!tech.hideName ? <strong>{tech.name}</strong> : null}
              <span>{tech.group}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

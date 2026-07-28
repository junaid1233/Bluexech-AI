import { useEffect, useMemo, useRef } from 'react'
import './Hero.css'

const STROKE_COLORS = ['rgba(255,255,255,0.1)', 'rgba(120,180,255,0.2)', 'rgba(80,150,255,0.28)']

const createSeededRandom = (seed) => {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export default function Hero() {
  const bgRef = useRef(null)
  const videoRef = useRef(null)

  const waveLines = useMemo(() => {
    const rnd = createSeededRandom(20260728)
    return Array.from({ length: 28 }, (_, index) => {
      const n = index / 27
      const baseY = -120 + n * 1240
      const slope = (rnd() - 0.5) * 180
      const amp = 14 + rnd() * 28
      const midY = baseY + slope * 0.5
      const endY = baseY + slope
      return {
        id: `line-${index}`,
        d: `M -240 ${baseY.toFixed(0)} C 200 ${(baseY + amp).toFixed(0)}, 700 ${(baseY - amp).toFixed(0)}, 960 ${midY.toFixed(0)} S 1500 ${(midY + amp * 0.6).toFixed(0)}, 1840 ${endY.toFixed(0)}`,
        delay: `${(-rnd() * 20).toFixed(1)}s`,
        duration: `${(22 + rnd() * 16).toFixed(1)}s`,
        opacity: (0.35 + rnd() * 0.5).toFixed(2),
        width: (0.55 + rnd() * 0.4).toFixed(2),
        color: STROKE_COLORS[Math.floor(rnd() * STROKE_COLORS.length)]
      }
    })
  }, [])

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let active = false

    const onMove = (event) => {
      const bounds = bg.parentElement.getBoundingClientRect()
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 5
      if (!active) {
        active = true
        frame = requestAnimationFrame(tick)
      }
    }

    const onLeave = () => {
      targetX = 0
      targetY = 0
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1
      bg.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = requestAnimationFrame(tick)
      } else {
        active = false
        bg.style.transform = `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0)`
      }
    }

    const hero = bg.parentElement
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.defaultPlaybackRate = 1
    video.playbackRate = 1

    const ensurePlay = () => {
      video.playbackRate = 1
      if (video.paused) {
        const p = video.play()
        if (p?.catch) p.catch(() => {})
      }
    }

    const onVisible = (entries) => {
      const entry = entries[0]
      if (!entry) return
      if (entry.isIntersecting) ensurePlay()
      else video.pause()
    }

    const observer = new IntersectionObserver(onVisible, { threshold: 0.2 })
    observer.observe(video)

    video.addEventListener('canplay', ensurePlay)
    video.addEventListener('stalled', ensurePlay)
    video.addEventListener('waiting', ensurePlay)
    ensurePlay()

    return () => {
      observer.disconnect()
      video.removeEventListener('canplay', ensurePlay)
      video.removeEventListener('stalled', ensurePlay)
      video.removeEventListener('waiting', ensurePlay)
    }
  }, [])

  return (
    <section id="home" className="hero" aria-label="Bluexech AI">
      <div className="hero-line-bg" ref={bgRef} aria-hidden="true">
        <svg className="hero-wave-svg" viewBox="0 0 1600 1000" fill="none" preserveAspectRatio="xMidYMid slice">
          <g className="hero-wave-main">
            {waveLines.map((line) => (
              <path
                key={line.id}
                className="hero-wave-line"
                d={line.d}
                stroke={line.color}
                strokeWidth={line.width}
                opacity={line.opacity}
                style={{
                  '--line-delay': line.delay,
                  '--line-duration': line.duration
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="hero-brand">Bluexech AI</p>
          <h1>Stop Guessing. Start Growing with AI.</h1>
          <p className="hero-lead">
            We help teams automate workflows, improve efficiency, and move faster with production-grade AI systems.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary">
              Book Free Strategy Call
            </a>
            <a href="#services" className="btn btn-ghost">
              Explore Services
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-media">
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-label="Bluexech AI product showcase"
            >
              <source src={`${import.meta.env.BASE_URL}videos/hero.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}

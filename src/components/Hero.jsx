import { useEffect, useMemo, useRef } from 'react'
import './Hero.css'

const STROKE_COLORS = ['rgba(255,255,255,0.08)', 'rgba(120,180,255,0.18)', 'rgba(80,150,255,0.25)']

const createSeededRandom = (seed) => () => {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export default function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const { waveLines, particleTracks } = useMemo(() => {
    const rnd = createSeededRandom(20260728)()
    const lineCount = 112
    const lines = Array.from({ length: lineCount }, (_, index) => {
      const n = index / (lineCount - 1)
      const baseY = -250 + n * 1450
      const slope = (rnd() - 0.5) * 260
      const ampA = 10 + rnd() * 36
      const ampB = 8 + rnd() * 42
      const ampC = 12 + rnd() * 30
      const midY = baseY + slope * 0.52
      const endY = baseY + slope
      const cp1y = baseY + ampA
      const cp2y = baseY - ampB
      const cp3y = midY + ampC * (rnd() > 0.5 ? 1 : -1)
      const duration = 28 + rnd() * 24
      const waveDuration = 16 + rnd() * 16
      const breathDuration = 6 + rnd() * 7
      return {
        id: `line-${index}`,
        d: `M -320 ${baseY.toFixed(2)} C 120 ${cp1y.toFixed(2)}, 580 ${cp2y.toFixed(2)}, 900 ${midY.toFixed(2)} S 1500 ${cp3y.toFixed(2)}, 1920 ${endY.toFixed(2)}`,
        delay: `${(-rnd() * duration).toFixed(2)}s`,
        duration: `${duration.toFixed(2)}s`,
        waveDuration: `${waveDuration.toFixed(2)}s`,
        breathDuration: `${breathDuration.toFixed(2)}s`,
        opacity: (0.34 + rnd() * 0.64).toFixed(3),
        width: (0.5 + rnd() * 0.5).toFixed(2),
        sway: `${(-10 + rnd() * 20).toFixed(2)}px`,
        driftY: `${(-14 + rnd() * 28).toFixed(2)}px`,
        travelX: `${(16 + rnd() * 30).toFixed(2)}px`,
        color: STROKE_COLORS[Math.floor(rnd() * STROKE_COLORS.length)]
      }
    })

    const tracks = lines
      .filter((_, index) => index % 14 === 0)
      .map((line, index) => ({
        id: `particle-${index}`,
        d: line.d,
        duration: `${14 + rnd() * 16}s`,
        delay: `${(-rnd() * 12).toFixed(2)}s`,
        radius: (0.85 + rnd() * 1.5).toFixed(2),
        opacity: (0.45 + rnd() * 0.5).toFixed(2)
      }))

    return { waveLines: lines, particleTracks: tracks }
  }, [])

  useEffect(() => {
    const node = heroRef.current
    if (!node || typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    let frame = 0

    const setParallax = (event) => {
      const bounds = node.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width
      const y = (event.clientY - bounds.top) / bounds.height
      const px = (x - 0.5) * 12
      const py = (y - 0.5) * 8

      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        node.style.setProperty('--parallax-x', `${px.toFixed(2)}px`)
        node.style.setProperty('--parallax-y', `${py.toFixed(2)}px`)
      })
    }

    const resetParallax = () => {
      node.style.setProperty('--parallax-x', '0px')
      node.style.setProperty('--parallax-y', '0px')
    }

    node.addEventListener('pointermove', setParallax, { passive: true })
    node.addEventListener('pointerleave', resetParallax)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      node.removeEventListener('pointermove', setParallax)
      node.removeEventListener('pointerleave', resetParallax)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultPlaybackRate = 1
    video.playbackRate = 1

    const forceNormalSpeed = () => {
      if (video.playbackRate !== 1) {
        video.playbackRate = 1
      }
    }

    video.addEventListener('ratechange', forceNormalSpeed)
    return () => {
      video.removeEventListener('ratechange', forceNormalSpeed)
    }
  }, [])

  return (
    <section id="home" className="hero" aria-label="Bluexech AI" ref={heroRef}>
      <div className="hero-line-bg" aria-hidden="true">
        <svg className="hero-wave-svg" viewBox="0 0 1600 1000" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroLineGradient" x1="0" y1="0" x2="1600" y2="1000" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#89a8ff" />
              <stop offset="0.5" stopColor="#47bfff" />
              <stop offset="1" stopColor="#1d68ff" />
            </linearGradient>
            <filter id="heroLineBlur" x="-40%" y="-40%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.6" />
            </filter>
            <filter id="heroParticleGlow" x="-220%" y="-220%" width="520%" height="520%">
              <feGaussianBlur stdDeviation="3.8" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="hero-wave-glow" filter="url(#heroLineBlur)">
            {waveLines.map((line) => (
              <path
                key={`${line.id}-glow`}
                className="hero-wave-line"
                d={line.d}
                style={{
                  '--line-delay': line.delay,
                  '--line-duration': line.duration,
                  '--line-wave-duration': line.waveDuration,
                  '--line-breath-duration': line.breathDuration,
                  '--line-opacity': Number(line.opacity) * 0.32,
                  '--line-width': Number(line.width) + 0.35,
                  '--line-sway': line.sway,
                  '--line-drift-y': line.driftY,
                  '--line-travel-x': line.travelX,
                  '--line-color': line.color
                }}
              />
            ))}
          </g>

          <g className="hero-wave-main">
            {waveLines.map((line) => (
              <path
                key={line.id}
                className="hero-wave-line"
                d={line.d}
                style={{
                  '--line-delay': line.delay,
                  '--line-duration': line.duration,
                  '--line-wave-duration': line.waveDuration,
                  '--line-breath-duration': line.breathDuration,
                  '--line-opacity': line.opacity,
                  '--line-width': line.width,
                  '--line-sway': line.sway,
                  '--line-drift-y': line.driftY,
                  '--line-travel-x': line.travelX,
                  '--line-color': line.color
                }}
              />
            ))}
          </g>

          <g className="hero-path-particles" filter="url(#heroParticleGlow)">
            {particleTracks.map((track) => (
              <circle key={track.id} r={track.radius} fill="#8bc2ff" opacity={track.opacity}>
                <animate attributeName="opacity" values="0.2;0.95;0.3;0.8;0.2" dur="5.8s" repeatCount="indefinite" />
                <animateMotion dur={track.duration} begin={track.delay} repeatCount="indefinite" path={track.d} rotate="auto" />
              </circle>
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
              aria-label="Bluexech AI product showcase"
            >
              <source src={`${import.meta.env.BASE_URL}videos/hero.mp4`} type="video/mp4" />
            </video>

            <div className="hero-media-shade" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

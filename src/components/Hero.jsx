import { useEffect, useMemo, useRef } from 'react'
import './Hero.css'

const STROKE_COLORS = ['rgba(255,255,255,0.08)', 'rgba(120,180,255,0.18)', 'rgba(80,150,255,0.25)']

const createSeededRandom = (seed) => {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export default function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const { waveLines, glowLines, particleTracks } = useMemo(() => {
    const rnd = createSeededRandom(20260728)
    const lineCount = 48
    const lines = Array.from({ length: lineCount }, (_, index) => {
      const n = index / (lineCount - 1)
      const baseY = -180 + n * 1360
      const slope = (rnd() - 0.5) * 220
      const ampA = 10 + rnd() * 32
      const ampB = 8 + rnd() * 36
      const ampC = 12 + rnd() * 28
      const midY = baseY + slope * 0.52
      const endY = baseY + slope
      const duration = 26 + rnd() * 20
      return {
        id: `line-${index}`,
        d: `M -280 ${baseY.toFixed(1)} C 160 ${(baseY + ampA).toFixed(1)}, 560 ${(baseY - ampB).toFixed(1)}, 880 ${midY.toFixed(1)} S 1480 ${(midY + ampC * (rnd() > 0.5 ? 1 : -1)).toFixed(1)}, 1880 ${endY.toFixed(1)}`,
        delay: `${(-rnd() * duration).toFixed(2)}s`,
        duration: `${duration.toFixed(2)}s`,
        breathDuration: `${(7 + rnd() * 6).toFixed(2)}s`,
        opacity: (0.4 + rnd() * 0.55).toFixed(3),
        width: (0.5 + rnd() * 0.5).toFixed(2),
        travelX: `${(18 + rnd() * 28).toFixed(1)}px`,
        driftY: `${(-12 + rnd() * 24).toFixed(1)}px`,
        color: STROKE_COLORS[Math.floor(rnd() * STROKE_COLORS.length)]
      }
    })

    const glow = lines.filter((_, index) => index % 4 === 0)
    const tracks = lines
      .filter((_, index) => index % 12 === 0)
      .slice(0, 4)
      .map((line, index) => ({
        id: `particle-${index}`,
        d: line.d,
        duration: `${12 + rnd() * 10}s`,
        delay: `${(-rnd() * 8).toFixed(2)}s`,
        radius: (1 + rnd() * 1.2).toFixed(2),
        opacity: (0.5 + rnd() * 0.4).toFixed(2)
      }))

    return { waveLines: lines, glowLines: glow, particleTracks: tracks }
  }, [])

  useEffect(() => {
    const node = heroRef.current
    if (!node || typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const setParallax = (event) => {
      const bounds = node.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width
      const y = (event.clientY - bounds.top) / bounds.height
      targetX = (x - 0.5) * 10
      targetY = (y - 0.5) * 6
    }

    const resetParallax = () => {
      targetX = 0
      targetY = 0
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      node.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`)
      node.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`)
      frame = requestAnimationFrame(tick)
    }

    node.addEventListener('pointermove', setParallax, { passive: true })
    node.addEventListener('pointerleave', resetParallax)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      node.removeEventListener('pointermove', setParallax)
      node.removeEventListener('pointerleave', resetParallax)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultPlaybackRate = 1
    video.playbackRate = 1

    const playVideo = () => {
      video.playbackRate = 1
      const playPromise = video.play()
      if (playPromise?.catch) playPromise.catch(() => {})
    }

    const forceNormalSpeed = () => {
      if (video.playbackRate !== 1) video.playbackRate = 1
    }

    video.addEventListener('loadeddata', playVideo)
    video.addEventListener('canplay', playVideo)
    video.addEventListener('ratechange', forceNormalSpeed)
    playVideo()

    return () => {
      video.removeEventListener('loadeddata', playVideo)
      video.removeEventListener('canplay', playVideo)
      video.removeEventListener('ratechange', forceNormalSpeed)
    }
  }, [])

  return (
    <section id="home" className="hero" aria-label="Bluexech AI" ref={heroRef}>
      <div className="hero-line-bg" aria-hidden="true">
        <svg className="hero-wave-svg" viewBox="0 0 1600 1000" fill="none" preserveAspectRatio="none">
          <defs>
            <filter id="heroParticleGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2.4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="hero-wave-glow">
            {glowLines.map((line) => (
              <path
                key={`${line.id}-glow`}
                className="hero-wave-line hero-wave-line-glow"
                d={line.d}
                style={{
                  '--line-delay': line.delay,
                  '--line-duration': line.duration,
                  '--line-breath-duration': line.breathDuration,
                  '--line-opacity': Number(line.opacity) * 0.28,
                  '--line-width': Number(line.width) + 0.8,
                  '--line-travel-x': line.travelX,
                  '--line-drift-y': line.driftY,
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
                  '--line-breath-duration': line.breathDuration,
                  '--line-opacity': line.opacity,
                  '--line-width': line.width,
                  '--line-travel-x': line.travelX,
                  '--line-drift-y': line.driftY,
                  '--line-color': line.color
                }}
              />
            ))}
          </g>

          <g className="hero-path-particles" filter="url(#heroParticleGlow)">
            {particleTracks.map((track) => (
              <circle key={track.id} r={track.radius} fill="#8bc2ff" opacity={track.opacity}>
                <animateMotion dur={track.duration} begin={track.delay} repeatCount="indefinite" path={track.d} />
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

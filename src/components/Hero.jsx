import { useEffect, useMemo, useRef } from 'react'
import './Hero.css'

export default function Hero() {
  const heroRef = useRef(null)
  const waveLines = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => {
        const y = -140 + index * 34
        const ampA = 16 + (index % 6) * 5
        const ampB = 12 + ((index + 3) % 5) * 6
        return {
          id: `line-${index}`,
          d: `M -260 ${y} C 140 ${y + ampA}, 360 ${y - ampA}, 720 ${y} S 1240 ${y + ampB}, 1720 ${y}`,
          delay: `${(index % 10) * -0.55}s`,
          duration: `${18 + (index % 7) * 1.7}s`,
          opacity: (0.08 + (index % 8) * 0.035).toFixed(3),
          width: (0.7 + (index % 4) * 0.22).toFixed(2),
          sway: `${8 + (index % 6) * 2}px`
        }
      }),
    []
  )

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
      const px = (x - 0.5) * 20
      const py = (y - 0.5) * 14

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

  return (
    <section id="home" className="hero" aria-label="Bluexech AI" ref={heroRef}>
      <div className="hero-line-bg" aria-hidden="true">
        <svg className="hero-wave-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroLineGradient" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#89a8ff" />
              <stop offset="0.5" stopColor="#47bfff" />
              <stop offset="1" stopColor="#1d68ff" />
            </linearGradient>
            <filter id="heroLineBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>
          </defs>

          <g className="hero-wave-glow" stroke="url(#heroLineGradient)" filter="url(#heroLineBlur)">
            {waveLines.map((line) => (
              <path
                key={`${line.id}-glow`}
                className="hero-wave-line"
                d={line.d}
                style={{
                  '--line-delay': line.delay,
                  '--line-duration': line.duration,
                  '--line-opacity': Number(line.opacity) * 0.55,
                  '--line-width': Number(line.width) + 0.25,
                  '--line-sway': line.sway
                }}
              />
            ))}
          </g>

          <g className="hero-wave-main" stroke="url(#heroLineGradient)">
            {waveLines.map((line) => (
              <path
                key={line.id}
                className="hero-wave-line"
                d={line.d}
                style={{
                  '--line-delay': line.delay,
                  '--line-duration': line.duration,
                  '--line-opacity': line.opacity,
                  '--line-width': line.width,
                  '--line-sway': line.sway
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

            <svg
              className="hero-neural"
              viewBox="0 0 560 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="neuralStroke" x1="40" y1="40" x2="520" y2="380" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#06B6D4" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className="neural-links" stroke="url(#neuralStroke)" strokeWidth="1.4" strokeLinecap="round">
                <path className="link link-a" d="M48 70 L140 110 L240 55" strokeDasharray="7 12" />
                <path className="link link-b" d="M480 80 L400 140 L520 200" strokeDasharray="6 11" />
                <path className="link link-c" d="M60 340 L150 300 L80 250" strokeDasharray="8 14" />
              </g>

              <ellipse
                className="orbit-ring"
                cx="280"
                cy="210"
                rx="200"
                ry="125"
                stroke="#2563EB"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity="0.28"
              />

              <g filter="url(#nodeGlow)">
                <circle className="node node-a" cx="48" cy="70" r="4.5" fill="#06B6D4" />
                <circle className="node node-b" cx="140" cy="110" r="5.5" fill="#2563EB" />
                <circle className="node node-c" cx="240" cy="55" r="4" fill="#06B6D4" />
                <circle className="node node-d" cx="480" cy="80" r="4.5" fill="#2563EB" />
                <circle className="node node-e" cx="400" cy="140" r="5" fill="#06B6D4" />
                <circle className="node node-f" cx="520" cy="200" r="4" fill="#2563EB" />
                <circle className="node node-g" cx="60" cy="340" r="4.5" fill="#06B6D4" />
                <circle className="node node-h" cx="150" cy="300" r="5" fill="#2563EB" />
                <circle className="node node-i" cx="80" cy="250" r="4" fill="#06B6D4" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

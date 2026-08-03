import { useEffect, useRef } from 'react'
import HeroNetworkBackground from './HeroNetworkBackground'
import './Hero.css'

export default function Hero() {
  const heroRef = useRef(null)
  const bgRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const bg = bgRef.current
    if (!hero || !bg) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let active = false

    const onMove = (event) => {
      const bounds = hero.getBoundingClientRect()
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
    <section id="home" className="hero" aria-label="Bluexech AI" ref={heroRef}>
      <div className="hero-bg-wrap" ref={bgRef}>
        <HeroNetworkBackground />
      </div>

      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="hero-brand">Bluexech AI</p>
          <h1>Build Smarter with Unique AI Solutions & Intelligent Automation</h1>
          <p className="hero-lead">
            We help businesses grow with AI chatbots, generative systems, document intelligence, predictive analytics, and agentic automation.
          </p>
          <div className="hero-ctas">
            <a href={`${import.meta.env.BASE_URL}message.html`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Get Started
            </a>
            <a href={`${import.meta.env.BASE_URL}message.html`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Book Free Consultation
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

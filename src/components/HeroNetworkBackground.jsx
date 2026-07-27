import { useEffect, useRef } from 'react'
import './HeroNetworkBackground.css'

/**
 * AI neural-network canvas — hero section ONLY.
 * Place: inside <section className="hero"> as the first child (behind content).
 */
export default function HeroNetworkBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = matchMedia('(max-width: 768px)').matches

    let nodes = []
    let raf = 0
    let running = true
    let frameSkip = 0
    let w = 0
    let h = 0
    let dpr = 1

    const rand = (min, max) => min + Math.random() * (max - min)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      w = parent.clientWidth
      h = parent.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Fewer nodes on mobile for performance
      const count = Math.min(
        mobile ? 38 : 70,
        Math.max(22, Math.floor((w * h) / (mobile ? 18000 : 14000))),
      )

      nodes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.25, 0.25),
        r: rand(1.2, 2.4),
      }))
    }

    const draw = () => {
      if (!running) return

      // Pause when tab is hidden
      if (document.hidden) {
        raf = requestAnimationFrame(draw)
        return
      }

      // Halve FPS on mobile
      if (mobile) {
        frameSkip = (frameSkip + 1) % 2
        if (frameSkip) {
          raf = requestAnimationFrame(draw)
          return
        }
      }

      ctx.clearRect(0, 0, w, h)

      // Soft dark-blue vignette blend (drawn under nodes)
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7)
      glow.addColorStop(0, 'rgba(37, 99, 235, 0.08)')
      glow.addColorStop(1, 'rgba(5, 8, 22, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      const linkDist = mobile ? 110 : 140
      const speed = reduced ? 0 : 1

      // Move nodes slowly
      for (const n of nodes) {
        if (speed) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          n.x = Math.max(0, Math.min(w, n.x))
          n.y = Math.max(0, Math.min(h, n.y))
        }
      }

      // Draw glowing connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > linkDist) continue

          const alpha = (1 - dist / linkDist) * 0.55
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Draw dots
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(125, 211, 252, 0.9)'
        ctx.shadowColor = 'rgba(37, 99, 235, 0.85)'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="hero-network" aria-hidden="true">
      {/* Dark blue / black gradient base */}
      <div className="hero-network-gradient" />
      {/* Animated AI network canvas */}
      <canvas ref={canvasRef} className="hero-network-canvas" />
    </div>
  )
}

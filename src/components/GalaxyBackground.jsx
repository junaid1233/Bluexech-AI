import { useEffect, useRef } from 'react'
import './GalaxyBackground.css'

export default function GalaxyBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const colors = ['34,211,238', '10,102,255', '139,92,246']
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = matchMedia('(max-width: 768px)').matches
    const density = mobile ? 0.4 : 1

    let stars = []
    let frame = 0
    let raf = 0
    let skip = 0

    const rand = (min, max) => min + Math.random() * (max - min)
    const pick = () => colors[Math.floor(Math.random() * colors.length)]

    const resize = () => {
      canvas.width = innerWidth
      canvas.height = innerHeight
      spawn()
    }

    const spawn = () => {
      const count = Math.min(180, Math.floor((canvas.width * canvas.height) / 9000) * density)
      stars = Array.from({ length: count }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        z: rand(0.2, 1),
        r: rand(0.3, 1.6),
        tw: rand(0, Math.PI * 2),
        c: pick(),
      }))
    }

    const draw = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw)
        return
      }

      if (mobile) {
        skip = (skip + 1) % 2
        if (skip) {
          raf = requestAnimationFrame(draw)
          return
        }
      }

      frame += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        const twinkle = reduced ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.02 + s.tw))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${s.c},${twinkle * s.z})`
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="galaxy" aria-hidden="true">
      <div className="galaxy-mesh" />
      <div className="galaxy-grid" />
      <canvas ref={canvasRef} className="galaxy-stars" />
    </div>
  )
}

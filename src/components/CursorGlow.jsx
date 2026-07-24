import { useEffect, useRef } from 'react'
import './CursorGlow.css'

export default function CursorGlow() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const fine = matchMedia('(pointer: fine)').matches
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) {
      ring.style.display = 'none'
      dot.style.display = 'none'
      return
    }

    let x = innerWidth / 2
    let y = innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let visible = false

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        ring.classList.add('is-on')
        dot.classList.add('is-on')
        rx = x
        ry = y
      }
    }

    const onDown = () => {
      ring.classList.add('is-down')
      dot.classList.add('is-down')
    }

    const onUp = () => {
      ring.classList.remove('is-down')
      dot.classList.remove('is-down')
    }

    const onLeave = () => {
      visible = false
      ring.classList.remove('is-on')
      dot.classList.remove('is-on')
    }

    const tick = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', onDown)
    addEventListener('pointerup', onUp)
    addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

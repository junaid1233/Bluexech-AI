import { useMemo } from 'react'
import './FlowingLines.css'

const STROKE_COLORS = [
  'rgba(255,255,255,0.22)',
  'rgba(120,180,255,0.38)',
  'rgba(80,150,255,0.48)',
]

const createSeededRandom = (seed) => {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function buildLines(count, seed, speedBoost = 1) {
  const rnd = createSeededRandom(seed)
  return Array.from({ length: count }, (_, index) => {
    const n = count <= 1 ? 0.5 : index / (count - 1)
    const baseY = -120 + n * 1240
    const slope = (rnd() - 0.5) * 180
    const amp = 14 + rnd() * 28
    const midY = baseY + slope * 0.5
    const endY = baseY + slope
    // Faster motion: shorter duration (speedBoost > 1 = faster)
    const duration = (12 + rnd() * 10) / speedBoost

    return {
      id: `flow-line-${seed}-${index}`,
      d: `M -240 ${baseY.toFixed(0)} C 200 ${(baseY + amp).toFixed(0)}, 700 ${(baseY - amp).toFixed(0)}, 960 ${midY.toFixed(0)} S 1500 ${(midY + amp * 0.6).toFixed(0)}, 1840 ${endY.toFixed(0)}`,
      delay: `${(-rnd() * 12).toFixed(1)}s`,
      duration: `${duration.toFixed(1)}s`,
      opacity: (0.55 + rnd() * 0.4).toFixed(2),
      width: (0.7 + rnd() * 0.45).toFixed(2),
      color: STROKE_COLORS[Math.floor(rnd() * STROKE_COLORS.length)],
    }
  })
}

/**
 * Animated SVG flowing lines — reusable for hero background or video overlay.
 * @param {'background' | 'overlay'} variant
 */
export default function FlowingLines({ variant = 'background', className = '' }) {
  const isOverlay = variant === 'overlay'
  const lineCount = isOverlay ? 18 : 32
  const seed = isOverlay ? 90817263 : 20260728
  const speedBoost = isOverlay ? 1.35 : 1.25

  const lines = useMemo(
    () => buildLines(lineCount, seed, speedBoost),
    [lineCount, seed, speedBoost],
  )

  return (
    <div
      className={`flowing-lines flowing-lines--${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        className="flowing-lines-svg"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="flowing-lines-group">
          {lines.map((line) => (
            <path
              key={line.id}
              className="flowing-lines-path"
              d={line.d}
              stroke={line.color}
              strokeWidth={line.width}
              opacity={line.opacity}
              style={{
                '--line-delay': line.delay,
                '--line-duration': line.duration,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

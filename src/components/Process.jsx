import { useReveal } from '../hooks/useReveal'
import './Process.css'

const steps = [
  { title: 'Align', tone: 'orange' },
  { title: 'Explore', tone: 'sky' },
  { title: 'Blueprint', tone: 'violet' },
  { title: 'Craft', tone: 'cyan' },
  { title: 'Prove', tone: 'blue' },
]

/** Pill centers - viewBox 620 x 340 */
const points = [
  { x: 90, y: 258 },
  { x: 211, y: 194 },
  { x: 329, y: 136 },
  { x: 450, y: 80 },
  { x: 555, y: 37 },
]

/**
 * Diameter circle: starts on current step, ends on next step (connected).
 * Centers sit on the path so neighbouring circles only meet at the shared step.
 */
const links = points.slice(0, -1).map((from, i) => {
  const to = points[i + 1]
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.hypot(dx, dy)
  return {
    cx: (from.x + to.x) / 2,
    cy: (from.y + to.y) / 2,
    r: dist / 2,
    arrows: [40, 220],
  }
})

function RingArrow({ cx, cy, r, deg }) {
  const rad = (deg * Math.PI) / 180
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  const rot = deg + 90
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-5.5 -4.5 L6.5 0 L-5.5 4.5 Z" className="build-ring-arrow" />
    </g>
  )
}

export default function Process() {
  const ref = useReveal()

  return (
    <section id="process" className="section">
      <div className="container">
        <div className="build-project reveal" ref={ref}>
          <div className="build-copy">
            <span className="eyebrow">How we deliver</span>
            <h2>Build your project</h2>
            <p>
              Experience the potential of your business with Bluexech AI - from discovery and product
              design to intelligent systems, automation, and reliable launch support.
            </p>
            <p>
              Strengthen your digital presence with a skilled team that turns ideas into solutions
              people actually use.
            </p>
            <a href="#contact" className="btn btn-primary">
              Start a project
            </a>
          </div>

          <div className="build-cycle" aria-label="Project delivery cycle">
            <svg className="build-cycle-art" viewBox="0 0 620 340" role="img" aria-hidden="true">
              {links.map((ring, i) => (
                <g
                  key={i}
                  className={`build-link build-link-${i + 1}`}
                  style={{ transformOrigin: `${ring.cx}px ${ring.cy}px` }}
                >
                  <circle cx={ring.cx} cy={ring.cy} r={ring.r} className="build-ring" />
                  {ring.arrows.map((deg) => (
                    <RingArrow key={deg} cx={ring.cx} cy={ring.cy} r={ring.r} deg={deg} />
                  ))}
                </g>
              ))}
            </svg>

            <div className="build-pills">
              {steps.map((step, i) => (
                <span key={step.title} className={`build-pill build-pill-${step.tone} build-pill-${i + 1}`}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

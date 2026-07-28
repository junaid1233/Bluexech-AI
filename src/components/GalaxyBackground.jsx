import './GalaxyBackground.css'

/** Soft site-wide dark base + aurora orbs + Markenexus-style line grid */
export default function GalaxyBackground() {
  return (
    <div className="galaxy" aria-hidden="true">
      <div className="galaxy-orb galaxy-orb-primary" />
      <div className="galaxy-orb galaxy-orb-accent" />
      <div className="galaxy-orb galaxy-orb-purple" />
      <div className="galaxy-grid" />
    </div>
  )
}

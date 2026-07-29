import './DetailModal.css'

export default function DetailModal({ open, onClose, title, children, image, imageAlt }) {
  if (!open) return null

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="detail-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {image ? (
          <div className="detail-media">
            <img src={image} alt={imageAlt || title} />
          </div>
        ) : null}
        <div className="detail-body">
          <h3>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}

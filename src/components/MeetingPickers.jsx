import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './MeetingPickers.css'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const VIEWPORT_PAD = 12
const GAP = 8

function pad(n) {
  return String(n).padStart(2, '0')
}

function toYmd(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseYmd(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatDisplayDate(value) {
  const d = parseYmd(value)
  if (!d) return 'Select date'
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDisplayTime(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return 'Select time'
  const [h, m] = value.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${pad(m)} ${suffix}`
}

function buildMonthCells(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(viewYear, viewMonth, day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** Keep floating panel inside the form card AND the visible viewport. */
function measurePanelNaturalHeight(panel) {
  const styles = getComputedStyle(panel)
  const padY = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0)
  const scrollEl = panel.querySelector('.mp-panel-scroll')
  const foot = panel.querySelector('.mp-panel-foot')
  const footStyles = foot ? getComputedStyle(foot) : null
  const footExtra = foot
    ? foot.offsetHeight +
      (parseFloat(footStyles.marginTop) || 0) +
      (parseFloat(footStyles.borderTopWidth) || 0)
    : 0
  const bodyHeight = scrollEl ? scrollEl.scrollHeight : panel.scrollHeight
  return Math.ceil(padY + bodyHeight + footExtra)
}

/** Keep floating panel inside the form card AND the visible viewport. */
function useAnchoredPanel(open, triggerRef, panelRef, options = {}) {
  const { minWidth = 0 } = options
  const [style, setStyle] = useState({})
  const [placement, setPlacement] = useState('bottom')

  useLayoutEffect(() => {
    if (!open) return undefined

    const update = () => {
      const trigger = triggerRef.current
      const panel = panelRef.current
      if (!trigger || !panel) return

      const rect = trigger.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      const host =
        trigger.closest('.message-form-card, .contact-box, .message-stack') || null
      const hostRect = host?.getBoundingClientRect()

      const clipLeft = Math.max(VIEWPORT_PAD, hostRect ? hostRect.left + 8 : VIEWPORT_PAD)
      const clipRight = Math.min(vw - VIEWPORT_PAD, hostRect ? hostRect.right - 8 : vw - VIEWPORT_PAD)
      // Always prefer visible screen for vertical clip so long form cards don't unlock huge menus
      const clipTop = Math.max(VIEWPORT_PAD, hostRect ? Math.max(hostRect.top + 8, VIEWPORT_PAD) : VIEWPORT_PAD)
      const clipBottom = Math.min(
        vh - VIEWPORT_PAD,
        hostRect ? Math.min(hostRect.bottom - 8, vh - VIEWPORT_PAD) : vh - VIEWPORT_PAD,
      )

      const maxWidth = Math.max(160, clipRight - clipLeft)
      const width = Math.min(Math.max(rect.width, minWidth), maxWidth)
      const naturalHeight = measurePanelNaturalHeight(panel)
      const viewportBudget = Math.max(96, clipBottom - clipTop)

      const spaceBelow = clipBottom - rect.bottom - GAP
      const spaceAbove = rect.top - clipTop - GAP
      const preferBelow =
        spaceBelow >= Math.min(naturalHeight, 200) || spaceBelow >= spaceAbove
      const available = Math.max(96, preferBelow ? spaceBelow : spaceAbove)
      const maxHeight = Math.min(naturalHeight, available, viewportBudget)

      let top = preferBelow
        ? rect.bottom + GAP
        : rect.top - GAP - maxHeight
      if (top < clipTop) top = clipTop
      if (top + maxHeight > clipBottom) top = Math.max(clipTop, clipBottom - maxHeight)

      let left = rect.left
      if (left + width > clipRight) left = clipRight - width
      if (left < clipLeft) left = clipLeft

      setPlacement(preferBelow ? 'bottom' : 'top')
      setStyle({
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        width: `${Math.round(width)}px`,
        maxHeight: `${Math.round(maxHeight)}px`,
        right: 'auto',
        zIndex: 80,
      })
    }

    update()
    const raf = requestAnimationFrame(update)

    const onScroll = (e) => {
      const panel = panelRef.current
      // Ignore scrolling inside the dropdown itself — that was expanding max-height
      if (panel && (e.target === panel || panel.contains(e.target))) return
      update()
    }

    window.addEventListener('resize', update)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, triggerRef, panelRef, minWidth])

  return { style, placement }
}

function useDismiss(open, rootRef, setOpen) {
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, rootRef, setOpen])
}

export function MeetingDatePicker({ id, value, min, onChange, invalid }) {
  const listId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
  const selected = parseYmd(value)
  const minDate = parseYmd(min) || startOfDay(new Date())
  const [view, setView] = useState(() => {
    const base = selected || new Date()
    return { year: base.getFullYear(), month: base.getMonth() }
  })
  const { style, placement } = useAnchoredPanel(open, triggerRef, panelRef)

  useDismiss(open, rootRef, setOpen)

  useEffect(() => {
    if (selected) {
      setView({ year: selected.getFullYear(), month: selected.getMonth() })
    }
  }, [value])

  const cells = useMemo(
    () => buildMonthCells(view.year, view.month),
    [view.year, view.month],
  )

  const canPrev =
    view.year > minDate.getFullYear() ||
    (view.year === minDate.getFullYear() && view.month > minDate.getMonth())

  const shiftMonth = (delta) => {
    setView((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const pickDay = (date) => {
    if (startOfDay(date) < startOfDay(minDate)) return
    onChange(toYmd(date))
    setOpen(false)
  }

  return (
    <div className={`mp-picker${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`mp-trigger${invalid ? ' is-invalid' : ''}${value ? ' has-value' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mp-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="16" rx="2.5" />
            <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="mp-trigger-text">{formatDisplayDate(value)}</span>
        <span className="mp-trigger-caret" aria-hidden="true" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className={`mp-panel mp-calendar is-fixed placement-${placement}`}
          id={listId}
          role="dialog"
          aria-label="Choose meeting date"
          style={style}
        >
          <div className="mp-panel-scroll">
            <div className="mp-cal-head">
              <button
                type="button"
                className="mp-nav"
                aria-label="Previous month"
                disabled={!canPrev}
                onClick={() => shiftMonth(-1)}
              >
                ‹
              </button>
              <p className="mp-cal-title">
                {MONTHS[view.month]} {view.year}
              </p>
              <button type="button" className="mp-nav" aria-label="Next month" onClick={() => shiftMonth(1)}>
                ›
              </button>
            </div>

            <div className="mp-weekdays">
              {WEEKDAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="mp-days">
              {cells.map((date, idx) => {
                if (!date) return <span key={`e-${idx}`} className="mp-day is-empty" />
                const ymd = toYmd(date)
                const disabled = startOfDay(date) < startOfDay(minDate)
                const isSelected = value === ymd
                const isToday = toYmd(new Date()) === ymd
                return (
                  <button
                    key={ymd}
                    type="button"
                    className={`mp-day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                    disabled={disabled}
                    onClick={() => pickDay(date)}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mp-panel-foot">
            <button
              type="button"
              className="mp-chip-action"
              onClick={() => {
                const today = startOfDay(new Date())
                const pick = today < startOfDay(minDate) ? startOfDay(minDate) : today
                pickDay(pick)
              }}
            >
              Today
            </button>
            <button type="button" className="mp-chip-action muted" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

function parseTimeParts(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return { hour12: 10, minute: 0, period: 'AM' }
  }
  const [h, m] = value.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  const minute = MINUTES.includes(m) ? m : Math.round(m / 5) * 5
  return { hour12, minute: minute === 60 ? 55 : minute, period }
}

function toHHmm(hour12, minute, period) {
  let h = hour12 % 12
  if (period === 'PM') h += 12
  return `${pad(h)}:${pad(minute)}`
}

export function MeetingTimePicker({ id, value, onChange, invalid }) {
  const listId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => parseTimeParts(value))
  const { style, placement } = useAnchoredPanel(open, triggerRef, panelRef)

  useEffect(() => {
    if (open) setDraft(parseTimeParts(value))
  }, [open, value])

  useDismiss(open, rootRef, setOpen)

  const apply = (next) => {
    setDraft(next)
    onChange(toHHmm(next.hour12, next.minute, next.period))
  }

  const confirm = () => {
    onChange(toHHmm(draft.hour12, draft.minute, draft.period))
    setOpen(false)
  }

  return (
    <div className={`mp-picker${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`mp-trigger${invalid ? ' is-invalid' : ''}${value ? ' has-value' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mp-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3.2 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="mp-trigger-text">{formatDisplayTime(value)}</span>
        <span className="mp-trigger-caret" aria-hidden="true" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className={`mp-panel mp-clock is-fixed placement-${placement}`}
          id={listId}
          role="dialog"
          aria-label="Choose meeting time"
          style={style}
        >
          <div className="mp-panel-scroll">
            <div className="mp-clock-preview" aria-live="polite">
              <span className="mp-clock-big">
                {draft.hour12}:{pad(draft.minute)}
              </span>
              <div className="mp-period">
                {['AM', 'PM'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`mp-period-btn${draft.period === p ? ' is-active' : ''}`}
                    onClick={() => apply({ ...draft, period: p })}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="mp-clock-grid mp-clock-grid-split">
              <div className="mp-clock-section">
                <p className="mp-clock-label">Hour</p>
                <div className="mp-chip-grid hours" role="listbox" aria-label="Hour">
                  {HOURS_12.map((h) => (
                    <button
                      key={h}
                      type="button"
                      role="option"
                      aria-selected={draft.hour12 === h}
                      className={`mp-time-chip${draft.hour12 === h ? ' is-selected' : ''}`}
                      onClick={() => apply({ ...draft, hour12: h })}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mp-clock-section">
                <p className="mp-clock-label">Minute</p>
                <div className="mp-chip-grid minutes" role="listbox" aria-label="Minute">
                  {MINUTES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="option"
                      aria-selected={draft.minute === m}
                      className={`mp-time-chip${draft.minute === m ? ' is-selected' : ''}`}
                      onClick={() => apply({ ...draft, minute: m })}
                    >
                      {pad(m)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mp-panel-foot">
            <button
              type="button"
              className="mp-chip-action"
              onClick={() => {
                const now = new Date()
                const rounded = Math.round(now.getMinutes() / 5) * 5
                const minute = rounded === 60 ? 55 : rounded
                let hour = now.getHours()
                if (rounded === 60) hour = (hour + 1) % 24
                const period = hour >= 12 ? 'PM' : 'AM'
                const hour12 = hour % 12 || 12
                apply({ hour12, minute, period })
                setOpen(false)
              }}
            >
              Now
            </button>
            <button type="button" className="mp-chip-action primary" onClick={confirm}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Custom select that stays inside the viewport (native <select> menus cannot).
 * options: [{ value, label }]
 */
export function MeetingSelect({
  id,
  value,
  options,
  onChange,
  invalid,
  placeholder = 'Select',
  triggerLabel,
  menuMinWidth = 0,
  className = '',
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
  const { style, placement } = useAnchoredPanel(open, triggerRef, panelRef, {
    minWidth: menuMinWidth,
  })

  useDismiss(open, rootRef, setOpen)

  const selected = options.find((o) => String(o.value) === String(value))
  const label = triggerLabel ?? selected?.label ?? placeholder

  return (
    <div className={`mp-picker${open ? ' is-open' : ''}${className ? ` ${className}` : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`mp-trigger${invalid ? ' is-invalid' : ''}${selected || triggerLabel ? ' has-value' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mp-trigger-text">{label}</span>
        <span className="mp-trigger-caret" aria-hidden="true" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className={`mp-panel mp-select is-fixed placement-${placement}`}
          id={listId}
          role="listbox"
          aria-label={placeholder}
          style={style}
        >
          <div className="mp-panel-scroll mp-select-list">
            {options.map((opt) => {
              const active = String(opt.value) === String(value)
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`mp-select-option${active ? ' is-selected' : ''}`}
                  onClick={() => {
                    onChange(String(opt.value))
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

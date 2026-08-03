import { useEffect, useId, useRef, useState } from 'react'
import { getChatbotReplyAsync } from '../data/chatbotLanguage'
import './AIChatbot.css'

const QUICK = [
  { label: 'Full site details', q: 'Full site details' },
  { label: 'Services kya hain?', q: 'Services kya hain?' },
  { label: 'Price kitna hai?', q: 'Price kitna hai?' },
  { label: 'Contact & location', q: 'Contact and location' },
]

const WELCOME = {
  role: 'bot',
  text:
    'Hi / Assalam o Alaikum — Bluexech AI Assistant.\n\nAny language mein sawal poocho (English, Roman Urdu, اردو, etc.) — jawab usi language mein milega.\n\nTry: “services kya hain?” · “What is pricing?” · “poori site details”',
}

/** Discord-style chatbot mark — same silhouette as the reference image */
function ChatBotLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 127.14 96.36" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21a105.73,105.73,0,0,0,32.17,16.15,77.7,77.7,0,0,0,6.89-11.11,68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.09-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />
    </svg>
  )
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const titleId = useId()

  const closeChat = () => {
    setOpen(false)
    setBusy(false)
    setInput('')
    setMessages([WELCOME])
  }

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 180)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open, busy])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeChat()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (raw) => {
    const text = String(raw || '').trim()
    if (!text || busy) return
    // No chat history — only current question + answer
    setMessages([{ role: 'user', text }])
    setInput('')
    setBusy(true)
    try {
      const reply = await getChatbotReplyAsync(text)
      setMessages([
        { role: 'user', text },
        { role: 'bot', text: reply },
      ])
    } catch {
      setMessages([
        { role: 'user', text },
        {
          role: 'bot',
          text: 'Sorry — reply load nahi hui. Dobara try karein, ya English/Roman Urdu mein likhein.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className={`ai-chatbot ${open ? 'is-open' : ''}`}>
      {open ? (
        <section className="ai-chat-panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <header className="ai-chat-head">
            <div className="ai-chat-avatar" aria-hidden="true">
              <ChatBotLogo className="ai-chat-logo" />
            </div>
            <div className="ai-chat-titles">
              <h2 id={titleId}>Bluexech AI Chat</h2>
              <p>Multi-language · same-language answers</p>
            </div>
            <button type="button" className="ai-chat-close" onClick={closeChat} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="ai-chat-messages" ref={listRef}>
            {messages.map((msg, i) => (
              <div key={`${msg.role}-${i}`} className={`ai-msg ai-msg-${msg.role}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {busy ? (
              <div className="ai-msg ai-msg-bot ai-typing" aria-live="polite">
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          <div className="ai-chat-quick">
            {QUICK.map((q) => (
              <button key={q.label} type="button" onClick={() => send(q.q)} disabled={busy}>
                {q.label}
              </button>
            ))}
          </div>

          <form className="ai-chat-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="ai-chat-input">
              Ask a question
            </label>
            <input
              id="ai-chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Any language / Roman Urdu…"
              autoComplete="off"
              disabled={busy}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send message">
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="ai-chat-fab"
        onClick={() => {
          if (open) closeChat()
          else {
            setMessages([WELCOME])
            setOpen(true)
          }
        }}
        aria-expanded={open}
        aria-label={open ? 'Close AI chatbot' : 'Open AI chatbot'}
      >
        <span className="ai-chat-fab-ring" aria-hidden="true" />
        <span className="ai-chat-fab-core" aria-hidden="true">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <ChatBotLogo className="ai-chat-logo" />
          )}
        </span>
      </button>
    </div>
  )
}

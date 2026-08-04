import { useEffect, useId, useRef, useState } from 'react'
import { getAssistantReplyAsync, hasChatGptKnowledge } from '../data/assistantAI'
import './AIChatbot.css'

const STORAGE_KEY = 'bluexech-assistant-chat-v1'

const WELCOME = {
  role: 'bot',
  text: 'Hi - I’m Bluexech AI Assistant 👋 What would you like to ask about this company? I can share clear information about Bluexech AI.',
  at: Date.now(),
}

function botMsg(text) {
  return { role: 'bot', text, at: Date.now() }
}

function sanitizeMessages(list) {
  return (list || []).map((m) => ({
    role: m.role,
    text: m.text || '',
    at: m.at || Date.now(),
    attachment: m.attachment
      ? {
          name: m.attachment.name,
          isImage: Boolean(m.attachment.isImage),
          previewUrl: null,
        }
      : undefined,
  }))
}

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [{ ...WELCOME, at: Date.now() }]
    const data = JSON.parse(raw)
    const msgs = sanitizeMessages(data.messages)
    return msgs.length ? msgs : [{ ...WELCOME, at: Date.now() }]
  } catch {
    return [{ ...WELCOME, at: Date.now() }]
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: sanitizeMessages(messages) }))
  } catch {
    /* ignore quota */
  }
}

const LINK_LABELS = {
  '#home': 'Home',
  '#about': 'About',
  '#services': 'Services',
  '#features': 'Features',
  '#process': 'Process',
  '#pricing': 'Pricing',
  '#portfolio': 'Portfolio',
  '#faq': 'FAQ',
  '#blog': 'Blog',
  '#technologies': 'Technologies',
  '#testimonials': 'Testimonials',
  '#contact': 'Contact',
  './message.html': 'Message form',
  '#service-ai-chatbots': 'AI Chatbots',
  '#service-generative-ai': 'Generative AI',
  '#service-document-ai': 'Document AI',
  '#service-predictive-analytics': 'Predictive Analytics',
  '#service-computer-vision': 'Computer Vision',
  '#service-agentic-automation': 'Agentic Automation',
}

function linkLabel(href) {
  if (LINK_LABELS[href]) return LINK_LABELS[href]
  if (href.startsWith('mailto:')) return href.replace(/^mailto:/, '')
  if (href.includes('wa.me')) return 'WhatsApp'
  if (href.includes('google.com/maps')) return 'Map'
  if (href.startsWith('#')) return href.slice(1).replace(/-/g, ' ')
  return href
}

function MessageText({ text }) {
  const raw = String(text || '')
  const parts = raw.split(/(https?:\/\/[^\s]+|mailto:[^\s]+|\.\/message\.html|#[\w-]+)/g)
  return (
    <p>
      {parts.map((part, i) => {
        if (/^(https?:\/\/|mailto:|\.\/message\.html|#)/.test(part)) {
          const href = part.replace(/[),.;!?]+$/, '')
          const trailing = part.slice(href.length)
          const external = href.startsWith('http') || href.startsWith('mailto:')
          return (
            <span key={`${i}-${href.slice(0, 24)}`}>
              <a
                href={href}
                className="ai-msg-link"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={(e) => e.stopPropagation()}
              >
                {linkLabel(href)}
              </a>
              {trailing}
            </span>
          )
        }
        return <span key={`${i}-t`}>{part}</span>
      })}
    </p>
  )
}

const HOME_PROMPTS = [
  { id: 'about', label: 'What is Bluexech AI?' },
  { id: 'services', label: 'What AI services do you offer?' },
]

const HELP_ARTICLES = [
  {
    id: 'industries',
    title: 'What industries do you serve?',
    ask: 'What industries do you serve?',
  },
  {
    id: 'start',
    title: 'How quickly can a project start?',
    ask: 'How quickly can a project start?',
  },
  {
    id: 'teams',
    title: 'Do you work with existing teams?',
    ask: 'Do you work with existing teams?',
  },
  {
    id: 'models',
    title: 'Custom models or existing AI?',
    ask: 'Do you build custom AI models or use existing ones?',
  },
  {
    id: 'support',
    title: 'Support after launch',
    ask: 'What does support look like after launch?',
  },
]

const EMOJIS = [
  '😀', '😁', '😂', '😊', '😍', '🤔', '👍', '👎',
  '🙏', '🔥', '✨', '💡', '✅', '❌', '❤️', '💙',
  '🎉', '🤝', '👋', '📩', '⭐', '🚀', '💬', '🤖',
]

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v7M9 6l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21v-7M9 18l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 10V3M9 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14v7M9 17l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        d="M21.4 11.6l-8.5 8.5a5 5 0 0 1-7.1-7.1l9.2-9.2a3.2 3.2 0 0 1 4.5 4.5l-9.2 9.2a1.4 1.4 0 0 1-2-2l8.1-8.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmojiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5c1.2 1.4 2.6 2 3.5 2s2.3-.6 3.5-2" strokeLinecap="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.4 20.6L21 12 3.4 3.4l.1 6.8L15 12 3.5 13.8l-.1 6.8z" />
    </svg>
  )
}

function BookIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5z" strokeLinejoin="round" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
    </svg>
  )
}

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
  const [open, setOpen] = useState(true)
  const [screen, setScreen] = useState('home') // home | help | chat
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState(() => loadMessages())
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [attachment, setAttachment] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const titleId = useId()
  const gptOn = hasChatGptKnowledge()
  const hydratedRef = useRef(false)

  useEffect(() => {
    hydratedRef.current = true
  }, [])

  useEffect(() => {
    if (!hydratedRef.current) return
    saveMessages(messages)
  }, [messages])

  const closeChat = () => {
    setOpen(false)
    setScreen('home')
    setBusy(false)
    setInput('')
    setEmojiOpen(false)
    setExpanded(false)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachment(null)
  }

  const goHome = () => {
    setScreen('home')
    setBusy(false)
    setInput('')
    setEmojiOpen(false)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachment(null)
  }

  const openChatScreen = () => {
    setScreen('chat')
  }

  const pinLatestQuestion = () => {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector('[data-latest-q="1"]')
    if (!el) {
      list.scrollTop = list.scrollHeight
      return
    }
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const delta = elRect.top - listRect.top - 8
    if (Math.abs(delta) < 2) return
    list.scrollTop += delta
  }

  const jumpToLatestQuestion = () => {
    pinLatestQuestion()
    window.requestAnimationFrame(() => {
      pinLatestQuestion()
      window.setTimeout(pinLatestQuestion, 40)
      window.setTimeout(pinLatestQuestion, 120)
    })
  }

  useEffect(() => {
    if (!open || screen !== 'chat') return
    const t = setTimeout(() => inputRef.current?.focus(), 180)
    return () => clearTimeout(t)
  }, [open, screen])

  // Jump to the asked question as soon as it appears / while waiting for reply
  useEffect(() => {
    if (!open || screen !== 'chat') return
    const last = messages[messages.length - 1]
    if (!last) return
    if (last.role === 'user' || busy) {
      jumpToLatestQuestion()
    }
  }, [messages, busy, open, screen])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeChat()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const stopPageScroll = (e) => {
    e.stopPropagation()
  }

  const clearAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachment(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const maxBytes = 8 * 1024 * 1024
    if (file.size > maxBytes) {
      setMessages((prev) => [
        ...prev,
        botMsg('File too large. Please attach an image/file under 8 MB.'),
      ])
      e.target.value = ''
      return
    }
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    const isImage = file.type.startsWith('image/')
    setAttachment({
      file,
      name: file.name,
      type: file.type || 'file',
      isImage,
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    })
    setEmojiOpen(false)
  }

  const insertEmoji = (emoji) => {
    setInput((prev) => `${prev}${emoji}`)
    setEmojiOpen(false)
    inputRef.current?.focus()
  }

  const send = async (raw) => {
    const text = String(raw || '').trim()
    const hasAttach = Boolean(attachment)
    if ((!text && !hasAttach) || busy) return

    const attachMeta = hasAttach
      ? {
          name: attachment.name,
          isImage: attachment.isImage,
          previewUrl: attachment.previewUrl,
        }
      : null

    const promptForBot = text
      ? hasAttach
        ? `${text}\n\n[Attached: ${attachment.name}]`
        : text
      : `I attached a file: ${attachment.name}. Please acknowledge and ask how I can help with it.`

    const userMsg = {
      role: 'user',
      text: text || `Attached: ${attachment.name}`,
      attachment: attachMeta,
      at: Date.now(),
    }
    let historySnapshot = []
    setMessages((prev) => {
      historySnapshot = prev
      return [...prev, userMsg]
    })
    setInput('')
    setAttachment(null)
    if (fileRef.current) fileRef.current.value = ''
    setBusy(true)
    setEmojiOpen(false)
    jumpToLatestQuestion()
    try {
      const reply = await getAssistantReplyAsync(promptForBot, historySnapshot)
      setMessages((prev) => [...prev, botMsg(reply)])
    } catch {
      setMessages((prev) => [
        ...prev,
        botMsg('Sorry - I couldn’t load a reply just now. Please try again.'),
      ])
    } finally {
      setBusy(false)
    }
  }

  const startFromPrompt = async (label) => {
    const q = String(label || '').trim()
    if (!q || busy) return
    setScreen('chat')
    setInput('')
    setEmojiOpen(false)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachment(null)

    const userMsg = { role: 'user', text: q, at: Date.now() }
    let historySnapshot = []
    setMessages((prev) => {
      historySnapshot = prev
      return [...prev, userMsg]
    })
    setBusy(true)
    jumpToLatestQuestion()
    try {
      const reply = await getAssistantReplyAsync(q, historySnapshot)
      setMessages((prev) => [...prev, botMsg(reply)])
    } catch {
      setMessages((prev) => [
        ...prev,
        botMsg('Sorry - I couldn’t load a reply just now. Please try again.'),
      ])
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const onHomeDraftSubmit = (e) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) {
      openChatScreen()
      return
    }
    startFromPrompt(q)
  }

  return (
    <div className={`ai-chatbot ${open ? 'is-open' : ''} ${expanded ? 'is-expanded' : ''}`}>
      {open ? (
        <section
          className="ai-chat-panel ai-fin"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onWheel={stopPageScroll}
          onTouchMove={stopPageScroll}
        >
          <header className="ai-chat-head">
            {screen === 'help' ? (
              <button type="button" className="ai-chat-back" onClick={goHome} aria-label="Back">
                <BackIcon />
              </button>
            ) : (
              <div className="ai-chat-avatar" aria-hidden="true">
                <ChatBotLogo className="ai-chat-logo" />
              </div>
            )}
            <div className="ai-chat-titles">
              <h2 id={titleId}>{screen === 'help' ? 'Help Centre' : 'Bluexech AI Assistant'}</h2>
              <p>
                {screen === 'help' ? (
                  'Guides & answers'
                ) : (
                  <>
                    <span className="ai-online-dot" aria-hidden="true" />
                    Bluexech AI · online{gptOn ? ' · GPT' : ''}
                  </>
                )}
              </p>
            </div>
            <div className="ai-chat-head-actions">
              {screen === 'chat' ? (
                <button type="button" className="ai-chat-home-btn" onClick={goHome} aria-label="Home" title="Home">
                  <HomeIcon />
                </button>
              ) : null}
              <button
                type="button"
                className="ai-chat-expand"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? 'Minimize chat' : 'Maximize chat'}
                title={expanded ? 'Minimize' : 'Maximize'}
              >
                {expanded ? <CollapseIcon /> : <ExpandIcon />}
              </button>
            </div>
          </header>

          {screen === 'home' ? (
            <div className="ai-chat-home">
              <div className="ai-chat-home-scroll">
                <div className="ai-chat-home-hero">
                  <div className="ai-chat-home-mark" aria-hidden="true">
                    <ChatBotLogo className="ai-chat-home-logo" />
                  </div>
                  <h3>Hi there 👋</h3>
                  <p>What would you like to ask about this company? I can share clear information about Bluexech AI.</p>
                </div>

                <div className="ai-fin-section">
                  <p className="ai-fin-label">Ask Bluexech</p>
                  <div className="ai-chat-home-prompts" role="list">
                    {HOME_PROMPTS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="ai-chat-home-prompt"
                        role="listitem"
                        onClick={() => startFromPrompt(item.label)}
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ai-fin-section">
                  <p className="ai-fin-label">Help Centre</p>
                  <button type="button" className="ai-fin-help-card" onClick={() => setScreen('help')}>
                    <span className="ai-fin-help-icon" aria-hidden="true">
                      <BookIcon />
                    </span>
                    <span className="ai-fin-help-copy">
                      <strong>Browse help articles</strong>
                      <small>FAQs about services, timelines, and support</small>
                    </span>
                    <span className="ai-fin-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </div>
              </div>

              <form className="ai-fin-home-compose" onSubmit={onHomeDraftSubmit}>
                <label className="sr-only" htmlFor="ai-home-input">
                  Chat with Bluexech AI
                </label>
                <input
                  id="ai-home-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Chat with Bluexech AI…"
                  autoComplete="off"
                  disabled={busy}
                />
                <button type="submit" className="ai-fin-home-send" aria-label="Start chat" disabled={busy}>
                  <SendIcon />
                </button>
              </form>
            </div>
          ) : null}

          {screen === 'help' ? (
            <div className="ai-fin-help">
              <p className="ai-fin-help-intro">Pick an article - Bluexech AI will answer in chat.</p>
              <div className="ai-fin-help-list">
                {HELP_ARTICLES.map((a) => (
                  <button key={a.id} type="button" className="ai-fin-help-item" onClick={() => startFromPrompt(a.ask)}>
                    <BookIcon className="ai-fin-help-item-icon" />
                    <span>{a.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {screen === 'chat' ? (
            <>
              <div className="ai-chat-messages" ref={listRef}>
                {(() => {
                  const lastUserIndex = messages.reduce((acc, m, idx) => (m.role === 'user' ? idx : acc), -1)
                  return messages.map((msg, i) => {
                    const key = `${msg.role}-${i}`
                    return (
                      <div
                        key={key}
                        className={`ai-msg-row ai-msg-row-${msg.role}`}
                        data-latest-q={i === lastUserIndex ? '1' : undefined}
                      >
                        <div className={`ai-msg-wrap ai-msg-wrap-${msg.role}`}>
                          <div className={`ai-msg ai-msg-${msg.role}`}>
                            {msg.attachment ? (
                              <div className="ai-msg-attach">
                                {msg.attachment.isImage && msg.attachment.previewUrl ? (
                                  <img src={msg.attachment.previewUrl} alt={msg.attachment.name} />
                                ) : (
                                  <span className="ai-msg-attach-file">{msg.attachment.name}</span>
                                )}
                              </div>
                            ) : null}
                            {msg.text ? <MessageText text={msg.text} /> : null}
                            {msg.role === 'bot' && i === messages.length - 1 && !busy ? (
                              <p className="ai-msg-suggest">Have a question? I’m right here if you need me.</p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
                {busy ? (
                  <div className="ai-msg-row ai-msg-row-bot">
                    <div className="ai-msg ai-msg-bot ai-typing" aria-live="polite">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}
              </div>

              <form className="ai-chat-form" onSubmit={onSubmit}>
                {attachment ? (
                  <div className="ai-attach-preview">
                    {attachment.isImage && attachment.previewUrl ? (
                      <img src={attachment.previewUrl} alt="" />
                    ) : (
                      <span className="ai-attach-file-icon" aria-hidden="true">
                        <AttachIcon />
                      </span>
                    )}
                    <span className="ai-attach-name" title={attachment.name}>
                      {attachment.name}
                    </span>
                    <button type="button" className="ai-attach-remove" onClick={clearAttachment} aria-label="Remove attachment">
                      ×
                    </button>
                  </div>
                ) : null}
                <div className="ai-chat-compose">
                  <input
                    ref={fileRef}
                    type="file"
                    className="ai-file-input"
                    accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.zip"
                    onChange={onPickFile}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className="ai-attach-btn"
                    onClick={() => {
                      setEmojiOpen(false)
                      fileRef.current?.click()
                    }}
                    aria-label="Attach photo or file"
                    disabled={busy}
                    title="Attach"
                  >
                    <AttachIcon />
                  </button>
                  <div className="ai-emoji-wrap">
                    <button
                      type="button"
                      className={`ai-emoji-btn ${emojiOpen ? 'is-open' : ''}`}
                      onClick={() => setEmojiOpen((v) => !v)}
                      aria-label="Insert emoji"
                      aria-expanded={emojiOpen}
                      disabled={busy}
                    >
                      <EmojiIcon />
                    </button>
                    {emojiOpen ? (
                      <div className="ai-emoji-picker" role="listbox" aria-label="Emoji picker">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="ai-emoji-item"
                            onClick={() => insertEmoji(emoji)}
                            aria-label={`Emoji ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <label className="sr-only" htmlFor="ai-chat-input">
                    Ask Bluexech AI Assistant a question
                  </label>
                  <input
                    id="ai-chat-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setEmojiOpen(false)}
                    placeholder="Message Bluexech AI…"
                    autoComplete="off"
                    disabled={busy}
                  />
                </div>
                <button
                  type="submit"
                  className="ai-send-btn"
                  disabled={busy || (!input.trim() && !attachment)}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </form>
            </>
          ) : null}
        </section>
      ) : null}

      <button
        type="button"
        className="ai-chat-fab"
        onClick={() => {
          if (open) closeChat()
          else {
            setScreen('home')
            setInput('')
            setOpen(true)
          }
        }}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg className="ai-chat-fab-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <ChatBotLogo className="ai-chat-fab-logo" />
        )}
      </button>
    </div>
  )
}

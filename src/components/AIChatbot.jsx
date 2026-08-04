import { useEffect, useId, useRef, useState } from 'react'
import { getCyanReplyAsync, hasChatGptKnowledge } from '../data/cyanAI'
import './AIChatbot.css'

const STORAGE_KEY = 'cyan-chat-store-v1'
const MAX_CHATS = 20

const WELCOME = {
  role: 'bot',
  text: 'Hi - I’m Cyan 👋 Ask anything. I’ll answer just what you ask.',
  at: Date.now(),
}

function formatReplyAge(at, now = Date.now()) {
  if (!at) return 'just now'
  const sec = Math.max(0, Math.floor((now - at) / 1000))
  if (sec < 45) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.floor(hr / 24)
  return `${day} day${day > 1 ? 's' : ''} ago`
}

function botMsg(text) {
  return { role: 'bot', text, at: Date.now() }
}

function newChatId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
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

function chatTitleFromMessages(messages) {
  const firstUser = (messages || []).find((m) => m.role === 'user' && m.text)
  if (!firstUser) return 'New chat'
  const t = String(firstUser.text).trim().replace(/\s+/g, ' ')
  return t.length > 42 ? `${t.slice(0, 42)}…` : t
}

function hasRealChat(messages) {
  return (messages || []).some((m) => m.role === 'user')
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { conversations: [], activeId: null }
    const data = JSON.parse(raw)
    return {
      conversations: Array.isArray(data.conversations) ? data.conversations : [],
      activeId: data.activeId || null,
    }
  } catch {
    return { conversations: [], activeId: null }
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* ignore quota */
  }
}

function createConversation(messages = [{ ...WELCOME, at: Date.now() }]) {
  const msgs = sanitizeMessages(messages)
  return {
    id: newChatId(),
    title: chatTitleFromMessages(msgs),
    updatedAt: Date.now(),
    messages: msgs,
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

/** Turn URLs / #anchors / mailto into clickable links inside chat text. */
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
  { id: 'cyan', label: 'What is Cyan?' },
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

function ChatBubbleIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4.2 3.2c-.6.45-1.5.05-1.5-.7V6.5z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HistoryIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" strokeLinecap="round" />
      <path d="M4.5 5.5V9H8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4.5l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const [open, setOpen] = useState(false)
  const [screen, setScreen] = useState('home') // home | help | chat | history
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([{ ...WELCOME, at: Date.now() }])
  const [activeChatId, setActiveChatId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [attachment, setAttachment] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [now, setNow] = useState(Date.now())
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const titleId = useId()
  const gptOn = hasChatGptKnowledge()
  const hydratedRef = useRef(false)

  const pinLatestQuestion = () => {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector('[data-latest-q="1"]')
    if (!el) return
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const delta = elRect.top - listRect.top - 8
    if (Math.abs(delta) < 2) return
    list.scrollTop += delta
  }

  const schedulePinLatestQuestion = () => {
    pinLatestQuestion()
    window.requestAnimationFrame(() => {
      pinLatestQuestion()
      window.setTimeout(pinLatestQuestion, 50)
      window.setTimeout(pinLatestQuestion, 150)
    })
  }

  // Load history once
  useEffect(() => {
    const store = loadStore()
    setConversations(store.conversations)
    if (store.activeId) {
      const active = store.conversations.find((c) => c.id === store.activeId)
      if (active?.messages?.length) {
        setActiveChatId(active.id)
        setMessages(sanitizeMessages(active.messages))
      }
    }
    hydratedRef.current = true
  }, [])

  // Persist active chat
  useEffect(() => {
    if (!hydratedRef.current) return

    setConversations((prev) => {
      let next = [...prev]

      if (!hasRealChat(messages)) {
        saveStore({ conversations: next, activeId: activeChatId })
        return next
      }

      let id = activeChatId
      if (!id) {
        id = newChatId()
        queueMicrotask(() => setActiveChatId(id))
      }

      const payload = {
        id,
        title: chatTitleFromMessages(messages),
        updatedAt: Date.now(),
        messages: sanitizeMessages(messages),
      }
      const idx = next.findIndex((c) => c.id === id)
      if (idx >= 0) next[idx] = payload
      else next = [payload, ...next]

      next = next
        .filter((c) => hasRealChat(c.messages))
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .slice(0, MAX_CHATS)

      saveStore({ conversations: next, activeId: id })
      return next
    })
  }, [messages, activeChatId])

  const closeChat = () => {
    setOpen(false)
    setScreen('home')
    setBusy(false)
    setInput('')
    setEmojiOpen(false)
    setExpanded(false)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachment(null)
    // Keep messages/history - do not wipe
  }

  const goHome = () => {
    setScreen('home')
    setBusy(false)
    setInput('')
    setEmojiOpen(false)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachment(null)
  }

  const startNewChat = () => {
    const welcome = [{ ...WELCOME, at: Date.now() }]
    setActiveChatId(null)
    setMessages(welcome)
    setScreen('chat')
    setInput('')
    setEmojiOpen(false)
  }

  const openChatScreen = () => {
    if (hasRealChat(messages)) {
      setScreen('chat')
      return
    }
    startNewChat()
  }

  const openConversation = (id) => {
    const chat = conversations.find((c) => c.id === id)
    if (!chat) return
    setActiveChatId(chat.id)
    setMessages(sanitizeMessages(chat.messages))
    setScreen('chat')
  }

  const deleteConversation = (id, e) => {
    e?.stopPropagation?.()
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id)
      const nextActive = activeChatId === id ? null : activeChatId
      if (activeChatId === id) {
        setActiveChatId(null)
        setMessages([{ ...WELCOME, at: Date.now() }])
      }
      saveStore({ conversations: next, activeId: nextActive })
      return next
    })
  }

  const clearAllHistory = () => {
    setConversations([])
    setActiveChatId(null)
    setMessages([{ ...WELCOME, at: Date.now() }])
    saveStore({ conversations: [], activeId: null })
    setScreen('home')
  }

  useEffect(() => {
    if (!open || screen !== 'chat') return
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [open, screen])

  useEffect(() => {
    if (!open || screen !== 'chat') return
    const t = setTimeout(() => inputRef.current?.focus(), 180)
    return () => clearTimeout(t)
  }, [open, screen])

  useEffect(() => {
    if (screen !== 'chat') return
    const last = messages[messages.length - 1]
    // New question, or waiting on that turn - keep question at top of the chat panel
    if (!last) return
    if (last.role === 'user' || busy) {
      schedulePinLatestQuestion()
    }
  }, [messages, busy, screen])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeChat()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
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

    const userMsg = { role: 'user', text: text || `Attached: ${attachment.name}`, attachment: attachMeta, at: Date.now() }
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
    schedulePinLatestQuestion()
    try {
      const reply = await getCyanReplyAsync(promptForBot, historySnapshot)
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
    // Fresh thread for home/help prompts
    setActiveChatId(null)
    setScreen('chat')
    setInput('')
    setEmojiOpen(false)
    setAttachment(null)
    const welcome = { ...WELCOME, at: Date.now() }
    const userMsg = { role: 'user', text: q, at: Date.now() }
    const history = [welcome]
    setMessages([welcome, userMsg])
    setBusy(true)
    schedulePinLatestQuestion()
    try {
      const reply = await getCyanReplyAsync(q, history)
      setMessages([welcome, userMsg, botMsg(reply)])
    } catch {
      setMessages([welcome, userMsg, botMsg('Sorry - I couldn’t load a reply just now. Please try again.')])
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
            {screen === 'help' || screen === 'history' ? (
              <button type="button" className="ai-chat-back" onClick={goHome} aria-label="Back">
                <BackIcon />
              </button>
            ) : (
              <div className="ai-chat-avatar" aria-hidden="true">
                <ChatBotLogo className="ai-chat-logo" />
              </div>
            )}
            <div className="ai-chat-titles">
              <h2 id={titleId}>
                {screen === 'help' ? 'Help Centre' : screen === 'history' ? 'Chat history' : 'Cyan'}
              </h2>
              <p>
                {screen === 'help' ? (
                  'Guides & answers'
                ) : screen === 'history' ? (
                  `${conversations.length} saved chat${conversations.length === 1 ? '' : 's'}`
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
                <button type="button" className="ai-chat-home-btn" onClick={goHome} aria-label="Cyan home" title="Home">
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
                  <p>I’m Cyan - how can we help you today?</p>
                </div>

                <div className="ai-fin-section">
                  <p className="ai-fin-label">Ask Cyan</p>
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

                <div className="ai-fin-section">
                  <p className="ai-fin-label">History</p>
                  {hasRealChat(messages) ? (
                    <button type="button" className="ai-fin-help-card" onClick={() => setScreen('chat')}>
                      <span className="ai-fin-help-icon" aria-hidden="true">
                        <ChatBubbleIcon />
                      </span>
                      <span className="ai-fin-help-copy">
                        <strong>Continue chat</strong>
                        <small>{chatTitleFromMessages(messages)}</small>
                      </span>
                      <span className="ai-fin-chevron" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  ) : null}
                  <button type="button" className="ai-fin-help-card" onClick={() => setScreen('history')}>
                    <span className="ai-fin-help-icon ai-fin-help-icon-muted" aria-hidden="true">
                      <HistoryIcon />
                    </span>
                    <span className="ai-fin-help-copy">
                      <strong>Chat history</strong>
                      <small>
                        {conversations.length
                          ? `${conversations.length} saved conversation${conversations.length === 1 ? '' : 's'}`
                          : 'No saved chats yet'}
                      </small>
                    </span>
                    <span className="ai-fin-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                  <button type="button" className="ai-fin-new-chat" onClick={startNewChat}>
                    New chat
                  </button>
                </div>
              </div>

              <form className="ai-fin-home-compose" onSubmit={onHomeDraftSubmit}>
                <label className="sr-only" htmlFor="ai-home-input">
                  Chat with Cyan
                </label>
                <input
                  id="ai-home-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Chat with Cyan…"
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
              <p className="ai-fin-help-intro">Pick an article - Cyan will answer in chat.</p>
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

          {screen === 'history' ? (
            <div className="ai-fin-help">
              <div className="ai-fin-history-toolbar">
                <button type="button" className="ai-fin-new-chat" onClick={startNewChat}>
                  New chat
                </button>
                {conversations.length ? (
                  <button type="button" className="ai-fin-clear-history" onClick={clearAllHistory}>
                    Clear all
                  </button>
                ) : null}
              </div>
              {conversations.length ? (
                <div className="ai-fin-help-list">
                  {conversations.map((c) => (
                    <div key={c.id} className="ai-fin-history-row">
                      <button type="button" className="ai-fin-help-item ai-fin-history-item" onClick={() => openConversation(c.id)}>
                        <ChatBubbleIcon className="ai-fin-help-item-icon" />
                        <span className="ai-fin-history-copy">
                          <strong>{c.title || 'Chat'}</strong>
                          <small>{formatReplyAge(c.updatedAt, now)}</small>
                        </span>
                      </button>
                      <button
                        type="button"
                        className="ai-fin-history-delete"
                        aria-label="Delete chat"
                        onClick={(e) => deleteConversation(c.id, e)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ai-fin-help-intro">No chat history yet. Start a conversation and it will show up here.</p>
              )}
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
                    Ask Cyan a question
                  </label>
                  <input
                    id="ai-chat-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setEmojiOpen(false)}
                    placeholder="Message Cyan…"
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
        aria-label={open ? 'Close Cyan' : 'Open Cyan'}
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

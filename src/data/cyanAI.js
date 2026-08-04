import { FULL_SITE_OVERVIEW } from './chatbotKnowledge'
import { getChatbotReplyAsync as getLocalReplyAsync } from './chatbotLanguage'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

function getApiKey() {
  return String(import.meta.env.VITE_OPENAI_API_KEY || '').trim()
}

const SYSTEM_PROMPT = `You are Cyan, a helpful assistant on the Bluexech AI website - reply like ChatGPT: natural, direct, and focused.

Core behavior:
1) Answer ONLY the user’s question. If they ask one thing, answer that one thing.
2) Do NOT dump full company info, full service lists, or marketing essays unless they explicitly ask for an overview / “sab batao”.
3) Keep answers short: usually 2-6 sentences, or a few tight bullets.
4) Use Bluexech facts from the knowledge ONLY when relevant to the question.
5) Match the user’s language (English, Roman Urdu, Urdu, etc.).
6) You are Cyan (not ChatGPT / not OpenAI).
7) No “Want me to connect you with the team…” style endings.
8) Add a link ONLY if it clearly helps that exact question (e.g. contact → #contact / WhatsApp; pricing → #pricing). Otherwise no links.
9) Emoji / “ye kya hai?” → explain the symbol only. Do not pitch Bluexech services.

=== REFERENCE KNOWLEDGE (use only what you need) ===
${FULL_SITE_OVERVIEW}
`

/**
 * Cyan replies: free local knowledge first.
 * Optional OpenAI only if VITE_OPENAI_API_KEY is set (not required).
 * @param {string} rawInput
 * @param {{ role: string, text: string }[]} [history]
 */
export async function getCyanReplyAsync(rawInput, history = []) {
  const question = String(rawInput || '').trim()
  if (!question) {
    return 'Please type a message - I’m Cyan, here to help.'
  }

  // Always available, no payment / API key needed
  const localAnswer = await getLocalReplyAsync(question)

  const apiKey = getApiKey()
  if (!apiKey) {
    return localAnswer
  }

  try {
    const recent = (history || [])
      .filter((m) => m && (m.role === 'user' || m.role === 'bot') && m.text)
      .filter((m) => m.role === 'user' || (m.role === 'bot' && !String(m.text).startsWith('Hi - I’m Cyan')))
      .slice(-6)
      .map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: String(m.text).slice(0, 1000),
      }))

    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.35,
        max_tokens: 380,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recent,
          {
            role: 'user',
            content: `Question: ${question}

Reply like ChatGPT: answer this question only. Do not add unrelated Bluexech company details.`,
          },
        ],
      }),
    })

    if (!res.ok) {
      console.warn('Cyan OpenAI error', res.status)
      return localAnswer
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text) return localAnswer
    return text
  } catch (err) {
    console.warn('Cyan OpenAI failed', err)
    return localAnswer
  }
}

export function hasChatGptKnowledge() {
  return Boolean(getApiKey())
}

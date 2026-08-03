import { getChatbotReplyMeta } from './chatbotKnowledge'

const ROMAN_MARKERS = [
  'kya',
  'hai',
  'hain',
  'ho',
  'kaise',
  'kaisay',
  'kahan',
  'kidhar',
  'kitna',
  'kitne',
  'kitni',
  'mujhe',
  'mujh',
  'batao',
  'bataen',
  'bataye',
  'batain',
  'chahiye',
  'chahye',
  'acha',
  'accha',
  'theek',
  'thik',
  'han',
  'haan',
  'nahi',
  'nahin',
  'please',
  'ap',
  'aap',
  'apka',
  'apki',
  'apke',
  'mera',
  'meri',
  'hamare',
  'humari',
  'walay',
  'wali',
  'ke',
  'ki',
  'ka',
  'se',
  'mein',
  'main',
  'par',
  'aur',
  'ya',
  'toh',
  'to',
  'bhi',
  'bohat',
  'bahut',
  'zyada',
  'thora',
  'thoda',
  'poori',
  'pori',
  'sari',
  'saari',
  'detail',
  'details',
  'maloom',
  'malomat',
  'maalum',
  'price',
  'qeemat',
  'rate',
  'package',
  'khidmat',
  'kya hai',
  'kya hain',
  'batado',
  'samjhao',
  'samjha',
  'madad',
  'shukriya',
  'meherbani',
  'assalam',
  'salam',
  'dua',
  'karachi',
  'pakistan',
]

/** @param {string} text */
export function isRomanUrdu(text) {
  const t = String(text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
  if (!t.trim()) return false
  if (/[\u0600-\u06FF]/.test(text)) return false
  const words = t.split(/\s+/).filter(Boolean)
  if (!words.length) return false
  let hits = 0
  for (const w of words) {
    if (ROMAN_MARKERS.includes(w)) hits += 1
  }
  // phrases
  if (/(kya|kitna|batao|chahiye|poori|pori|maloom|samjhao)/.test(t)) hits += 2
  return hits >= 2 || (hits >= 1 && words.length <= 6)
}

function isMostlyLatinEnglish(text) {
  const t = String(text || '').trim()
  if (!t) return true
  if (/[\u0600-\u06FF\u0900-\u097F\u4e00-\u9fff\u0400-\u04FF\u3040-\u30ff]/.test(t)) return false
  if (isRomanUrdu(t)) return false
  // Latin letters / numbers / common punctuation
  const cleaned = t.replace(/[\s\d.,!?'"@+\-_/():;%#&*]+/g, '')
  return cleaned.length === 0 || /^[A-Za-z\u00C0-\u024F]+$/.test(cleaned)
}

/**
 * Translate via Google gtx (fallback MyMemory).
 * @param {string} text
 * @param {string} from
 * @param {string} to
 */
export async function translateText(text, from, to) {
  const input = String(text || '').trim()
  if (!input || from === to) return { text: input, lang: to }

  const chunkSize = 4200
  const chunks = []
  for (let i = 0; i < input.length; i += chunkSize) chunks.push(input.slice(i, i + chunkSize))

  const out = []
  let detected = from

  for (const chunk of chunks) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(chunk)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('gtx fail')
      const data = await res.json()
      out.push((data[0] || []).map((p) => p[0]).join(''))
      if (data[2]) detected = data[2]
      continue
    } catch {
      /* try mymemory */
    }

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk.slice(0, 450))}&langpair=${encodeURIComponent(from)}|${encodeURIComponent(to)}`
      const res = await fetch(url)
      const data = await res.json()
      const translated = data?.responseData?.translatedText
      if (translated) out.push(translated)
      else out.push(chunk)
    } catch {
      out.push(chunk)
    }
  }

  return { text: out.join(''), lang: detected || to }
}

/**
 * Detect question language and prepare English match text.
 * @param {string} raw
 */
export async function prepareQuestion(raw) {
  const original = String(raw || '').trim()
  if (!original) {
    return { original, matchText: '', targetLang: 'en', mode: 'en' }
  }

  if (isRomanUrdu(original)) {
    return { original, matchText: original, targetLang: 'roman', mode: 'roman' }
  }

  if (isMostlyLatinEnglish(original)) {
    return { original, matchText: original, targetLang: 'en', mode: 'en' }
  }

  const { text: en, lang } = await translateText(original, 'auto', 'en')
  const target = lang && lang !== 'en' ? lang : 'auto'
  // If auto still unknown, re-detect by translating to same
  let targetLang = target === 'auto' ? 'en' : target
  if (targetLang === 'en' && /[\u0600-\u06FF]/.test(original)) targetLang = 'ur'
  if (targetLang === 'en' && /[\u0900-\u097F]/.test(original)) targetLang = 'hi'

  return {
    original,
    matchText: en || original,
    targetLang,
    mode: 'translate',
  }
}

/**
 * Answer in the same language as the question.
 * @param {string} rawInput
 */
export async function getChatbotReplyAsync(rawInput) {
  const original = String(rawInput || '').trim()
  if (!original) {
    return 'Please type a question / Koi sawal likhein — e.g. “services kya hain?” or “What is pricing?”'
  }

  // Match on the original text so emojis / “ye kya hai” are not lost
  const metaFromOriginal = getChatbotReplyMeta(original)
  if (metaFromOriginal.intentIds?.includes('smalltalk')) {
    const prepared = await prepareQuestion(original)
    if (prepared.mode === 'roman' || prepared.targetLang === 'roman') {
      return metaFromOriginal.romanText || metaFromOriginal.text
    }
    if (prepared.mode === 'translate') {
      const target = prepared.targetLang === 'auto' ? 'en' : prepared.targetLang
      if (target && target !== 'en') {
        try {
          const { text } = await translateText(metaFromOriginal.text, 'en', target)
          return text || metaFromOriginal.text
        } catch {
          return metaFromOriginal.text
        }
      }
    }
    return metaFromOriginal.text
  }

  const prepared = await prepareQuestion(original)
  const meta = getChatbotReplyMeta(prepared.matchText || original)

  if (prepared.mode === 'en' || prepared.targetLang === 'en') {
    return meta.text
  }

  if (prepared.mode === 'roman' || prepared.targetLang === 'roman') {
    return meta.romanText || meta.text
  }

  const target = prepared.targetLang === 'auto' ? 'en' : prepared.targetLang
  if (!target || target === 'en') return meta.text

  try {
    const { text } = await translateText(meta.text, 'en', target)
    return text || meta.text
  } catch {
    return meta.text
  }
}

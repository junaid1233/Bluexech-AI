import { services } from './services'
import { blogPosts, technologies } from './content'

const WA =
  'https://wa.me/923092547332?text=Hi%21%20I%27d%20like%20to%20talk%20about%20a%20project%20with%20Bluexech%20AI.'
const EMAIL = 'support@bluexech.com'
const PHONE = '+92 309 2547332'
const ADDRESS = 'Gulshan Hadeed, Karachi, Pakistan'
const MSG = './message.html'
const MAP =
  'https://www.google.com/maps/search/?api=1&query=Gulshan-e-Hadeed%2C+Karachi%2C+Pakistan'

const LINKS = {
  home: '#home',
  about: '#about',
  services: '#services',
  features: '#features',
  process: '#process',
  pricing: '#pricing',
  portfolio: '#portfolio',
  faq: '#faq',
  blog: '#blog',
  tech: '#technologies',
  testimonials: '#testimonials',
  contact: '#contact',
  message: MSG,
  whatsapp: WA,
  email: `mailto:${EMAIL}`,
  map: MAP,
}

function serviceLink(id) {
  return `#service-${id}`
}

const serviceChat = (s) =>
  `${s.title}: ${s.desc}\n\nTypical timeline: ${s.duration}. Outcomes: ${s.outcomes.join(', ')}.\n\nMore detail: ${serviceLink(s.id)}`

const serviceChatRoman = (s) =>
  `${s.title}: ${s.desc}\n\nDuration: ${s.duration}. Results: ${s.outcomes.join(', ')}.\n\nZyada detail: ${serviceLink(s.id)}`

const allServicesShort = services
  .map((s, i) => `${i + 1}. ${s.title} - ${s.desc.split('.')[0]}.`)
  .join('\n')

const techByGroup = technologies.reduce((acc, t) => {
  ;(acc[t.group] ||= []).push(t.name)
  return acc
}, {})

const techLines = Object.entries(techByGroup)
  .map(([group, names]) => `• ${group}: ${names.join(', ')}`)
  .join('\n')

const blogLines = blogPosts.map((b) => `• ${b.title} (${b.readTime})`).join('\n')

const FULL_SITE_OVERVIEW = `Here’s a clear overview of Bluexech AI:

We’re an AI company that builds chatbots, generative systems, document AI, predictive analytics, computer vision, and agentic automation.

Office: ${ADDRESS}
Stats: 120+ projects · 40+ clients · 12+ countries · 8+ years

Services:
${allServicesShort}

Pricing: Starter $1,999/project · Growth $4,999/month · Enterprise custom

Process: Discover → Design → Build → Scale

Useful links on this website:
• Home ${LINKS.home}
• Services ${LINKS.services}
• Pricing ${LINKS.pricing}
• Process ${LINKS.process}
• Portfolio ${LINKS.portfolio}
• FAQ ${LINKS.faq}
• Blog ${LINKS.blog}
• Technologies ${LINKS.tech}
• Contact ${LINKS.contact}
• Message form ${LINKS.message}
• WhatsApp ${LINKS.whatsapp}
• Email ${LINKS.email}
• Map ${LINKS.map}

Ask me about any one topic (pricing, a service, portfolio, contact) and I’ll go deeper.`

/** Topic-related link lines (not a team CTA on every reply). */
const RELATED_LINKS = {
  full_site: `Explore: ${LINKS.services} - ${LINKS.pricing} - ${LINKS.contact}`,
  greeting: `Quick links: ${LINKS.services} - ${LINKS.pricing} - ${LINKS.faq}`,
  cyan: `Browse: ${LINKS.services} - ${LINKS.faq}`,
  about: `About & stats: ${LINKS.about} - Services: ${LINKS.services}`,
  services: `Services section: ${LINKS.services} - Start project: ${LINKS.message}`,
  chatbots: `Service: ${serviceLink('ai-chatbots')} - All: ${LINKS.services}`,
  generative: `Service: ${serviceLink('generative-ai')} - All: ${LINKS.services}`,
  document: `Service: ${serviceLink('document-ai')} - All: ${LINKS.services}`,
  predictive: `Service: ${serviceLink('predictive-analytics')} - All: ${LINKS.services}`,
  vision: `Service: ${serviceLink('computer-vision')} - All: ${LINKS.services}`,
  agents: `Service: ${serviceLink('agentic-automation')} - All: ${LINKS.services}`,
  pricing: `Packages: ${LINKS.pricing} - Message form: ${LINKS.message}`,
  why: `Why Bluexech: ${LINKS.features}`,
  process: `How we work: ${LINKS.process}`,
  contact: `Contact: ${LINKS.contact}\nEmail: ${LINKS.email}\nWhatsApp: ${LINKS.whatsapp}\nMap: ${LINKS.map}\nMessage form: ${LINKS.message}`,
  whatsapp: `WhatsApp: ${LINKS.whatsapp}`,
  portfolio: `Portfolio: ${LINKS.portfolio}`,
  faq: `FAQ / Help Centre: ${LINKS.faq}`,
  tech: `Technologies: ${LINKS.tech}`,
  blog: `Blog: ${LINKS.blog}`,
  stats: `Stats: ${LINKS.about}`,
  consultation: `Message form: ${LINKS.message} - Contact: ${LINKS.contact}`,
  testimonials: `Testimonials: ${LINKS.testimonials}`,
  attachment: `Share details via form: ${LINKS.message}`,
}

/** @type {{ id: string, keywords: string[], answer: string }[]} */
export const chatbotIntents = [
  {
    id: 'full_site',
    keywords: [
      'full detail',
      'full details',
      'complete detail',
      'everything',
      'whole site',
      'all info',
      'all information',
      'site details',
      'pori detail',
      'poori detail',
      'sara detail',
      'saari detail',
      'tell me all',
      'overview',
      'summary of site',
      'extra detail',
      'extra details',
      'poori malomat',
      'sari malomat',
      'site ki detail',
      'sab batao',
      'sab kuch',
    ],
    answer: FULL_SITE_OVERVIEW,
  },
  {
    id: 'greeting',
    keywords: [
      'hi',
      'hello',
      'hey',
      'salam',
      'assalam',
      'aoa',
      'hola',
      'good morning',
      'good evening',
      'good afternoon',
      'assalamualaikum',
      'madad',
    ],
    answer: `Hi 👋 I’m Cyan. Ask me anything about Bluexech - I’ll answer just what you ask.`,
  },
  {
    id: 'cyan',
    keywords: [
      'what is cyan',
      'who is cyan',
      'about cyan',
      'cyan kya',
      'cyan kon',
      'your name',
      'assistant name',
      'cyan',
    ],
    answer: `I’m Cyan - the chat assistant on this Bluexech AI website. I answer your questions about the company and its AI work.`,
  },
  {
    id: 'about',
    keywords: [
      'about bluexech',
      'who are you',
      'company',
      'bluexech',
      'what do you do',
      'agency',
      'introduce',
      'mission',
      'company kya',
      'tum kon',
      'aap kon',
      'kya kartay',
      'kya karte',
    ],
    answer: `Bluexech AI builds practical AI for businesses - chatbots, document AI, predictive models, computer vision, and automation. Based in ${ADDRESS}.`,
  },
  {
    id: 'services',
    keywords: [
      'service',
      'services',
      'offer',
      'what can you',
      'solutions',
      'capabilities',
      'ai services',
      'list service',
      'services kya',
      'kya services',
      'what ai services',
      'apki services',
      'your services',
    ],
    answer: `Bluexech AI’s main services:

${allServicesShort}

Want detail on one? Name it (e.g. chatbot or document AI).`,
  },
  {
    id: 'chatbots',
    keywords: [
      'chatbot',
      'chat bot',
      'virtual agent',
      'whatsapp bot',
      'support bot',
      'customer support',
      'messenger',
      'rag chatbot',
      'bot banana',
      'chat bot kya',
    ],
    answer: serviceChat(services.find((x) => x.id === 'ai-chatbots')),
  },
  {
    id: 'generative',
    keywords: [
      'generative',
      'content ai',
      'writing',
      'copy',
      'proposal',
      'content system',
      'brand voice',
      'sop',
      'content likhna',
      'writing ai',
    ],
    answer: serviceChat(services.find((x) => x.id === 'generative-ai')),
  },
  {
    id: 'document',
    keywords: [
      'document',
      'ocr',
      'invoice',
      'pdf',
      'contract',
      'extraction',
      'data entry',
      'erp',
      'forms',
      'document ai',
      'invoice ai',
    ],
    answer: serviceChat(services.find((x) => x.id === 'document-ai')),
  },
  {
    id: 'predictive',
    keywords: [
      'predict',
      'forecast',
      'analytics',
      'churn',
      'demand',
      'sales forecast',
      'kpi',
      'risk score',
      'prediction',
      'forecasting',
    ],
    answer: serviceChat(services.find((x) => x.id === 'predictive-analytics')),
  },
  {
    id: 'vision',
    keywords: [
      'vision',
      'camera',
      'image',
      'video',
      'defect',
      'quality check',
      'inspection',
      'object detection',
      'attendance',
      'visual search',
      'computer vision',
    ],
    answer: serviceChat(services.find((x) => x.id === 'computer-vision')),
  },
  {
    id: 'agents',
    keywords: [
      'agentic',
      'automation',
      'workflow',
      'agent',
      'rpa',
      'process automation',
      'hands-free',
      'crm update',
      'auto kaam',
      'automation kya',
    ],
    answer: serviceChat(services.find((x) => x.id === 'agentic-automation')),
  },
  {
    id: 'pricing',
    keywords: [
      'price',
      'pricing',
      'package',
      'packages',
      'cost',
      'fee',
      'budget',
      'starter',
      'growth',
      'enterprise',
      'how much',
      'payment',
      'quote',
      'kitna',
      'kitne',
      'qeemat',
      'rate kya',
      'price kya',
      'charges',
      'fees',
      'pakage',
    ],
    answer: `Pricing packages:

• Starter - $1,999 / project (chatbot or Doc AI pilot)
• Growth - $4,999 / month (ongoing AI partnership)
• Enterprise - custom (org-wide / multi-agent)

Final quote depends on scope. Details: ${LINKS.pricing}`,
  },
  {
    id: 'why',
    keywords: [
      'why choose',
      'why bluexech',
      'features',
      'benefit',
      'advantage',
      'different',
      'unique',
      'kyun choose',
      'kyun bluexech',
      'fazool',
      'behtar',
    ],
    answer: `Teams choose Bluexech for outcome-first AI delivery, senior specialists, safe AI guardrails, clear communication, and support after launch.`,
  },
  {
    id: 'process',
    keywords: [
      'process',
      'how you work',
      'how we work',
      'steps',
      'methodology',
      'timeline',
      'start project',
      'kickoff',
      'discover',
      'design',
      'build',
      'scale',
      'kaise kaam',
      'process kya',
      'steps kya',
      'kaise start',
    ],
    answer: `We work in 4 steps: Discover → Design → Build → Scale. Most projects start within 1-2 weeks after discovery.`,
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'email',
      'phone',
      'call',
      'reach',
      'address',
      'location',
      'office',
      'karachi',
      'gulshan',
      'hadeed',
      'map',
      'where',
      'pakistan',
      'hours',
      'reply',
      'number',
      'rabta',
      'address kya',
      'office kahan',
      'kahan ho',
    ],
    answer: `Email: ${EMAIL}
Phone / WhatsApp: ${PHONE}
Office: ${ADDRESS}
WhatsApp: ${LINKS.whatsapp}
Contact page: ${LINKS.contact}`,
  },
  {
    id: 'whatsapp',
    keywords: ['whatsapp', 'wa link', 'message on whatsapp', 'whatsapp number'],
    answer: `Sure - WhatsApp us anytime:

Number: ${PHONE}
Direct link: ${WA}

(WhatsApp button is on the left side of the site.)
I’m here for instant site answers; WhatsApp is best for talking to the team.`,
  },
  {
    id: 'portfolio',
    keywords: [
      'portfolio',
      'project',
      'case study',
      'case studies',
      'work',
      'novaops',
      'harbor',
      'harborpay',
      'shield',
      'shieldgrid',
      'lumen',
      'clients',
      'demo',
      'projects kya',
      'kaam dikhao',
    ],
    answer: `A few projects from our portfolio:

• NovaOps (AI + Cloud) - cut incident response ~42%
• HarborPay (Web App) - secure payments + live reconciliation
• ShieldGrid (Cybersecurity) - multi-region threat visibility
• Lumen Care (Custom Software) - clinic scheduling, records, billing

On the site, open “View case study →”, then “Start similar project” if you want something like that.

Which industry are you in?`,
  },
  {
    id: 'faq',
    keywords: [
      'faq',
      'help centre',
      'help center',
      'help centre?',
      'help center?',
      'browse help',
      'industries',
      'industry',
      'custom model',
      'existing team',
      'support after',
      'sla',
      'healthcare',
      'logistics',
      'retail',
      'finance',
      'how quickly can a project',
      'project start',
      'after launch',
    ],
    answer: `Here’s Cyan’s Help Centre 📚

Quick answers:
• Industries: healthcare, logistics, retail, finance, professional services
• Start time: usually 1-2 weeks after discovery (pilots sooner)
• Existing teams: yes - we embed or run as a full delivery squad
• Models: existing AI APIs and custom/fine-tuned models - whichever fits accuracy & data
• After launch: monitoring + updates; Enterprise gets SLAs

You can also open the FAQ section on this site for the same answers.
Ask any one of these in more detail if you want.`,
  },
  {
    id: 'tech',
    keywords: [
      'tech',
      'technology',
      'technologies',
      'stack',
      'tools',
      'react',
      'python',
      'aws',
      'azure',
      'docker',
      'mongodb',
      'firebase',
      'kubernetes',
      'tech stack',
      'konsa tech',
    ],
    answer: `We pick the stack that fits your project (privacy, cost, accuracy, scale):

${techLines}

Want a recommendation for your use case?`,
  },
  {
    id: 'blog',
    keywords: ['blog', 'article', 'articles', 'blogs', 'blog topics'],
    answer: `Here are blog topics on the site:

${blogLines}

Tell me a topic name if you want a short summary.`,
  },
  {
    id: 'stats',
    keywords: [
      'stat',
      'stats',
      'statistics',
      'projects',
      'clients',
      'countries',
      'experience',
      'years',
      'kitne projects',
      'kitne clients',
    ],
    answer: `Bluexech AI by the numbers:

• 120+ projects completed
• 40+ happy clients
• 12+ countries served
• 8+ years of experience

Want to see how that translates into a service for you?`,
  },
  {
    id: 'consultation',
    keywords: [
      'consult',
      'consultation',
      'get started',
      'book',
      'hire',
      'free',
      'meeting',
      'message form',
      'form',
      'shuru',
      'kaise book',
      'consult karna',
    ],
    answer: `Easy - here’s how to start:

1) Click “Get Started” or “Book Free Consultation” on the site
2) Or use the Contact message form
3) Or reach us directly: ${EMAIL} / WhatsApp ${PHONE}

Share your goal, timeline, and budget range - we’ll recommend Starter, Growth, or Enterprise.

Shall I send the WhatsApp link?`,
  },
  {
    id: 'testimonials',
    keywords: [
      'testimonial',
      'review',
      'reviews',
      'feedback',
      'client say',
      'rating',
      'client reviews',
    ],
    answer: `Here’s what clients say:

• Sara Malik (Freightline) - WhatsApp agent handles ~80% of support questions
• Daniel Okoye (Meridian Health) - Document AI cut invoice entry from hours to minutes
• Priya Nair (Atlas Retail) - Agentic automation paid for itself in the first quarter

All shown as 5-star reviews on the site. Want a similar outcome?`,
  },
  {
    id: 'attachment',
    keywords: [
      'attached',
      'attachment',
      'i attached',
      'attach a file',
      'file:',
      'photo',
      'screenshot',
      'image attached',
    ],
    answer: `Got it - thanks for sharing the file 📎

I can’t deeply analyze file contents in this chat yet, but I’ve noted your attachment.

Please tell me in 1-2 lines what you need help with (e.g. chatbot brief, invoice sample, UI screenshot), and I’ll guide the next steps - or WhatsApp the team at ${PHONE} for a human review.`,
  },
  {
    id: 'thanks',
    keywords: [
      'thanks',
      'thank you',
      'shukriya',
      'ok',
      'okay',
      'great',
      'perfect',
      'done',
      'jazakallah',
    ],
    answer: `You’re welcome! 😊 Anytime you need services, pricing, or contact details - just ask.`,
  },
]

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s+@$./-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const ROMAN_BY_ID = {
  full_site: `Bluexech AI ka clear overview:

Hum AI company hain - chatbots, generative AI, document AI, predictive analytics, computer vision, aur agentic automation.

Office: ${ADDRESS}
Stats: 120+ projects · 40+ clients · 12+ countries · 8+ years

Services:
${allServicesShort}

Pricing: Starter $1,999/project · Growth $4,999/month · Enterprise custom
Process: Discover → Design → Build → Scale
Contact: ${EMAIL} · ${PHONE}

Kisi ek topic pe aur detail chahiye to batao.`,

  greeting: `Assalam o Alaikum 👋 Main Cyan hoon. Jo poochoge usi ka short answer dunga.`,

  cyan: `Main Cyan hoon - Bluexech AI website ka chat assistant. Aap ke sawal ka seedha jawab deta hoon.`,

  about: `Bluexech AI businesses ke liye practical AI banati hai - chatbots, document AI, predictive, vision, automation. Office: ${ADDRESS}.`,

  services: `Bluexech AI ki main services:

${allServicesShort}

Kisi ek ki detail chahiye to naam likho.`,

  chatbots: serviceChatRoman(services.find((x) => x.id === 'ai-chatbots')),
  generative: serviceChatRoman(services.find((x) => x.id === 'generative-ai')),
  document: serviceChatRoman(services.find((x) => x.id === 'document-ai')),
  predictive: serviceChatRoman(services.find((x) => x.id === 'predictive-analytics')),
  vision: serviceChatRoman(services.find((x) => x.id === 'computer-vision')),
  agents: serviceChatRoman(services.find((x) => x.id === 'agentic-automation')),

  pricing: `Pricing:

• Starter - $1,999 / project
• Growth - $4,999 / month
• Enterprise - custom

Details: ${LINKS.pricing}`,

  why: `Bluexech outcome-first AI, senior specialists, safe AI, clear communication, aur launch ke baad support ke liye choose hota hai.`,

  process: `Process: Discover → Design → Build → Scale. Start aksar discovery ke 1-2 weeks baad.`,

  contact: `Email: ${EMAIL}
Phone/WhatsApp: ${PHONE}
Office: ${ADDRESS}
WhatsApp: ${LINKS.whatsapp}
Contact: ${LINKS.contact}`,

  whatsapp: `WhatsApp:

Number: ${PHONE}
Link: ${WA}

(Left side pe WhatsApp button hai.)
Site answers ke liye main; team se baat ke liye WhatsApp best hai.`,

  portfolio: `Portfolio se examples:

• NovaOps - incident response ~42% better
• HarborPay - secure payments + reconciliation
• ShieldGrid - threat visibility
• Lumen Care - clinic scheduling/records/billing

Kis industry mein ho? Similar project chahiye to batao.`,

  faq: `Cyan Help Centre 📚

• Industries: healthcare, logistics, retail, finance…
• Start: 1-2 weeks after discovery
• Existing teams: haan
• Models: existing + custom dono
• After launch: monitoring; Enterprise pe SLA

Site pe FAQ section bhi hai.
Kis sawal pe aur detail chahiye?`,

  tech: `Tech stack project ke hisaab se choose hota hai:

${techLines}

Apna use case batao - recommend karun?`,

  blog: `Site pe blog topics:

${blogLines}

Kisi topic ka short summary chahiye?`,

  stats: `Numbers:

• 120+ projects
• 40+ clients
• 12+ countries
• 8+ years

Service recommend karun?`,

  consultation: `Start kaise karein:

1) Site pe Get Started / Book Free Consultation
2) Contact message form
3) Direct: ${EMAIL} / WhatsApp ${PHONE}

Goal, timeline, budget batao - package suggest karenge.
WhatsApp link bhejun?`,

  testimonials: `Clients kehti hain:

• Sara Malik - WhatsApp agent ~80% support handle
• Daniel Okoye - Document AI ne invoice entry hours → minutes
• Priya Nair - automation pehle quarter mein payback

Similar result chahiye?`,

  attachment: `File mil gayi 📎 - shukriya!

Is chat mein file ko deeply analyze nahi kar sakta, lekin note kar liya.

1-2 lines mein batao kya help chahiye (brief, invoice, screenshot…), main next steps bataunga - ya team ko WhatsApp ${PHONE} pe bhej dein.`,

  thanks: `Shukriya! 😊 Services, price, ya contact - jab chaho pooch lena.`,
}

const STOP = new Set([
  'the',
  'and',
  'for',
  'you',
  'your',
  'our',
  'are',
  'is',
  'am',
  'was',
  'were',
  'what',
  'which',
  'who',
  'how',
  'when',
  'where',
  'why',
  'with',
  'from',
  'this',
  'that',
  'these',
  'those',
  'have',
  'has',
  'had',
  'can',
  'could',
  'would',
  'should',
  'will',
  'just',
  'about',
  'into',
  'than',
  'then',
  'them',
  'they',
  'their',
  'there',
  'here',
  'also',
  'very',
  'much',
  'more',
  'some',
  'any',
  'all',
  'not',
  'but',
  'or',
  'do',
  'does',
  'did',
  'a',
  'an',
  'of',
  'to',
  'in',
  'on',
  'at',
  'as',
  'by',
  'be',
  'me',
  'my',
  'we',
  'us',
  'please',
  'tell',
  'want',
  'need',
  'like',
  'get',
  'got',
  'kya',
  'hai',
  'hain',
  'hein',
  'ye',
  'yeh',
  'yai',
  'yea',
  'this',
  'matlab',
])

const EMOJI_HINTS = [
  { re: /⭐|🌟|✨/, nameEn: 'a star / sparkle emoji', nameRoman: 'star / sparkle emoji' },
  { re: /🔥/, nameEn: 'a fire emoji (often means “hot” / awesome)', nameRoman: 'fire emoji (matlab “zabardast / trending”)' },
  { re: /❤️|💙|💕|💗/, nameEn: 'a heart emoji (love / like)', nameRoman: 'heart emoji (pyar / like)' },
  { re: /😂|🤣|😁|😀|😊/, nameEn: 'a smile / laugh emoji', nameRoman: 'smile / laugh emoji' },
  { re: /👍|👎/, nameEn: 'a thumbs up/down emoji', nameRoman: 'thumbs up/down emoji' },
  { re: /🙏/, nameEn: 'a folded-hands emoji (thanks / please)', nameRoman: 'pray/thanks emoji' },
  { re: /🚀/, nameEn: 'a rocket emoji (launch / growth)', nameRoman: 'rocket emoji (launch / growth)' },
  { re: /💡/, nameEn: 'a light-bulb emoji (idea)', nameRoman: 'bulb emoji (idea)' },
  { re: /✅|❌/, nameEn: 'a check / cross mark emoji', nameRoman: 'check / cross emoji' },
]

function extractEmojis(original) {
  try {
    return String(original || '').match(/\p{Extended_Pictographic}/gu) || []
  } catch {
    return String(original || '').match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []
  }
}

function emojiSmalltalkReply(original) {
  const raw = String(original || '').trim()
  if (!raw) return null
  const emojis = extractEmojis(raw)
  const asksWhat =
    /(kya hai|kia hai|ye kya|yai kya|yeh kya|what is this|what's this|whats this|what is that|matlab kya|is ka matlab|ye wali)/i.test(
      raw,
    )
  let stripped = raw
  for (const e of emojis) stripped = stripped.split(e).join('')
  const mostlyEmoji = emojis.length > 0 && stripped.replace(/\s+/g, '').length <= 2

  if (!emojis.length && !asksWhat) return null
  if (!emojis.length && asksWhat) {
    return {
      text: `I didn’t catch what you mean by that.\n\nPlease say a clear topic - like pricing, services, or contact - and I’ll answer.`,
      romanText: `Clear nahi mila kis cheez ke bare mein.\n\nTopic likhein - jaise pricing, services, ya contact - main jawab dunga.`,
      intentIds: ['smalltalk'],
    }
  }

  if (emojis.length && (asksWhat || mostlyEmoji)) {
    const e = emojis[0]
    const hint = EMOJI_HINTS.find((h) => h.re.test(e))
    const enName = hint?.nameEn || 'an emoji / symbol'
    const romanName = hint?.nameRoman || 'emoji / symbol'
    return {
      text: `That’s ${enName}: ${e}\n\nIt’s just a chat symbol - not a Bluexech service.\n\nIf you meant something on the site (pricing, chatbots, contact), tell me in a short sentence and I’ll answer that.`,
      romanText: `Ye ${romanName} hai: ${e}\n\nSirf chat symbol hai - Bluexech ki koi service nahi.\n\nAgar site ki cheez poochni hai (price, chatbot, contact), short sentence mein likhein - usi pe jawab dunga.`,
      intentIds: ['smalltalk'],
    }
  }

  return null
}

function meaningfulTokens(text) {
  return text
    .split(' ')
    .filter((t) => t.length > 2 && !STOP.has(t))
}

function scoreIntents(text) {
  return chatbotIntents
    .map((intent) => {
      let score = 0
      for (const kw of intent.keywords) {
        const k = kw.toLowerCase()
        if (!k) continue
        if (text === k) score += 20
        else if (k.includes(' ') && text.includes(k)) score += 14
        else if (
          !k.includes(' ') &&
          k.length >= 4 &&
          (text === k || text.startsWith(`${k} `) || text.endsWith(` ${k}`) || text.includes(` ${k} `))
        ) {
          score += k.length >= 6 ? 10 : 7
        }
      }
      const tokens = meaningfulTokens(text)
      for (const t of tokens) {
        if (t.length < 4) continue
        for (const kw of intent.keywords) {
          const k = kw.toLowerCase()
          if (k === t) score += 6
          // Only allow longer token≈keyword matches (avoid “kya” → “kya services”)
          else if (k.length >= 5 && t.length >= 4 && k === t) score += 4
        }
      }
      if (intent.id === 'cyan' && !/\bcyan\b/.test(text) && !text.includes('your name') && !text.includes('assistant name')) {
        score = Math.min(score, 2)
      }
      // Don't let “services” win on vague “kya hai” style messages
      if (intent.id === 'services' && !/(service|services|offer|solutions|khidmat|capabilities)/.test(text)) {
        score = 0
      }
      return { intent, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
}

function matchServiceFromText(text) {
  const tokens = meaningfulTokens(text)
  if (!tokens.length) return null

  let best = null
  let bestScore = 0
  for (const s of services) {
    const titleToks = tokenize(s.title).split(' ').filter((t) => t.length > 2 && !STOP.has(t))
    const idToks = tokenize(s.id.replace(/-/g, ' ')).split(' ').filter(Boolean)
    let score = 0

    for (const tw of titleToks) {
      if (text.includes(tw)) score += tw.length > 5 ? 8 : 5
    }
    for (const idt of idToks) {
      if (idt.length > 3 && text.includes(idt)) score += 6
    }

    // Specific boosts
    if (s.id === 'ai-chatbots' && /(chatbot|chat bot|whatsapp bot|virtual agent)/.test(text)) score += 12
    if (s.id === 'document-ai' && /(document|ocr|invoice|pdf|contract)/.test(text)) score += 12
    if (s.id === 'generative-ai' && /(generative|content ai|brand voice|writing ai)/.test(text)) score += 12
    if (s.id === 'predictive-analytics' && /(predict|forecast|churn|analytics)/.test(text)) score += 12
    if (s.id === 'computer-vision' && /(vision|camera|defect|inspection|object detection)/.test(text)) score += 12
    if (s.id === 'agentic-automation' && /(agentic|automation|workflow|rpa)/.test(text)) score += 12

    if (score > bestScore) {
      bestScore = score
      best = s
    }
  }
  return bestScore >= 10 ? best : null
}

/** Only attach links when the question topic needs them. */
const LINK_INTENTS = new Set([
  'full_site',
  'greeting',
  'cyan',
  'about',
  'contact',
  'whatsapp',
  'pricing',
  'consultation',
  'portfolio',
  'faq',
  'services',
  'process',
  'tech',
  'blog',
  'why',
  'stats',
  'testimonials',
  'attachment',
  'chatbots',
  'generative',
  'document',
  'predictive',
  'vision',
  'agents',
])

function composeChat(body, intentId) {
  if (!intentId || !LINK_INTENTS.has(intentId)) return body
  const link = RELATED_LINKS[intentId]
  if (!link) return body
  if (String(body).includes(link.split('\n')[0])) return body
  return `${body}\n\n🔗 ${link}`
}

const FALLBACK_EN = `I didn’t catch a clear topic yet 😊

Tell me what you want in a short line - for example:
• “pricing”
• “chatbot service”
• “office / contact”`

const FALLBACK_ROMAN = `Clear topic samajh nahi aya 😊

Short line mein batao - jaise:
• “pricing”
• “chatbot service”
• “contact / office”`

export function getChatbotReplyMeta(rawInput) {
  const original = String(rawInput || '').trim()
  const text = tokenize(rawInput)

  if (!original) {
    return {
      text: 'Please type a message - I’m here to help with services, pricing, process, or contact.',
      romanText: 'Koi message likhein - services, price, process, ya contact pe help karunga.',
      intentIds: [],
    }
  }

  // Emoji / “ye kya hai?” - never dump services
  const small = emojiSmalltalkReply(original)
  if (small) return small

  if (!text) {
    return {
      text: 'I see a symbol, but I’m not sure what you want. Tell me a topic (pricing, services, contact…).',
      romanText: 'Symbol dikha, lekin sawal clear nahi. Topic likho (pricing, services, contact…).',
      intentIds: ['smalltalk'],
    }
  }

  const scored = scoreIntents(text)
  const serviceHit = matchServiceFromText(text)
  const pickRoman = (id, en) => ROMAN_BY_ID[id] || en
  const top = scored[0]
  const topScore = top?.score || 0

  // Attachment note from UI
  if (/\[attached:|i attached a file|attached:/i.test(original) || /\battached\b/.test(text)) {
    const en = chatbotIntents.find((i) => i.id === 'attachment').answer
    return {
      text: composeChat(en, 'attachment'),
      romanText: composeChat(ROMAN_BY_ID.attachment, 'attachment'),
      intentIds: ['attachment'],
    }
  }

  // Explicit service deep-dive only when service keywords are strong AND stronger than weak intents
  if (serviceHit && topScore < 12) {
    const en = serviceChat(serviceHit)
    const roman = serviceChatRoman(serviceHit)
    const id = serviceHit.id
    const linkKey =
      id === 'ai-chatbots'
        ? 'chatbots'
        : id === 'generative-ai'
          ? 'generative'
          : id === 'document-ai'
            ? 'document'
            : id === 'predictive-analytics'
              ? 'predictive'
              : id === 'computer-vision'
                ? 'vision'
                : id === 'agentic-automation'
                  ? 'agents'
                  : 'services'
    return {
      text: composeChat(en, linkKey),
      romanText: composeChat(roman, linkKey),
      intentIds: [serviceHit.id],
    }
  }

  // Strong service + user asked about a named service (even if services intent also matches)
  if (serviceHit && top && ['services', 'full_site'].includes(top.intent.id)) {
    const en = serviceChat(serviceHit)
    const roman = serviceChatRoman(serviceHit)
    return {
      text: composeChat(en, 'services'),
      romanText: composeChat(roman, 'services'),
      intentIds: [serviceHit.id],
    }
  }

  if (!scored.length || topScore < 4) {
    return {
      text: FALLBACK_EN,
      romanText: FALLBACK_ROMAN,
      intentIds: [],
    }
  }

  const enBody = top.intent.answer
  const romanBody = pickRoman(top.intent.id, top.intent.answer)

  return {
    text: composeChat(enBody, top.intent.id),
    romanText: composeChat(romanBody, top.intent.id),
    intentIds: [top.intent.id],
  }
}

export function getChatbotReply(rawInput) {
  return getChatbotReplyMeta(rawInput).text
}

export { WA, EMAIL, PHONE, ADDRESS, FULL_SITE_OVERVIEW }

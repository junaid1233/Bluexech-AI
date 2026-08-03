import { services } from './services'
import { blogPosts, technologies } from './content'

const WA =
  'https://wa.me/923092547332?text=Hi%21%20I%27d%20like%20to%20talk%20about%20a%20project%20with%20Bluexech%20AI.'
const EMAIL = 'support@bluexech.com'
const PHONE = '+92 309 2547332'
const ADDRESS = 'Gulshan Hadeed, Karachi, Pakistan'

const serviceBlock = (s) =>
  `${s.title}\nDuration: ${s.duration} | Level: ${s.level}\n\nSummary: ${s.desc}\n\nFull details: ${s.details}\n\nWhat you get:\n• ${s.modules.join('\n• ')}\n\nOutcomes: ${s.outcomes.join(' · ')}\n\nExtra: We scope data sources, success metrics, integrations, and training before build. Human review / handoff is available where decisions need oversight.`

const allServicesDetailed = services.map((s, i) => `${i + 1}. ${serviceBlock(s)}`).join('\n\n————\n\n')

const techByGroup = technologies.reduce((acc, t) => {
  ;(acc[t.group] ||= []).push(t.name)
  return acc
}, {})

const techLines = Object.entries(techByGroup)
  .map(([group, names]) => `• ${group}: ${names.join(', ')}`)
  .join('\n')

const blogLines = blogPosts
  .map((b) => `• ${b.title} (${b.tag}, ${b.readTime}) — ${b.excerpt}`)
  .join('\n')

const FULL_SITE_OVERVIEW = `📘 COMPLETE BLUEXECH AI SITE GUIDE

━━━━━━━━━━━━━━━━━━
1) COMPANY
━━━━━━━━━━━━━━━━━━
Brand: Bluexech AI
Tagline: Build Smarter with Unique AI Solutions & Intelligent Automation
What we do: Help businesses grow with AI chatbots, generative systems, document intelligence, predictive analytics, computer vision, and agentic automation.
Office: ${ADDRESS}
Focus: Unique AI services (not generic website-only agency work).

Stats from the site:
• 120+ Projects Completed
• 40+ Happy Clients
• 12+ Countries Served
• 8+ Years of Experience

━━━━━━━━━━━━━━━━━━
2) ALL SERVICES (FULL)
━━━━━━━━━━━━━━━━━━
${allServicesDetailed}

━━━━━━━━━━━━━━━━━━
3) WHY CHOOSE BLUEXECH
━━━━━━━━━━━━━━━━━━
• Outcome-first delivery — measurable business results, not vanity demos
• Senior AI specialists — AI model, automation, vision, and data experts
• Safe AI by default — guardrails, human-in-the-loop, data privacy
• Transparent communication — milestones, demos, clear ownership
• Scalable AI architecture — grows with data, channels, and use cases
• Long-term partnership — support and iteration after launch

━━━━━━━━━━━━━━━━━━
4) HOW WE WORK
━━━━━━━━━━━━━━━━━━
1. Discover — map goals, constraints, and success metrics with stakeholders
2. Design — architecture, UX, and delivery plan before code ships
3. Build — iterative sprints with demos, quality gates, clear ownership
4. Scale — launch support, monitoring, continuous improvement after go-live

Typical start: 1–2 weeks after discovery. Pilots can start sooner.

━━━━━━━━━━━━━━━━━━
5) PACKAGES / PRICING
━━━━━━━━━━━━━━━━━━
• Starter — $1,999 / project
  AI pilots (chatbot or document automation)
  Includes: discovery workshop, chatbot/Doc AI pilot, basic analytics, 2 weeks support

• Growth — $4,999 / month (featured)
  Ongoing AI product & automation partnership
  Includes: dedicated AI squad, Agents + AI model scope, sprint demos, priority support

• Enterprise — Custom pricing
  Multi-agent, vision, org-wide AI rollout
  Includes: architecture review, custom models/RAG, 24/7 coverage, SLA & onsite options

━━━━━━━━━━━━━━━━━━
6) PORTFOLIO / CASE STUDIES
━━━━━━━━━━━━━━━━━━
• NovaOps Platform (AI + Cloud) — operations intelligence; cut incident response ~42%. Highlights: live incident board, AI triage, cloud metric connectors, RBAC.
• HarborPay Portal (Web App) — secure payments hub with realtime reconciliation. Highlights: payment status, dashboards, secure auth, exportable reports.
• ShieldGrid Monitor (Cybersecurity) — multi-region threat visibility. Highlights: threat feed, endpoint health map, escalation workflows, audit logs.
• Lumen Care Suite (Custom Software) — clinic scheduling, records, billing. Highlights: scheduling board, patient records, billing sync, staff roles.

Open Portfolio → “View case study →” for details, then “Start similar project”.

━━━━━━━━━━━━━━━━━━
7) TECHNOLOGIES
━━━━━━━━━━━━━━━━━━
${techLines}

━━━━━━━━━━━━━━━━━━
8) FAQ HIGHLIGHTS
━━━━━━━━━━━━━━━━━━
• Industries: healthcare, logistics, retail, finance, professional services
• Custom models OR existing AI models/APIs — both, based on accuracy & data needs
• We work with your existing teams or as a full delivery squad
• After launch: monitoring, prompt/model updates; Enterprise gets SLAs

━━━━━━━━━━━━━━━━━━
9) BLOG TOPICS ON THE SITE
━━━━━━━━━━━━━━━━━━
${blogLines}

━━━━━━━━━━━━━━━━━━
10) CONTACT & NEXT STEPS
━━━━━━━━━━━━━━━━━━
Email: ${EMAIL}
Phone: ${PHONE}
WhatsApp: ${PHONE}
  Link: ${WA}
Office: ${ADDRESS}
Map: live Google Map on Contact section (Gulshan-e-Hadeed, Karachi)

Message form: open “message.html” / Contact CTA — fill instructions then submit.
CTAs on site: Get Started · Book Free Consultation
Social: LinkedIn (company/bluexech-ai), Facebook, Instagram (@bluexech_ai)
Reply time: usually within 1 business day

Ask any specific question (e.g. “document AI modules”, “Growth package”, “office map”) for a focused answer.`

function formatService(s) {
  return serviceBlock(s)
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
      'start',
      'help',
      'madad',
      'assalamualaikum',
    ],
    answer:
      `Hello! I’m the Bluexech AI Assistant — I know this full website.\n\nAsk me anything, for example:\n• “Full site details” — complete guide\n• “All services” — every AI service with modules & outcomes\n• “Pricing” — Starter / Growth / Enterprise\n• “Why Bluexech” — why choose us\n• “Process” — Discover → Design → Build → Scale\n• “Portfolio” — NovaOps, HarborPay, ShieldGrid, Lumen Care\n• “Contact” — email, phone, WhatsApp, Gulshan Hadeed map\n• “Technologies” / “Blog” / “FAQ”\n\nOffice: ${ADDRESS}\n${EMAIL} · ${PHONE}`,
  },
  {
    id: 'about',
    keywords: [
      'about',
      'who are you',
      'company',
      'bluexech',
      'what do you do',
      'agency',
      'introduce',
      'brand',
      'mission',
      'business',
      'company kya',
      'tum kon',
      'aap kon',
      'kya kartay',
      'kya karte',
    ],
    answer:
      `About Bluexech AI (full):\n\nBluexech AI helps organizations grow with unique AI services — chatbots, document intelligence, predictive models, computer vision, and agentic automation — delivered close to your goals.\n\nHeadline on site: “Build Smarter with Unique AI Solutions & Intelligent Automation”\nLead: We help businesses grow with AI chatbots, generative systems, document intelligence, predictive analytics, and agentic automation.\n\nTrusted delivery stats:\n• 120+ projects completed\n• 40+ happy clients\n• 12+ countries served\n• 8+ years of experience\n\nHQ / office: ${ADDRESS}\nWe are an AI-first company (not a generic web-only shop).\n\nNext: ask “all services”, “pricing”, or “full site details”.`,
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
      'products',
      'ai services',
      'list service',
      'services kya',
      'kya services',
      'kya offer',
      'kya dete',
      'kya kar sakte',
      'khidmat',
    ],
    answer: `All Bluexech AI services — full details:\n\n${allServicesDetailed}\n\nTip: Ask one by name for a shorter deep dive (chatbots, generative, document AI, predictive, vision, agentic).`,
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
    answer: formatService(services.find((x) => x.id === 'ai-chatbots')),
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
    answer: formatService(services.find((x) => x.id === 'generative-ai')),
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
    answer: formatService(services.find((x) => x.id === 'document-ai')),
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
    answer: formatService(services.find((x) => x.id === 'predictive-analytics')),
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
    answer: formatService(services.find((x) => x.id === 'computer-vision')),
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
    answer: formatService(services.find((x) => x.id === 'agentic-automation')),
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
    answer:
      `Packages / Pricing (full):\n\n1) Starter — $1,999 / project\n   Best for: focused AI pilots (chatbot OR document automation)\n   Includes:\n   • AI discovery workshop\n   • Chatbot or Doc AI pilot\n   • Basic analytics\n   • 2 weeks support\n\n2) Growth — $4,999 / month (featured / most popular on site)\n   Best for: ongoing AI product & automation partnership\n   Includes:\n   • Dedicated AI squad\n   • Agents + AI model scope\n   • Sprint demos\n   • Priority support\n\n3) Enterprise — Custom\n   Best for: multi-agent systems, vision, org-wide AI rollout\n   Includes:\n   • AI architecture review\n   • Custom models / RAG\n   • 24/7 coverage\n   • SLA & onsite options\n\nExtra: Final quote depends on data readiness, integrations, channels (web/WhatsApp), and compliance needs.\nBook Free Consultation via the site message form, email ${EMAIL}, or WhatsApp ${PHONE}.`,
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
    answer:
      `Why Choose Bluexech (full):\n\n1) Outcome-first delivery — every engagement tied to measurable results, not vanity demos\n2) Senior AI specialists — AI model, automation, vision, and data experts who ship production systems\n3) Safe AI by default — guardrails, human-in-the-loop checks, data privacy baked in\n4) Transparent communication — clear milestones, demos, ownership\n5) Scalable AI architecture — pipelines/agents that grow with volume & use cases\n6) Long-term partnership — support, iteration, guidance after launch\n\nExtra: We stay accountable after go-live with monitoring and continuous improvement.`,
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
    answer:
      `How We Work — full process from the site:\n\n1) Discover\n   We map goals, constraints, and success metrics with your stakeholders.\n\n2) Design\n   Architecture, UX, and delivery plan are shaped before code ships.\n\n3) Build\n   Iterative sprints with demos, quality gates, and clear ownership.\n\n4) Scale\n   Launch support, monitoring, and continuous improvement after go-live.\n\nExtra details:\n• Most engagements begin within 1–2 weeks after discovery\n• Urgent pilots (chatbot / document AI) can start sooner\n• You get demos during sprints so there are no surprises\n• Post-launch: monitoring + iteration (Enterprise: SLA options)\n\nReady to start? Message form, ${EMAIL}, or WhatsApp ${PHONE}.`,
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
    answer:
      `Contact & location (full):\n\n📧 Email: ${EMAIL}\n📞 Phone: ${PHONE}\n💬 WhatsApp: ${PHONE}\n   Direct link: ${WA}\n📍 Office: ${ADDRESS}\n🗺️ Map: Google Map embedded on Contact section for Gulshan-e-Hadeed, Karachi\n\nExtra:\n• Reply time: usually within 1 business day\n• Message form: Contact page CTA opens message.html in a new tab with fill instructions\n• Site CTAs: “Get Started” and “Book Free Consultation”\n• Footer also lists email, phone, and address\n• Social: LinkedIn company/bluexech-ai · Facebook · Instagram @bluexech_ai\n\nLeft floating button = WhatsApp · Right floating button = this AI chat`,
  },
  {
    id: 'whatsapp',
    keywords: ['whatsapp', 'wa link', 'message on whatsapp', 'whatsapp number'],
    answer: `WhatsApp (full):\n\nNumber: ${PHONE}\nChat link: ${WA}\n\nUse WhatsApp for quick human chat. Use this AI chat for full site details anytime.\nWhatsApp float is on the LEFT side of the screen.`,
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
    answer:
      `Portfolio / case studies (full):\n\n1) NovaOps Platform — tag: AI + Cloud\n   Ops intelligence suite that cut incident response time by ~42%.\n   Details: real-time ops platform with AI alerts, cloud telemetry, operator workflows.\n   Highlights: Live incident board · AI triage suggestions · Cloud metric connectors · Role-based access\n\n2) HarborPay Portal — tag: Web App\n   Secure customer payments hub with real-time reconciliation dashboards.\n   Highlights: Realtime payment status · Reconciliation dashboards · Secure auth flows · Exportable reports\n\n3) ShieldGrid Monitor — tag: Cybersecurity\n   Continuous threat visibility for a multi-region logistics network.\n   Highlights: Threat feed panel · Endpoint health map · Escalation workflows · Audit-ready logs\n\n4) Lumen Care Suite — tag: Custom Software\n   Clinic workflow system: scheduling, records, billing.\n   Highlights: Scheduling board · Patient records · Billing sync · Staff roles\n\nExtra: Cards show “View case study →”. Modal has “Start similar project” (opens message form).`,
  },
  {
    id: 'faq',
    keywords: [
      'faq',
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
      'question',
      'sawal',
    ],
    answer:
      `FAQ — full answers from the site:\n\nQ: What industries do you serve?\nA: Healthcare, logistics, retail, finance, and professional services — anywhere AI chatbots, document AI, and automation create leverage.\n\nQ: How quickly can a project start?\nA: Most AI engagements begin within 1–2 weeks after discovery. Pilot chatbots or document pipelines can start sooner.\n\nQ: Do you work with existing teams?\nA: Yes. We embed with your ops, product, and engineering teams — or run as a self-contained AI delivery squad.\n\nQ: Do you build custom AI models or use existing ones?\nA: Both. Proven AI models/APIs where they fit; fine-tune or train custom models when your data and accuracy need it.\n\nQ: What does support look like after launch?\nA: Monitoring, prompt/model updates, post-launch coverage. Enterprise clients get SLAs and continuous improvement cycles.\n\nExtra: Open the FAQ section on the site for the same answers in accordion UI.`,
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
    answer:
      `Technologies we use (full list from the site):\n\n${techLines}\n\nExtra: Stack is chosen per project for privacy, cost, accuracy, and scale — not hype. AI work often leans on Python + cloud + AI models; product UIs may use React/TypeScript.`,
  },
  {
    id: 'blog',
    keywords: ['blog', 'article', 'articles', 'guide', 'read', 'post', 'blogs'],
    answer: `Blog preview topics on the site:\n\n${blogLines}\n\nExtra: Blog section is a preview of practical AI guides. Ask if you want a summary of any topic (RAG chatbots, document AI, agentic automation, growth, tools).`,
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
    answer:
      `Statistics section (full):\n\n• 120+ Projects Completed\n• 40+ Happy Clients\n• 12+ Countries Served\n• 8+ Years of Experience\n\nExtra: Bluexech AI helps organizations grow with unique AI services delivered close to your goals.`,
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
    answer:
      `How to start with Bluexech AI (full):\n\n1) Click “Get Started” or “Book Free Consultation” on the hero\n2) Or open Contact → “Open message form” (message.html new tab)\n3) Follow fill instructions, choose a service, submit details\n4) Or email ${EMAIL} / call-WhatsApp ${PHONE}\n\nExtra: Tell us goals, data sources, timeline, and budget range so we can recommend Starter, Growth, or Enterprise.\nOffice visits / remote: based in ${ADDRESS}; we also serve clients internationally (12+ countries on stats).`,
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
    answer:
      `Testimonials on the site (full):\n\n• Sara Malik (CTO, Freightline) — WhatsApp agent answers ~80% of support questions so the team focuses on complex cases.\n• Daniel Okoye (Head of Ops, Meridian Health) — Document AI cut invoice entry from hours to minutes with high accuracy.\n• Priya Nair (COO, Atlas Retail) — Agentic automation paid for itself in the first quarter; communication stayed crisp.\n\nExtra: All shown with 5-star ratings on the Testimonials section.`,
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'shukriya', 'ok', 'okay', 'great', 'perfect', 'done', 'jazakallah'],
    answer:
      'You’re welcome! Ask “full site details” anytime for the complete guide, or ask about any section — services, pricing, portfolio, contact, tech, blog, FAQ.',
  },
]

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s+@$./-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const serviceRoman = (s) =>
  `${s.title}\nDuration: ${s.duration} | Level: ${s.level}\n\nShort: ${s.desc}\n\nPoori detail: ${s.details}\n\nAap ko milta hai:\n• ${s.modules.join('\n• ')}\n\nResults: ${s.outcomes.join(' · ')}\n\nExtra: Hum pehle data, goals, integrations aur training clear karte hain. Jahan zarurat ho wahan human review / handoff bhi hota hai.`

const ROMAN_BY_ID = {
  full_site: `📘 BLUEXECH AI — POORI SITE GUIDE (Roman)

1) COMPANY
Brand: Bluexech AI
Kaam: Unique AI solutions — chatbots, generative AI, document AI, predictive analytics, computer vision, agentic automation.
Office: ${ADDRESS}
Stats: 120+ projects · 40+ clients · 12+ countries · 8+ years

2) SERVICES
${services.map((s, i) => `${i + 1}) ${serviceRoman(s)}`).join('\n\n---\n\n')}

3) WHY BLUEXECH
Outcome-first · Senior AI specialists · Safe AI · Transparent communication · Scalable architecture · Long-term partnership

4) PROCESS
Discover → Design → Build → Scale
Start aksar 1–2 weeks after discovery. Pilots jaldi ho sakte hain.

5) PRICING
Starter $1,999/project · Growth $4,999/month · Enterprise Custom

6) PORTFOLIO
NovaOps · HarborPay · ShieldGrid · Lumen Care Suite

7) CONTACT
Email: ${EMAIL}
Phone/WhatsApp: ${PHONE}
Address: ${ADDRESS}
Map Contact section pe hai.

Koi bhi specific sawal poocho — isi Roman style mein detail milay gi.`,

  greeting: `Assalam o Alaikum! Main Bluexech AI Assistant hoon — poori website ki details mujhe pata hain.\n\nAap pooch sakte ho:\n• “poori site details”\n• “services kya hain”\n• “price kitna hai”\n• “contact / office kahan hai”\n• “process kaise hai”\n• “portfolio”\n\nOffice: ${ADDRESS}\n${EMAIL} · ${PHONE}`,

  about: `Bluexech AI ke bare mein (poori detail):\n\nHum unique AI services dete hain — chatbots, document intelligence, predictive models, computer vision, aur agentic automation.\n\nSite headline: Build Smarter with Unique AI Solutions & Intelligent Automation\n\nStats: 120+ projects · 40+ clients · 12+ countries · 8+ years\nOffice: ${ADDRESS}\n\nHum AI-first company hain (sirf generic website agency nahi).\nAgla sawal: “services kya hain” ya “price batao”.`,

  services: `Bluexech AI ki saari services (poori detail):\n\n${services.map((s, i) => `${i + 1}) ${serviceRoman(s)}`).join('\n\n---\n\n')}\n\nKisi ek pe deep dive chahiye to naam likho (chatbot, document AI, vision, etc.).`,

  chatbots: serviceRoman(services.find((x) => x.id === 'ai-chatbots')),
  generative: serviceRoman(services.find((x) => x.id === 'generative-ai')),
  document: serviceRoman(services.find((x) => x.id === 'document-ai')),
  predictive: serviceRoman(services.find((x) => x.id === 'predictive-analytics')),
  vision: serviceRoman(services.find((x) => x.id === 'computer-vision')),
  agents: serviceRoman(services.find((x) => x.id === 'agentic-automation')),

  pricing: `Packages / Pricing (poori detail):\n\n1) Starter — $1,999 / project\n   Chatbot ya Document AI pilot\n   Includes: discovery workshop, pilot, basic analytics, 2 weeks support\n\n2) Growth — $4,999 / month (popular)\n   Ongoing AI partnership\n   Includes: dedicated AI squad, agents + AI model, sprint demos, priority support\n\n3) Enterprise — Custom\n   Multi-agent, vision, org-wide AI\n   Includes: architecture review, custom models/RAG, 24/7, SLA & onsite\n\nFinal quote data, integrations aur channels pe depend karta hai.\nContact: ${EMAIL} · WhatsApp ${PHONE}`,

  why: `Bluexech kyun choose karein:\n\n1) Outcome-first delivery — measurable results\n2) Senior AI specialists\n3) Safe AI — guardrails + human-in-the-loop\n4) Transparent communication\n5) Scalable AI architecture\n6) Long-term partnership after launch\n\nExtra: Launch ke baad bhi monitoring aur improvement milti hai.`,

  process: `Hum kaise kaam karte hain:\n\n1) Discover — goals, constraints, success metrics\n2) Design — architecture, UX, delivery plan\n3) Build — sprints, demos, quality checks\n4) Scale — launch support + continuous improvement\n\nStart: aksar discovery ke 1–2 weeks baad. Pilots jaldi possible.\nShuru karna ho to message form, ${EMAIL}, ya WhatsApp ${PHONE}.`,

  contact: `Contact (poori detail):\n\nEmail: ${EMAIL}\nPhone: ${PHONE}\nWhatsApp: ${PHONE}\nLink: ${WA}\nOffice: ${ADDRESS}\nMap: Contact section pe Gulshan-e-Hadeed ka live map\n\nReply: usually 1 business day\nMessage form Contact se open hota hai\nSocial: LinkedIn, Facebook, Instagram @bluexech_ai\n\nLeft button = WhatsApp · Right button = AI Chat`,

  whatsapp: `WhatsApp details:\nNumber: ${PHONE}\nLink: ${WA}\n\nJaldi human chat ke liye WhatsApp use karo. Site details ke liye ye AI chat use karo.\nWhatsApp LEFT side pe hai.`,

  portfolio: `Portfolio / case studies:\n\n1) NovaOps Platform (AI + Cloud) — incident response ~42% better\n2) HarborPay Portal (Web App) — secure payments + reconciliation\n3) ShieldGrid Monitor (Cybersecurity) — threat visibility\n4) Lumen Care Suite (Custom Software) — clinic scheduling/records/billing\n\nSite pe “View case study →” dabao, phir “Start similar project”.`,

  faq: `FAQ (Roman):\n\nIndustries: healthcare, logistics, retail, finance, professional services\nStart time: 1–2 weeks after discovery (pilots jaldi)\nExisting teams: haan — embed ya alag squad\nModels: existing AI models/APIs + custom fine-tune dono\nAfter launch: monitoring + updates; Enterprise pe SLA\n\nAur sawal poocho — detail mil jayegi.`,

  tech: `Technologies (site list):\n\n${techLines}\n\nExtra: Har project pe stack privacy, cost aur accuracy ke hisaab se choose hota hai.`,

  blog: `Blog topics:\n\n${blogLines}\n\nKisi topic ka summary chahiye to naam likho.`,

  stats: `Statistics:\n• 120+ Projects\n• 40+ Happy Clients\n• 12+ Countries\n• 8+ Years Experience\n\nBluexech AI unique AI services ke sath growth help karta hai.`,

  consultation: `Project kaise start karein:\n\n1) Hero pe Get Started / Book Free Consultation\n2) Contact → Open message form\n3) Instructions follow karke form bharo\n4) Ya ${EMAIL} / WhatsApp ${PHONE}\n\nGoals, data, timeline, budget batao — Starter/Growth/Enterprise suggest karenge.\nOffice: ${ADDRESS}`,

  testimonials: `Client feedback:\n\n• Sara Malik (Freightline) — WhatsApp agent ~80% support handle karta hai\n• Daniel Okoye (Meridian Health) — Document AI ne invoice entry hours se minutes ki\n• Priya Nair (Atlas Retail) — Agentic automation pehle quarter mein payback\n\nSab 5-star testimonials site pe hain.`,

  thanks: `Shukriya! Kabhi bhi “poori site details”, services, price, ya contact pooch sakte ho — main Roman/English dono samajhta hoon.`,
}

const FALLBACK_EN =
  `I can still help.\n\nBluexech AI · ${ADDRESS}\nAI services: Chatbots · Generative AI · Document AI · Predictive Analytics · Computer Vision · Agentic Automation\nPackages: Starter $1,999/project · Growth $4,999/mo · Enterprise Custom\nContact: ${EMAIL} · ${PHONE}\n\nType “full site details” or ask: services · pricing · portfolio · contact`

const FALLBACK_ROMAN =
  `Main madad kar sakta hoon.\n\nBluexech AI · ${ADDRESS}\nServices: Chatbots · Generative · Document AI · Predictive · Vision · Agentic Automation\nPackages: Starter $1,999/project · Growth $4,999/mo · Enterprise Custom\nContact: ${EMAIL} · ${PHONE}\n\nLikho: “poori site details” ya “services kya hain” / “price kitna hai”`

function scoreIntents(text) {
  return chatbotIntents
    .map((intent) => {
      let score = 0
      for (const kw of intent.keywords) {
        if (text === kw) score += 6
        else if (text.includes(kw)) score += kw.length > 8 ? 4 : kw.length > 4 ? 3 : 2
      }
      const tokens = text.split(' ').filter((t) => t.length > 2)
      for (const t of tokens) {
        if (intent.keywords.some((kw) => kw.includes(t) || t.includes(kw))) score += 1
      }
      return { intent, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function getChatbotReplyMeta(rawInput) {
  const text = tokenize(rawInput)

  if (!text) {
    return {
      text: 'Please type a question — try “full site details”, “all services”, “pricing”, or “contact”.',
      romanText: 'Koi sawal likhein — maslan “poori site details”, “services kya hain”, “price kitna hai”.',
      intentIds: [],
    }
  }

  const scored = scoreIntents(text)

  if (!scored.length) {
    return { text: FALLBACK_EN, romanText: FALLBACK_ROMAN, intentIds: [] }
  }

  const top = scored[0]
  const extras = scored
    .slice(1, 3)
    .filter((x) => x.score >= Math.max(3, top.score - 2) && x.intent.id !== top.intent.id)

  const pickRoman = (id, en) => ROMAN_BY_ID[id] || en

  if (top.intent.id === 'full_site' || top.score >= 8) {
    return {
      text: top.intent.answer,
      romanText: pickRoman(top.intent.id, top.intent.answer),
      intentIds: [top.intent.id],
    }
  }

  if (extras.length && top.intent.id !== 'greeting' && top.intent.id !== 'thanks') {
    const text =
      top.intent.answer +
      '\n\n—— Related ——\n\n' +
      extras.map((x) => x.intent.answer).join('\n\n——\n\n')
    const romanText =
      pickRoman(top.intent.id, top.intent.answer) +
      '\n\n—— Related ——\n\n' +
      extras.map((x) => pickRoman(x.intent.id, x.intent.answer)).join('\n\n——\n\n')
    return {
      text,
      romanText,
      intentIds: [top.intent.id, ...extras.map((x) => x.intent.id)],
    }
  }

  return {
    text: top.intent.answer,
    romanText: pickRoman(top.intent.id, top.intent.answer),
    intentIds: [top.intent.id],
  }
}

export function getChatbotReply(rawInput) {
  return getChatbotReplyMeta(rawInput).text
}

export { WA, EMAIL, PHONE, ADDRESS, FULL_SITE_OVERVIEW }

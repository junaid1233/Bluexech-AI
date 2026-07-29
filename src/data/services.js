export const services = [
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    desc: 'Custom models, automation, and intelligent workflows that reduce busywork and surface better decisions.',
    image: 'images/services/ai.png',
    alt: 'AI neural network and intelligent systems',
    duration: '4–8 weeks',
    level: 'Business + Tech',
    details:
      'Learn and deploy practical AI for your business — chatbots, document automation, forecasting, and internal copilots built around your data and workflows.',
    modules: [
      'AI opportunity mapping for your operations',
      'Data prep, model selection, and prompt systems',
      'Workflow automation with human-in-the-loop checks',
      'Dashboard, monitoring, and handoff training',
    ],
    outcomes: ['Faster operations', 'Reduced manual work', 'Clear AI roadmap'],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    desc: 'Fast, accessible product sites and web apps engineered for performance and conversion.',
    image: 'images/services/web.png',
    alt: 'Modern web development and interface design',
    duration: '3–6 weeks',
    level: 'Product + Design',
    details:
      'Build high-converting websites and web apps with modern React stacks, clean UI, SEO basics, and mobile-first performance.',
    modules: [
      'UX structure and conversion-focused layout',
      'Responsive frontend build (React / Vite)',
      'Forms, analytics, and lead capture',
      'Launch, speed checks, and maintenance plan',
    ],
    outcomes: ['Faster pages', 'Better leads', 'Mobile-ready UI'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    desc: 'Scalable cloud architecture, CI/CD, and observability so releases stay predictable.',
    image: 'images/services/cloud.png',
    alt: 'Cloud infrastructure and DevOps pipelines',
    duration: '3–7 weeks',
    level: 'Engineering',
    details:
      'Set up reliable cloud infrastructure with CI/CD, monitoring, and secure deployments so your team ships without downtime drama.',
    modules: [
      'Cloud architecture and environment setup',
      'CI/CD pipelines and release automation',
      'Logging, alerts, and uptime monitoring',
      'Cost control and scaling playbooks',
    ],
    outcomes: ['Stable releases', 'Less downtime', 'Clear ops process'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    desc: 'Threat assessments, hardening, and continuous monitoring to protect data and uptime.',
    image: 'images/services/cyber.png',
    alt: 'Cybersecurity shield and digital protection',
    duration: '2–5 weeks',
    level: 'Security',
    details:
      'Protect systems with practical security reviews, hardening steps, access controls, and ongoing monitoring suited to your stack.',
    modules: [
      'Security audit and risk scoring',
      'Access control and endpoint hardening',
      'Backup, recovery, and incident basics',
      'Monitoring setup and team guidance',
    ],
    outcomes: ['Lower risk', 'Hardened systems', 'Faster incident response'],
  },
  {
    id: 'custom-software',
    title: 'Custom Software',
    desc: 'Tailored platforms that fit your processes — from internal tools to customer-facing products.',
    image: 'images/services/software.png',
    alt: 'Custom software modules and applications',
    duration: '6–12 weeks',
    level: 'Full Product',
    details:
      'Design and build custom software around your exact process — CRMs, portals, admin tools, and industry workflows.',
    modules: [
      'Process discovery and system blueprint',
      'UI/UX and core feature build',
      'Integrations, roles, and permissions',
      'Testing, launch, and support handoff',
    ],
    outcomes: ['Fit-to-process tools', 'Less spreadsheet chaos', 'Scalable product base'],
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting',
    desc: 'Clear roadmaps, stack choices, and delivery plans aligned to growth and budget.',
    image: 'images/services/consulting.png',
    alt: 'IT consulting strategy and technology roadmap',
    duration: '1–3 weeks',
    level: 'Strategy',
    details:
      'Get a practical IT and digital roadmap — stack advice, budget planning, vendor choices, and delivery milestones.',
    modules: [
      'Business and tech discovery workshop',
      'Stack and architecture recommendations',
      'Budget + timeline planning',
      '90-day execution roadmap',
    ],
    outcomes: ['Clear plan', 'Smarter spend', 'Faster decisions'],
  },
]

export const getServiceById = (id) => services.find((s) => s.id === id)

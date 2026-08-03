export const services = [
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots & Virtual Agents',
    desc: 'Smart assistants that answer customers, qualify leads, and handle support 24/7 across chat and WhatsApp.',
    image: 'images/services/chatbots.png',
    alt: 'Customer support chat on phone and laptop',
    duration: '3–6 weeks',
    level: 'Customer Experience',
    details:
      'Deploy brand-trained AI agents that understand your products, policies, and tone — with handoff to humans when needed.',
    modules: [
      'Conversation design and intent mapping',
      'Knowledge base / RAG training on your data',
      'Multi-channel setup (web, WhatsApp, Messenger)',
      'Analytics, escalation rules, and handoff training',
    ],
    outcomes: ['24/7 support', 'Faster lead reply', 'Lower ticket load'],
  },
  {
    id: 'generative-ai',
    title: 'Generative AI Systems',
    desc: 'Custom generative tools for content, proposals, product copy, and internal knowledge writing.',
    image: 'images/services/generative.png',
    alt: 'Content drafting workspace with laptop and notes',
    duration: '3–7 weeks',
    level: 'Content + Ops',
    details:
      'Build private generative AI workspaces that create on-brand content, summaries, and drafts from your approved sources.',
    modules: [
      'Brand voice and prompt system design',
      'Secure model access and usage controls',
      'Templates for blogs, ads, emails, and SOPs',
      'Team training and quality review workflow',
    ],
    outcomes: ['Faster content', 'Consistent brand voice', 'Reusable AI tools'],
  },
  {
    id: 'document-ai',
    title: 'Intelligent Document AI',
    desc: 'Extract, classify, and process invoices, contracts, forms, and PDFs with AI — no manual data entry.',
    image: 'images/services/document-ai.png',
    alt: 'Invoices and forms scanned on a tablet',
    duration: '4–8 weeks',
    level: 'Operations',
    details:
      'Turn messy documents into structured data with OCR + AI extraction, validation rules, and push into your CRM or ERP.',
    modules: [
      'Document types and field mapping',
      'OCR + AI extraction pipeline',
      'Validation, exceptions, and human review',
      'Integration with sheets, CRM, or ERP',
    ],
    outcomes: ['Zero busywork entry', 'Fewer errors', 'Faster processing'],
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics & Forecasting',
    desc: 'AI models that forecast demand, churn, sales, and risk so you act before problems hit.',
    image: 'images/services/predictive.png',
    alt: 'Business forecasting charts on a laptop dashboard',
    duration: '4–9 weeks',
    level: 'Data + Strategy',
    details:
      'Use your historical data to predict outcomes — sales pipelines, inventory, customer churn, and operational risk scores.',
    modules: [
      'Data audit and feature engineering',
      'Model training and accuracy validation',
      'Live dashboards and alert thresholds',
      'Decision playbooks for your team',
    ],
    outcomes: ['Better forecasts', 'Proactive decisions', 'Clear KPIs'],
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision AI',
    desc: 'Image and video intelligence for quality checks, object detection, attendance, and visual search.',
    image: 'images/services/computer-vision.png',
    alt: 'Camera quality inspection of a product on a workbench',
    duration: '5–10 weeks',
    level: 'Vision + Edge',
    details:
      'Build vision models that see what humans miss — defect detection, inventory counting, face/ID checks, and visual tagging.',
    modules: [
      'Use-case and camera/data setup',
      'Model training on your image set',
      'Real-time or batch inference pipeline',
      'Alerts, reports, and ops handoff',
    ],
    outcomes: ['Automated inspection', 'Higher accuracy', 'Scalable monitoring'],
  },
  {
    id: 'agentic-automation',
    title: 'Agentic Process Automation',
    desc: 'Multi-step AI agents that run workflows end-to-end — research, update systems, and notify teams.',
    image: 'images/services/agentic.png',
    alt: 'Connected workflow apps and task automation board',
    duration: '4–8 weeks',
    level: 'Automation',
    details:
      'Design AI agents that plan and execute tasks across tools — CRM updates, research briefs, follow-ups, and internal ops loops.',
    modules: [
      'Process mapping and agent goals',
      'Tool connections (CRM, email, sheets, APIs)',
      'Guardrails, approvals, and audit logs',
      'Monitoring, retries, and team training',
    ],
    outcomes: ['Hands-free workflows', 'Fewer missed steps', 'Measurable ROI'],
  },
]

export const getServiceById = (id) => services.find((s) => s.id === id)

export const serviceTitles = services.map((s) => s.title)

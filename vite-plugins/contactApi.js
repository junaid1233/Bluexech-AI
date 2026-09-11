import { loadEnv } from 'vite'
import { sendContactEmails, validateContactPayload } from '../server/sendContact.mjs'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function googleEnv(env = {}) {
  return {
    RESEND_API_KEY: env.RESEND_API_KEY || process.env.RESEND_API_KEY,
    MAIL_FROM: env.MAIL_FROM || process.env.MAIL_FROM,
    EMAIL_TO: env.EMAIL_TO || process.env.EMAIL_TO,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID: env.GOOGLE_CALENDAR_ID || process.env.GOOGLE_CALENDAR_ID || 'primary',
    GOOGLE_MEET_ORGANIZER_EMAIL:
      env.GOOGLE_MEET_ORGANIZER_EMAIL || process.env.GOOGLE_MEET_ORGANIZER_EMAIL,
  }
}

function attachContactApi(middlewares, env) {
  middlewares.use(async (req, res, next) => {
    const url = req.url?.split('?')[0]
    if (url !== '/api/contact') return next()

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.end()
      return
    }

    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
      return
    }

    try {
      const body = await readBody(req)
      const errors = validateContactPayload(body)
      if (Object.keys(errors).length) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, errors }))
        return
      }

      const result = await sendContactEmails(body, googleEnv(env))
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
    } catch (err) {
      console.error('[contact-api]', err)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: err?.message || 'Failed to send email' }))
    }
  })
}

/** Vite plugin: POST /api/contact during `vite` and `vite preview`. */
export function contactApiPlugin() {
  return {
    name: 'bluexech-contact-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      attachContactApi(server.middlewares, env)
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      attachContactApi(server.middlewares, env)
    },
  }
}

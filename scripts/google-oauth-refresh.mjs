/**
 * One-time helper: get Google OAuth refresh token for Calendar + Meet.
 *
 * 1) In Google Cloud → Credentials → your OAuth Web client, add redirect URI:
 *      http://localhost:8788/oauth2/callback
 * 2) Put GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in .env
 * 3) Run:  npm run google:oauth
 * 4) Sign in as GOOGLE_MEET_ORGANIZER_EMAIL and allow Calendar access
 * 5) Copy GOOGLE_REFRESH_TOKEN into .env (script can also write it)
 */

import http from 'node:http'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const PORT = Number(process.env.GOOGLE_OAUTH_PORT || 8788)
const REDIRECT_URI = `http://localhost:${PORT}/oauth2/callback`
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ')

function loadEnvFile() {
  const envPath = resolve(root, '.env')
  const map = {}
  if (!existsSync(envPath)) return map
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    map[key] = value
    if (!(key in process.env)) process.env[key] = value
  }
  return map
}

function upsertEnv(key, value) {
  const envPath = resolve(root, '.env')
  let text = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
  const line = `${key}=${value}`
  const re = new RegExp(`^${key}=.*$`, 'm')
  if (re.test(text)) text = text.replace(re, line)
  else text = `${text.trimEnd()}\n${line}\n`
  writeFileSync(envPath, text, 'utf8')
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolveAsk) => {
    rl.question(question, (answer) => {
      rl.close()
      resolveAsk(answer.trim().toLowerCase())
    })
  })
}

const fileEnv = loadEnvFile()
const clientId = process.env.GOOGLE_CLIENT_ID || fileEnv.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || fileEnv.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env')
  process.exit(1)
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', SCOPES)
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent')
authUrl.searchParams.set('include_granted_scopes', 'true')

console.log('\n=== Google OAuth — get refresh token ===\n')
console.log('1) Google Cloud → your OAuth Web client → Authorized redirect URIs')
console.log(`   MUST include exactly:\n   ${REDIRECT_URI}\n`)
console.log('2) OAuth consent screen → Test users → add muhammadahmed.ma03@gmail.com\n')
console.log('3) Open this URL in your browser (sign in as that Gmail):\n')
console.log(authUrl.toString())
console.log('\nWaiting for Google redirect on', REDIRECT_URI, '...\n')

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)
  if (url.pathname !== '/oauth2/callback') {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
    return
  }

  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<h1>OAuth error</h1><pre>${error}</pre>`)
    console.error('OAuth error:', error)
    server.close()
    process.exit(1)
  }
  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('Missing code')
    return
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokenRes.ok) {
      throw new Error(tokens.error_description || tokens.error || JSON.stringify(tokens))
    }

    const refresh = tokens.refresh_token
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    if (!refresh) {
      res.end(`
        <h1>No refresh_token returned</h1>
        <p>Google sometimes skips it if this app was already authorized.</p>
        <ol>
          <li>Open <a href="https://myaccount.google.com/permissions">Google Account → Third-party access</a></li>
          <li>Remove access for this app</li>
          <li>Run <code>npm run google:oauth</code> again</li>
        </ol>
        <pre>${JSON.stringify(tokens, null, 2)}</pre>
      `)
      console.error('\nNo refresh_token in response. Revoke app access and retry with prompt=consent.\n')
      console.error(tokens)
      server.close()
      process.exit(1)
    }

    res.end(`
      <h1>Success</h1>
      <p>Refresh token received. You can close this tab and return to the terminal.</p>
    `)

    console.log('\n✅ GOOGLE_REFRESH_TOKEN:\n')
    console.log(refresh)
    console.log('')

    const answer = await ask('Write this into .env now? (y/n): ')
    if (answer === 'y' || answer === 'yes') {
      upsertEnv('GOOGLE_REFRESH_TOKEN', refresh)
      console.log('Saved GOOGLE_REFRESH_TOKEN to .env')
    } else {
      console.log('Paste it into .env manually as GOOGLE_REFRESH_TOKEN=...')
    }

    server.close()
    process.exit(0)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<h1>Token exchange failed</h1><pre>${String(err?.message || err)}</pre>`)
    console.error(err)
    server.close()
    process.exit(1)
  }
})

server.listen(PORT, () => {
  console.log(`OAuth callback server listening on http://localhost:${PORT}`)
})

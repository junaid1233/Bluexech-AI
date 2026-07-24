import { useEffect, useState } from 'react'
import { COUNTRY_CODES } from '../data/countryCodes'
import './AuthModal.css'

const emptyLogin = { email: '', password: '' }
const emptySignup = {
  name: '',
  email: '',
  country: 'PK',
  phone: '',
  password: '',
  confirm: '',
}

export default function AuthModal({ open, mode: initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [login, setLogin] = useState(emptyLogin)
  const [signup, setSignup] = useState(emptySignup)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bluexche_user') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setError('')
      setOk('')
    }
  }, [open, initialMode])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const dial = COUNTRY_CODES.find((c) => c.code === signup.country)?.dial || '+92'

  const saveUser = (data) => {
    localStorage.setItem('bluexche_user', JSON.stringify(data))
    setUser(data)
  }

  const onLogin = (e) => {
    e.preventDefault()
    setError('')
    const stored = JSON.parse(localStorage.getItem('bluexche_accounts') || '[]')
    const found = stored.find(
      (a) => a.email.toLowerCase() === login.email.trim().toLowerCase() && a.password === login.password,
    )
    if (!found) {
      setError('Invalid email or password. Sign up if you are new.')
      return
    }
    saveUser({ name: found.name, email: found.email })
    setOk(`Welcome back, ${found.name}!`)
    setTimeout(onClose, 900)
  }

  const onSignup = (e) => {
    e.preventDefault()
    setError('')
    if (signup.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (signup.password !== signup.confirm) {
      setError('Passwords do not match.')
      return
    }
    const accounts = JSON.parse(localStorage.getItem('bluexche_accounts') || '[]')
    if (accounts.some((a) => a.email.toLowerCase() === signup.email.trim().toLowerCase())) {
      setError('An account with this email already exists. Please log in.')
      return
    }
    const account = {
      name: signup.name.trim(),
      email: signup.email.trim(),
      phone: `${dial} ${signup.phone.trim()}`,
      country: signup.country,
      password: signup.password,
    }
    accounts.push(account)
    localStorage.setItem('bluexche_accounts', JSON.stringify(accounts))
    saveUser({ name: account.name, email: account.email })
    setOk('Account created successfully!')
    setSignup(emptySignup)
    setTimeout(onClose, 900)
  }

  const logout = () => {
    localStorage.removeItem('bluexche_user')
    setUser(null)
    setOk('Signed out.')
  }

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {user ? (
          <div className="auth-signed">
            <h2 id="auth-title">Signed in</h2>
            <p>
              You are logged in as <strong>{user.name}</strong>
              <br />
              <span>{user.email}</span>
            </p>
            {ok ? <p className="auth-ok">{ok}</p> : null}
            <button type="button" className="btn btn-primary auth-submit" onClick={logout}>
              Sign out
            </button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === 'login' ? 'is-active' : ''}
                onClick={() => {
                  setMode('login')
                  setError('')
                  setOk('')
                }}
              >
                Log in
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'is-active' : ''}
                onClick={() => {
                  setMode('signup')
                  setError('')
                  setOk('')
                }}
              >
                Sign up
              </button>
            </div>

            <h2 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p className="auth-lead">
              {mode === 'login'
                ? 'Log in to manage your AI projects and messages.'
                : 'Sign up to get started with Bluexche AI.'}
            </p>

            {error ? <p className="auth-error">{error}</p> : null}
            {ok ? <p className="auth-ok">{ok}</p> : null}

            {mode === 'login' ? (
              <form onSubmit={onLogin} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={login.email}
                    onChange={(e) => setLogin((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={login.password}
                    onChange={(e) => setLogin((p) => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary auth-submit">
                  Log in
                </button>
              </form>
            ) : (
              <form onSubmit={onSignup} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="signup-name">Full name</label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={signup.name}
                    onChange={(e) => setSignup((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={signup.email}
                    onChange={(e) => setSignup((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-phone">Phone</label>
                  <div className="phone-row">
                    <select
                      id="signup-country"
                      aria-label="Country code"
                      value={signup.country}
                      onChange={(e) => setSignup((p) => ({ ...p, country: e.target.value }))}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.dial})
                        </option>
                      ))}
                    </select>
                    <input
                      id="signup-phone"
                      type="tel"
                      required
                      autoComplete="tel-national"
                      value={signup.phone}
                      onChange={(e) => setSignup((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="300 1234567"
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={signup.password}
                    onChange={(e) => setSignup((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="signup-confirm">Confirm password</label>
                  <input
                    id="signup-confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={signup.confirm}
                    onChange={(e) => setSignup((p) => ({ ...p, confirm: e.target.value }))}
                    placeholder="Repeat password"
                  />
                </div>
                <button type="submit" className="btn btn-primary auth-submit">
                  Sign up
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

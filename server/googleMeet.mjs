/**
 * Create a Google Calendar event with an auto-generated Meet link.
 * Uses OAuth refresh token (personal Gmail / Workspace user).
 */

function requireEnv(env, key) {
  const value = env?.[key] || process.env[key]
  if (!value) throw new Error(`${key} is not configured`)
  return value
}

export async function getGoogleAccessToken(env = {}) {
  const clientId = requireEnv(env, 'GOOGLE_CLIENT_ID')
  const clientSecret = requireEnv(env, 'GOOGLE_CLIENT_SECRET')
  const refreshToken = requireEnv(env, 'GOOGLE_REFRESH_TOKEN')

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || `Google token refresh failed (${res.status})`,
    )
  }
  return data.access_token
}

/**
 * @param {object} opts
 * @param {string} opts.summary
 * @param {string} opts.description
 * @param {string} opts.meetingDate YYYY-MM-DD
 * @param {string} opts.meetingTime HH:mm
 * @param {string} opts.timezone
 * @param {number} opts.durationMinutes
 * @param {string} opts.guestEmail
 * @param {string} [opts.guestName]
 * @param {object} env
 */
export async function createMeetEvent(opts, env = {}) {
  const {
    summary,
    description,
    meetingDate,
    meetingTime,
    timezone,
    durationMinutes,
    guestEmail,
    guestName,
  } = opts

  const calendarId = encodeURIComponent(env.GOOGLE_CALENDAR_ID || process.env.GOOGLE_CALENDAR_ID || 'primary')
  const accessToken = await getGoogleAccessToken(env)

  const [hh, mm] = meetingTime.split(':').map(Number)
  const duration = Number(durationMinutes) || 30
  const startMinutes = hh * 60 + mm
  const endMinutes = startMinutes + duration
  const endHh = Math.floor(endMinutes / 60) % 24
  const endMm = endMinutes % 60
  const dayOffset = Math.floor(endMinutes / (24 * 60))

  let endDate = meetingDate
  if (dayOffset > 0) {
    const d = new Date(`${meetingDate}T00:00:00Z`)
    d.setUTCDate(d.getUTCDate() + dayOffset)
    endDate = d.toISOString().slice(0, 10)
  }

  const pad = (n) => String(n).padStart(2, '0')
  const startDateTime = `${meetingDate}T${pad(hh)}:${pad(mm)}:00`
  const endDateTime = `${endDate}T${pad(endHh)}:${pad(endMm)}:00`
  const requestId = `bluexech-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const body = {
    summary,
    description,
    location: 'Google Meet',
    start: {
      dateTime: startDateTime,
      timeZone: timezone || 'UTC',
    },
    end: {
      dateTime: endDateTime,
      timeZone: timezone || 'UTC',
    },
    attendees: [
      {
        email: guestEmail,
        displayName: guestName || guestEmail,
      },
    ],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: true,
    },
  }

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
    `?conferenceDataVersion=1&sendUpdates=all`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.error_description ||
      `Google Calendar API error (${res.status})`
    throw new Error(msg)
  }

  const entryPoints = data.conferenceData?.entryPoints || []
  const video = entryPoints.find((e) => e.entryPointType === 'video')
  const meetLink = data.hangoutLink || video?.uri || null

  if (!meetLink) {
    throw new Error('Calendar event created but Google Meet link was missing')
  }

  return {
    eventId: data.id,
    htmlLink: data.htmlLink || null,
    meetLink,
    hangoutLink: data.hangoutLink || null,
  }
}

export function googleMeetConfigured(env = {}) {
  return Boolean(
    (env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID) &&
      (env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET) &&
      (env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN),
  )
}

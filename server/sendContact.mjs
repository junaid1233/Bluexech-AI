import { createMeetEvent, googleMeetConfigured } from './googleMeet.mjs'

/**
 * Shared contact / meeting email logic (Resend).
 * Used by the Vite dev middleware and the standalone API server.
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Wall-clock time in `timeZone` → absolute Date */
function zonedTimeToUtc(meetingDate, meetingTime, timeZone) {
  const [y, mo, d] = meetingDate.split('-').map(Number)
  const [hh, mm] = meetingTime.split(':').map(Number)
  const wanted = Date.UTC(y, mo - 1, d, hh, mm, 0)
  let utcMs = wanted

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  for (let i = 0; i < 3; i += 1) {
    const parts = Object.fromEntries(
      dtf
        .formatToParts(new Date(utcMs))
        .filter((p) => p.type !== 'literal')
        .map((p) => [p.type, p.value]),
    )
    const hour = parts.hour === '24' ? 0 : Number(parts.hour)
    const shown = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      hour,
      Number(parts.minute),
      Number(parts.second),
    )
    utcMs += wanted - shown
  }

  return new Date(utcMs)
}

function toIcsUtc(date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

function formatInviteWhen(start, end, timeZone) {
  const dayFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const timeFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${dayFmt.format(start)} • ${timeFmt.format(start)} – ${timeFmt.format(end)}`
}

function formatSubjectWhen(start, end, timeZone) {
  const dayFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timeFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${dayFmt.format(start)} ${timeFmt.format(start)} – ${timeFmt.format(end)} (${timeZone})`
}

function googleCalendarUrl({ title, details, start, end, location }) {
  const fmt = (d) => toIcsUtc(d)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details,
    dates: `${fmt(start)}/${fmt(end)}`,
  })
  if (location) params.set('location', location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function foldIcsLine(line) {
  const max = 75
  if (line.length <= max) return line
  const parts = []
  let rest = line
  parts.push(rest.slice(0, max))
  rest = rest.slice(max)
  while (rest.length) {
    parts.push(` ${rest.slice(0, max - 1)}`)
    rest = rest.slice(max - 1)
  }
  return parts.join('\r\n')
}

function buildIcs({
  uid,
  title,
  description,
  start,
  end,
  organizerEmail,
  organizerName,
  attendeeEmail,
  attendeeName,
}) {
  const stamp = toIcsUtc(new Date())
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bluexech AI//Meeting Request//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    foldIcsLine(`SUMMARY:${title.replace(/\r?\n/g, ' ')}`),
    foldIcsLine(`DESCRIPTION:${description.replace(/\r?\n/g, '\\n')}`),
    foldIcsLine(
      `ORGANIZER;CN=${(organizerName || 'Bluexech AI').replace(/[;\\,]/g, '')}:mailto:${organizerEmail}`,
    ),
    foldIcsLine(
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${(attendeeName || attendeeEmail).replace(/[;\\,]/g, '')}:mailto:${attendeeEmail}`,
    ),
    foldIcsLine(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Bluexech AI:mailto:${organizerEmail}`),
    'LOCATION:Google Meet',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

function detailRow(label, value) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;color:#64748b;width:120px;font-size:13px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`
}

function hasMeetingSchedule(payload) {
  return Boolean(payload?.meetingDate && payload?.meetingTime)
}

/** Google Calendar–style invite card (HTML approximation for Resend emails). */
function inviteCardHtml({
  whenLine,
  title,
  organizerEmail,
  guestEmail,
  calendarLink,
  meetLink,
  isAdmin,
}) {
  const primaryHref = meetLink || calendarLink
  const primaryLabel = meetLink ? 'Join with Google Meet' : isAdmin ? 'Open in Calendar' : 'Yes'
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px;background:#f8fbff;border:1px solid #dbe3ef;border-radius:16px;">
    <tr>
      <td style="padding:22px 22px 8px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;padding-right:12px;">
              <p style="margin:0 0 8px;font-size:13px;color:#5f6368;font-weight:600;">${escapeHtml(whenLine)}</p>
              <h1 style="margin:0 0 10px;font-size:26px;line-height:1.25;color:#202124;font-weight:700;">${escapeHtml(title)}</h1>
              <p style="margin:0;font-size:13px;color:#5f6368;">
                <span style="display:inline-block;vertical-align:middle;margin-right:6px;">📹</span>
                Google Meet consultation
              </p>
            </td>
            <td width="56" style="vertical-align:top;text-align:right;">
              <div style="width:44px;height:44px;border-radius:50%;background:#e8f0fe;display:inline-block;text-align:center;line-height:44px;font-size:18px;">📅</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${
      meetLink
        ? `<tr>
      <td style="padding:10px 22px 4px 22px;">
        <div style="padding:12px 14px;background:#e6f4ea;border:1px solid #ceead6;border-radius:12px;">
          <p style="margin:0 0 4px;font-size:12px;color:#137333;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Google Meet link</p>
          <a href="${meetLink}" style="color:#0b57d0;font-size:14px;font-weight:600;word-break:break-all;text-decoration:none;">${escapeHtml(meetLink)}</a>
        </div>
      </td>
    </tr>`
        : ''
    }
    <tr>
      <td style="padding:8px 22px 6px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;padding-right:16px;">
              <p style="margin:0 0 4px;font-size:13px;color:#202124;font-weight:600;">${escapeHtml(organizerEmail)}</p>
              <p style="margin:0;font-size:12px;color:#80868b;">Organizer</p>
            </td>
            <td style="vertical-align:top;text-align:right;">
              <p style="margin:0 0 4px;font-size:13px;color:#202124;">👤 ${escapeHtml(guestEmail)}</p>
              <p style="margin:0;font-size:12px;color:#80868b;">Guest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 22px 8px 22px;">
        <p style="margin:0 0 2px;font-size:13px;color:#202124;font-weight:600;">
          <span style="margin-right:6px;">📆</span>On your Google Calendar
        </p>
        <p style="margin:0;font-size:12px;color:#80868b;">${
          meetLink
            ? 'A Google Calendar invite with Meet was also sent to the guest.'
            : 'Open the invite, then add a Google Meet video call.'
        }</p>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 22px 22px 22px;">
        <a href="${primaryHref}" style="display:inline-block;background:#1a73e8;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;margin-right:8px;margin-bottom:8px;">
          ${primaryLabel}
        </a>
        ${
          calendarLink
            ? `<a href="${calendarLink}" style="display:inline-block;background:#e8f0fe;color:#1967d2;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:600;margin-right:8px;margin-bottom:8px;">
          Open in Calendar
        </a>`
            : ''
        }
        <a href="mailto:${escapeHtml(isAdmin ? guestEmail : organizerEmail)}?subject=${encodeURIComponent(`Re: ${title}`)}" style="display:inline-block;background:#e8f0fe;color:#1967d2;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:600;margin-bottom:8px;">
          Add note
        </a>
      </td>
    </tr>
  </table>`
}

function infoBlockHtml({ name, email, phoneDisplay, country, service, whenLabel, message, meetLink }) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 8px;">
    <tr>
      <td>
        <h2 style="margin:0 0 12px;font-size:16px;color:#0f172a;">Request details</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${detailRow('Name', name)}
          ${detailRow('Email', email)}
          ${detailRow('Phone', phoneDisplay)}
          ${detailRow('Country', country)}
          ${detailRow('Service', service)}
          ${whenLabel ? detailRow('Preferred time', whenLabel) : ''}
          ${meetLink ? detailRow('Google Meet', meetLink) : ''}
        </table>
        <p style="margin:18px 0 8px;font-size:13px;color:#64748b;">Message</p>
        <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;color:#0f172a;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </td>
    </tr>
  </table>`
}

function wrapEmail(inner) {
  return `
  <div style="margin:0;padding:0;background:#f1f3f4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f1f3f4;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(15,23,42,0.08);">
            <tr>
              <td style="padding:18px 22px;background:linear-gradient(90deg,#1a73e8,#0ea5e9);color:#fff;font-family:Segoe UI,Roboto,Arial,sans-serif;">
                <strong style="font-size:15px;letter-spacing:0.02em;">Bluexech AI</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:22px;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#202124;">
                ${inner}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`
}

/**
 * @param {object} payload
 * @param {object} env - RESEND_API_KEY, MAIL_FROM, EMAIL_TO
 */
export async function sendContactEmails(payload, env) {
  const {
    name,
    email,
    country,
    dial,
    phone,
    service,
    message,
    meetingDate,
    meetingTime,
    timezone,
    durationMinutes,
  } = payload

  const apiKey = env.RESEND_API_KEY
  const from = env.MAIL_FROM || 'Bluexech AI Contact <onboarding@resend.dev>'
  const to = env.EMAIL_TO

  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  if (!to) throw new Error('EMAIL_TO is not configured')

  const wantsMeeting = hasMeetingSchedule(payload)
  const phoneDisplay = `${dial || ''} ${phone}`.trim()

  let calendarLink = null
  let meetLink = null
  let htmlLink = null
  let meetWarning = null
  let attachment = null
  let whenLabel = null
  let whenLine = null
  let subjectWhen = null
  let eventTitle = `Bluexech AI — ${service}`
  let start = null
  let end = null

  if (wantsMeeting) {
    const duration = Number(durationMinutes) || 30
    const tz = timezone || 'UTC'
    start = zonedTimeToUtc(meetingDate, meetingTime, tz)
    end = new Date(start.getTime() + duration * 60_000)

    if (Number.isNaN(start.getTime())) {
      throw new Error('Invalid meeting date/time')
    }

    whenLabel = `${meetingDate} ${meetingTime} (${tz}) · ${duration} min`
    whenLine = formatInviteWhen(start, end, tz)
    subjectWhen = formatSubjectWhen(start, end, tz)
    eventTitle = `Bluexech AI — ${service}`

    const details = [
      'Google Meet consultation requested via Bluexech AI contact form.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phoneDisplay}`,
      `Service: ${service}`,
      `When: ${whenLabel}`,
      '',
      'Message:',
      message,
    ].join('\n')

    if (googleMeetConfigured(env)) {
      try {
        const meet = await createMeetEvent(
          {
            summary: eventTitle,
            description: details,
            meetingDate,
            meetingTime,
            timezone: tz,
            durationMinutes: duration,
            guestEmail: email,
            guestName: name,
          },
          env,
        )
        meetLink = meet.meetLink
        htmlLink = meet.htmlLink
        calendarLink = meet.htmlLink || googleCalendarUrl({
          title: eventTitle,
          details: `${details}\n\nMeet: ${meetLink}`,
          start,
          end,
          location: meetLink,
        })
      } catch (err) {
        meetWarning = err?.message || 'Failed to create Google Meet'
        console.warn('[contact-api] Google Meet create failed:', meetWarning)
      }
    } else {
      meetWarning = 'Google Meet OAuth is not configured'
    }

    if (!calendarLink) {
      calendarLink = googleCalendarUrl({
        title: eventTitle,
        details: meetLink ? `${details}\n\nMeet: ${meetLink}` : details,
        start,
        end,
        location: meetLink || 'Google Meet',
      })
    }

    const icsDetails = meetLink ? `${details}\n\nGoogle Meet: ${meetLink}` : details
    const ics = buildIcs({
      uid: `bluexech-${Date.now()}@bluexech.com`,
      title: eventTitle,
      description: icsDetails,
      start,
      end,
      organizerEmail: to,
      organizerName: 'Bluexech AI',
      attendeeEmail: email,
      attendeeName: name,
    })
    attachment = {
      filename: 'invite.ics',
      content: Buffer.from(ics, 'utf8').toString('base64'),
      content_type: 'text/calendar; method=REQUEST; charset=UTF-8',
    }
  }

  const detailsHtml = infoBlockHtml({
    name,
    email,
    phoneDisplay,
    country,
    service,
    whenLabel,
    message,
    meetLink,
  })

  const organizerEmail = env.GOOGLE_MEET_ORGANIZER_EMAIL || to

  const adminHtml = wantsMeeting
    ? wrapEmail(`
        <p style="margin:0 0 16px;font-size:15px;color:#5f6368;">New meeting invitation from your website form.${
          meetLink ? ' A Google Meet link was created automatically.' : ''
        }</p>
        ${inviteCardHtml({
          whenLine,
          title: eventTitle,
          organizerEmail,
          guestEmail: email,
          calendarLink,
          meetLink,
          isAdmin: true,
        })}
        ${detailsHtml}
        <p style="margin:18px 0 0;font-size:12px;color:#80868b;line-height:1.5;">
          ${
            meetLink
              ? 'Google also emailed a Calendar invite to the guest. Use the Meet link above to join.'
              : 'A calendar invite (.ics) is attached. Open in Google Calendar and add Meet if needed.'
          }
          ${meetWarning && !meetLink ? ` (Meet auto-create note: ${escapeHtml(meetWarning)})` : ''}
        </p>
      `)
    : wrapEmail(`
        <h2 style="margin:0 0 8px;font-size:22px;color:#202124;">New contact message</h2>
        <p style="margin:0 0 18px;color:#5f6368;font-size:14px;">No meeting time was selected.</p>
        ${detailsHtml}
      `)

  const guestHtml = wantsMeeting
    ? wrapEmail(`
        <p style="margin:0 0 16px;font-size:15px;color:#5f6368;">Hi ${escapeHtml(name)}, you’re invited to a Bluexech AI consultation.</p>
        ${inviteCardHtml({
          whenLine,
          title: eventTitle,
          organizerEmail,
          guestEmail: email,
          calendarLink,
          meetLink,
          isAdmin: false,
        })}
        ${detailsHtml}
        <p style="margin:18px 0 0;font-size:12px;color:#80868b;line-height:1.5;">
          ${
            meetLink
              ? 'Click <strong>Join with Google Meet</strong> at the scheduled time. A Google Calendar invite was also sent to this email.'
              : 'Our team will confirm shortly. You can add this event with the button above or the attached invite.'
          }
        </p>
      `)
    : wrapEmail(`
        <h2 style="margin:0 0 8px;font-size:22px;color:#202124;">We received your message</h2>
        <p style="margin:0 0 18px;color:#5f6368;font-size:14px;">Hi ${escapeHtml(name)}, thanks for reaching out to Bluexech AI.</p>
        ${detailsHtml}
        <p style="margin:16px 0 0;color:#202124;font-size:14px;">Our team will reply within one business day.</p>
      `)

  async function send(body) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = data?.message || data?.error || `Resend error ${res.status}`
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
    return data
  }

  const adminPayload = {
    from,
    to: [to],
    reply_to: email,
    subject: wantsMeeting
      ? `Invitation: ${eventTitle} @ ${subjectWhen}`
      : `Contact message: ${name} — ${service}`,
    html: adminHtml,
  }
  if (attachment) adminPayload.attachments = [attachment]

  const adminResult = await send(adminPayload)

  let guestId = null
  let guestWarning = null
  try {
    const guestPayload = {
      from,
      to: [email],
      subject: wantsMeeting
        ? `Invitation: ${eventTitle} @ ${subjectWhen}`
        : 'Bluexech AI — we received your message',
      html: guestHtml,
    }
    if (attachment) guestPayload.attachments = [attachment]
    const guestResult = await send(guestPayload)
    guestId = guestResult.id
  } catch (err) {
    guestWarning = err?.message || 'Guest confirmation email could not be sent'
    console.warn('[contact-api] guest email skipped:', guestWarning)
  }

  return {
    ok: true,
    calendarLink,
    htmlLink,
    meetLink,
    meetWarning,
    adminId: adminResult.id,
    guestId,
    guestWarning,
  }
}

export function validateContactPayload(body) {
  const errors = {}
  if (!body?.name?.trim()) errors.name = 'Name is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body?.email || '')) errors.email = 'Valid email required'
  if (!body?.phone?.trim()) errors.phone = 'Phone is required'
  if (!body?.service?.trim()) errors.service = 'Service is required'
  if (!body?.message || String(body.message).trim().length < 10) {
    errors.message = 'Message too short'
  }

  const hasDate = Boolean(body?.meetingDate)
  const hasTime = Boolean(body?.meetingTime)
  if (hasDate || hasTime) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body?.meetingDate || '')) {
      errors.meetingDate = 'Meeting date required'
    }
    if (!/^\d{2}:\d{2}$/.test(body?.meetingTime || '')) {
      errors.meetingTime = 'Meeting time required'
    }
    const duration = Number(body?.durationMinutes)
    if (body?.durationMinutes != null && body.durationMinutes !== '' && ![15, 30, 45, 60].includes(duration)) {
      errors.durationMinutes = 'Invalid duration'
    }
  }

  return errors
}

import nodemailer from 'nodemailer';
import { validateContact } from '../src/contact/validation.js';

// POST /api/contact — Vercel serverless function (also mounted by `npm run dev`, see vite.config.js).
// Validates the contact form again on the server and emails it to CONTACT_TO over SMTP.
// Configuration: SMTP_USER / SMTP_PASS (required), SMTP_HOST, SMTP_PORT, CONTACT_TO — see .env.example.

const DEFAULT_TO = '5chicksagyncy@gmail.com';
const MAX_BODY = 16 * 1024;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// Vercel already parses JSON bodies into req.body; the dev server hands over the raw stream.
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error('too large');
  }
  return JSON.parse(raw || '{}');
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function buildEmail({ name, phone, details, link }, lang) {
  const rows = [
    ['Name', name],
    ['Phone', phone],
    ['Project link', link || '—'],
    ['Language', lang === 'ar' ? 'Arabic' : 'English'],
    ['Sent', new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC']
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Project details:', details].join('\n');
  const cell = 'padding:8px 12px;border-bottom:1px solid #e5e5e5;vertical-align:top';
  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#171717;max-width:620px">
  <h2 style="margin:0 0 16px;font-size:20px">New project inquiry from the website</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows
      .map(([k, v]) => {
        const value = k === 'Project link' && link ? `<a href="${escapeHtml(link)}">${escapeHtml(link)}</a>` : escapeHtml(v);
        return `<tr><th align="left" style="${cell};width:130px;color:#555">${k}</th><td style="${cell}">${value}</td></tr>`;
      })
      .join('')}
  </table>
  <h3 style="margin:22px 0 8px;font-size:15px">Project details</h3>
  <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(details)}</p>
</div>`;
  return { text, html };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: 'invalid' });
  }

  // Honeypot: a hidden field real visitors never fill. Pretend success so bots don't retry.
  if (body.website) return send(res, 200, { ok: true });

  const { values, errors } = validateContact(body);
  if (Object.keys(errors).length) return send(res, 400, { ok: false, error: 'invalid', fields: errors });

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('[contact] SMTP_USER / SMTP_PASS are not set');
    return send(res, 500, { ok: false, error: 'config' });
  }
  const port = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  const { text, html } = buildEmail(values, body.lang);
  try {
    await transporter.sendMail({
      from: { name: '5CHICKS Website', address: SMTP_USER },
      to: process.env.CONTACT_TO || DEFAULT_TO,
      subject: `New project inquiry — ${values.name}`,
      text,
      html
    });
  } catch (error) {
    console.error('[contact] sending failed:', error.message);
    return send(res, 502, { ok: false, error: 'send' });
  }
  return send(res, 200, { ok: true });
}

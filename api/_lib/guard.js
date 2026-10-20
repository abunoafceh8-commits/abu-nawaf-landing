/**
 * AbuNawaf API Guard — طبقة حماية موحّدة لواجهات Vercel
 * © 2026 أبو نواف — Abu Nawaf (Ethical Hacker) · MIT
 *
 * يوفر: CORS مقيّد، تحديد معدّل، فحص مدخلات، حماية SSRF، مصادقة إدارية، قراءة جسم آمن.
 * بلا أي تبعيات خارجية.
 */
import crypto from 'node:crypto';

const MEM = new Map(); // rate-limit buckets (per warm instance)

/* ---------------------------------- CORS --------------------------------- */
const DEFAULT_ALLOWED = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https?:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^https?:\/\/[a-z0-9-]+\.arcada\.app$/,
];

export function cors(req, res, extra = []) {
  const origin = req.headers.origin || '';
  const allow = [...DEFAULT_ALLOWED, ...extra.map((e) => (e instanceof RegExp ? e : new RegExp(e)))];
  const own = (() => {
    try { return new URL(`https://${req.headers.host}`).origin; } catch { return ''; }
  })();
  let ok = false;
  if (!origin) ok = true;
  else if (origin === own) ok = true;
  else ok = allow.some((rx) => rx.test(origin));
  if (ok && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  res.setHeader('Access-Control-Max-Age', '600');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

/* --------------------------------- JSON ---------------------------------- */
export function json(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(data));
}

/* ------------------------------- Body read -------------------------------- */
export async function readBody(req, limit = 64 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    if (req.body.length > limit) throw new HttpError(413, 'payload too large');
    try { return JSON.parse(req.body || '{}'); } catch { throw new HttpError(400, 'invalid JSON'); }
  }
  return await new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new HttpError(413, 'payload too large')); req.destroy(); return; }
      raw += c;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new HttpError(400, 'invalid JSON')); }
    });
    req.on('error', reject);
  });
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

/* ------------------------------ Rate limit -------------------------------- */
export function getIp(req) {
  const f = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return f || req.socket?.remoteAddress || 'unknown';
}

export function rateLimit(req, res, { max = 30, windowMs = 60_000, key = '' } = {}) {
  const bucket = `${key}:${getIp(req)}`;
  const now = Date.now();
  const cur = MEM.get(bucket);
  if (!cur || now > cur.reset) {
    MEM.set(bucket, { n: 1, reset: now + windowMs });
    if (MEM.size > 5000) MEM.clear();
    return true;
  }
  cur.n++;
  res.setHeader('X-RateLimit-Limit', String(max));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - cur.n)));
  if (cur.n > max) {
    res.setHeader('Retry-After', String(Math.ceil((cur.reset - now) / 1000)));
    json(res, 429, { error: 'تم تجاوز الحد المسموح من الطلبات — أعد المحاولة بعد قليل' });
    return false;
  }
  return true;
}

/* ------------------------------ Validation -------------------------------- */
export const V = {
  username(v, max = 40) {
    const s = String(v || '').trim().replace(/^@/, '');
    return /^[A-Za-z0-9._-]{1,40}$/.test(s) && s.length <= max ? s : '';
  },
  email(v) {
    const s = String(v || '').trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,24}$/i.test(s) && s.length <= 254 ? s : '';
  },
  text(v, max = 500) {
    const s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    return s.slice(0, max);
  },
  oneOf(v, list, fallback) { return list.includes(v) ? v : fallback; },
};

/* ------------------------------- Admin auth ------------------------------- */
function timingEq(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** يتحقق من ترويسة إدارية. يُفعّل فقط إن ضُبط ADMIN_TOKEN في بيئة Vercel. */
export function requireAdmin(req, res) {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) {
    json(res, 503, { error: 'admin_unconfigured', message: 'لم يُضبط ADMIN_TOKEN في متغيّرات البيئة — الوظيفة الإدارية معطّلة بأمان.' });
    return false;
  }
  const got = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.headers['x-admin-token'] || '';
  if (!timingEq(got, expected)) {
    json(res, 401, { error: 'unauthorized' });
    return false;
  }
  return true;
}

/** يتحقق من كلمة مرور مُخزَّنة كـ hash (SHA-256 مع ملح) في متغيرات البيئة. */
export function verifyPass(pass, envName = 'ADMIN_PASS_HASH') {
  const stored = process.env[envName] || '';
  if (!stored || !pass) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const got = crypto.createHash('sha256').update(`${salt}:${pass}`).digest('hex');
  return timingEq(got, hash);
}


/** يقبل إمّا ADMIN_TOKEN البيئي أو جلسة موقّعة صادرة من /api/admin-auth. */
export function requireAdminOrSession(req, res) {
  const got = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.headers['x-admin-token'] || '';
  const master = process.env.ADMIN_TOKEN || '';
  if (master && timingEq(got, master)) return true;
  const session = verifySession(got);
  if (session && session.role === 'admin') return true;
  json(res, 401, { error: 'unauthorized' });
  return false;
}


/** يُرجع true إن كان الطلب من مدير (بدون كتابة استجابة). */
export function isAdmin(req) {
  const got = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.headers['x-admin-token'] || '';
  const master = process.env.ADMIN_TOKEN || '';
  if (master && timingEq(got, master)) return true;
  const s = verifySession(got);
  return !!(s && s.role === 'admin');
}

/** ينشئ رمز جلسة موقّعًا HMAC (بديل آمن عن 'admin_'+Date.now()). */
export function signSession(payload = {}, ttlSec = 3600) {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || '';
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttlSec * 1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(token) {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || '';
  if (!secret || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const want = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!timingEq(sig, want)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch { return null; }
}

/* ----------------------------- SSRF protection ---------------------------- */
const PRIVATE = [
  /^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^0\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^::1$/, /^fc00:/i, /^fe80:/i, /^::ffff:127\./i,
];

export function isSafeUrl(raw, { allowedHosts = null, allowHttp = false } = {}) {
  let u;
  try { u = new URL(String(raw)); } catch { return { ok: false, reason: 'invalid_url' }; }
  if (u.protocol !== 'https:' && !(allowHttp && u.protocol === 'http:')) return { ok: false, reason: 'protocol' };
  const host = u.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) return { ok: false, reason: 'host' };
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && PRIVATE.some((rx) => rx.test(host))) return { ok: false, reason: 'private_ip' };
  if (host.startsWith('[') && PRIVATE.some((rx) => rx.test(host))) return { ok: false, reason: 'private_ip' };
  if (allowedHosts && !allowedHosts.some((h) => host === h || host.endsWith(`.${h}`))) return { ok: false, reason: 'host_not_allowed' };
  return { ok: true, url: u };
}

/** fetch آمن: يتحقق من كل تحويل، ويحدّ الحجم والمدة. */
export async function safeFetch(raw, { timeout = 12_000, maxBytes = 6 * 1024 * 1024, allowedHosts = null, headers = {} } = {}) {
  let current = raw;
  for (let hop = 0; hop < 4; hop++) {
    const check = isSafeUrl(current, { allowedHosts });
    if (!check.ok) throw new HttpError(400, `blocked_url:${check.reason}`);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    let r;
    try {
      r = await fetch(check.url.href, { redirect: 'manual', signal: ctrl.signal, headers: { 'User-Agent': 'AbuNawaf-SafeFetch/2.0', ...headers } });
    } finally { clearTimeout(t); }
    if (r.status >= 300 && r.status < 400) {
      const loc = r.headers.get('location');
      if (!loc) throw new HttpError(502, 'bad_redirect');
      current = new URL(loc, check.url).href;
      continue;
    }
    const len = Number(r.headers.get('content-length') || 0);
    if (len && len > maxBytes) throw new HttpError(413, 'too_large');
    return r;
  }
  throw new HttpError(508, 'too_many_redirects');
}

/* ------------------------------- handler wrap ----------------------------- */
export function endpoint(fn, opts = {}) {
  return async function handler(req, res) {
    try {
      if (cors(req, res, opts.origins || [])) return;
      if (opts.methods && !opts.methods.includes(req.method)) return json(res, 405, { error: 'method_not_allowed' });
      if (opts.rate && !rateLimit(req, res, { ...opts.rate, key: opts.name || 'api' })) return;
      return await fn(req, res);
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      return json(res, status, { error: status === 500 ? 'internal_error' : 'bad_request', message: status === 500 ? undefined : e.message });
    }
  };
}

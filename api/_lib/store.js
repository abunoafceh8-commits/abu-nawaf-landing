/**
 * AbuNawaf Store — تخزين خفيف متوافق مع Upstash Redis (REST) مع بديل في الذاكرة.
 * © 2026 أبو نواف · MIT
 */
const MEM = new Map();

function kvEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function cmd(...parts) {
  const env = kvEnv();
  if (!env) return null;
  const r = await fetch(`${env.url}/${parts.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${env.token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`kv ${r.status}`);
  return (await r.json()).result;
}

export const durable = () => !!kvEnv();

export async function put(key, value, ttlSec = 60 * 60 * 24 * 90) {
  const raw = JSON.stringify(value);
  if (kvEnv()) {
    await cmd('set', key, raw, 'EX', String(ttlSec));
    if (key.startsWith('case:') || key.startsWith('req:')) await cmd('zadd', 'idx:' + key.split(':')[0], String(Date.now()), key);
    return;
  }
  MEM.set(key, { v: raw, exp: Date.now() + ttlSec * 1000 });
}

export async function get(key) {
  if (kvEnv()) {
    const raw = await cmd('get', key);
    return raw ? JSON.parse(raw) : null;
  }
  const e = MEM.get(key);
  if (!e || Date.now() > e.exp) { MEM.delete(key); return null; }
  return JSON.parse(e.v);
}

export async function del(key) {
  if (kvEnv()) { await cmd('del', key); return; }
  MEM.delete(key);
}

export async function list(prefix, limit = 100) {
  if (kvEnv()) {
    const kind = prefix.includes('case') ? 'case' : 'req';
    const keys = (await cmd('zrevrange', 'idx:' + kind, '0', String(limit - 1))) || [];
    const out = [];
    for (const k of keys) {
      const v = await get(k);
      if (v) out.push(v);
    }
    return out;
  }
  const out = [];
  for (const [k, e] of MEM) {
    if (k.startsWith(prefix) && Date.now() <= e.exp) out.push(JSON.parse(e.v));
  }
  return out.slice(-limit).reverse();
}

export function ref(prefix = 'AW') {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return `${prefix}-${s}`;
}

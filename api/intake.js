import { endpoint, readBody, json, V, rateLimit } from './_lib/guard.js';
import { put, ref, durable } from './_lib/store.js';

/**
 * POST /api/intake — استلام طلبات الخدمة من صفحة الهبوط.
 * تخزين دائم (Upstash/KV عند التوفّر)، حدّ معدّل، تحقق صارم، وإشعار تيليجرام اختياري.
 */
export default endpoint(async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  if (!rateLimit(req, res, { max: 8, windowMs: 10 * 60 * 1000, key: 'intake' })) return;

  const b = await readBody(req, 16 * 1024);
  const rec = {
    id: ref('AW'),
    name: V.text(b.name, 80),
    phone: V.text(b.phone, 24),
    email: V.email(b.email),
    service: V.text(b.service, 80),
    platform: V.text(b.platform, 60),
    budget: V.text(b.budget, 60),
    message: V.text(b.message, 4000),
    created_at: new Date().toISOString(),
    status: 'new',
  };
  if (!rec.name || (!rec.phone && !rec.email) || rec.message.length < 10) {
    return json(res, 400, { error: 'بيانات ناقصة أو غير صالحة' });
  }
  await put(`req:${rec.id}`, rec, 60 * 60 * 24 * 180);

  // إشعار تيليجرام اختياري (بيئة Vercel: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN, tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChat,
          text: `🔔 طلب جديد ${rec.id}\n${rec.name} · ${rec.service}\n📱 ${rec.phone || '—'} · ✉️ ${rec.email || '—'}\n\n${rec.message.slice(0, 900)}`,
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(6000),
      });
    } catch { /* الإشعار اختياري */ }
  }

  return json(res, 201, {
    success: true,
    ref: rec.id,
    durable: durable(),
    message: 'تم استلام الطلب — سيتواصل معك الفريق خلال 24 ساعة.',
  });
}, { name: 'intake', methods: ['POST'] });

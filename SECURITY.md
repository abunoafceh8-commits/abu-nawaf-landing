# الأمان — أبو نواف | AbuNawaf Security

> © 2026 أبو نواف — Ethical Hacker · MIT

## الإبلاغ عن ثغرة
أرسل التفاصيل إلى **abunoaf.ceh8@gmail.com** أو افتح `Security Advisory` في المستودع.
نلتزم بالرد خلال **72 ساعة** وبعدم اتخاذ أي إجراء قانوني ضد الباحثين حسني النية.

## نموذج التهديد
هذه الأدوات تعمل على بيانات **متاحة علنًا** فقط. لا تخزين لبيانات مستخدمين على الخادم،
ولا تتبّع، ولا تحليلات، ولا ملفات تعريف ارتباط تحليلية.

## الضوابط المطبَّقة في هذا المستودع
| الضابط | الوصف |
|---|---|
| CORS مقيّد | انعكاس الأصل (origin) فقط للأصول المسموحة؛ لا `*` في الواجهات الحساسة |
| Rate limiting | حدّ طلبات لكل IP ولكل مسار (429 + Retry-After) |
| SSRF guard | منع IPs الخاصة/localhost، قائمة نطاقات مسموحة، تحقق كل تحويلة، حدّ حجم |
| Input validation | تحقق صارم من الأنواع والأطوال، إزالة أحرف التحكّم |
| Admin auth | كلمة مرور مجزّأة (salt + SHA-256) في متغيّرات البيئة + جلسات HMAC موقّعة |
| Security headers | HSTS · nosniff · Referrer-Policy · Permissions-Policy · X-Frame-Options |
| No secrets in code | لا يوجد أي مفتاح/كلمة مرور داخل المستودع |
| Dependency-free | صفر حزم خارجية على الواجهة والخادم |

## متغيّرات البيئة الاختيارية (Vercel → Settings → Environment Variables)
```
ADMIN_EMAIL=you@example.com
ADMIN_PASS_HASH=<salt>:<sha256(salt:password)>
ADMIN_SECRET=<random 32+ chars>
ADMIN_TOKEN=<random 32+ chars>          # مفتاح رئيسي بديل للوحة الإدارة
UPSTASH_REDIS_REST_URL=                # تخزين دائم للطلبات/الحالات
UPSTASH_REDIS_REST_TOKEN=
OPENVERSE_TOKEN=                       # تفعيل مصدر Openverse في بحث الصور
TELEGRAM_BOT_TOKEN=                    # إشعار فوري بالطلبات الجديدة
TELEGRAM_CHAT_ID=
```

### توليد بصمة كلمة المرور
```bash
node -e "const c=require('crypto');const s=process.argv[1];console.log(s+':'+c.createHash('sha256').update(s+':'+process.argv[2]).digest('hex'))" mysalt 'MyStrongPassword!'
```

## الإبلاغ المسؤول
يُمنع استخدام هذه الأدوات للمضايقة أو انتهاك الخصوصية أو مخالفة قوانين بلدك أو شروط المنصات.
كل استخدام مخالف يقع على مسؤولية المستخدم وحده.

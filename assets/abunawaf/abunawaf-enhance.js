/*!
 * AbuNawaf Enhance v2.0 — طبقة التعزيز الموحّدة
 * © 2026 Abu Nawaf — Ethical Hacker · https://github.com/abunoafceh8-commits
 * License: MIT · No tracking · 100% client-side
 */
(function () {
  'use strict';
  if (window.__ABUNAWAF__) return;

  var VERSION = '2.0.0';
  var HUB = 'https://abu-nawaf-hub.vercel.app';
  var GH = 'https://github.com/abunoafceh8-commits';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function meta(name, attr) {
    var m = document.querySelector('meta[name="' + name + '"]');
    return m ? (m.getAttribute(attr || 'content') || '') : '';
  }
  var CFG = {
    name: meta('abunawaf:name') || document.title.replace(/\s*[|—–-]\s*.*$/, '') || 'أداة أبو نواف',
    tagline: meta('abunawaf:tagline') || meta('description') || 'أداة استخبارات رقمية من تطوير فريق أبو نواف',
    category: meta('abunawaf:category') || 'أدوات OSINT',
    polish: meta('abunawaf:polish') === '1'
  };
  var STORE = {
    get: function (k, d) { try { var v = localStorage.getItem('abunawaf:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('abunawaf:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ------------------------------------------------------------------ *
   * 1) Tokens + styles
   * ------------------------------------------------------------------ */
  var CSS = [
    "@font-face{font-family:'TajawalX';font-style:normal;font-weight:400;font-display:swap;src:url('assets/abunawaf/fonts/tajawal-400-arabic.woff2') format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFC}",
    "@font-face{font-family:'TajawalX';font-style:normal;font-weight:500;font-display:swap;src:url('assets/abunawaf/fonts/tajawal-500-arabic.woff2') format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFC}",
    "@font-face{font-family:'TajawalX';font-style:normal;font-weight:700;font-display:swap;src:url('assets/abunawaf/fonts/tajawal-700-arabic.woff2') format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFC}",
    "@font-face{font-family:'TajawalX';font-style:normal;font-weight:800;font-display:swap;src:url('assets/abunawaf/fonts/tajawal-800-arabic.woff2') format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFC}",
    ":root{--an-navy:#070b14;--an-navy-2:#0b1220;--an-panel:#0e1826;--an-line:rgba(148,197,222,.16);--an-teal:#22d3ee;--an-teal-2:#34d399;--an-gold:#f5c451;--an-ink:#e8f2f9;--an-muted:#8aa3b8;--an-danger:#fb7185;--an-radius:16px;--an-font:'TajawalX','Tajawal',system-ui,'Segoe UI',Tahoma,sans-serif}",
    ".an-root,.an-root *{box-sizing:border-box}",
    ".an-root{font-family:var(--an-font);color:var(--an-ink);-webkit-font-smoothing:antialiased}",
    "html{scroll-behavior:smooth}",
    "@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}",
    "::selection{background:rgba(34,211,238,.28);color:#fff}",
    ":focus-visible{outline:2px solid var(--an-teal);outline-offset:3px;border-radius:6px}",
    ".an-skip{position:fixed;top:-60px;inset-inline-start:12px;z-index:2147483000;background:var(--an-teal);color:#031018;padding:10px 16px;border-radius:0 0 12px 12px;font-weight:800;text-decoration:none;transition:top .18s}",
    ".an-skip:focus{top:0}",

    /* brand bar */
    ".an-bar{position:relative;z-index:900;display:flex;align-items:center;gap:12px;padding:8px clamp(12px,3vw,28px);background:linear-gradient(90deg,rgba(7,11,20,.96),rgba(11,22,36,.92) 45%,rgba(7,11,20,.96));border-bottom:1px solid var(--an-line);backdrop-filter:blur(14px) saturate(140%);font-family:var(--an-font);color:var(--an-ink);font-size:13px;line-height:1.2}",
    ".an-bar:before{content:'';position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,var(--an-teal-2),var(--an-teal),var(--an-gold),transparent);opacity:.85}",
    ".an-bar a{color:inherit;text-decoration:none}",
    ".an-brand{display:flex;align-items:center;gap:9px;min-width:0;text-decoration:none}",
    ".an-brand img{width:26px;height:26px;filter:drop-shadow(0 0 10px rgba(34,211,238,.35))}",
    ".an-brand b{font-weight:800;font-size:13.5px;letter-spacing:.2px;white-space:nowrap}",
    ".an-brand small{color:var(--an-muted);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:34vw}",
    ".an-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;border:1px solid var(--an-line);background:rgba(34,211,238,.07);color:#bfeafe;font-size:10.5px;font-weight:700;white-space:nowrap}",
    ".an-dot{width:7px;height:7px;border-radius:50%;background:var(--an-teal-2);box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:anPulse 2.6s infinite}",
    "@keyframes anPulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.5)}70%{box-shadow:0 0 0 7px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}",
    "@media (prefers-reduced-motion:reduce){.an-dot{animation:none}}",
    ".an-bar .an-spacer{flex:1}",
    ".an-bar-btn{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:9px;border:1px solid var(--an-line);background:rgba(255,255,255,.03);color:var(--an-ink);font:700 11.5px var(--an-font);cursor:pointer;transition:.18s}",
    ".an-bar-btn:hover{background:rgba(34,211,238,.12);border-color:rgba(34,211,238,.45);transform:translateY(-1px)}",
    ".an-bar-btn kbd{font:600 10px ui-monospace,monospace;padding:1px 5px;border-radius:5px;background:rgba(255,255,255,.08);border:1px solid var(--an-line);color:var(--an-muted)}",
    "@media(max-width:640px){.an-brand small,.an-hide-sm{display:none}}",

    /* footer */
    ".an-footer{position:relative;z-index:1;margin-top:48px;padding:42px clamp(16px,4vw,40px) 30px;background:radial-gradient(1200px 320px at 50% 120%,rgba(34,211,238,.14),transparent 70%),linear-gradient(180deg,#08101c,#070b14);border-top:1px solid var(--an-line);font-family:var(--an-font);color:var(--an-ink);text-align:center}",
    ".an-footer-in{max-width:1080px;margin:0 auto;display:grid;gap:18px;justify-items:center}",
    ".an-footer-logo{display:flex;align-items:center;gap:12px}",
    ".an-footer-logo img{width:44px;height:44px;filter:drop-shadow(0 6px 18px rgba(34,211,238,.28))}",
    ".an-footer-logo b{font-size:17px;font-weight:800}",
    ".an-footer-logo span{display:block;font-size:11.5px;color:var(--an-muted);font-weight:600}",
    ".an-footer p{margin:0;font-size:12.5px;color:var(--an-muted);max-width:62ch;line-height:1.8}",
    ".an-footer nav{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}",
    ".an-footer nav a{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;border:1px solid var(--an-line);background:rgba(255,255,255,.03);color:#cfe6f5;font-size:11.5px;font-weight:700;text-decoration:none;transition:.18s}",
    ".an-footer nav a:hover{border-color:rgba(34,211,238,.5);background:rgba(34,211,238,.1);transform:translateY(-1px)}",
    ".an-legal{font-size:10.5px;color:#64798c;line-height:1.9}",
    ".an-legal b{color:#9fb6c8}",

    /* corner badge + watermark */
    ".an-watermark{position:fixed;inset-inline-start:14px;bottom:14px;z-index:820;display:inline-flex;align-items:center;gap:7px;padding:5px 11px 5px 8px;border-radius:999px;background:rgba(7,11,20,.72);border:1px solid var(--an-line);color:#a9c3d6;font:700 10.5px var(--an-font);text-decoration:none;backdrop-filter:blur(10px);transition:.2s;opacity:.72}",
    ".an-watermark:hover{opacity:1;border-color:rgba(245,196,81,.5);color:#f5c451;transform:translateY(-2px)}",
    ".an-watermark img{width:16px;height:16px}",
    ".an-fab{position:fixed;inset-inline-end:16px;bottom:16px;z-index:821;width:46px;height:46px;border-radius:50%;border:1px solid rgba(34,211,238,.4);background:radial-gradient(circle at 35% 30%,#123047,#070b14 70%);box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 6px rgba(34,211,238,.05);cursor:pointer;display:grid;place-items:center;transition:.2s}",
    ".an-fab:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 14px 36px rgba(0,0,0,.5),0 0 0 8px rgba(34,211,238,.08)}",
    ".an-fab img{width:26px;height:26px}",
    ".an-fab:after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(245,196,81,.32)}",

    /* panel */
    ".an-panel{position:fixed;inset-inline-end:16px;bottom:72px;z-index:821;width:min(340px,calc(100vw - 32px));border-radius:20px;border:1px solid var(--an-line);background:linear-gradient(180deg,rgba(14,24,38,.98),rgba(9,15,26,.99));box-shadow:0 24px 70px rgba(0,0,0,.6);font-family:var(--an-font);color:var(--an-ink);padding:16px;transform:translateY(12px) scale(.98);opacity:0;pointer-events:none;transition:.2s cubic-bezier(.2,.8,.2,1)}",
    ".an-panel.open{transform:none;opacity:1;pointer-events:auto}",
    ".an-panel h4{margin:0 0 4px;font-size:14px;font-weight:800;display:flex;align-items:center;gap:8px}",
    ".an-panel h4 img{width:20px;height:20px}",
    ".an-panel p{margin:0 0 12px;font-size:11.5px;color:var(--an-muted);line-height:1.7}",
    ".an-panel ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}",
    ".an-panel li button{width:100%;display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:11px;border:1px solid transparent;background:rgba(255,255,255,.03);color:var(--an-ink);font:600 12px var(--an-font);cursor:pointer;text-align:start;transition:.16s}",
    ".an-panel li button:hover{background:rgba(34,211,238,.1);border-color:rgba(34,211,238,.32)}",
    ".an-panel li button span{flex:1}",
    ".an-panel .an-k{font:600 10px ui-monospace,monospace;color:var(--an-muted);background:rgba(255,255,255,.06);border:1px solid var(--an-line);border-radius:5px;padding:1px 5px}",
    ".an-panel .an-sep{height:1px;background:var(--an-line);margin:10px 0}",

    /* palette */
    ".an-modal{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:start center;padding:12vh 16px 16px;background:rgba(4,8,14,.66);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:.16s}",
    ".an-modal.open{opacity:1;pointer-events:auto}",
    ".an-pal{width:min(620px,100%);border-radius:18px;border:1px solid rgba(34,211,238,.22);background:linear-gradient(180deg,#0d1725,#080e18);box-shadow:0 30px 90px rgba(0,0,0,.65);overflow:hidden;transform:translateY(-8px);transition:.18s}",
    ".an-modal.open .an-pal{transform:none}",
    ".an-pal input{width:100%;padding:15px 18px;background:transparent;border:0;border-bottom:1px solid var(--an-line);color:var(--an-ink);font:600 14px var(--an-font);outline:none}",
    ".an-pal ul{list-style:none;margin:0;padding:6px;max-height:52vh;overflow:auto}",
    ".an-pal li{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;font:600 12.5px var(--an-font);color:#cfe0ee;cursor:pointer}",
    ".an-pal li[aria-selected=true]{background:rgba(34,211,238,.12);color:#fff}",
    ".an-pal li em{margin-inline-start:auto;font:600 10px ui-monospace,monospace;color:var(--an-muted);font-style:normal}",
    ".an-pal .an-pal-foot{display:flex;gap:14px;padding:8px 16px;border-top:1px solid var(--an-line);font:600 10.5px var(--an-font);color:var(--an-muted)}",

    /* toast */
    ".an-toasts{position:fixed;inset-inline:0;bottom:22px;z-index:2147483001;display:grid;justify-items:center;gap:8px;pointer-events:none}",
    ".an-toast{pointer-events:auto;max-width:min(420px,92vw);padding:10px 15px;border-radius:12px;border:1px solid var(--an-line);background:rgba(10,18,30,.96);color:var(--an-ink);font:600 12px var(--an-font);box-shadow:0 16px 40px rgba(0,0,0,.5);display:flex;gap:9px;align-items:center;animation:anIn .22s ease-out}",
    ".an-toast.ok{border-color:rgba(52,211,153,.45)}.an-toast.err{border-color:rgba(251,113,133,.5)}",
    "@keyframes anIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",

    /* tools directory */
    ".an-dir{position:relative;z-index:1;padding:56px clamp(16px,4vw,40px) 40px;font-family:var(--an-font);color:var(--an-ink);background:radial-gradient(900px 420px at 88% -10%,rgba(34,211,238,.1),transparent 62%),radial-gradient(700px 380px at 8% 110%,rgba(245,196,81,.07),transparent 60%),linear-gradient(180deg,#070b14,#091220 70%,#070b14);border-top:1px solid var(--an-line);border-bottom:1px solid var(--an-line)}",
    ".an-dir-in{max-width:1180px;margin:0 auto}",
    ".an-dir header{text-align:center;margin-bottom:22px}",
    ".an-dir h2{margin:0 0 6px;font-size:clamp(20px,3vw,27px);font-weight:800}",
    ".an-dir header p{margin:0;color:var(--an-muted);font-size:13px}",
    ".an-dir-tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;margin-bottom:18px}",
    ".an-dir-tools input{min-width:min(320px,80vw);padding:11px 16px;border-radius:12px;border:1px solid var(--an-line);background:rgba(255,255,255,.04);color:var(--an-ink);font:600 13px var(--an-font);outline:none}",
    ".an-dir-tools input:focus{border-color:rgba(34,211,238,.55);box-shadow:0 0 0 4px rgba(34,211,238,.1)}",
    ".an-cats{display:flex;gap:6px;flex-wrap:wrap}",
    ".an-cats button{padding:7px 13px;border-radius:999px;border:1px solid var(--an-line);background:transparent;color:var(--an-muted);font:700 11.5px var(--an-font);cursor:pointer;transition:.16s}",
    ".an-cats button.on,.an-cats button:hover{background:rgba(34,211,238,.13);border-color:rgba(34,211,238,.45);color:#e8fbff}",
    ".an-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:12px}",
    ".an-tool{display:flex;align-items:center;gap:11px;padding:13px 14px;border-radius:14px;border:1px solid var(--an-line);background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01));text-decoration:none;color:var(--an-ink);transition:.18s}",
    ".an-tool:hover{transform:translateY(-2px);border-color:rgba(34,211,238,.45);background:rgba(34,211,238,.07);box-shadow:0 12px 28px rgba(0,0,0,.35)}",
    ".an-tool-ic{width:38px;height:38px;flex:0 0 38px;border-radius:11px;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#143b53,#0a1420 75%);border:1px solid rgba(34,211,238,.28);color:#9fe9ff;font:800 12px var(--an-font)}",
    ".an-tool-tx{display:grid;gap:2px;min-width:0;flex:1}",
    ".an-tool-tx b{font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".an-tool-tx small{font-size:11px;color:var(--an-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".an-tool-tag{font-size:9.5px;font-weight:800;color:#f5c451;background:rgba(245,196,81,.1);border:1px solid rgba(245,196,81,.28);padding:2px 7px;border-radius:999px;white-space:nowrap}",
    ".an-dir-empty{text-align:center;color:var(--an-muted);font-size:12.5px;padding:24px 0}",
    /* polish for marketing pages */
    ".an-polish body{background-image:radial-gradient(900px 500px at 85% -10%,rgba(34,211,238,.08),transparent 60%),radial-gradient(700px 420px at 10% 110%,rgba(245,196,81,.05),transparent 60%)}",
    ".an-polish h1,.an-polish h2{letter-spacing:-.2px}",

    "@media print{.an-bar,.an-fab,.an-watermark,.an-panel,.an-modal,.an-toasts{display:none!important}.an-footer{border-top:1px solid #ccc;background:#fff;color:#111}.an-footer *{color:#111!important}}"
  ].join('\n');

  function styleEl() {
    var s = document.createElement('style');
    s.id = 'an-styles';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function abs(p) { try { return new URL(p, location.href).href; } catch (e) { return p; } }
  var LOGO = 'assets/abunawaf/logo.svg';

  /* ------------------------------------------------------------------ *
   * 2) Identity: favicons, manifest, social cards, JSON-LD
   * ------------------------------------------------------------------ */
  function identity() {
    var head = document.head;
    function set(sel, attrs) {
      var n = head.querySelector(sel);
      if (!n) { n = document.createElement(attrs.tag || 'link'); head.appendChild(n); }
      for (var k in attrs) if (k !== 'tag') n.setAttribute(k, attrs[k]);
    }
    set('link[rel="icon"]', { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' });
    set('link[rel="apple-touch-icon"]', { rel: 'apple-touch-icon', href: abs('assets/abunawaf/icon-180.png') });
    set('meta[name="theme-color"]', { name: 'theme-color', content: '#070b14', tag: 'meta' });
    set('meta[name="referrer"]', { name: 'referrer', content: 'strict-origin-when-cross-origin', tag: 'meta' });
    set('meta[name="author"]', { name: 'author', content: 'Abu Nawaf — أبو نواف (Ethical Hacker)', tag: 'meta' });
    set('meta[name="application-name"]', { name: 'application-name', content: 'Abu Nawaf Tools', tag: 'meta' });
    set('meta[property="og:site_name"]', { property: 'og:site_name', content: 'أبو نواف — Abu Nawaf', tag: 'meta' });
    set('meta[property="og:image"]', { property: 'og:image', content: abs('assets/abunawaf/icon-512.png'), tag: 'meta' });
    set('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image', tag: 'meta' });
    if (!head.querySelector('link[rel="canonical"]')) {
      var c = el('link', { rel: 'canonical', href: location.origin + location.pathname });
      head.appendChild(c);
    }
    // web manifest (blob) — enables installable PWA
    try {
      if (!head.querySelector('link[rel="manifest"]')) {
        var man = {
          name: CFG.name + ' — أبو نواف',
          short_name: 'أبو نواف',
          description: CFG.tagline,
          start_url: location.pathname,
          display: 'standalone',
          background_color: '#070b14',
          theme_color: '#070b14',
          icons: [
            { src: abs('assets/abunawaf/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: abs('assets/abunawaf/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' }
          ]
        };
        var b = new Blob([JSON.stringify(man)], { type: 'application/manifest+json' });
        head.appendChild(el('link', { rel: 'manifest', href: URL.createObjectURL(b) }));
      }
    } catch (e) {}
    // JSON-LD
    try {
      if (!document.getElementById('an-jsonld')) {
        var ld = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: CFG.name,
              applicationCategory: 'SecurityApplication',
              operatingSystem: 'Web',
              description: CFG.tagline,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: { '@type': 'Person', name: 'أبو نواف', alternateName: 'Abu Nawaf', url: GH }
            },
            { '@type': 'Organization', name: 'فريق أبو نواف', url: HUB, logo: abs('assets/abunawaf/icon-512.png'), sameAs: [GH] }
          ]
        };
        var s = el('script', { type: 'application/ld+json', id: 'an-jsonld' });
        s.textContent = JSON.stringify(ld);
        head.appendChild(s);
      }
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ *
   * 3) Brand bar
   * ------------------------------------------------------------------ */
  function brandBar() {
    var bar = el('div', { class: 'an-root an-bar', role: 'banner', 'aria-label': 'شريط هوية أبو نواف' });
    bar.innerHTML =
      '<a class="an-brand" href="' + HUB + '" target="_blank" rel="noopener noreferrer" title="مركز أدوات أبو نواف">' +
        '<img src="' + LOGO + '" alt="شعار أبو نواف">' +
        '<b>أبو نواف</b><small class="an-hide-sm">· ' + esc(CFG.category) + ' · هكر أخلاقي</small>' +
      '</a>' +
      '<span class="an-chip"><i class="an-dot"></i> ' + esc(CFG.name) + '</span>' +
      '<span class="an-spacer"></span>' +
      '<button class="an-bar-btn" data-an-act="palette" title="لوحة الأوامر"><span>⌘</span> أوامر <kbd>Ctrl K</kbd></button>' +
      '<a class="an-bar-btn an-hide-sm" href="' + HUB + '" target="_blank" rel="noopener noreferrer">مركز الأدوات ↗</a>' +
      '<button class="an-bar-btn" data-an-act="panel" aria-label="لوحة أبو نواف">✦</button>';
    var anchor = document.body.firstElementChild;
    if (anchor && anchor.id === 'root') document.body.insertBefore(bar, anchor);
    else document.body.insertBefore(bar, document.body.firstChild);

    if (CFG.polish) {
      bar.classList.add('an-polish-root');
      document.documentElement.classList.add('an-polish');
    }
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /* ------------------------------------------------------------------ *
   * 4) Footer credit
   * ------------------------------------------------------------------ */
  function footer() {
    var y = new Date().getFullYear();
    var f = el('footer', { class: 'an-root an-footer', role: 'contentinfo' });
    f.innerHTML =
      '<div class="an-footer-in">' +
        '<div class="an-footer-logo"><img src="' + LOGO + '" alt="شعار أبو نواف">' +
          '<div style="text-align:start"><b>أبو نواف</b><span>هكر أخلاقي · حماية · استخبارات مفتوحة</span></div>' +
        '</div>' +
        '<p>صُمّمت وبُنيت هذه الأداة وهُيّئت للعمل بمعايير أمان حديثة على يد <b style="color:#e8f2f9">فريق أبو نواف</b>. ' +
          'الاستخدام مسموح للأغراض المشروعة والبحث الأمني فقط، وبما يتوافق مع قوانين بلدك وشروط المنصات.</p>' +
        '<nav aria-label="روابط أبو نواف">' +
          '<a href="' + HUB + '" target="_blank" rel="noopener noreferrer">مركز الأدوات</a>' +
          '<a href="' + GH + '" target="_blank" rel="noopener noreferrer">GitHub</a>' +
          '<a href="mailto:abunoaf.ceh8@gmail.com">تواصل معنا</a>' +
          '<a href="#an-top" data-an-act="top">أعلى الصفحة ↑</a>' +
        '</nav>' +
        '<div class="an-legal">© ' + y + ' <b>أبو نواف</b> — جميع الحقوق محفوظة · رخصة MIT<br>' +
          'خصوصية كاملة: لا تتبّع، لا إعلانات، لا Cookies تحليلية — كل المعالجة داخل متصفحك.</div>' +
      '</div>';
    document.body.appendChild(f);
  }

  /* ------------------------------------------------------------------ *
   * 5) Watermark + control panel
   * ------------------------------------------------------------------ */
  function watermark() {
    if (STORE.get('nowm', false)) return;
    var w = el('a', { class: 'an-watermark an-root', href: HUB, target: '_blank', rel: 'noopener noreferrer', title: 'شعار وتعزيز: أبو نواف — انقر لزيارة مركز الأدوات' });
    w.innerHTML = '<img src="' + LOGO + '" alt=""> تعزيز بواسطة أبو نواف ✦';
    document.body.appendChild(w);
  }

  function panel() {
    var fab = el('button', { class: 'an-fab an-root', 'aria-label': 'لوحة أبو نواف', 'aria-expanded': 'false', title: 'لوحة أبو نواف (Ctrl+Shift+A)' });
    fab.innerHTML = '<img src="' + LOGO + '" alt="">';
    var p = el('aside', { class: 'an-panel an-root', id: 'an-panel', 'aria-hidden': 'true', 'aria-label': 'لوحة أبو نواف' });
    p.innerHTML =
      '<h4><img src="' + LOGO + '" alt=""> لوحة أبو نواف</h4>' +
      '<p>' + esc(CFG.name) + ' — الإصدار المعزّز <b style="color:#22d3ee">v' + VERSION + '</b></p>' +
      '<ul>' +
        '<li><button data-an-act="palette"><span>لوحة الأوامر</span><i class="an-k">Ctrl K</i></button></li>' +
        '<li><button data-an-act="copy"><span>نسخ رابط الصفحة</span><i class="an-k">C</i></button></li>' +
        '<li><button data-an-act="save"><span>تنزيل نسخة من الصفحة</span><i class="an-k">S</i></button></li>' +
        '<li><button data-an-act="print"><span>طباعة / حفظ PDF</span><i class="an-k">P</i></button></li>' +
        '<li><button data-an-act="top"><span>أعلى الصفحة</span><i class="an-k">T</i></button></li>' +
        '<li><button data-an-act="wm"><span>' + (STORE.get('nowm', false) ? 'إظهار توقيع الهوية' : 'إخفاء توقيع الهوية') + '</span><i class="an-k">W</i></button></li>' +
      '</ul>' +
      '<div class="an-sep"></div>' +
      '<ul>' +
        '<li><button data-an-act="hub"><span>مركز أدوات أبو نواف ↗</span></button></li>' +
        '<li><button data-an-act="gh"><span>مستودعات GitHub ↗</span></button></li>' +
      '</ul>' +
      '<div class="an-sep"></div>' +
      '<p style="margin:0;font-size:10.5px">استخدام مسؤول: هذه الأداة تعرض بيانات متاحة علنًا فقط. لا تستخدمها للمضايقة أو انتهاك الخصوصية.</p>';
    document.body.appendChild(fab);
    document.body.appendChild(p);

    function toggle(open) {
      var on = open == null ? !p.classList.contains('open') : open;
      p.classList.toggle('open', on);
      p.setAttribute('aria-hidden', String(!on));
      fab.setAttribute('aria-expanded', String(on));
    }
    fab.addEventListener('click', function () { toggle(); });
    p.addEventListener('click', function (e) {
      var b = e.target.closest('[data-an-act]');
      if (b) { actions(b.getAttribute('data-an-act')); if (b.getAttribute('data-an-act') === 'wm') toggle(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle(false);
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) { e.preventDefault(); toggle(); }
    });
    window.__ABUNAWAF__.togglePanel = toggle;
  }

  /* ------------------------------------------------------------------ *
   * 6) Command palette + shortcuts
   * ------------------------------------------------------------------ */
  function palette() {
    var m = el('div', { class: 'an-modal an-root', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'لوحة الأوامر' });
    m.innerHTML =
      '<div class="an-pal"><input type="text" placeholder="ابحث عن أمر أو قسم…" aria-label="بحث الأوامر" autocomplete="off" spellcheck="false">' +
      '<ul role="listbox"></ul>' +
      '<div class="an-pal-foot"><span>↑↓ تنقّل</span><span>Enter تنفيذ</span><span>Esc إغلاق</span></div></div>';
    document.body.appendChild(m);
    var input = m.querySelector('input'), list = m.querySelector('ul'), items = [], sel = 0;

    function commands() {
      var cmds = [
        { t: 'نسخ رابط الصفحة', k: 'C', run: actions.bind(null, 'copy') },
        { t: 'تنزيل نسخة HTML من الصفحة', k: 'S', run: actions.bind(null, 'save') },
        { t: 'طباعة / حفظ PDF', k: 'P', run: actions.bind(null, 'print') },
        { t: 'أعلى الصفحة', k: 'T', run: actions.bind(null, 'top') },
        { t: 'مركز أدوات أبو نواف', k: '↗', run: function () { open_(HUB); } },
        { t: 'مستودعات GitHub', k: '↗', run: function () { open_(GH); } },
        { t: 'تواصل مع فريق أبو نواف', k: '@', run: function () { location.href = 'mailto:abunoaf.ceh8@gmail.com'; } }
      ];
      var hs = document.querySelectorAll('h1,h2,h3,section[id],main[id]');
      for (var i = 0; i < hs.length && i < 30; i++) {
        var h = hs[i];
        var id = h.id || (h.parentElement && h.parentElement.id);
        var txt = (h.textContent || '').trim().slice(0, 60);
        if (!txt || !h.offsetParent) continue;
        if (h.tagName === 'H1' || h.tagName === 'H2') {
          cmds.push({ t: 'الانتقال: ' + txt, k: '§', run: (function (hh) { return function () { hh.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }; })(h) });
        }
      }
      return cmds;
    }
    function render(q) {
      var all = commands();
      var ql = (q || '').toLowerCase();
      items = all.filter(function (c) { return !ql || c.t.toLowerCase().includes(ql); }).slice(0, 12);
      if (!items.length) items = all.slice(0, 6);
      sel = 0;
      list.innerHTML = items.map(function (c, i) {
        return '<li role="option" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(c.t) + '<em>' + esc(c.k) + '</em></li>';
      }).join('');
    }
    function open(open_) {
      m.classList.toggle('open', open_ !== false);
      if (open_ !== false) { render(''); setTimeout(function () { input.focus(); input.select(); }, 30); }
    }
    function move(d) {
      if (!items.length) return;
      sel = (sel + d + items.length) % items.length;
      [].forEach.call(list.children, function (li, i) { li.setAttribute('aria-selected', String(i === sel)); });
      var cur = list.children[sel]; if (cur) cur.scrollIntoView({ block: 'nearest' });
    }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); var c = items[sel]; if (c) { open(false); setTimeout(function () { c.run(); }, 60); } }
      else if (e.key === 'Escape') { open(false); }
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      var c = items[+li.getAttribute('data-i')]; open(false); if (c) setTimeout(function () { c.run(); }, 60);
    });
    m.addEventListener('click', function (e) { if (e.target === m) open(false); });

    document.addEventListener('keydown', function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement || {}).isContentEditable;
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); open(!m.classList.contains('open')); return; }
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === '?') { e.preventDefault(); showHelp(); }
      else if (e.key === '/' ) { e.preventDefault(); open(true); }
    });
    window.__ABUNAWAF__.openPalette = function () { open(true); };
    function open_(u) { window.open(u, '_blank', 'noopener'); }
  }

  function showHelp() {
    toast('اختصارات: Ctrl+K الأوامر · Ctrl+Shift+A اللوحة · C نسخ · S تنزيل · P طباعة · T أعلى · ? المساعدة', 'ok', 6500);
  }

  /* ------------------------------------------------------------------ *
   * 7) Actions + toast
   * ------------------------------------------------------------------ */
  function toast(msg, type, ms) {
    var host = document.querySelector('.an-toasts');
    if (!host) { host = el('div', { class: 'an-toasts an-root', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(host); }
    var t = el('div', { class: 'an-toast an-root ' + (type || '') });
    t.innerHTML = '<span>' + (type === 'ok' ? '✓' : type === 'err' ? '!' : 'ℹ') + '</span><span>' + esc(msg) + '</span>';
    host.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = '.3s'; setTimeout(function () { t.remove(); }, 320); }, ms || 3200);
  }

  function actions(act) {
    switch (act) {
      case 'palette': window.__ABUNAWAF__.openPalette(); break;
      case 'panel': window.__ABUNAWAF__.togglePanel(); break;
      case 'copy':
        var txt = location.href;
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
          .then(function () { toast('تم نسخ الرابط', 'ok'); })
          .catch(function () {
            var ta = el('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); toast('تم نسخ الرابط', 'ok'); } catch (e) { toast('تعذّر النسخ', 'err'); }
            ta.remove();
          });
        break;
      case 'save':
        try {
          var html = '<!doctype html>\n' + document.documentElement.outerHTML;
          var b = new Blob([html], { type: 'text/html;charset=utf-8' });
          var a = el('a', { href: URL.createObjectURL(b), download: (location.hostname.split('.')[0] || 'abunawaf') + '-' + Date.now() + '.html' });
          document.body.appendChild(a); a.click(); a.remove();
          toast('تم تنزيل نسخة الصفحة', 'ok');
        } catch (e) { toast('تعذّر التنزيل', 'err'); }
        break;
      case 'print': window.print(); break;
      case 'top': window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); break;
      case 'wm': STORE.set('nowm', !STORE.get('nowm', false)); location.reload(); break;
      case 'hub': window.open(HUB, '_blank', 'noopener'); break;
      case 'gh': window.open(GH, '_blank', 'noopener'); break;
    }
  }

  /* ------------------------------------------------------------------ *
   * 8) Hardening + a11y + perf helpers
   * ------------------------------------------------------------------ */
  function harden() {
    // every external target=_blank link gets a safe rel
    function fixRels() {
      var as = document.querySelectorAll('a[target="_blank"]');
      for (var i = 0; i < as.length; i++) {
        var rel = (as[i].getAttribute('rel') || '').split(/\s+/);
        if (rel.indexOf('noopener') < 0) rel.push('noopener');
        if (rel.indexOf('noreferrer') < 0) rel.push('noreferrer');
        as[i].setAttribute('rel', rel.join(' ').trim());
      }
    }
    fixRels();
    try {
      new MutationObserver(function () { clearTimeout(harden._t); harden._t = setTimeout(fixRels, 120); })
        .observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
    // lazy-load images
    try {
      var imgs = document.querySelectorAll('img:not([loading])');
      for (var j = 0; j < imgs.length; j++) { imgs[j].loading = 'lazy'; imgs[j].decoding = 'async'; }
    } catch (e) {}
    // skip link
    var skip = el('a', { class: 'an-skip an-root', href: '#main, main, #root' });
    skip.textContent = 'تجاوز إلى المحتوى';
    skip.addEventListener('click', function (e) {
      var t = document.querySelector('main,#main,#root,.container,section');
      if (t) { e.preventDefault(); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: false }); }
    });
    document.body.insertBefore(skip, document.body.firstChild);
    // guard: never let injected chrome inherit weird app styles
    document.documentElement.style.setProperty('--an-ready', '1');
  }

  /* ------------------------------------------------------------------ *
   * 8.5) Legacy relay shim — يحوّل النداءات القديمة إلى نفس الأصل
   * ------------------------------------------------------------------ */
  function legacyRelay() {
    var BAD = [/\.arcada\.app$/i, /arcadawebapps\d*\.vercel\.app$/i];
    function rewrite(u) {
      try {
        var url = new URL(String(u), location.href);
        if (BAD.some(function (rx) { return rx.test(url.hostname); })) {
          return location.origin + url.pathname + url.search;
        }
      } catch (e) {}
      return null;
    }
    try {
      var of = window.fetch;
      window.fetch = function (input, init) {
        var u = typeof input === 'string' ? input : (input && input.url);
        var r = rewrite(u);
        if (r) {
          if (typeof input === 'string') input = r;
          else input = new Request(r, input);
          if (window.__ABUNAWAF__) window.__ABUNAWAF__.relay = (window.__ABUNAWAF__.relay || 0) + 1;
        }
        return of.call(this, input, init);
      };
    } catch (e) {}
    try {
      var ox = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (m, u) {
        var r = rewrite(u);
        return ox.apply(this, r ? [m, r].concat([].slice.call(arguments, 2)) : arguments);
      };
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ *
   * 8.6) Tools directory (hub only)
   * ------------------------------------------------------------------ */
  var TOOLS = [
    ['zehef-email-osint', 'Zehef', 'استخبارات البريد الإلكتروني', 'OSINT'],
    ['web-archive-deep-search', 'ذاكرة الويب العميقة', 'البحث في أرشيفات الإنترنت', 'OSINT'],
    ['tweet-recovery-machine-v2', 'Tweet Recovery v2', 'استعادة التغريدات المحذوفة', 'OSINT'],
    ['tweet-recovery-machine', 'Tweet Recovery', 'استعادة التغريدات — v1', 'OSINT'],
    ['tiktrace-tiktok-osint', 'TikTrace', 'استخبارات TikTok', 'OSINT'],
    ['ghosttrace-snapchat-osint', 'GhostTrace', 'استخبارات Snapchat', 'OSINT'],
    ['snaposint-snapchat-osint', 'SnapOSINT', 'منصة Snapchat OSINT', 'OSINT'],
    ['x-osint-intelligence', 'X-OSINT', 'منصة استخبارات X.com', 'OSINT'],
    ['x-commander', 'X Commander', 'تحليل وأرشفة وبلاغات X', 'X'],
    ['x-archive-pro', 'X Archive Pro', 'أرشيف التغريدات', 'X'],
    ['x-archive-dashboard', 'X Archive', 'لوحة أرشيف متقدمة', 'X'],
    ['x-inspector-pro', 'X Inspector Pro', 'ملف الحساب والبلاغات', 'X'],
    ['x-tweet-extractor', 'X Tweet Extractor', 'استخراج روابط التغريدات', 'X'],
    ['x-link-filler', 'مُعبّئ الروابط', 'بلاغات X السريعة', 'X'],
    ['x-media-vault', 'خزنة وسائط X', 'تحميل كل الوسائط', 'X'],
    ['miswar-image-search', 'مِصوَر', 'بحث الصور الرئيسي', 'صور'],
    ['miswar-image-search-uvm89k', 'مِصوَر Pro', 'بحث + وسيط صور آمن', 'صور'],
    ['miswar-image-search-aso2tw', 'مِصوَر Batch', 'تحميل ZIP بكميات', 'صور'],
    ['miswar-image-search-n1jw5l', 'مِصوَر Deep', 'مصادر متعددة', 'صور'],
    ['miswar-image-search-x49pmj', 'مِصوَر Hyper', 'بحث تشعبي', 'صور'],
    ['miswar-image-search-phuhyn', 'مِصوَر Lite', 'نسخة خفيفة', 'صور'],
    ['smart-image-downloader', 'صور ذكية', 'بحث + صور مشابهة', 'صور'],
    ['bulk-image-downloader-pro', 'تحميل جماعي', 'دفعات كبيرة', 'صور'],
    ['advanced-image-downloader', 'أداة تحميل', 'مصادر مفتوحة', 'صور'],
    ['torrentscope-torrent-search', 'TorrentScope', 'بحث وتجميع التورنت', 'بحث'],
    ['abu-nawaf-hub', 'مركز أبو نواف', 'كل الأدوات في مكان واحد', 'الهوية'],
    ['abu-nawaf-landing', 'ابونواف', 'هكر أخلاقي — خدمات', 'الهوية'],
    ['abu-nawaf-services', 'الخدمات', 'الخدمات والأسعار', 'الهوية'],
    ['abu-nawaf-diagnostic', 'تشخيص ذكي', 'طلب خدمة وتشخيص', 'الهوية'],
    ['whatsapp-lan-messaging', 'WhatsApp LAN', 'مراسلة بلا إنترنت (APK)', 'تطبيقات']
  ];

  function directory() {
    if (meta('abunawaf:directory') !== '1') return;
    var sec = el('section', { class: 'an-root an-dir', id: 'tools', 'aria-label': 'مكتبة أدوات أبو نواف' });
    var cards = TOOLS.map(function (t) {
      var url = 'https://' + t[0] + '.vercel.app';
      return '<a class="an-tool" href="' + url + '" target="_blank" rel="noopener noreferrer" data-cat="' + t[3] + '" data-name="' + esc((t[1] + ' ' + t[2] + ' ' + t[3]).toLowerCase()) + '">' +
        '<span class="an-tool-ic">' + esc(t[1].slice(0, 2)) + '</span>' +
        '<span class="an-tool-tx"><b>' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></span>' +
        '<span class="an-tool-tag">' + esc(t[3]) + '</span></a>';
    }).join('');
    var cats = ['الكل'].concat(Array.from(new Set(TOOLS.map(function (t) { return t[3]; }))));
    sec.innerHTML =
      '<div class="an-dir-in">' +
        '<header><h2>مكتبة أدوات أبو نواف</h2>' +
        '<p>' + TOOLS.length + ' أداة استخبارات وأمن سيبراني — كلها مفتوحة، سريعة، وبلا تتبّع.</p></header>' +
        '<div class="an-dir-tools"><input type="search" placeholder="ابحث عن أداة…" aria-label="بحث الأدوات" id="an-dir-q">' +
        '<div class="an-cats">' + cats.map(function (c, i) { return '<button data-cat="' + (i === 0 ? '' : esc(c)) + '" class="' + (i === 0 ? 'on' : '') + '">' + esc(c) + '</button>'; }).join('') + '</div></div>' +
        '<div class="an-grid" id="an-dir-grid">' + cards + '</div>' +
        '<p class="an-dir-empty" hidden>لا نتائج مطابقة — جرّب كلمة أخرى.</p>' +
      '</div>';
    var foot = document.querySelector('.an-footer');
    if (foot) document.body.insertBefore(sec, foot); else document.body.appendChild(sec);

    var q = sec.querySelector('#an-dir-q');
    var grid = sec.querySelector('#an-dir-grid');
    var empty = sec.querySelector('.an-dir-empty');
    var activeCat = '';
    function filter() {
      var term = (q.value || '').trim().toLowerCase();
      var shown = 0;
      [].forEach.call(grid.children, function (a) {
        var okCat = !activeCat || a.getAttribute('data-cat') === activeCat;
        var okTerm = !term || a.getAttribute('data-name').indexOf(term) >= 0;
        var show = okCat && okTerm;
        a.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      empty.hidden = shown > 0;
    }
    q.addEventListener('input', filter);
    sec.querySelector('.an-cats').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      activeCat = b.getAttribute('data-cat') || '';
      [].forEach.call(sec.querySelectorAll('.an-cats button'), function (x) { x.classList.toggle('on', x === b); });
      filter();
    });
  }

  /* ------------------------------------------------------------------ *
   * 9) Boot
   * ------------------------------------------------------------------ */
  function boot() {
    window.__ABUNAWAF__ = {
      version: VERSION, name: CFG.name, toast: toast, actions: actions,
      logo: LOGO, hub: HUB, github: GH
    };
    styleEl();
    identity();
    legacyRelay();
    if (!document.getElementById('an-top')) {
      var a = el('a', { id: 'an-top', 'aria-hidden': 'true' });
      a.setAttribute('tabindex', '-1');
      document.body.insertBefore(a, document.body.firstChild);
    }
    brandBar();
    harden();
    if (!document.body.hasAttribute('data-an-bare')) {
      watermark();
      panel();
      footer();
    }
    directory();
    palette();
    // expose tiny helper for tools
    window.AbuNawaf = window.__ABUNAWAF__;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

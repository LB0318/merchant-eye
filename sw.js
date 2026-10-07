const CACHE_NAME = 'merchant-eye-v7';
const urlsToCache = [
  './index.html',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const OFFLINE = new Response('<h1>绂荤嚎妯″紡</h1><p>璇疯繛鎺ョ綉缁滃悗鍒锋柊銆?/p>', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
  // 涓婚〉闈㈣蛋 network-first锛氬湪绾挎椂濮嬬粓鎷挎渶鏂扮増锛堟洿鏂板嵆寮€鍗冲緱锛夛紝绂荤嚎鍥為€€缂撳瓨
  if (req.mode === 'navigate' || req.url.indexOf('merchant-eye-toolkit.html') !== -1) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
        return res;
      }).catch(() =>
        caches.match('./index.html').then(r => r || OFFLINE)
      )
    );
    return;
  }
  // 鍏朵綑璧勬簮锛堝瓧浣撶瓑锛夌淮鎸佺紦瀛樹紭鍏?  event.respondWith(
    caches.match(req).then(response => response || fetch(req).catch(() => OFFLINE))
  );
});

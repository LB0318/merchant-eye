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
  const OFFLINE = new Response('<h1>离线模式</h1><p>请连接网络后刷新。</p>', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
  // 主页面走 network-first：在线时始终拿最新版（更新即开即得），离线回退缓存
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
  // 其余资源（字体等）维持缓存优先
  event.respondWith(
    caches.match(req).then(response => response || fetch(req).catch(() => OFFLINE))
  );
});

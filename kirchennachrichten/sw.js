/* Offline-Speicher der Kirchennachrichten */
const CACHE = 'kina-2026-12-v2';
const DATEIEN = [
 "./",
 "index.html",
 "style.css",
 "app.js",
 "manifest.webmanifest",
 "icons/apple-touch-icon.png",
 "icons/favicon-32.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "img/adventsblasen.jpg",
 "img/adventskalender.jpg",
 "img/anima-nordica.jpg",
 "img/ankommen.jpg",
 "img/ankunft.jpg",
 "img/ausmalbild.png",
 "img/breithaupt.jpg",
 "img/brot-fuer-die-welt.jpg",
 "img/buch.jpg",
 "img/drache.jpg",
 "img/drei-koenige.jpg",
 "img/familienkirche.jpg",
 "img/festzug-1951.jpg",
 "img/gemeindefest.jpg",
 "img/kammerorchester.jpg",
 "img/kirche-bethlehem.png",
 "img/kirche-heilig-geist.png",
 "img/kirche-versoehnung.png",
 "img/kirchentag.jpg",
 "img/krippe.jpg",
 "img/logo-75.png",
 "img/logo-seniorenhilfe.png",
 "img/posaunenchor.jpg",
 "img/qr-abendmahl.png",
 "img/qr-kinderbibeltage.png",
 "img/qr-kirchentag.png",
 "img/qr-workshop.png",
 "img/stern.jpg",
 "img/striesener-friedhof.jpg",
 "img/taize.jpg",
 "img/titelbild.jpg",
 "img/uta-kaufmann.jpg",
 "img/vater-unser.jpg",
 "img/wahlvorstand.jpg",
 "img/workshop.jpg"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('kina-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Seite selbst: immer zuerst aktuell aus dem Netz, offline aus dem Speicher
  if (req.mode === 'navigate' || (url.origin === location.origin && /\.(html|css|js|webmanifest)$/.test(url.pathname))) {
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const k = r.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, k)); }
      return r;
    }).catch(() => caches.match(req.mode === 'navigate' ? './' : req, { ignoreSearch: true })));
    return;
  }
  // Bilder, Icons, Schriften: zuerst aus dem Speicher
  e.respondWith(caches.match(req).then(t => t || fetch(req).then(r => {
    if (r.ok && (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com'))) {
      const k = r.clone(); caches.open(CACHE).then(c => c.put(req, k));
    }
    return r;
  })));
});

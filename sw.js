/* ADAM Agenda - service worker: the app opens even without network; data always from the server */
const C='adam-agenda-0.3';
const FILES=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','img/bg-tablet.jpg','img/bg-phone.jpg'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{ const k=r.clone(); caches.open(C).then(c=>c.put(e.request,k)); return r; }).catch(()=>caches.match(e.request)));
});

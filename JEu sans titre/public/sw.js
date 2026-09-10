const CACHE='lvi-v1-shell-6';
const APP_SHELL=['/','/index.html','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
async function cacheShell(){
 const cache=await caches.open(CACHE);
 const response=await fetch('/',{cache:'no-cache'});
 if(!response.ok)throw new Error('Impossible de récupérer le shell');
 const html=await response.text();
 const assets=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)].map(x=>x[1]);
 await cache.put('/',new Response(html,{headers:{'content-type':'text/html'}}));
 await cache.addAll([...APP_SHELL.slice(1),...assets]);
}
self.addEventListener('install',e=>{e.waitUntil(cacheShell().then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('/index.html',copy))}return res}).catch(()=>caches.match('/index.html')));return}e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{if(res.ok&&u.origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return res}).catch(()=>cached)))})

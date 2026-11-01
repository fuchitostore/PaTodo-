var C='patodo-v2',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(F.map(function(u){return c.add(u).catch(function(){})}));
  }));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(r&&r.ok){var c=r.clone();caches.open(C).then(function(x){x.put(e.request,c)})}
      return r;
    }).catch(function(){
      return caches.match(e.request,{ignoreSearch:true}).then(function(m){
        if(m)return m;
        return caches.match('./').then(function(h){return h||caches.match('index.html')});
      });
    })
  );
});

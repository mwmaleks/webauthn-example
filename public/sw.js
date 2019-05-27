self.addEventListener('install', function(event) {
    event.waitUntil(
            caches.open('webauthn-demo').then(function(cache) {
                return cache.addAll(
                    [
                        '/index.html'
                    ]
                );
            })
        );
});

self.addEventListener('activate', (event) => {
    console.log('👷', 'activate', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('webauthn-demo').then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                    if (event.request.method !== 'POST') {
                        cache.put(event.request, response.clone());
                    }

                    return response;
                });
            });
        })
    );
});

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);


// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

// Always serve TMDB images from cache if they're available while they revalidate
workbox.routing.registerRoute(
    new RegExp(/^https:\/\/image\.tmdb\.org\//),
    workbox.strategies.staleWhileRevalidate()
);

// Try to serve TMDB API requests from the network, fallback to cache while offline
workbox.routing.registerRoute(
    new RegExp(/^https:\/\/api\.themoviedb\.org\/3/),
    workbox.strategies.networkFirst()
);

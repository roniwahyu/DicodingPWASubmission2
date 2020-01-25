const CACHE_NAME = "BolaPWA.com";
var urlsToCache = [
    "/",
    "/manifest.json",
    "/nav.html",
    "/index.html",
    "/article.html",
    "/pages/home.html",
    "/pages/team.html",
    "/pages/match.html",
    "/pages/favorite.html",
    "/pages/premier.html",
    "/pages/seriea.html",
    "/pages/champions.html",
    "/css/materialize.min.css",
    "/css/custom.css",
    "/css/fontawesome.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/api.js",
    "/js/fontawesome.js",
    "/images/profil.jpg",
    "/images/images-pwa.png",
    "/images/logo.png",
    "/images/icons/favicon.ico",
    "/images/merlin-ball.jpg",
    "/images/champions-league.jpg",
    "/images/stadiumwall.jpg",
    "/images/seriea2020.jpg"


];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    var base_url = "https://api.football-data.org/v2/";
    

    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
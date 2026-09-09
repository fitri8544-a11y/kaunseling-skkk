const CACHE_NAME = "ubk-skkk-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/manifest.json",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/apple-touch-icon.png"
];


/* =========================================
   INSTALL
========================================= */

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();

});


/* =========================================
   ACTIVATE
========================================= */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))

      );

    })

  );

  self.clients.claim();

});


/* =========================================
   FETCH
========================================= */

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    fetch(event.request)
      .then((response) => {

        const copy = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, copy);
          });

        return response;

      })
      .catch(() => caches.match(event.request))

  );

});
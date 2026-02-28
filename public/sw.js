const CACHE_NAME = "cart2save-cache-v1";
const BYPASS_PATHS = ["/api/", "/api/out", "/_next/data/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (BYPASS_PATHS.some((path) => url.pathname.startsWith(path))) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

/* King Food SW v3 — network-first (never pin old HTML/JS) */
const CACHE = "king-food-v3";

self.addEventListener("install", (event) => {
  // Activate immediately on new deploy
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigation / HTML / Next.js data: always network-first
  const isNav = req.mode === "navigate";
  const isHtml = (req.headers.get("accept") || "").includes("text/html");
  const isNextData = url.pathname.startsWith("/_next/");

  if (isNav || isHtml || isNextData) {
    event.respondWith(
      fetch(req)
        .then((res) => res)
        .catch(() => caches.match(req))
    );
    return;
  }

  // Static assets (logo, manifest): network-first, fallback cache
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

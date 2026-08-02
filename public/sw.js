/* King Food SW v4 — HTML/JS network-first, static assets cache-first */
const CACHE = "king-food-v4";
const PRECACHE = [
  "/logo-kingfood.png.png",
  "/bg-acai.jpg",
  "/manifest.json",
  "/icons/launchericon-192x192.png",
  "/icons/launchericon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // Only same-origin
  if (url.origin !== self.location.origin) return;

  const isNav = req.mode === "navigate";
  const accept = req.headers.get("accept") || "";
  const isHtml = accept.includes("text/html");
  const isNext = url.pathname.startsWith("/_next/");
  const isSw = url.pathname === "/sw.js";

  // Never cache SW itself stale
  if (isSw) {
    event.respondWith(fetch(req));
    return;
  }

  // Navigation / HTML / Next bundles: network-first (fresh deploys)
  if (isNav || isHtml || isNext) {
    event.respondWith(
      fetch(req)
        .then((res) => res)
        .catch(() => caches.match(req).then((c) => c || caches.match("/")))
    );
    return;
  }

  // Static assets: cache-first, then network + put
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});

self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
});

self.addEventListener("fetch", (e) => {
  // Minimal passthrough to satisfy PWA requirements
  // In a real app, you would implement caching here
  // e.respondWith(fetch(e.request));
});

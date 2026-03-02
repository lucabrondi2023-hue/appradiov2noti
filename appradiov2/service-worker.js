const CACHE_NAME = "radio-v3";

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./main.js",
        "./logo.png",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Permite mostrar notificaciones incluso si la app no está visible
self.addEventListener("message", event => {
  if (event.data && event.data.type === "MOSTRAR_NOTIFICACION") {
    self.registration.showNotification(event.data.titulo, {
      body: event.data.mensaje,
      icon: "icon-192.png",
      badge: "icon-192.png",
      vibrate: [200, 100, 200],
      tag: "radio-local",
      renotify: true
    });
  }
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("./index.html")
  );
});
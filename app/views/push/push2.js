self.addEventListener("push", function(event) {
    self.registration.showNotification("タイトル", {
        body: "本文2",
        tag: "タグ2",
        icon: "http://example.com/icon.png",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: "http://localhost:3000/index", // これは独自データ
    });
});

self.addEventListener("notificationclick", function(event) {
    var uri = event.notification.data;
    event.notification.close();
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientLists) {
        if (clients.openWindow) return clients.openWindow(uri);
    }))
});

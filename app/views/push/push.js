self.addEventListener("push", function(event){
  data = event.data.json();
  if(event.data){
    event.waitUntil(
      self.registration.showNotification(data.title,{
        body: data.body,
        tag: "タグ",
        icon: "http://example.com/icon.png",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        actions: [
          {action: 'action1', title: "action1"},
          {action: 'action2', title: "action2"}
        ]
      })
    )
  }
});

self.addEventListener("notificationclick", function(event) {
  var uri = event.notification.data;
  event.notification.close();
  // event.waitUntil(clients.matchAll({
  //   type: "window"
  // }).then(function(clientLists) {
  //   if(clients.openWindow) return clients.openWindow(uri);
  // }))
  if (event.action === 'action1') {
    clients.openWindow("/action1");
  } else if (event.action === 'action2') {
    clients.openWindow("/action2");
  } else {
    clients.openWindow("/");
  }
});



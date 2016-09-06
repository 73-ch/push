self.addEventListener("push", function(event){
  var data = event.data.json();
  if(event.data){
    var action = [];
    if(data.button1 == "true"){
      var action1 = {action: "action1", title: "action1"}
      action.push(action1);
    }
    if(data.button2 == "true") {
      var action2 = {action: "action2", title: "action2"}
      action.push(action2);
    }
    console.log(action.constructor);
    event.waitUntil(
      self.registration.showNotification(data.title,{
        body: data.body,
        tag: "タグ",
        icon: "http://example.com/icon.png",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        actions: action
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



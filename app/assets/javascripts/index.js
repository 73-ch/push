window.onload = function(){
  var pushbutton = document.getElementById('push');
  var pushbutton2 = document.getElementById('push2');
  pushbutton.addEventListener('click', function(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/push', {scope: '/'})
        .then(subscribe)
        .catch((error) => {
          console.log('インストールができませんでした');
        }
      );
    }else{
      console.log('非対応ブラウザです');
    }
  });

  pushbutton2.addEventListener('click', function(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/push2', {scope: '/'})
        .then(subscribe)
        .catch((error) => {
          console.log('インストールができませんでした');
        }
      );
    }else{
      console.log('非対応ブラウザです');
    }
  });
}

function subscribe() {
  if(Notification.permission == 'denied') {
    console.log('プッシュ通知が有効ではありません');
    return;
  }

  navigator.serviceWorker.ready.then((sw) => {
    Notification.requestPermission((permission) => {
      if(permission !== 'denied') {
        sw.pushManager.subscribe({userVisibleOnly: true}).then((s) => {
          // ここでPushのエンドポイントが取得できる
          fetch("/push_data", {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
              endpoint: s.endpoint,
              key: btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('p256dh'))))
                     .replace(/\+/g, '-').replace(/\//g, '_'),
              auth: btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('auth'))))
                     .replace(/\+/g, '-').replace(/\//g, '_')
            })
          })
        });
      }
    });
  })
};






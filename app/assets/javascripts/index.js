window.onload = function(){
  var pushbutton = document.getElementById('push');
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
}

function subscribe() {
  if(Notification.permission == 'denied') {
    console.log('プッシュ通知が有効ではありません');
    return;
  }
  var public_key = new Uint8Array(string_to_buffer(atob(document.getElementById('public_key').textContent.replace(/\-/g, '+').replace(/\_/g, '/'))));
  // public_keyをurlsafedecodeする
  console.log("pub_key" + atob(document.getElementById('public_key').textContent.replace(/\-/g, '+').replace(/\_/g, '/')));

  navigator.serviceWorker.ready.then((sw) => {
    sw.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: public_key}).then((s) => {
      // ここでPushのエンドポイントが取得できる
      console.log(s.endpoint);
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
  })
};

function string_to_buffer(src) {
  return (new Uint8Array([].map.call(src, function(c) {
    return c.charCodeAt(0)
  }))).buffer;
}


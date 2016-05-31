window.addEventListener('load', function() {
  document.getElementById('register').addEventListener('click', register, false);
  document.getElementById('push').addEventListener('click', setPush , false);
  navigator.serviceWorker.ready.then(checkPush);
}, false);

function register() {
  navigator.serviceWorker.register('push.js').then(checkNotification);
}

function checkNotification() {
  Notification.requestPermission(function(permission) {
    if(permission !== 'denied')
      document.getElementById('push').disabled = false;
    else
      alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
  });
}

var subscription = null;

function checkPush(sw) {
  sw.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s){
  if(!s){
    resetSubscription();
  }else {
    document.getElementById('register').disabled = true;
    subscription = s;
    var p = document.getElementById('push');
    p.textContent = 'プッシュ通知を解除する';
    p.disabled = false;
    registerNotification(s);
  }
}

function resetSubscription() {
  document.getElementById('register').disabled = true;
  subscription = null;
  var p = document.getElementById('push');
  p.textContent = 'プッシュ通知を有効にする';
  p.disabled = false;
}

function setPush() {
  if(!subscription) {
    if(Notification.permission == 'denied') {
      alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
      return;
    }
    navigator.serviceWorker.ready.then(function(subscribe){
      console.log(subscribe);
      subscribe.pushManager.subscribe({userVisibleOnly: true }).then(setSubscription, resetSubscription);
    });
  }

  else{
    navigator.serviceWorker.ready.then(unsubscribe);
  }
}

function unsubscribe() {
  if(subscription) {
    // 自分のWebアプリサーバ等にプッシュ通知の解除を通知する処理をここに実装
    subscription.unsubscribe();
  }
  resetSubscription();
}

function registerNotification(s) {
  var endpoint = s.endpoint;
  // Chrome 43以前への対処
  if(('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId))
    endpoint += '/' + s.subscriptionId;
  // 自分のWebアプリサーバ等にプッシュ通知を登録する処理をここに実装
  // endpointにプッシュサービスのエンドポイントのURLが格納される
  navigator.serviceWorker.ready.then(function(registration) {
  registration.pushManager.getSubscription().then(function(subscription){
    fetch(appServerURL, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': '/manifest.json; charset=UTF-8' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        key: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))))
               .replace(/\+/g, '-').replace(/\//g, '_'),
        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
               .replace(/\+/g, '-').replace(/\//g, '_')
      })
    });
  });
  });
};

(function () {
  if (!('serviceWorker' in navigator)) return;

  function register() {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(function (reg) {
        console.log('[SW] Registered successfully.');

        // Check for updates immediately, then every 60 seconds
        reg.update();
        setInterval(function () {
          reg.update();
        }, 60 * 1000);

        // When a new SW is found and waiting to activate
        reg.addEventListener('updatefound', function () {
          var newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', function () {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new version is ready — tell it to activate immediately
              console.log('[SW] New version detected. Activating...');
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(function (e) {
        console.warn('[SW] Registration failed:', e);
      });

    // When the new SW takes over, reload the page to use fresh assets
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true;
      console.log('[SW] Controller changed. Reloading for latest version...');
      window.location.reload();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', register);
  } else {
    register();
  }
})();

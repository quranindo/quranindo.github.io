(() => {

  const pwaInstallButton = document.getElementById('pwa-install');
  if (!pwaInstallButton) return;

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    pwaInstallButton.hidden = false;
  });

  pwaInstallButton.addEventListener('click', async () => {

    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      return;
    }

    alert("Chrome ⋮ → Tambahkan ke layar utama");

  });

  window.addEventListener('appinstalled', () => {
    pwaInstallButton.hidden = true;
    deferredPrompt = null;
  });

})();

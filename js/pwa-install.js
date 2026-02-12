/* ===============================
   PWA INSTALL BUTTON – CLEAN
   Kang Ismet Edition
   =============================== */

let deferredPrompt = null;

const btn = document.getElementById('pwa-install');


/* ===============================
   HIDE kalau sudah terinstall
   =============================== */
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
}

if (isStandalone()) {
  btn.hidden = true;
}


/* ===============================
   Tangkap event install
   =============================== */
window.addEventListener('beforeinstallprompt', (e) => {

  e.preventDefault(); // stop auto popup

  deferredPrompt = e;

  btn.hidden = false; // tampilkan tombol

});


/* ===============================
   Klik tombol install
   =============================== */
btn.addEventListener('click', async () => {

  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    btn.hidden = true;
  }

  deferredPrompt = null;

});


/* ===============================
   Setelah sukses install
   =============================== */
window.addEventListener('appinstalled', () => {
  btn.hidden = true;
  deferredPrompt = null;
});

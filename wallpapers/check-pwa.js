// Check if the app is running in standalone mode or on iOS/macOS
const displayMode = window.matchMedia('(display-mode: standalone)').matches;
const isStandalone = window.navigator.standalone;
const body = document.body;
const bfLogo = document.querySelector('.bfLogo');

if (displayMode || isStandalone) {
  body.classList.add('pwa');
  bfLogo.classList.add('pwa');
}
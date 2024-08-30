// Check if the app is running in standalone mode or on iOS/macOS
const displayMode = window.matchMedia('(display-mode: standalone)').matches;
const isStandalone = window.navigator.standalone;
const body = document.body;
const bfLogo = document.querySelector('.bfLogo');
const installForMacBtn = document.getElementById("installForMacBtn");

if (displayMode || isStandalone) {
  body.classList.add('pwa');
  bfLogo.classList.add('pwa');
  if (isIOS()) {
    installForMacBtn.style.display = "none";
  }
} else {
  installForMacBtn.style.display = "block";
}
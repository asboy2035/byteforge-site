// Check if the app is running in standalone mode or on iOS/macOS
const displayMode = window.matchMedia('(display-mode: standalone)').matches;
const isStandalone = window.navigator.standalone;

if (displayMode || isStandalone) {
  document.querySelectorAll('*').forEach(element => {
    element.classList.add('pwa');
  });  
}
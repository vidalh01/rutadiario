if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/page-rutadiario/sw.js', { scope: '/page-rutadiario/' })})}
//Import all components
// tv.js will only load what is needed

//$tv.setConfig({ renderAll: false });
$tv.setConfig({ waitForEveryone: false });
$tv.import({ define: 'tv-email', file: '/src/components/other/FormSpree'});
$tv.import({ define: 'tv-button', file: '/src/components/other/Button'});


// Service Worker for PWA cache
/* TODO: Add service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
            .then(reg => console.log('✅ Service Worker has been registered!', reg.scope))
            .catch(err => console.log('⚠️ Service Worker: Something was going wrong...', err));
    });
}
*/
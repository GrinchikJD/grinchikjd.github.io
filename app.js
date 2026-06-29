//Import all components
// tv.js will only load what is needed

//$tv.setConfig({ renderAll: false });
$tv.setConfig({ waitForEveryone: false });
$tv.import({ define: 'tv-email', file: '/src/components/other/FormSpree'});
$tv.import({ define: 'tv-button', file: '/src/components/other/Button'});
$tv.import({ define: 'tv-babylon-render', file: '/src/components/babylon/BabylonRender'});
$tv.import({ define: 'tv-three-render', file: '/src/components/three/ThreeRender'});


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
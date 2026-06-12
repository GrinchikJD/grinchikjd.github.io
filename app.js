//Import all components
// tv.js will only load what is needed

//$tv.setConfig({ renderAll: false });
$tv.setConfig({ waitForEveryone: false });
$tv.import({ define: 'tv-email', file: '/src/components/other/FormSpree'});


// Service Worker for PWA cache
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker has been registered!', reg.scope))
            .catch(err => console.log('Service Worker: Something was going wrong...', err));
    });
}
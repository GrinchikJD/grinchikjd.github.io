$ez.import([
    { define: 'ez-header', file: '/src/components/page/Header'},
    { define: 'ez-footer', file: '/src/components/page/Footer'},
    { define: 'ez-showcase', file: '/src/components/page/Showcase'},
    { define: 'ez-skills', file: '/src/components/other/Skills'},
    { define: 'ez-email', file: '/src/components/other/FormSpree'},
    { define: 'ez-button', file: '/src/components/other/Button'},
    { define: 'ez-dropdownlist', file: '/src/components/other/DropdownList'},
    { define: 'ez-shell', file: '/src/components/other/Shell'},
    { define: 'ez-babylon-render', file: '/src/components/babylon/BabylonRender'},
    { define: 'ez-three-render', file: '/src/components/three/ThreeRender'},
    { define: 'ez-products-grid', file: '/src/components/products/ProductsGrid'},
    { define: 'ez-product', file: '/src/components/products/ProductItem'}
]);

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
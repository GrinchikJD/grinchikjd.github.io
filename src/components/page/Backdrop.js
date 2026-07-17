class Backdrop extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initBackdropComponent';

    ELEMENT_ATTRIBUTES = [{ 'x-bind' : 'eventListeners' }]

    EZ_HTML = ($) => /*html*/`
    <div class="fixed top-0 left-0 right-0 bottom-0 z-40 md:hidden
        bg-gradient-to-b from-theme to-alpha"
        :class="{ 'fixed' : isActive, 'hidden' : !isActive }"
        style="animation: fadeInOpacity 0.2s ease-out forwards;" @click="hookDisableBackdrop()" 
    ></div>
    `

    initBackdropComponent($) {
        return {
            isActive: false,
            toggleBackdrop() {
                this.isActive = !this.isActive;
            },
            hookDisableBackdrop() {
                this.isActive = false;
                window.dispatchEvent(new CustomEvent('hook-backdrop-disable'));
            },
            eventListeners: {
                ['@backdrop-toggle.window'](e) {
                    this.toggleBackdrop();
                }
            }
        }
    }
}
$ez.setComponent(Backdrop);

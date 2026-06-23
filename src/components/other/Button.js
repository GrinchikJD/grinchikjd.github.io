class Button extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initButtonComponent';

    ELEMENT_ATTRIBUTES = [
        { 'x-bind' : 'eventListeners' },
        { 'class' : 'flex gap-4' }
    ];

    constructor() {
        super();
    }

    TV_HTML = /*html*/`
        <button @click="counter()">${this.LEGACY_HTML}</button>
        <div x-text="value"></div>
    `

    initButtonComponent() {
        return {
            value: 0,
            counter() {
                this.value++;
            },
            eventListeners: {
               ['@android-accelerometer.window'](e) {}
            }
        }
    }

    connectedCallback() {
         super.connectedCallback();
    }
}
$tv.setComponent(Button);

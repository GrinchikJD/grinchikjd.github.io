class Button extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initButtonComponent';

    ELEMENT_ATTRIBUTES = [{ 'class' : 'flex gap-4' }];

    EZ_HTML = ({title}) => /*html*/`
        <button @click="counter()" class="font-bold">
            ${title}
        </button>
        <div x-text="value"></div>
    `

    initButtonComponent($) {
        return {
            value: 0,
            counter() {
                this.value++;
            }
        }
    }

    connectedCallback() {
         super.connectedCallback();
    }
}
$ez.setComponent(Button);

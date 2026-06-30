class Dropdown extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initDropdownComponent';
    
    TV_HTML = /*html*/`
        <button @click="isOpen = !isOpen" x-text="buttonTitle"></button>
        <div x-show="isOpen">
            <!-- <tv-three-render loading="lazy"></tv-three-render> -->
            <tv-legacy-html></tv-legacy-html>
        </div>
    `

    initDropdownComponent() {
        return {
            isOpen: false,
            buttonTitle: 'Check this',
            init() {
                this.buttonTitle = this.$el.getAttribute('title') || 'Button';
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
$tv.setComponent(Dropdown);

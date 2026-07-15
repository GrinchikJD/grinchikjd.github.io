class DropdownList extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initDropdownListComponent';

    EZ_HTML = ($) => /*html*/`
        <div>
            ${JSON.parse($.json || "[]").map(this.renderItemsHtml).join('')}
        </div>
    `;

    constructor() {
        super();
    }

    renderItemsHtml(obj, idx) {
        return /*html*/`
            <button @click="setActive(${idx})">
                ${obj.title}
            </button>
            <template x-if="currentIndex === ${idx}">
                <${obj.component}></${obj.component}>
            </template>
        `
    }

    initDropdownListComponent() {
        return {
            currentIndex: false,
            setActive(idx) {
                this.currentIndex = idx === this.currentIndex ? false : idx;
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
$ez.setComponent(DropdownList);

class DropdownList extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initDropdownListComponent';

    TV_HTML = /*html*/`
    <button @click="setActive(1)">Show 3d</button>
    <div x-show="currentIndex === 1">
        <tv-legacy-html></tv-legacy-html>
    </div>

    <button @click="setActive(2)">Show Email</button>
    <template x-if="currentIndex === 2">
        <tv-email x-bind:loaded="$tv.$deferImport('tv-email')"></tv-email>
    </template>

    `

    initDropdownListComponent() {
        return {
            currentIndex: 0,
            setActive(idx) {
                this.currentIndex = idx === this.currentIndex ? 0 : idx;
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
$tv.setComponent(DropdownList);

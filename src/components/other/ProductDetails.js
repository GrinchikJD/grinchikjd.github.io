class ProductDetails extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initProductDetailsComponent';

    EZ_HTML = ($) => /*html*/`
    <div class="flex gap-4">
        <div x-show="isOpened" class="bg-theme-50 rounded-xl">
            <ez-childs></ez-childs>
        </div>
        <button @click="isOpened = !isOpened">Test</button>
    </div>
    `

    initProductDetailsComponent($) {
        return {
            isOpened: false
        }
    }
}
$ez.setComponent(ProductDetails);

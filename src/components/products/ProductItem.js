class ProductItem extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initProductItemComponent';

    constructor() {
        super();
    }

    EZ_HTML = ({title, img}) => /*html*/`
        <div class="">
            <span>${title}</span>
            <img loading="lazy" src="${img}" alt="${title}" width="150" height="150" />
        </div>
    `

    initProductItemComponent() {
        return {
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
$ez.setComponent(ProductItem);

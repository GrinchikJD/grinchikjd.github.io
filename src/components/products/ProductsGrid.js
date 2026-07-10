class ProductsGrid extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initProductsGridComponent';

    ITEMS_ARRAY = [];

    constructor() {
        super();
    }

    EZ_HTML = this.renderHtml();

    renderHtml() {
        return /*html*/`
        <div class="grid grid-cols-3 gap-4 max-w-[80%] mx-auto">
            ${this.ITEMS_ARRAY.map(this.renderItemsHtml).join('')}
        </div>
        `
    }

    renderItemsHtml(obj, idx) {
        return /*html*/`
            <ez-product loading="lazy" title="${obj.title}" img="${obj.image}"></ez-product>
        `
    }

    initProductsGridComponent() {
        return {
        }
    }

    connectedCallback() {
        this.ITEMS_ARRAY = [];
        fetch(
            "https://fakestoreapi.com/products",
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        )
        .then((response) => {
            if (!response.ok) return;
            return response.json();
        })
        .then(data => {
            this.ITEMS_ARRAY = data;
            this.EZ_HTML = this.renderHtml(); 
            super.connectedCallback();
        });
    }
}
$ez.setComponent(ProductsGrid);

class Shell extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initShellComponent';

    DEPS = []; // exmple: [{ 'text/css' : 'web/css/scene.css' }]

    constructor() {
        super();
    }

    EZ_HTML = ({title}) => /*html*/`
    <div>
        ${title ? `<h1>${title}</h1>` : ``}
        <button @click="isOpened = !isOpened">Click</button>
        <div x-show="isOpened">
            <div>
                <ez-childs></ez-childs>
            </div>
        </div>
    </div>
    `

    initShellComponent() {
        return {
            alpineText: '',
            isOpened: false
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
$ez.setComponent(Shell);

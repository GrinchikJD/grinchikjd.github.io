class Header extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initHeaderComponent';

    ELEMENT_ATTRIBUTES = [{ 'class' : 'flex items-center w-full justify-between' }];

    EZ_HTML = ($) => /*html*/`
    <nav role="navigation flex items-center my-auto">
        <ul class="flex items-center">
            <template x-for="(item, idx) in menuArr">
                <li class="px-2 mx-2">
                    <a  x-bind:href="item.url"
                        :class="{
                            'selected text-white' : selectedIdx === idx,
                            'text-gray-400' : selectedIdx !== idx,
                        }"
                        class="menu-tab text-gray-400"
                    >
                        <span class="text" x-text="item.title"></span>
                    </a>
                </li>
            </template>
        </ul>
    </nav>
    <div>
        *
    </div>
    `

    initHeaderComponent($) {
        return {
            selectedIdx: null,
            menuArr: [
                {title: 'Showcase', url:'/'},
                {title: 'Contact Me', url:'/zpages/contact.html'}
            ],
            init(){
                let self = this;
                let strPath = window.location.pathname.split('/');
                    strPath = strPath[strPath.length-1];
                if (!strPath) {
                    this.selectedIdx = 0;
                    return;
                }
                this.menuArr.forEach( (elem, idx) => {
                    if (elem.url.indexOf(strPath) >= 0) {
                        self.selectedIdx = idx;
                    }
                });
            }
        }
    }
}
$ez.setComponent(Header);

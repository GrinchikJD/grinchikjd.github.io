class Footer extends EzHTMLElement {
    EZ_HTML = ($) => /*html*/`
    <div class="p-3 text-white">
        <code>
            Powered by <a href="https://ezlandjs.github.io/" 
                title="EzLand.js official web-page" 
                target="_blank">EzLand.js</a> 
            and
            <a href="" title="" target="_blank">Alpine.js</a>
        </code>
    </div>
    `
}
$ez.setComponent(Footer);

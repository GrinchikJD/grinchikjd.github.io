class Showcase extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initShowcaseComponent';

    EZ_HTML = ($) => /*html*/`
    <div class="w-full h-full">
        <div class="showcase-grid grid grid-cols-2 md:grid-cols-4 gap-2 h-full">
        <template x-for="(item, idx) in items" :key="idx">
            <div class="card showcase-item h-[150px] md:h-auto py-[2px]">
                <a :href="item.url" :title="'Check the ' + item.title"
                    class="card-content">
                    <div class="flex items-center group w-full h-full overflow-hidden relative rounded-md">
                        <img :src="item.img" :alt="item.title + ' image'" 
                            width="250" height="250" 
                            class="absolute w-full min-h-full min-w-full object-cover 
                            group-hover:scale-110 transition-all duration-300 group-hover:opacity-30"
                        />
                        <div class="relative flex flex-col py-2 w-full self-end">
                            <div class="duration-200 transition-all absolute bottom-2 flex flex-col w-full px-2
                                group-hover:md:bottom-auto group-hover:md:top-2 group-hover:md:-translate-y-full" >
                                <span class="font-heading" x-text="item.title"></span>
                                <code class="text-xs" x-text="item.description"></code>  
                            </div>
                            <div class="max-md:hidden duration-200 transition-all translate-y-[105%] opacity-0
                                group-hover:translate-y-0 group-hover:opacity-100 text-sm pt-2 px-2 -mb-2 pb-2
                                bg-gradient-to-t from-theme-50"
                            >
                                <span x-text="item.details"></span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </template>
        </div>
    </div>
    `

    initShowcaseComponent($) {
        return {
            items: [
                { 
                    url: "/zpages/3d_demo.html",
                    title: "Web 3D Graphics", img: "/src/img/showcase/3dpreview.webp",
                    description: "3D visualization right on Your webpage!",
                    details: `Does Your online store / web-demo / web-game need 3D graphics integration? 
                        Drawing on my GameDev experience, I can quickly and seamlessly implement any concept You have in mind.
                        Check out the demo.`
                },
                { 
                    url: "",
                    title: "EzLand.js", img: "/src/img/particles_circle.webp",
                    description: "Need a small landing page? Like this one?",
                    details: `EzLand.js is my small library for quickly creating client-side rendering landing pages using Web Components. 
                        You don't need Node.js for this - it's very simple.
                        Check out the demo.`
                },
                { 
                    url: "",
                    title: "Languager", img: "/src/img/showcase/languager.webp",
                    description: "The web-app designed for language learning.",
                    details: `Circumstances required me to learn several languages. 
                        I liked the Pimsleur method, so I created a tool to help me memorize phrases in foreign languages.`
                }
            ]
        }
    }
}
$ez.setComponent(Showcase);

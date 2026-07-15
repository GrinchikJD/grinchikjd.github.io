class FormSpree extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initFormSpreeComponent';

    ELEMENT_ATTRIBUTES = [];

    constructor() {
        super();
    }

    EZ_HTML = /*html*/`
    <form action="https://formspree.io/f/xeewlvvv" method="POST" @submit.prevent="submitForm">
        <div x-show="!isSent">
            <section class="flex flex-col gap-2">
                <input x-model="userEmail" placeholder="Enter Your email" title="Enter Your email" />
                <textarea x-model="message" placeholder="Your message" title="Enter Your message"></textarea>
                <button type="submit">Send request</button>
            </section>
        </div>
        <div x-show="isSent">
            <div>Message has been sent</div>
        </div>
    </form>
    `

    initFormSpreeComponent() {
        return {
            userEmail: '',
            message: '',
            fetching: false,
            isError: false,
            isSent: false,
            storageId: 'jd-landing-form-sent',
            init() {
                this.checkIsSent();
            },
            checkIsSent() {
                if (!window.localStorage.getItem(this.storageId)) return;
                this.isSent = true;
            },
            bakeIsSent() {
                this.isSent = true;
                window.localStorage.setItem(this.storageId, '1');
            },
            submitForm(e) {
                if (this.isSent) return;
                this.fetching = true;

                const form = e.target;
                const formData = new FormData(form);
                formData.append('email', this.userEmail);
                formData.append('message', this.message + '; ' + this.userEmail);

                const data = Object.fromEntries(formData.entries());

                fetch(form.action, {
                    method: form.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(response => {
                    if (response.ok) {
                        this.isError = false;
                        this.bakeIsSent();
                        form.reset();
                        return;
                    }
                    this.isError = true;
                });
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
$ez.setComponent(FormSpree);

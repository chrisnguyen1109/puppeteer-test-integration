import { Browser, Page } from 'puppeteer';
import { generateJwt, generateUser } from '../factories';

export class CustomPage {
    static async build(browser: Browser) {
        const page = await browser.newPage();

        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get(target, p, receiver) {
                if (target[p as keyof typeof p]) {
                    return target[p as keyof typeof p];
                }

                const value = page[p as keyof Page];
                if (value instanceof Function) {
                    return function (this: any, ...args: any[]) {
                        return (value as Function).apply(
                            this === receiver ? page : this,
                            args
                        );
                    };
                }

                return value;
            },
        }) as CustomPage & Page;
    }

    private constructor(private readonly page: Page) {}

    async login() {
        const user = await generateUser();

        const accessToken = await generateJwt(user);

        await this.page.setCookie({
            name: 'access_token',
            value: accessToken,
        });
    }

    async getContentOf(
        selector: string,
        type: 'textContent' | 'innerHTML' = 'textContent'
    ) {
        await this.page.waitForSelector(selector);

        return this.page.evaluate(
            ({ selector, type }) => document.querySelector(selector)?.[type],
            { selector, type }
        );
    }

    private async typeInput(selector: string, input: string) {
        await this.page.focus(selector);
        await this.page.keyboard.type(input, { delay: 100 });
    }

    async createBlog(title: string, content: string) {
        const titleInputSelector = 'form input[placeholder="Title"]';
        const contentInputSelector = 'form textarea[placeholder="Content"]';
        const submitBtnSelector = '[type="submit"].btn.btn-primary';

        await Promise.all([
            this.page.waitForSelector(titleInputSelector),
            this.page.waitForSelector(contentInputSelector),
            this.page.waitForSelector(submitBtnSelector),
        ]);

        await this.typeInput(titleInputSelector, title);
        await this.typeInput(contentInputSelector, content);

        await Promise.all([
            this.page.click(submitBtnSelector),
            this.page.waitForNavigation(),
        ]);
    }

    async request(path: string, requestOptions: RequestInit = {}) {
        return this.page.evaluate(
            async ({ path, requestOptions }) => {
                const response = await fetch(path, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    ...requestOptions,
                });

                return response.json();
            },
            { path, requestOptions }
        );
    }
}

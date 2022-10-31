import puppeteer, { Browser, Page, Target } from 'puppeteer';
import { PORT } from '../src/configs';
import { clearRedisDB } from '../src/loaders';
import { CustomPage, extendPage } from './helpers';

let browser: Browser;
let page: CustomPage & Page;

beforeEach(async () => {
    await clearRedisDB();

    browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
    });
    // browser.on('targetcreated', async (target: Target) => {
    //     const newPage = await target.page();
    //     if (target.type() === 'page' && newPage) {
    //         extendPage(newPage);
    //     }
    // });

    page = await CustomPage.build(browser);

    await page.goto(`http://server:${PORT}`);
});

afterEach(async () => {
    await browser.close();
});

it('Header has correct text', async () => {
    const text = await page.getContentOf('.navbar-brand');

    expect(text).toEqual('Blogs');
});

it('Click login starts oauth flow', async () => {
    const btnSelector = '.navbar span.btn-link';
    await page.waitForSelector(btnSelector);

    await page.click(btnSelector);

    const oauthPage: Page | null = await new Promise(resolve =>
        browser.once('targetcreated', (target: Target) =>
            resolve(target.page())
        )
    );

    expect(oauthPage?.url()).toMatch(/accounts\.google\.com/);
});

it("When signed in, user's name be defined", async () => {
    await page.login();

    const text = await page.getContentOf('#basic-nav-dropdown');

    expect(text).toBeDefined();
});

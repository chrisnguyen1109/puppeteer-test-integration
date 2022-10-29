require('dotenv').config({
    path: '.env.test',
});
import puppeteer, { Browser, Page } from 'puppeteer';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { JWT_SECRET } from '../src/configs';

let browser: Browser;
let page: Page;

beforeAll(async () => {
    jest.setTimeout(10 * 1000);

    browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
});

afterAll(async () => {
    await browser.close();
});

beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3001');
});

afterEach(async () => {
    await page.close();
});

it('Header has correct text', async () => {
    const brandSelector = '.navbar-brand';
    await page.waitForSelector(brandSelector);

    const text = await page.$eval(brandSelector, el => el.textContent);

    expect(text).toEqual('Blogs');
});

it('Click login starts oauth flow', async () => {
    const btnSelector = '.navbar span.btn-link';
    await page.waitForSelector(btnSelector);

    await page.click(btnSelector);

    const oauthPage: Page = await new Promise(resolve =>
        browser.once('targetcreated', target => resolve(target.page()))
    );

    expect(oauthPage.url()).toMatch(/accounts\.google\.com/);
});

// it("When signed in, user's name be defined", async () => {
//     const jwtSign = promisify(jwt.sign) as any;

//     const accessToken = await jwtSign(
//         {
//             id: '110961896453089690630',
//         },
//         JWT_SECRET
//     );

//     await page.setCookie({
//         name: 'access_token',
//         value: accessToken,
//     });

//     const dropDownBtn = '#basic-nav-dropdown';
//     await page.waitForSelector(dropDownBtn);

//     const text = await page.$eval(dropDownBtn, el => el.textContent);

//     expect(text).toBeDefined();
// });

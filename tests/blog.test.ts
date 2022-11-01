import puppeteer, { Browser, Page } from 'puppeteer';
import { PORT } from '../src/configs';
import { clearRedisDB } from '../src/loaders';
import { CustomPage } from './helpers';

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

    page = await CustomPage.build(browser);

    page.on('console', message => console.log(message));

    await page.goto(`http://server:${PORT}`);
});

afterEach(async () => {
    await browser.close();
});

describe('When user logged in', () => {
    beforeEach(async () => {
        await page.login();
    });

    it('View empty blog posts', async () => {
        const text = await page.getContentOf('main p.text-center');

        expect(text).toMatch(/You don't have any blogs/);
    });

    describe('Create blog post', () => {
        beforeEach(async () => {
            const navLinkSelector = '#basic-nav-dropdown';
            await page.waitForSelector(navLinkSelector);

            await page.click(navLinkSelector);

            const createBlogSelector =
                '.dropdown-menu.show .dropdown-item:first-child';
            await page.waitForSelector(createBlogSelector);

            await page.click(createBlogSelector);
        });

        it('View create blog page', async () => {
            const text = await page.getContentOf(
                '[type="submit"].btn.btn-primary'
            );

            expect(text).toEqual('Create blog');
        });

        it('Create blog post and redirect to homepage', async () => {
            const title = 'title';
            const content = 'content';

            await page.createBlog(title, content);

            const [textTitle, textContent] = await Promise.all([
                page.getContentOf('.card .card-body .card-title'),
                page.getContentOf('.card .card-body .card-text'),
            ]);

            expect(textTitle).toEqual(title);
            expect(textContent).toEqual(content);
        });

        it('Submit form with invalid input', async () => {
            const submitBtnSelector = '[type="submit"].btn.btn-primary';
            await page.waitForSelector(submitBtnSelector);

            await page.click(submitBtnSelector);

            const text = await page.getContentOf('.was-validated');

            expect(text).toBeDefined();
        });

        it('Remove blog post after create', async () => {
            await page.createBlog('title', 'content');

            const removeBtnSelector = '.card .card-footer .btn.btn-danger';
            await page.waitForSelector(removeBtnSelector);

            await page.click(removeBtnSelector);

            const text = await page.getContentOf('main p.text-center');

            expect(text).toMatch(/You don't have any blogs/);
        });
    });
});

describe('When user not logged in', () => {
    it('Cannot view blog posts', async () => {
        const text = await page.getContentOf(
            'main .text-center.text-danger.mark'
        );

        expect(text).toEqual('You need to login to create blog!');
    });

    it('Cannot view create blog page', async () => {
        await page.goto(`http://server:${PORT}/blogs/create`);

        const text = await page.getContentOf(
            'main .text-center.text-danger.mark'
        );

        expect(text).toEqual('You need to login to create blog!');
    });

    it('Cannot create blog post', async () => {
        const response = await page.request('/api/v1/blogs', {
            method: 'POST',
            body: JSON.stringify({
                title: 'title',
                content: 'content',
                image: 'https://thumbs.dreamstime.com/b/blog-information-website-concept-workplace-background-text-view-above-127465079.jpg',
            }),
        });

        expect(response).toMatchObject({ message: 'Unauthorized' });
    });

    it('Cannot remove blog post', async () => {
        const response = await page.request('/api/v1/blogs/123456', {
            method: 'DELETE',
        });

        expect(response).toMatchObject({ message: 'Unauthorized' });
    });
});

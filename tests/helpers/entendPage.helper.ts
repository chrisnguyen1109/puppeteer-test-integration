import { Page } from 'puppeteer';
import { generateJwt, generateUser } from '../factories';

export const extendPage = (page: Page) => {
    // page.login = async function () {
    //     const user = await generateUser();
    //     const accessToken = await generateJwt(user);
    //     await this.setCookie({
    //         name: 'access_token',
    //         value: accessToken,
    //     });
    // };
};

import { connectRedisDB, disconnectRedisDB } from '../src/loaders';

// declare module 'puppeteer' {
//     interface Page {
//         login(): Promise<void>;
//     }
// }

beforeAll(async () => {
    await connectRedisDB();
});

afterAll(async () => {
    await disconnectRedisDB();
});

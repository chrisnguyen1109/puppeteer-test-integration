import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from '../configs';

export const redisClient = createClient({
    url: `redis://default:default@${REDIS_HOST}:${REDIS_PORT}`,
});

export const connectRedisDB = async () => {
    await redisClient.connect();

    console.log('Connect redis database successfully!');
};

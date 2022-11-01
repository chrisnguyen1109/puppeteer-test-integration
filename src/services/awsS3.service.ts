import AWS from 'aws-sdk';
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from '../configs';

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
    region: 'ap-southeast-1',
});

export const getPreSignedUrl = (params: Record<string, any>) => {
    return s3.getSignedUrlPromise('putObject', params);
};

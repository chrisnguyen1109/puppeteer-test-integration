import { RequestHandler } from 'express';
import { User } from '../models';
import {
    createBlog,
    getMyBlogs,
    getPreSignedUrl,
    removeBlog,
} from '../services';
import { v4 as uuid } from 'uuid';
import { BLOG_S3_BUCKET } from '../configs';

export const createBlogController: RequestHandler = async (req, res) => {
    const blog = await createBlog(req.user as User, req.body);

    res.status(201).json({
        message: 'Success',
        data: {
            blog,
        },
    });
};

export const getMyBlogsController: RequestHandler = (req, res) => {
    const blogs = getMyBlogs(req.user as User);

    res.status(200).json({
        message: 'Success',
        data: {
            blogs,
        },
    });
};

export const removeBlogController: RequestHandler = async (req, res) => {
    await removeBlog(req.user as User, req.params.id);

    res.status(204).json({
        message: 'Success',
    });
};

export const uploadBlogImgController: RequestHandler = async (req, res) => {
    const fileType = req.body.fileType as string;
    const key = `${(req.user as User).id}/${uuid()}.${fileType.split('/')[1]}`;

    const url = await getPreSignedUrl({
        Bucket: BLOG_S3_BUCKET,
        ContentType: fileType,
        Key: key,
    });

    res.status(200).json({
        message: 'Success',
        data: {
            url,
            key,
        },
    });
};

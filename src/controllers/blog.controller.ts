import { RequestHandler } from 'express';
import { User } from '../models';
import { createBlog, getMyBlogs, removeBlog } from '../services';

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
    console.log(req.params.id);
    await removeBlog(req.user as User, req.params.id);

    res.status(204).json({
        message: 'Success',
    });
};

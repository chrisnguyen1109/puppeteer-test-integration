import { Blog, User } from '../models';

export const createBlog = (
    user: User,
    body: { title: string; content: string; image: string }
) => {
    const blog = new Blog(body.title, body.content, body.image);

    return user.createBlog(blog);
};

export const getMyBlogs = (user: User) => {
    return user.getMyBlogs();
};

export const removeBlog = (user: User, blogId: string) => {
    return user.removeBlog(blogId);
};

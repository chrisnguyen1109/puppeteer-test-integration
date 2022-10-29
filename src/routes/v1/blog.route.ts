import { Router } from 'express';
import {
    createBlogController,
    getMyBlogsController,
    removeBlogController,
} from '../../controllers';
import { checkAuth } from '../../middlewares';

export const blogRouter = Router();

blogRouter.use(checkAuth);

blogRouter.route('/').post(createBlogController).get(getMyBlogsController);

blogRouter.delete('/:id', removeBlogController);

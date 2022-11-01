import { Router } from 'express';
import {
    createBlogController,
    getMyBlogsController,
    removeBlogController,
    uploadBlogImgController,
} from '../../controllers';
import { checkAuth } from '../../middlewares';

export const blogRouter = Router();

blogRouter.use(checkAuth);

blogRouter.route('/').post(createBlogController).get(getMyBlogsController);

blogRouter.delete('/:id', removeBlogController);

blogRouter.post('/upload-img', uploadBlogImgController);

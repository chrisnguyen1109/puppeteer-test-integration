import { redisClient } from '../loaders';
import { Blog } from './Blog.model';
import { plainToInstance } from 'class-transformer';

export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public blogs: Blog[] = []
    ) {}

    static async findById(userId: string) {
        const user = await redisClient.get(userId);
        if (!user) return null;

        return plainToInstance(User, JSON.parse(user) as User);
    }

    save() {
        return redisClient.set(this.id, JSON.stringify(this));
    }

    getMyBlogs() {
        return this.blogs;
    }

    async createBlog(blog: Blog) {
        this.blogs = [blog, ...this.blogs];

        await this.save();

        return blog;
    }

    removeBlog(blogId: string) {
        this.blogs = this.blogs.filter(({ id }) => id !== blogId);

        return this.save();
    }
}

import { User } from '../../src/models';
import { v4 as uuid } from 'uuid';

export const generateUser = async () => {
    const user = new User(uuid(), 'test', 'test@gmail.com');

    await user.save();

    return user;
};

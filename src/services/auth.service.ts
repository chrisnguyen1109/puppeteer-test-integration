import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRE } from '../configs';
import { User } from '../models';
import { promisify } from 'util';

const jwtSign = promisify(jwt.sign) as any;
const jwtVerify = promisify(jwt.verify) as any;

export const login = (user: User) => {
    return jwtSign(
        {
            id: user.id,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRE }
    );
};

export const verifyToken = async (token: string) => {
    const { id } = await jwtVerify(token, JWT_SECRET);

    return User.findById(id as string);
};

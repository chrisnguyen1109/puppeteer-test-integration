import { User } from '../../src/models';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { JWT_SECRET } from '../../src/configs';

export const generateJwt = (user: User) => {
    const jwtSign = promisify(jwt.sign) as any;

    return jwtSign(
        {
            id: user.id,
        },
        JWT_SECRET
    );
};

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../configs';
import { User } from '../models';

export const loadPassports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/v1/auth/google/callback',
            },
            async (_accessToken, _refreshToken, profile, cb) => {
                try {
                    const { sub, name = '', email = '' } = profile._json;

                    let user = await User.findById(sub);

                    if (!user) {
                        user = new User(sub, name, email);

                        await user.save();
                    }

                    cb(null, user);
                } catch (error) {
                    cb(error as any);
                }
            }
        )
    );
};

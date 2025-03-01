import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
    passReqToCallback: true
},

    async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    avatar: profile.photos[0].value
                });

                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }

))
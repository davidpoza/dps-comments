import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

import config from '../config/index.js';

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
      },
      function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        cb(null, user);
      }
    )
  );
};

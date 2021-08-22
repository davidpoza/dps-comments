import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Container } from 'typedi';

import config from '../config/index.js';

export default () => {
  const sequelize = Container.get('sequelizeInstance');
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
        passReqToCallback: true,
      },
      async function (req, accessToken, refreshToken, profile, cb) {
        try {
          let user = await sequelize.models.users.findOne({ where: { email: profile.emails[0].value } });
          if (!user) {
            user = await sequelize.models.users.create({
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
              name: profile.displayName,
            });
          }
          cb(null, { // injects user in req.user
            email: user.dataValues.email,
            id: user.dataValues.id,
            backUrl: req.query.state,
          });
        } catch(err) {
          cb(err, null);
        }
      }
    )
  );
};

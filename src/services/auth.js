import { Container } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// Verify Token validity and attach token data as request attribute
export const verifyToken = (token) => {
  jwt.verify(token, config.jwtSecret, { algorithms: [ config.jwtAlgorithm ]}, async (err, payload) => {
    if (err) { // checks validity and expiration.
      throw new Error('unauthorized');
    } else {
      const sequelize = Container.get('sequelizeInstance');
      const userModel = sequelize.models.users;
      const user = await userModel.findOne({ where: { id: payload?.userId || '' } });
      if (!user) {
        throw new Error('unauthorized');
      }
      return {
        email: user.dataValues.email,
        id: user.dataValues.id,
      };
    }
  });
};

// Issue Token, add userId to token
export const signToken = (req, res) => {
  jwt.sign({ userId: req.user.id }, config.jwtSecret, { expiresIn: `${config.jwtLifetime} min` }, (err, token) => {
    if(err){
        res.sendStatus(500);
    } else {
        res.json({ token });
    }
  });
}
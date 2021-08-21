import { Container } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// Verify Token validity and attach token data as request attribute
export const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwtSecret, { algorithms: [ config.jwtAlgorithm ]});
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

import { Container } from 'typedi';
import { verifyToken } from "../../services/auth.js";

/**
 * This middleware can take auth token from headers or from query parameter
 */
export default async (req, res, next) => {
  const loggerInstance = Container.get('loggerInstance');
  if (!req.headers.authorization && !req.query.auth) {
      return res.sendStatus(403);
  }
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    token = req.query.auth;
    console.log('using token from url', token)
  }
  try {
    const user = await verifyToken(token);
    // injection of user into request
    req.user = user;
    return next();
  } catch(err) {
    loggerInstance.error('🔥 error: %o', err);
    return res.sendStatus(403);
  }
}
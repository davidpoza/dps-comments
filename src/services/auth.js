import config from '../config/index.js';

// Verify Token validity and attach token data as request attribute
export const verifyToken = (req, res) => {
  jwt.verify(req.token, config.jwtSecret, (err, authData) => {
      if(err) {
          res.sendStatus(403);
      } else {
          return req.authData = authData;
      }
  })
};

// Issue Token
export const signToken = (req, res) => {
  jwt.sign({ userId: req.user._id }, config.jwtSecret, { expiresIn:'5 min' }, (err, token) => {
      if(err){
          res.sendStatus(500);
      } else {
          res.json({ token });
      }
  });
}
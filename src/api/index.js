import { Router } from 'express';


// own
import passport from './routes/passport.js';
import message from './routes/message.js';
import thread from './routes/thread.js';


export default () => {
  const app = Router();
  passport(app);
  message(app);
  thread(app);
  return app
}
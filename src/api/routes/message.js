import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import rateLimit from 'express-rate-limit';

import config from '../../config/index.js';
import middlewares from '../middlewares/index.js';

const apilimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  max: 10 // requests
});


const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');
  const messageService = Container.get('messageService');
  const sanitizeHtml = Container.get('sanitizeHtml');
  app.use('/messages', route);

  route.post('/',
    apilimiter,
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        threadUrl: Joi.string().required(),
        content: Joi.string().min(1).max(300).required(),
        parentId: Joi.number(),
      }),
    }),
    async (req, res, next) => {
      const {
        threadUrl,
        content,
        parentId,
       } = req.body;
      const userId = req.user?.id;
      try {
        const message = await messageService.create(
          {
            threadUrl,
            userId,
            content: sanitizeHtml(content, config.sanitizeHtmlConfig),
            parentId,
          }
        );
        if (!message) {
          return res.sendStatus(403);
        }
        res.status(201).json(message);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          return res.sendStatus(400);
        }
        return next(err);
      }
    });

  route.patch('/:id',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        content: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const { id } = req.params;
      const userId = req.user.id;
      const {
        content,
      } = req.body;
      try {
        const message = await messageService.updateById(id, userId,
          {
            content: sanitizeHtml(content, config.sanitizeHtmlConfig),
          }
        );
        if (!message) {
          res.sendStatus(404);
        }
        res.status(200).json(message);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    async (req, res, next) => {
      const { id } = req.params
      try {
        if (id) {
          const message = await messageService.findById(id);
          if (!message) {
            return res.sendStatus(404);
          }
          return res.status(200).json(message);
        }
        const { threadId } = req.query;
        const messages = await messageService.findAll({ threadId });
        if (messages) return res.status(200).json(messages);
        return res.sendStatus(404);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
  });

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const isAdmin = req.user.admin;
      if (!isAdmin) return res.sendStatus(403);
      try {
        if (!await messageService.deleteById(id)) {
          return res.sendStatus(404);
        }
        return res.sendStatus(204);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        console.log('ERRRR', err);
        return res.sendStatus(404);
      }
  });
};
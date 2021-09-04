import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');
  const threadService = Container.get('threadService');

  app.use('/threads', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        url: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {

      const {
        url,
       } = req.body;
      const isAdmin = req.user?.admin;
      if (!isAdmin) return res.sendStatus(403);
      try {
        const thread = await threadService.create({ url });
        if (!thread) {
          return res.sendStatus(403);
        }
        res.status(201).json(thread);
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
        url: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const { id } = req.params;
      const isAdmin = req.user.admin;
      if (!isAdmin) return res.sendStatus(403);
      const {
        url,
      } = req.body;
      try {
        const thread = await threadService.updateById(id,
          {
            url,
          }
        );
        if (!thread) {
          res.sendStatus(404);
        }
        res.status(200).json(thread);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  /**
   * @param {string} offset - applied over messages array, not threads one
   * @param {string} limit - applied over messages array, not threads one
   */
  route.get('/:id?',
    async (req, res, next) => {
      const { id } = req.params
      const { url, limit, offset } = req.query;
      let thread;
      try {
        if (id) {
          thread = await threadService.findById(id);
          if (!thread) {
            return res.sendStatus(404);
          }
          return res.status(200).json(await threadService.getTemplate(thread));
        } else if (url) {
          thread = await threadService.findByUrl({ url });
          if (!thread) {
            return res.sendStatus(404);
          }
          return res.status(200).json(await threadService.getTemplate(thread, limit, offset));
        }
        const threads = await threadService.findAll();
        return res.status(200).json(await Promise.all(threads.map(
          (t) => { return threadService.getTemplate(t); }
        )));
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
      const threadService = Container.get('threadService');
      if (!isAdmin) return res.sendStatus(403);
      try {
        if (!await threadService.deleteById(id)) {
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
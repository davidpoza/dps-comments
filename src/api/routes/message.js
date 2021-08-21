import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');
  const messageService = Container.get('messageService');
  app.use('/messages', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        threadId: Joi.number().required(),
        content: Joi.string().required(),
        parentId: Joi.number(),
      }),
    }),
    async (req, res, next) => {
      const {
        threadId,
        content,
        parentId,
       } = req.body;
      const userId = req.user?.id;
      try {
        const message = await messageService.create(
          {
            threadId,
            userId,
            content,
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
            content
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

  // // get totals for each tag of given transactions
  // route.get('/tags',
  // middlewares.isAuth,
  // async (req, res, next) => {
  //   const userId = req.user.id;
  //   const { accountId, from, to } = req.query;
  //   const transactionService = Container.get('transactionService');
  //   try {
  //     const transactions = await transactionService.calculateExpensesByTags({ accountId, userId, from, to });
  //     return res.status(200).json(transactions);
  //   } catch (err) {
  //     loggerInstance.error('🔥 error: %o', err);
  //     return next(err);
  //   }
  // });

  route.get('/:id?',
    async (req, res, next) => {
      const { id } = req.params
      const { url } = req.query;
      try {
        if (id) {
          const message = await messageService.findById(id);
          if (!message) {
            return res.sendStatus(404);
          }
          return res.status(200).json(message);
        }
        if (url) {
          const messages = await messageService.findAllInThread({ url });
          return res.status(200).json(messages);
        }
        return res.sendStatus(404);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
  });

  // route.delete('/:id',
  //   middlewares.isAuth,
  //   async (req, res, next) => {
  //     const { id } = req.params
  //     const userId = req.user.id;
  //     const transactionService = Container.get('transactionService');
  //     try {
  //       if (!await transactionService.deleteById(id, userId)) {
  //         return res.sendStatus(404);
  //       }
  //       return res.sendStatus(204);
  //     } catch (err) {
  //       loggerInstance.error('🔥 error: %o', err);
  //       console.log('ERRRR', err);
  //       return res.sendStatus(404);
  //     }
  // });
};
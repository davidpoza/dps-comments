import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';
import ThreadService from '../../services/thread.js';

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

  // route.patch('/:id',
  //   middlewares.isAuth,
  //   celebrate({
  //     body: Joi.object({
  //       accountId: Joi.number(),
  //       amount: Joi.number(),
  //       assCard: Joi.string(),
  //       balance: Joi.number(),
  //       comments: Joi.string(),
  //       currency: Joi.string(),
  //       date: Joi.string(),
  //       description: Joi.string(),
  //       emitterName: Joi.string(),
  //       favourite: Joi.boolean(),
  //       receipt: Joi.boolean(),
  //       receiverName: Joi.string(),
  //       tags: Joi.array().items(Joi.number()),
  //       valueDate: Joi.string(),
  //     }),
  //   }),
  //   async (req, res, next) => {
  //     const transactionService = Container.get('transactionService');
  //     const { id } = req.params;
  //     const userId = req.user.id;
  //     const {
  //       accountId,
  //       amount,
  //       assCard,
  //       balance,
  //       comments,
  //       date,
  //       description,
  //       emitterName,
  //       favourite,
  //       receiverName,
  //       tags,
  //       valueDate,
  //     } = req.body;
  //     try {
  //       const transaction = await transactionService.updateById(id, userId,
  //         {
  //           accountId,
  //           amount,
  //           assCard,
  //           balance,
  //           comments,
  //           date,
  //           description,
  //           emitterName,
  //           favourite,
  //           receiverName,
  //           tags,
  //           valueDate,
  //         }
  //       );
  //       if (!transaction) {
  //         res.sendStatus(404);
  //       }
  //       res.status(200).json(transaction);
  //     } catch (err) {
  //       loggerInstance.error('🔥 error: %o', err);
  //       return next(err);
  //     }
  //   });

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
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const { url } = req.query;
      let thread;
      try {
        if (id) {
          thread = await threadService.findById(id);
          if (!thread) {
            return res.sendStatus(404);
          }
          return res.status(200).json(await ThreadService.getTemplate(thread));
        } else if (url) {
          thread = await threadService.findByUrl(url);
          if (!thread) {
            return res.sendStatus(404);
          }
          return res.status(200).json(await ThreadService.getTemplate(thread));
        }
        const threads = await threadService.findAll();
        return res.status(200).json(await Promise.all(threads.map(
          (t) => { return ThreadService.getTemplate(t); }
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
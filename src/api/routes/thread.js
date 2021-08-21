import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/threads', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        url: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const threadService = Container.get('threadService');
      const {
        url,
       } = req.body;
      const userId = req.user?.id;
      try {
        const thread = await threadService.create(
          {
            url
          }
        );
        if (!thread) {
          res.sendStatus(403);
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

  // route.get('/:id?',
  //   middlewares.isAuth,
  //   async (req, res, next) => {
  //     const { id } = req.params
  //     const userId = req.user.id;
  //     const { accountId, tags, limit, sort, offset, from, to, search } = req.query;
  //     const tagsArray = tags ? tags.split(',').map((id) => parseInt(id, 10)) : undefined;
  //     const transactionService = Container.get('transactionService');
  //     try {
  //       if (id) {
  //         const transaction = await transactionService.findById({ id, userId });
  //         if (!transaction) {
  //           return res.sendStatus(404);
  //         }
  //         return res.status(200).json(transaction);
  //       }
  //       const transactions = await transactionService.findAll({ accountId, userId, tags: tagsArray, from, to, limit, offset, sort, search });
  //       return res.status(200).json(transactions);
  //     } catch (err) {
  //       loggerInstance.error('🔥 error: %o', err);
  //       return next(err);
  //     }
  // });

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
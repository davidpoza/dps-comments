import passportLoader from './passport.js';
import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import logger from './logger.js';
import MessageService from '../services/message.js';
import ThreadService from '../services/thread.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('🟢 Database loaded');

  diLoader({
    sequelize,
    logger,
    MessageService,
    ThreadService,
  });
  logger.info('🟢 Dependency injection loaded');

  await passportLoader();
  logger.info('🟢 Passport loaded');

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};
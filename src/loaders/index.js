import sanitizeHtml from 'sanitize-html';
import passportLoader from './passport.js';
import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import logger from './logger.js';
import WebhookService from '../services/webhook.js';
import MessageService from '../services/message.js';
import ThreadService from '../services/thread.js';
export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('🟢 Database loaded');

  diLoader({
    sanitizeHtml,
    sequelize,
    logger,
    MessageService,
    ThreadService,
    WebhookService,
  });
  logger.info('🟢 Dependency injection loaded');

  await passportLoader();
  logger.info('🟢 Passport loaded');

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};
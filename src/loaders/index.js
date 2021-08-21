import passportLoader from './passport.js';
import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import logger from './logger.js';
// import Scheduler from './scheduler.js';
// import AuthService from '../services/auth.js';
// import UserService from '../services/user.js';
// import TransactionService from '../services/transaction.js';
// import AccountService from '../services/account.js';
// import TagService from '../services/tag.js';
// import RuleService from '../services/rule.js';
// import RecurrentService from '../services/recurrent.js';
// import BudgetService from '../services/budget.js';
// import OpenbankImporter from '../services/importers/openbank.js';
// import AttachmentService from '../services/attachment.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('🟢 Database loaded');

  diLoader({
    sequelize,
    logger,
  });
  logger.info('🟢 Dependency injection loaded');

  await passportLoader();
  logger.info('🟢 Passport loaded');

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};
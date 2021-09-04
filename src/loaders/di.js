import { Container } from 'typedi';


export default ({
  sequelize,
  logger,
  MessageService,
  ThreadService,
  sanitizeHtml,
  WebhookService,
  BayesianFilterService,

}) => {
  // dependency order is important, services are dependant of sequelize and logger
  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');

  Container.set('bayesianFilterService', new BayesianFilterService());
  logger.info('💉 bayesianFilterService injected');

  Container.set('sanitizeHtml', sanitizeHtml);
  logger.info('💉 sanitizeHtml injected');

  Container.set('sequelizeInstance', sequelize);
  logger.info('💉 sequelizeInstance injected');

  Container.set('webhookService', new WebhookService());
  logger.info('💉 webhook service instance injected');

  Container.set('threadService', new ThreadService());
  logger.info('💉 thread service instance injected');

  Container.set('messageService', new MessageService());
  logger.info('💉 message service instance injected');

}
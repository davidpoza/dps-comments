import { Container } from 'typedi';
// import Config from '../config/index.js';


export default ({
  sequelize,
  logger,

}) => {
  // dependency order is important, services are dependant of sequelize and logger

  Container.set('sequelizeInstance', sequelize);
  logger.info('💉 sequelizeInstance injected');

  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');


}
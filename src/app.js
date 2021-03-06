import express from 'express';

// own
import config from './config/index.js';
import Logger from './loaders/logger.js';

async function startServer() {
  const app = express();
  const Loaders = await import('./loaders/index.js');
  Loaders.default({ expressApp: app });

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      # Api service listening on: ${config.port}          #
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();
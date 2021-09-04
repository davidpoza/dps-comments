import { Container } from 'typedi';
import natural from 'natural';
import { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const stateFilepath = `${__dirname}/../config/bayes_state.json`;

export default class BayesianFilterService {
  constructor() {
    let classifier;
    this.logger = Container.get('loggerInstance');
    if (fs.existsSync(stateFilepath)) {
      classifier = natural.BayesClassifier.restore(JSON.parse(fs.readFileSync(stateFilepath)));
      this.logger.info('Presaved state loaded from bayes_state.json on src/config directory');
    } else {
      this.logger.error('Bayesian filter service needs bayes_state.json on src/config directory');
      process.exit(1);
    }
    return classifier;
  }
};
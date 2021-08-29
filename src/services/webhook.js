import fetch from 'node-fetch';
import { Container } from 'typedi';
import config from '../config/index.js';

export default class WebhookService {
  constructor() {
    this.logger = Container.get('loggerInstance');
  }

  async sendMessage(text) {
    try {
      await fetch(`${config.commentPostWebhook}${encodeURI(text)}`);
    } catch (err) {
      this.logger.error(err);
    }
  }


};
import { Container } from 'typedi';
import MessageService from '../services/message.js';

export default class ThreadService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.threadModel = this.sequelize.models.threads;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.findByUrl = this.findByUrl.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  static async getTemplate(thread) {
    if (thread) {
      const messages = await thread.getMessages()

      return ({
        id: thread.id,
        url: thread.url,
        messages: await Promise.all(messages
          .filter((m) => m.parentId === null)
          .map((m) => {
            return MessageService.getTemplate(m)
          })
        ),
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      });
    }
    return null;
  }

  async create({
    url,
  }) {
    try {
      const thread = await this.threadModel.create(
        { url });
      return thread;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll() {
    const threads = await this.threadModel.findAll({  });
    return threads;
  }

  async findById(id) {
    const thread = await this.threadModel.findOne({ where: { id } });
    if (!thread) {
      return null;
    }
    return (thread);
  }

  async findByUrl(url) {
    const thread = await this.threadModel.findOne({ where: { url } });
    if (!thread) {
      return null;
    }
    return (thread);
  }

  async updateById(id, values) {
    const affectedRows = await this.threadModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  async deleteById(id) {
    const affectedRows = await this.threadModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Thread does not exist');
    }
  }
};
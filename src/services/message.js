import { Container } from 'typedi';

export default class MessageService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.messageModel = this.sequelize.models.messages;
  }

  getTemplate(message) {
    if (message) {
      return ({
        id: message.id,
        content: message.content,
        threadId: message.threadId,
        userId: message.userId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      });
    }
    return null;
  }

  async create({
    content,
    userId,
    threadId,
  }) {
    try {
      const message = await this.messageModel.create(
        { content, userId, threadId });
      return message;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll() {
    const messages = await this.messageModel.findAll({  });
    return messages.map((m) => {
      return (this.getTemplate(m));
    });
  }

  async findById(id) {
    const message = await this.messageModel.findOne({ where: { id } });
    if (!message) {
      return null;
    }
    return (this.getTemplate(message));
  }

  async updateById(id, values) {
    const affectedRows = await this.messageModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  async deleteById(id) {
    const affectedRows = await this.messageModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Message does not exist');
    }
  }
};
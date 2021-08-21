import { Container } from 'typedi';

export default class MessageService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.messageModel = this.sequelize.models.messages;
    this.threadService = Container.get('threadService');

  }

  // get only one level of responses
  async getTemplate(message) {
    if (message) {
      const responses = message.getResponses ? await message.getResponses() : [];
      return ({
        id: message.id,
        content: message.content,
        threadId: message.threadId,
        parentId: message.parentId,
        userId: message.userId,
        responses: await Promise.all(responses?.map(async (r) => {
          return await this.getTemplate(r.dataValues)
        })),
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
    parentId,
  }) {
    try {
      const message = await this.messageModel.create(
        { content, userId, threadId, parentId });
      return message;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAllInThread({ url }) {
    const thread = await this.threadService.findByUrl(url);
    if (!thread) return null;
    const messages = await this.messageModel.findAll({ where: { threadId: thread.id, parentId: null } });
    return await Promise.all(messages.map((m) => {
      return (this.getTemplate(m));
    }));
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
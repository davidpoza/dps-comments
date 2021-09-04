import { Container } from 'typedi';
import pickBy from 'lodash.pickby';
import { paragraphTags } from '../shared/utils.js';

export default class MessageService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.messageModel = this.sequelize.models.messages;
    this.threadService = Container.get('threadService');
    this.webhookService = Container.get('webhookService');
    this.bayesianFilterService = Container.get('bayesianFilterService');

    this.create = this.create.bind(this);
    this.findById = this.findById.bind(this);
    this.findAll = this.findAll.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);;
  }

  // get only one level of responses
  static async getTemplate(message) {
    if (message) {
      const user = message.getUser ? await message.getUser() : {};
      return ({
        id: message.id,
        content: paragraphTags(message.content),
        threadId: message.threadId,
        parentId: message.parentId,
        user,
        responses: message.responses,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      });
    }
    return null;
  }

  async create({
    content,
    userId,
    threadUrl,
    parentId,
  }) {
    try {
      let isSpam = false;
      const thread = await this.threadService.findByUrl({ url: threadUrl });
      if (!thread) throw new Error('thread does not exist');
      if (this.bayesianFilterService.classify(content) === 'spam') {
        await this.webhookService.sendMessage(`🐛Spam detected on: ${threadUrl}`);
        isSpam = true;
      }
      const message = await this.messageModel.create(
        { content, userId, threadId: thread.id, parentId, isSpam });
      if (!isSpam) await this.webhookService.sendMessage(`New comment on: ${threadUrl}`);
      return message;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll({ threadId, limit, offset }) {
    let filter = pickBy({ // pickBy (by default) removes undefined keys
      threadId,
      isSpam: false,
    });
    const messages = await this.messageModel.findAll(
      {
        include: [
          { model: this.sequelize.models.users, as: 'user', duplicating: false },
          {
            model: this.sequelize.models.messages, as: 'responses', duplicating: false,
            include: {
              model: this.sequelize.models.users
            },
          },
        ],
        limit,
        offset,
        where: filter,
        order: [ ['createdAt', 'DESC'] ]
      });

    return await Promise.all(messages.map((m) => {
      return MessageService.getTemplate(m);
    }));
  }

  async findById(id) {
    const message = await this.messageModel.findOne({ where: { id } });
    if (!message) {
      return null;
    }
    return (MessageService.getTemplate(message));
  }

  async updateById(id, userId, values) {
    const affectedRows = await this.messageModel.update(values, { where: { id, userId } });
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
    return true;
  }
};
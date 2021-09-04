import Sequelize from 'sequelize';

export const definition = [
  'messages',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: Sequelize.TEXT, allowNull: true },
    isSpam: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    threadId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'threads',
        key: 'id'
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    parentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      }
    },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE }
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};
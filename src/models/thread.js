import Sequelize from 'sequelize';

export const definition = [
  'threads',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE }
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};
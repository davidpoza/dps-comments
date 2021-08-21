// this file will define associations after all models have been defined.function applyExtraSetup(sequelize) {
export default function applyExtraSetup(sequelize) {
  const { users, messages, threads } = sequelize.models;

  messages.belongsTo(threads);
  threads.hasMany(messages);
  messages.belongsTo(messages, { foreignKey: 'parentId' });
  messages.hasMany(messages, { foreignKey: 'parentId', as: 'responses' });
  users.hasMany(messages);
  messages.belongsTo(users);
}
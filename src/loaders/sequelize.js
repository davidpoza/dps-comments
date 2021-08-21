import Sequelize from 'sequelize';

import config from '../config/index.js';
import applyExtraSetup from '../models/extra-setup.js';

import User from '../models/user.js';
import Message from '../models/message.js';
import Thread from '../models/thread.js';


let sequelize;
export default {
  newConnection: () => {
    sequelize = new Sequelize(config.db.dbname, config.db.username, config.db.password, config.db.params);

    const modelDefiners = [
      User,
      Message,
      Thread,
    ];
    // We define all models according to their files.
    for (const modelDefiner of modelDefiners) {
      modelDefiner(sequelize);
    }
    // We execute any extra setup after the models are defined, such as adding associations.
    applyExtraSetup(sequelize);

    sequelize
      .authenticate()
      .then(() => {
          console.log('Connection has been established successfully.');
      })
      .catch(err => {
          console.error('Unable to connect to the database:', err);
      });
    return sequelize;
  },
  getConnection: () => {
    return sequelize;
  }
}
import dotenv from 'dotenv';
const envFound = dotenv.config();

import sequelizeLoader from '../src/loaders/sequelize.js';
import { definition as userDefinition } from '../src/models/user.js';
import { definition as threadDefinition } from '../src/models/thread.js';
import { definition as messageDefinition } from '../src/models/message.js';

const sequelize = sequelizeLoader.newConnection();
const queryInterface = sequelize.getQueryInterface();

queryInterface.dropTable('users');
queryInterface.dropTable('threads');
queryInterface.dropTable('messages');

queryInterface.createTable(...userDefinition);
queryInterface.createTable(...threadDefinition);
queryInterface.createTable(...messageDefinition);

import chalk from 'chalk';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Import environment variables
import {
  DATABASE_NAME,
  SQL_DIALECT,
  SQL_HOSTNAME,
  SQL_PASSWORD,
  SQL_USERNAME,
} from '../constants/env';

const sequelizeOptions = {
  dialect: SQL_DIALECT as Dialect,
  models: [], // Add your models here
  logging: (sql): void => {
    console.log(
      chalk.yellow('[ db ]'),
      sql,
      chalk.blue('at'),
      chalk.magenta(new Date().toLocaleTimeString()),
    );
  },
};

// Add connection options for dialects other than SQLite
if (SQL_DIALECT !== 'sqlite') {
  Object.assign(sequelizeOptions, {
    host: SQL_HOSTNAME,
    username: SQL_USERNAME,
    password: SQL_PASSWORD,
    database: DATABASE_NAME,
  });
} else {
  // For SQLite, specify the storage path for the database
  Object.assign(sequelizeOptions, {
    storage: DATABASE_NAME,
  });
}

// Initialize Sequelize
const connection = new Sequelize(sequelizeOptions);

// Export the connection for use in other parts of your app
export { connection };

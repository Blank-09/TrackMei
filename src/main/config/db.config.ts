import chalk from 'chalk'

import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

// Models
// import { User } from '../models/user';
// import { BlacklistedToken } from '../models/BlacklistedToken';
// import { cleanupExpiredTokens } from '../utils/tokens';

import {
  DATABASE_NAME,
  SQL_DIALECT,
  SQL_HOSTNAME,
  SQL_PASSWORD,
  SQL_USERNAME,
} from '../constants/env'

const connection = new Sequelize({
  dialect: SQL_DIALECT as Dialect,
  host: SQL_HOSTNAME,
  username: SQL_USERNAME,
  password: SQL_PASSWORD,
  database: DATABASE_NAME,
  models: [],
  logging: (sql): void => {
    console.log(
      chalk.yellow('[ mssql ]'),
      sql,
      chalk.blue('at'),
      chalk.magenta(new Date().toLocaleTimeString()),
    )
  },
})

// clean up blacklist
// setTimeout(cleanupExpiredTokens, ms('1h'));

export { connection }

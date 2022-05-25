const { Sequelize } = require('sequelize');

const db = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  database: process.env.DB,
  dialect: 'postgres',
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
});

module.exports = { db };

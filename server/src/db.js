// server/src/db.js
const { Sequelize } = require('sequelize');

const isProd = !!process.env.DATABASE_URL;

const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }, // Neon exige SSL
      },
    })
  : new Sequelize(
      process.env.DB_NAME || 'portfolio_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );

module.exports = sequelize;

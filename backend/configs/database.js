const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

const connection = new Sequelize(process.env.BD_post_uri, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Для использования SSL
      rejectUnauthorized: false, // Если ты уверен в безопасности
    },
  },
  logging: false,
});

module.exports = connection;
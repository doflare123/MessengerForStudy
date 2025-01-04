const { Sequelize } = require('sequelize');

const connection = new Sequelize('MessengerUsers', 'password', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = connection;
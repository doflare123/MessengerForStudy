const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

const connection = new Sequelize(process.env.BD_post_namebd, process.env.BD_post_username, process.env.BD_post_pswd , {
    host: process.env.BD_post_adress,
    dialect: 'postgres'
});

module.exports = connection;
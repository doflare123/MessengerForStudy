const { DataTypes } = require('sequelize');
const connection = require('../configs/database');

const User = connection.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar:{
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "https://res.cloudinary.com/dntadqnty/image/upload/v1745007935/bgAva_hlxfka.jpg"
    },
}, {
    tableName: 'users',
    timestamps: true,
});
connection.sync({ alter: true })


module.exports = User;

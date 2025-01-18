const { DataTypes } = require('sequelize');
const connection = require('../database');


const Session = connection.define('Sessions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true, 
      },
    SessionId: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    CodeConfirm: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
}, {
    tableName: 'sessions',
    timestamps: false,
  });

module.exports = Session;
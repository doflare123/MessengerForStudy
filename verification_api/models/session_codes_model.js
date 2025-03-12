const { DataTypes } = require('sequelize');
const connection = require('../database');

const SessionCodes = connection.define('SessionCodes', {
    id:{
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
    TypeSession:{ // false - не региcтрация
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    Attempts:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
}, {
    tableName: 'SessionCodes',
    timestamps: false,
  });

module.exports = SessionCodes;
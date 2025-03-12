const { DataTypes } = require('sequelize');
const connection = require('../database');


const SessionPass = connection.define('SessionsPass',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true, 
      },
    SessionId: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    Validation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ExpiresAt: { 
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 10 * 60 * 1000),
    },
}, {
    tableName: 'SessionsPass',
    timestamps: false,
  });

module.exports = SessionPass;
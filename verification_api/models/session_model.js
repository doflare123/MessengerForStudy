const { DataTypes } = require('sequelize');
const connection = require('../database');

const Session = connection.define('Session', {
  SessionId: { 
    type: DataTypes.STRING, 
    allowNull: false,
    primaryKey: true, 
  },
  Type: { 
    type: DataTypes.ENUM('reg', 'chng'), 
    allowNull: false 
  },
  Verified: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => new Date(Date.now() + 10 * 60 * 1000),
  },
}, {
  tableName: 'Sessions',
  timestamps: false,
});

module.exports = Session;

const { DataTypes } = require('sequelize');
const connection = require('../database');
const Session = require('./session_model');

const SessionCodes = connection.define('SessionCodes', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  SessionId: { 
    type: DataTypes.STRING, 
    allowNull: false,
    references: {
      model: 'Sessions',  
      key: 'SessionId',  
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  CodeConfirm: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  Attempts: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, {
  tableName: 'SessionCodes',
  timestamps: false,
});

// Устанавливаем связь между моделями
Session.hasOne(SessionCodes, {
  foreignKey: 'SessionId',  // Это поле в SessionCodes будет foreign key
  sourceKey: 'SessionId',  // Это поле в Session — source key
  onDelete: 'CASCADE',
});
SessionCodes.belongsTo(Session, {
  foreignKey: 'SessionId',  // Указываем, что это внешний ключ
  targetKey: 'SessionId',  // Это поле в Session — target key
});

module.exports = SessionCodes;
const { DataTypes } = require('sequelize');
const connection = require('../configs/database');
const User = require('./users');

const Contact = connection.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true, 
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id', 
      },
      allowNull: false, 
    },
    contact_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User, 
        key: 'id', 
      },
      allowNull: false, 
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
      allowNull: false,
    },
  }, {
    tableName: 'contacts',
    timestamps: false,
  });

User.hasMany(Contact, { foreignKey: 'user_id' });
User.hasMany(Contact, { foreignKey: 'contact_id' });
Contact.belongsTo(User, { foreignKey: 'user_id' });
Contact.belongsTo(User, { foreignKey: 'contact_id' });

module.exports = Contact;
const { DataTypes } = require('sequelize');

const { db } = require('../utils/database');

const Repair = db.define('repair', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  computerNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = { Repair };

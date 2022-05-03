// models
const { Repair } = require('../models/repairs.model');
const { User } = require('../models/user.model');

const initModels = () => {
  User.hasMany(Repair);
  Repair.belongsTo(User);
};
module.exports = { initModels };

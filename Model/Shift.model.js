const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Shift = sequelize.define("shift", {
  tenant: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  primaryId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gradeTenant: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gradePrimaryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  del: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Shift;


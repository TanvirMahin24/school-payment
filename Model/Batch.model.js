const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Batch = sequelize.define("batch", {
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
  year: {
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
  shiftTenant: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shiftPrimaryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  del: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Batch;


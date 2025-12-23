const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Payment = sequelize.define("payment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  month: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tenant: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  meta: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  extra_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  total_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  gradeTenant: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  gradePrimaryId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  shiftTenant: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  shiftPrimaryId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  batchTenant: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  batchPrimaryId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = Payment;

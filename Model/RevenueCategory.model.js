const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const RevenueCategory = sequelize.define("revenue_category", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tenant: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = RevenueCategory;



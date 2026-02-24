const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const CombinedRevenue = sequelize.define("combined_revenue", {
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
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = CombinedRevenue;

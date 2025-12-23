const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Grade = sequelize.define("grade", {
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
  del: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Grade;


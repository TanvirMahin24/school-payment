const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const User = sequelize.define("user", {
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

  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  school: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  coaching: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  primary: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  can_view_combined_school_primary_report: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = User;


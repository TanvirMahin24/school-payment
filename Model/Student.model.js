const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Student = sequelize.define("student", {
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
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  father: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  mother: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  blood: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  del: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

module.exports = Student;







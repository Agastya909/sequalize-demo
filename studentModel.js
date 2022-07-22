const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./sequalize");

const studentModel = sequelize.define("Student", {
  UniqueID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = studentModel;

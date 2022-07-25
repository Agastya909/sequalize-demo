const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./sequalize");

const studentModel = sequelize.define(
  "Student",
  {
    UniqueID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      // type: DataTypes.STRING,
      type: DataTypes.BLOB("medium"),
    },
    Age: {
      type: DataTypes.INTEGER,
    },
    Email: {
      type: DataTypes.BLOB("medium"),
      // type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = studentModel;

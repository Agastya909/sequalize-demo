const Sequelize = require("sequelize");

const connection = new Sequelize("test", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;

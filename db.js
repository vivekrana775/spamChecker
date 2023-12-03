const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("spam_detect", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectToDb };

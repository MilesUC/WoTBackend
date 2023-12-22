const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/getSequelizeConnection");
const initModels = require("../models/initModels");

initModels(sequelize);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { connectDB, sequelize, Sequelize, DataTypes, Model };
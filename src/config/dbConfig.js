const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "capstone_development",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DRIVER || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "capstone_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DRIVER || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER || "mysql",
    port: process.env.DB_PORT,
  }
}

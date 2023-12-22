const { Sequelize } = require("sequelize");
const { development, test, production } = require("../config/dbConfig");
let entorno_db = process.env.DEBUG ? development : production;


// NO BORRAR SI SE VAN A HACER TESTS
// CADA VEZ QUE SE CORREN LOS TESTS SE REINICIA LA DB DE LOS TESTS
if (process.env.NODE_ENV === "test") {
  entorno_db = test;
}

const db = entorno_db;

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
  port: db.port,
  logging: false,
});

module.exports = sequelize;

'use strict';

const csvParser = require("csv-parser");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const Community = require("../models/community");
const sequelize = require("../utils/getSequelizeConnection");

Community.initModel(sequelize);

module.exports = {
  async up (queryInterface, Sequelize) {
    await pipeline(
      fs.createReadStream("src/data/bd-comunidades.csv"),
      csvParser(),
      async function* (source) {
        for await (const chunk of source) {
          await Community.findOrCreate({
            where: {
              name: chunk.name,
              description: chunk.description,
            },
          });
        }
      }
    );
    return;
  },

  async down (queryInterface, Sequelize) {
    await Community.destroy({ where: {} });
    return;
  }
};

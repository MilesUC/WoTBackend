const Region = require("../models/Region");
const JSONAPISerializer = require("jsonapi-serializer").Serializer;

const RegionSerializer = new JSONAPISerializer("regions", {
  attributes: ["id", "nombre"],
});

const RegionCotroller = {
  async getRegions(req, res) {
    const regions = await Region.findAll({
      attributes: ["id", "nombre"],
    });
  
    res.status(200);
    res.json(RegionSerializer.serialize(regions));
  },
};

module.exports = RegionCotroller;
const Idioma = require("../models/Idioma");
const JSONAPISerializer = require("jsonapi-serializer").Serializer;

const IdiomaSerializer = new JSONAPISerializer("idiomas", {
  attributes: ["id", "nombre"],
});

const LanguageController = {
    async getLanguage(req, res) {
        const languages = await Idioma.findAll({
            attributes: ["id", "nombre"],
        });
        
        res.status(200);
        res.json(IdiomaSerializer.serialize(languages));
    },
};

module.exports = LanguageController;
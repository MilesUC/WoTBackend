const Usuaria = require("../models/Usuaria");
const usuariaController = require("../controllers/usuaria.controller");

async function verifyFullProfile(req, res, next) {

    const usuariaId = req.cognitoUserId;

    if(!usuariaId) {
      let error = new Error(`Unauthorized`);
      error.statusCode = 401;
      throw error;
    }

    const params = await usuariaController.getUser(req, res, next, usuariaId);
    const usuaria = await Usuaria.findOne(params);

    // const usuaria = await Usuaria.findByPk(usuariaId);
    
    const optionalAttributes = [
      "postgrado",
      "empresa_adicional",
      "aditionalCargo",
      "aditionalIndustria",
      "nombrePuebloOriginario",
      "regionCompromiso",
      "idiomas",
      "factor",
      "contactos_verificacion",
      "regionActualDomicilio",
    ];

    const attributes = Object.keys(usuaria.dataValues);
    let profileIsIncomplete = false;
    const emptyAttributes = [];

    attributes.forEach((attribute) => {
    //   console.log(`\n${attribute} -- ${usuaria.dataValues[attribute]}`);
      if (usuaria[attribute] === null || usuaria[attribute] === '' || (Array.isArray(usuaria[attribute]) && usuaria[attribute].length === 0)) {
        if (!optionalAttributes.includes(attribute)){
          profileIsIncomplete = true;
          emptyAttributes.push(attribute);
        }
      }
    });

    if (profileIsIncomplete) {
      return true
    //   return res.status(401).json({ error: `Unauthorized, profile has not been fully set up` });
    }
    return false
}

module.exports = verifyFullProfile;
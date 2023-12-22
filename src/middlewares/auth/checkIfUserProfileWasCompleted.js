const Usuaria = require("../../models/Usuaria");
const usuariaController = require("../../controllers/usuaria.controller");

async function checkIfUserProfileWasCompleted(req, res, next) {
  try{
    const usuariaId = req.cognitoUserId;

    if(!usuariaId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const params = await usuariaController.getUser(req, res, next, usuariaId);
    const usuaria = await Usuaria.findOne(params);

    // const usuaria = await Usuaria.findByPk(usuariaId);
    
    if(!usuaria) {
        return res.status(401).json({ error: "Unauthorized, user not found" });
    }
    
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
    //   console.log(`\n${attribute}`);
      if (usuaria[attribute] === null || usuaria[attribute] === '' || (Array.isArray(usuaria[attribute]) && usuaria[attribute].length === 0)) {
        if (!optionalAttributes.includes(attribute)){
          profileIsIncomplete = true;
          emptyAttributes.push(attribute);
        }
      }
    });

    if (profileIsIncomplete) {
      return res.status(401).json({ error: `Unauthorized, profile has not been fully set up, missing attributes: ${emptyAttributes}` });
    //   return res.status(401).json({ error: `Unauthorized, profile has not been fully set up` });
    } else {
      // Proceder a siguiente middleware si se verifico que el perfil está completo
      next();
    }
  } catch (error) {
    console.error("Error validating profile completion: ", error);
    return res.status(401).json({ error: error.message });
  }
}

module.exports = checkIfUserProfileWasCompleted;
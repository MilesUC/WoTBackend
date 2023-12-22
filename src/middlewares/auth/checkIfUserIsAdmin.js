const Rol = require("../../models/Rol");
const UsuariaAdmin = require("../../models/usuariaadmin"); // Import the Usuaria model
const verifyAndDecodeJWT = require("../../utils/verifyAndDecodeCognitoJWT");

async function checkIfUserisAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let cognitoUserId =
      req.requestContext?.authorizer?.claims["cognito:username"] ||
      (await verifyAndDecodeJWT(token)).username;

    console.log("cognitoUserId: ", cognitoUserId);
    const existingUsuaria = await UsuariaAdmin.findByPk(cognitoUserId, {
      include: { model: Rol, as: "rol" },
    });

    console.log("existingUsuaria: ", existingUsuaria);

    if (!existingUsuaria) {
      return res.status(404).json({ error: "Admin user doesn't exist" });
    }

    if (existingUsuaria.rol.nombre !== "admin") {
      return res.status(409).json({
        error: "User doesn't have the role to see this resource",
      });
    }

    next(); // User role does not exist, proceed to the next middleware/controller
  } catch (error) {
    console.error("Error checking user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = checkIfUserisAdmin;

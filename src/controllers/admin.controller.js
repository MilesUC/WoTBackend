const UsuariaAdmin = require("../models/usuariaadmin");

const Rol = require("../models/Rol");

const { initiateAuth } = require("../utils/cognitoUtils");

const userSerializer = require("../utils/serializers/users");

const AdminController = {
  async login(req, res) {
    const { email, password } = req.body;
  
    try {
      const response = await initiateAuth(email, password);
  
      const user = await UsuariaAdmin.findOne({
        where: { mail: email },
        include: [
          {
            model: Rol,
            as: "rol",
            attributes: ["id", "nombre"],
          },
        ],
      });
  
      if (user.rol.nombre !== "admin") {
        return res.status(401).json({
          error: "User isn't an admin user",
        });
      }
  
      const serializedUser = userSerializer([
        "nombre",
        "apellido",
        "mail",
        "celular",
        "rut",
        "rol",
      ]).serialize(user);
  
      return res.status(201).json({
        status: 201,
        message: "User logged successfully!",
        token: response.AuthenticationResult.AccessToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        user: serializedUser,
      });
    } catch (error) {
      console.error("Error login user:", error);
      res.status(401).json({
        errors: [
          {
            status: "401",
            title: "Error login user",
            error: error.message,
          },
        ],
      });
    }
  },
};

module.exports = AdminController;
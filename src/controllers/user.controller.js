const UsuariaAdmin = require("../models/usuariaadmin");
const { adminCreateUser, adminSetPassword } = require("../utils/cognitoUtils");

const UserController = {
  
  async adminCreateUser(req, res) {
    // get data from request body
    const {
      nombre,
      password,
      email,
      rut,
      id_rol
    } = req.body;

    try {
      console.log("Here!");
      const response = await adminCreateUser(nombre, email, password);
      const { User: cognitoUser } = response;

      // Set a permanent password for the user
      await adminSetPassword(email, password);

      const user = await UsuariaAdmin.create({
        id: cognitoUser.Username,
        nombre: nombre,
        rut: rut,
        password: password,
        mail: email,
        rut: rut,
        id_rol: id_rol
      });
      return res.status(201).json({
        status: 201,
        message: "User created successfully!",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(400).json({
        status: 400,
        message: "Error creating user",
        details: error.message,
      });
    }
  },

  async updateUser(req, res) {
    const {
      nombre,
      password,
      email,
      rut,
      id_rol
    } = req.body;

    try {
      const user = await UsuariaAdmin.findOne({
        where: {
          mail: email,
        },
      });
      console.log("User", cognitoUser.username);

      await user.update({
        id: cognitoUser.username,
        nombre: nombre,
        rut: rut,
        password: password,
        mail: email,
        rut: rut,
        id_rol: id_rol
      });
      return res.status(200).json({
        status: 200,
        message: "User updated successfully!",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({
        status: 400,
        message: "Error updating user",
        details: error.message,
      });
    }
  },
}

module.exports = UserController
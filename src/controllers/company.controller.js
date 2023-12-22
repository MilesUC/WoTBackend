// Define the serializer configuration

const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");

const Usuaria = require('../models/Usuaria');
const UsuariosEmpresa = require('../models/UsuariosEmpresa');
const Busqueda = require('../models/Busqueda');
const Empresa = require('../models/Empresa');
const Rol = require('../models/Rol');
const Industria = require('../models/Industria');
const Fundacion = require('../models/Fundacion');
const IngresoAnual = require('../models/IngresoAnual');
const Region = require('../models/Region');
const {
  initiateAuth,
  adminSetPassword,
  adminCreateUser,
  adminDeleteUser,
} = require('../utils/cognitoUtils');

// const userSerializer = require('../utils/serializers/users');

exports.register = async (req, res) => {
  const {
    email,
    user_name,
    cargo_usuario,
    password,
    company_rut,
    company_name,
    id_industria,
    id_fundacion,
    id_ingreso_anual,
    id_cantidad_emplado,
    valoresEmpresa,
    politicaESG,
    indicadoresImpacto,
    empresa_b,
    id_region,
    declaracion,
  } = req.body;

  try {
    const company = await Empresa.create({
      rut: company_rut,
      nombre: company_name,
      id_industria,
      id_fundacion,
      id_ingreso_anual,
      id_cantidad_emplado,
      valoresEmpresa,
      politicaESG,
      indicadoresImpacto,
      empresa_b,
      id_region,
      declaracion,
    });

    // Set a permanent password for the user
    const response = await adminCreateUser(user_name, email, password);
    const { User: cognitoUser } = response;

    await adminSetPassword(email, password);

    console.log('User created successfully:', response);

    const user = await UsuariosEmpresa.create({ //aca se tiene que cambiar que se meta a contactos emoresa
      id:  cognitoUser.Username,
      id_empresa: company.id,
      user_name,
      user_email: email,
      user_cargo: cargo_usuario
    });

    user.setEmpresa(company);

    const role = await Rol.findOne({ where: { nombre: 'company' } });
    user.setRol(role);
    res.status(201).json({
      status: 201,
      message: 'User created successfully!',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      status: 400,
      message: 'Error creating user',
      details: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userAttributes = ['id', 'user_name', 'user_email', 'user_cargo'];

    const user = await UsuariosEmpresa.findOne({ //cambiar a tabla de contacto de empresa
      where: { user_email: email },
      include: [
        {
          model: Empresa,
          as: 'empresa',
          attributes: ['id', 'nombre', 'rut', 'activo'],
        },
        {
          model: Rol,
          as: 'rol',
          attributes: ['id', 'nombre'],
        },
      ],
      attributes: userAttributes,
    });

    if (!user) {
      return res.status(401).json({
        error: 'Email o contraseña incorrectos',
      });
    }

    if (!user.empresa) {
      return res.status(401).json({
        error: 'Usuario no es un usuario de ninguna compañia',
      });
    }

    const response = await initiateAuth(email, password);

    if (response.error) {
      return res.status(401).json({
        error: 'Email or password is incorrect',
      });
    }

    // if (!user.empresa.activo) {
    //   return res.status(401).json({
    //     error: "Company isn't active, please contact the administrator",
    //   });
    // }

    const serializedUser = userSerializer([
      ...userAttributes,
      'empresa',
      'rol',
    ]).serialize(user);

    return res.status(201).json({
      status: 201,
      message: 'Usuario logueado correctamente!',
      token: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      user: serializedUser,
    });
  } catch (error) {
    console.error('Error en login. Porfavor intente más tarde', error);
    return res.status(407).json({
      error: error.message,
    });
  }
};

exports.activeDeactive = async (req, res) => {
  // get the active boolean and rut
  const { active, id } = req.body;

  try {
    const company = await Empresa.findOne({ where: { id } });

    if (!company) {
      return res.status(404).json({
        status: 404,
        message: 'Company not found',
      });
    }

    // update the active boolean
    company.activo = active;

    // save the company
    await company.save();
    //
    res.status(201).json({
      status: 201,
      message: `Company ${active ? 'activated' : 'deactivated'} successfully!`,
      company: company,
    });
  } catch (error) {
    console.error('Error active/deactive company:', error);
    res.status(400).json({
      status: 400,
      message: `Error active/deactive company`,
      details: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  const { id } = req;
  const userAttributes = ['id', 'nombre', 'apellido', 'mail', 'celular', 'rut'];
  const users = await UsuariosEmpresa.findAll({ //cambiar a tabla de contacto de empresa
    attributes: userAttributes,
    include: {
      model: Empresa,
      as: 'empresa',
      required: true,
      where: { id },
      attributes: [],
    },
  });
  const serializedUsers = userSerializer(userAttributes).serialize(users);

  return res.status(200).json({
    users: serializedUsers,
  });
};

exports.getCompany = async (req, res) => {
  const { id } = req;

  const company = await Empresa.findByPk(id, {
    include: [
      {
        model: Industria,
        as: 'industria',
      },
      {
        model: Fundacion,
        as: 'fundacion',
      },
      {
        model: IngresoAnual,
        as: 'ingresoAnual',
      },
      {
        model: Region,
        as: 'region',
      },
    ],
  });
  console.log(company);
  return res.status(200).json({empresa: company});
};


exports.getCompanyAdmin = async (req, res) => {
  const { id } = req.params;

  const company = await Empresa.findByPk(id, {
    include: [
      {
        model: Industria,
        as: 'industria',
      },
      {
        model: Fundacion,
        as: 'fundacion',
      },
      {
        model: IngresoAnual,
        as: 'ingresoAnual',
      },
      {
        model: Region,
        as: 'region',
      },
    ],
  });
  console.log(company);
  return res.status(200).json({empresa: company});
};


exports.updateCompany = async (req, res) => {
  const {
    company_name,
    company_rut,
    id_industria,
    id_fundacion,
    id_ingreso_anual,
    id_cantidad_emplado,
    valoresEmpresa,
    politicaESG,
    indicadoresImpacto,
    empresa_b,
    id_region,
    declaracion,
  } = req.body;

  const { id } = req;
  const company = await Empresa.findByPk(id);

  if (company) {
    const updatedFields = {
      nombre: company_name,
      rut: company_rut,
      id_industria,
      id_fundacion,
      id_ingreso_anual,
      id_cantidad_emplado,
      valoresEmpresa,
      politicaESG,
      indicadoresImpacto,
      empresa_b,
      id_region,
      declaracion,
    };

    Object.entries(updatedFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        company[key] = value;
      }
    });

    await company.save();
  }

  return res.status(200).json({
    message: 'Empresa actualizada',
    company: company,
  });
};

exports.removeUsers = async (req, res) => {
  const { users, id } = req.body;

  try {
    for (let userData of users) {
      const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: userData.email,
      };
      try {
        await UsuariosEmpresa.destroy({ where: { mail: userData.email } }); //cambiar a tabla de contacto de empresa

        await adminDeleteUser(userData.email);
        console.log('user deleted successfully from cognito');
      } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send('Error deleting user');
      }
    }
    return res.status(200).json({
      message: 'Users deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting users:', error);
    return res.status(400).json({
      status: 400,
      message: 'Error deleting users',
      details: error.message,
    });
  }
};

exports.addUsers = async (req, res) => {
  const { users, id } = req.body;
  try {
    for (let userData of users) {
      const company = await Empresa.findByPk(id);
      const response = await adminCreateUser(
        userData.user_name,
        userData.user_email,
        userData.password,
      );
      console.log('User created successfully:', response);
      const { User: cognitoUser } = response;
      const username = userData.user_email
      // Set a permanent password for the user
      await adminSetPassword(username, userData.password);

      const user = await UsuariosEmpresa.create({ //cambiar a tabla de contacto de empresa
        id_empresa: id,
        user_name: userData.user_name,
        user_email: userData.user_email,
        user_cargo: userData.cargo_usuario
      });

      user.setEmpresa(company);

      const role = await Rol.findOne({ where: { nombre: 'company' } });
      user.setRol(role);
    }

    return res.status(201).json({
      status: 201,
      message: 'Users created successfully!',
    });
  } catch (error) {
    console.error('Error creating users:', error);
    return res.status(400).json({
      status: 400,
      message: 'Error creating users',
      details: error.message,
    });
  }
};

exports.getBusquedasPorEmpresa = async (req, res) => {
  const { rut } = req.params;
  const busquedas = await Busqueda.findAll({
    include: [
      {
        model: Empresa,
        where: { rut: rut },
      },
    ],
  });

  if (busquedas.length === 0) {
    return res
      .status(404)
      .json({ message: 'No se encontraron búsquedas para esta empresa' });
  }

  return res.status(200).json({
    busquedas: busquedas,
  });
};

exports.newBusqueda = async (req, res) => {
  const {
    rutEmpresa,
    cargo,
    jornada,
    horasRequeridas,
    modalidad,
    areaEspecifica,
    area,
    regionEspecifica,
    region,
    cargoFlexible,
    necesidadViaje,
    profesionEspecifica,
    profesion,
    postgrado,
    aniosExperiencia,
    areasExperiencia,
    sectorIndustriaEspecifica,
    industriaPreferencia,
    competencias,
    dominioIdiomas,
    experienviaDirectorios,
    altaDireccion,
  } = req.body;

  try {
    const busqueda = await Busqueda.create({
      rutEmpresa,
      cargo,
      jornada,
      horasRequeridas,
      modalidad,
      areaEspecifica,
      area,
      regionEspecifica,
      region,
      cargoFlexible,
      necesidadViaje,
      profesionEspecifica,
      profesion,
      postgrado,
      aniosExperiencia,
      areasExperiencia,
      sectorIndustriaEspecifica,
      industriaPreferencia,
      competencias,
      dominioIdiomas,
      experienviaDirectorios,
      altaDireccion,
    });
  } catch (error) {
    console.error('Error creating busqueda', error);
    return res.status(400).json({
      status: 400,
      message: 'Error creating busqueda',
      details: error.message,
    });
  }
};

exports.getAllEmpresas = async (req, res) => {
  try {
    // Realizar la consulta para obtener todas las compañías
    const empresas = await Empresa.findAll();

    // Devolver las compañías en la respuesta
    return res.status(200).json({
      empresas: empresas,
    });
  } catch (error) {
    console.error('Error getting all empresas', error);
    return res.status(500).json({
      status: 500,
      message: 'Error getting all empresas',
      details: error.message,
    });
  }
};

exports.findEmpresasByName = asyncHandler(async (req, res, next) => {
  const nombre = req.body.nombre;
  
  const companies = await Empresa.findAll({
    where: { 
      nombre: { [Op.like]: `%${nombre}%` },
      activo: true
    },
    include: [
      {
        model: Industria,
        as: 'industria',
        attributes: ["id", "nombre_industria"],
      },
      {
        model: Fundacion,
        as: 'fundacion',
        attributes: ["id", "rango_anios_desde", "rango_anios_hasta"],
      },
      {
        model: Region,
        as: 'region',
        attributes: ["id", "nombre", "numero"],
      },
    ],
    attributes: ["id", "nombre", "valoresEmpresa"]
  });
  return res.status(200).json(companies);
});

exports.getCompanyForUsuaria = async (req, res, next) => {
    try {
      const companyId = req.params.companyId;

      if (!companyId) {
        let error = new Error("Missing companyId.");
        error.statusCode = 400;
        throw error;
      }
      
      const company = await Empresa.findByPk(companyId, {
        attributes: ["nombre", "valoresEmpresa", "activo"],
        include: [
          {
            model: Industria,
            as: 'industria',
            attributes: ["id", "nombre_industria"],
          },
          {
            model: Region,
            as: 'region',
            attributes: ["id", "nombre", "numero"],
          },
        ],
      });
    
      if (!company) {
        let error = new Error("Company not found.");
        error.statusCode = 404;
        throw error;
      }

      // Caso compañia desactivada
      if (!company.activo) {
        let error = new Error("Company not found.");
        error.statusCode = 404;
        throw error;
      }
      delete company.dataValues.activo;
      return res.status(200).json({empresa: company});
    } catch(error) {
      next(error);
    }
  };
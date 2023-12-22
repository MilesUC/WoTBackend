const { Model, DataTypes,  UUIDV4 } = require("sequelize");

  class UsuariaAdmin extends Model {
    static initModel(sequelize) {
      UsuariaAdmin.init(
        {
          id: {
            type: DataTypes.STRING,
            defaultValue: UUIDV4,
            primaryKey: true,
            // autoIncrement: true,
            allowNull: false,
          },
          rut:{
            type: DataTypes.STRING,
          }, 
        
          nombre: {
            type: DataTypes.STRING,
          },
          mail: {
            type: DataTypes.STRING,
          },
          id_rol: 
          {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
              model: "roles",
              key: "id",
            },
          }
        }, {
          sequelize,
          tableName: 'usuaria_admins',
          modelName: 'UsuariaAdmin',
        });
    return UsuariaAdmin;
  }
}
module.exports = UsuariaAdmin;

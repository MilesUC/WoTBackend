const { Model, DataTypes,  UUIDV4 } = require("sequelize");

class UsuariosEmpresa extends Model {
  static initModel(sequelize) {
    UsuariosEmpresa.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: UUIDV4,
          primaryKey: true,
          // autoIncrement: true,
          allowNull: false,
        },
        // FK
        id_empresa: {
          type: DataTypes.INTEGER,
          references: {
            model: "empresas",
            key: "id",
          },
        },
        // FK
        user_name: {
          type: DataTypes.STRING,
        },
        user_email: {
          type: DataTypes.STRING,
        },
        user_cargo: {
          type: DataTypes.STRING,
        },
        id_rol: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "roles",
            key: "id",
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          field: "created_at", // Specify column name as "createdAt"
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at", // Specify column name as "updatedAt"
        },
      },
      {
        sequelize,
        modelName: "UsuariosEmpresa",
        tableName: "usuarios_empresas",
        timestamps: true,
      }
    );

    return UsuariosEmpresa;
  }
}

module.exports = UsuariosEmpresa;

const { Model, DataTypes } = require("sequelize");

class UsuariasIndustria extends Model {
  static initModel(sequelize) {
    UsuariasIndustria.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // FK
        idUsuaria: {
          type: DataTypes.STRING,
          field: "id_usuaria",
          references: {
            model: "Usuaria",
            key: "id",
          },
        },
        // FK
        idIndustria: {
          type: DataTypes.INTEGER,
          field: "id_industria",
          references: {
            model: "Industria",
            key: "id",
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at",
        },
      },
      {
        sequelize,
        modelName: "UsuariasIndustria",
        tableName: "industrias_usuarias",
        timestamps: true,
      }
    );

    return UsuariasIndustria;
  }
}

module.exports = UsuariasIndustria;

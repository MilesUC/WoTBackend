const { Model, DataTypes } = require("sequelize");

class UsuariasIdioma extends Model {
  static initModel(sequelize) {
    UsuariasIdioma.init(
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
        // TODO :Revisar  FK
        idIdioma: {
          type: DataTypes.INTEGER,
          field: "id_idioma",
          references: {
            model: "Idioma",
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
        modelName: "UsuariasIdioma",
        tableName: "idiomas_usuarias",
        timestamps: true,
      }
    );

    return UsuariasIdioma;
  }
}

module.exports = UsuariasIdioma;

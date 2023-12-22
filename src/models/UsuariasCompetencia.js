const { Model, DataTypes } = require("sequelize");

class UsuariasCompetencia extends Model {
  static initModel(sequelize) {
    UsuariasCompetencia.init(
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
        idCompetencia: {
          type: DataTypes.INTEGER,
          field: "id_competencia",
          references: {
            model: "Competencia",
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
        modelName: "UsuariasCompetencia",
        tableName: "competencias_usuarias",
        timestamps: true,
      }
    );

    return UsuariasCompetencia;
  }
}

module.exports = UsuariasCompetencia;

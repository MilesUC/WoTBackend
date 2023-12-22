const { Model, DataTypes } = require("sequelize");

class UsuariasProfesion extends Model {
  static initModel(sequelize) {
    UsuariasProfesion.init(
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
            model: "usuarias",
            key: "id",
          },
        },
        // FK
        idProfesion: {
          type: DataTypes.INTEGER,
          field: "id_profesion",
          references: {
            model: "profesiones",
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
        modelName: "UsuariasProfesion",
        tableName: "profesiones_usuarias",
        timestamps: true,
      }
    );

    return UsuariasProfesion;
  }
}

module.exports = UsuariasProfesion;

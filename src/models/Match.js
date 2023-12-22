const { Model, DataTypes } = require("sequelize");

class Match extends Model {
  static initModel(sequelize) {
    Match.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        fecha: {
          type: DataTypes.DATE,
        },
        // FK
        id_busqueda: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "busquedas",
            key: "id",
          },
          field: "id_busqueda",
        },
        // FK
        id_usuaria: {
          type: DataTypes.STRING,
          references: {
            model: "",
            key: "",
          },
          field: "id_usuaria",
        },
        correspondencia: {
          type: DataTypes.FLOAT,
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
        tableName: "matches",
      }
    );

    return Match;
  }
}

module.exports = Match;

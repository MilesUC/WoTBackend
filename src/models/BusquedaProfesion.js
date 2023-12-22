const { Model, DataTypes } = require("sequelize");

class BusquedaProfesion extends Model {
  static initModel(sequelize) {
    BusquedaProfesion.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // FK
        id_busqueda: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
        },
        // FK
        id_profesion: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
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
        tableName: "busquedas_profesiones",
      }
    );

    return BusquedaProfesion;
  }
}

module.exports = BusquedaProfesion;

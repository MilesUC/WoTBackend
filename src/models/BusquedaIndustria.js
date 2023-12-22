const { Model, DataTypes } = require("sequelize");

class BusquedaIndustria extends Model {
  static initModel(sequelize) {
    BusquedaIndustria.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // FK
        idBusqueda: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
          field: "id_busqueda",
        },
        // FK
        idIndustria: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
          field: "id_industria",
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
        tableName: "busquedas_industrias",
      }
    );

    return BusquedaIndustria;
  }
}

module.exports = BusquedaIndustria;
